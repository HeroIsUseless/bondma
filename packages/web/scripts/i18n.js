const fs = require('fs');
const path = require('path');
const http = require('http');
const AdmZip = require('adm-zip');
const { promisify } = require('util');

// Configuration
const config = {
  host: '127.0.0.1',
  port: 3001,
  projectId: '67c6ce6d4992cad581e38f3f', // Please replace with the actual project ID
  username: '3256384696@qq.com',
  password: '1234',
  format: 'json', // Supports 'json', 'csv', 'xml', 'yaml'
  languages: '', // Comma-separated list of languages
};

// Download translation files
async function downloadTranslations() {
  if (!config.projectId) {
    console.error('Error: Please set projectId in configuration');
    process.exit(1);
  }

  console.log('Starting to download translation files...');

  // Build URL query parameters
  const params = new URLSearchParams({
    format: config.format,
    languages: config.languages,
    username: config.username,
    password: config.password,
    showEmptyTranslations: 'false',
    prettify: 'true',
    includeMetadata: 'false',
  });

  // Build request URL
  const url = `/api/project/download/${config.projectId}?${params.toString()}`;
  
  return new Promise((resolve, reject) => {
    const req = http.request({
      host: config.host,
      port: config.port,
      path: url,
      method: 'GET',
    }, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Request failed, status code: ${res.statusCode}`));
      }

      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });
    });

    req.on('error', (err) => {
      reject(new Error(`Request error: ${err.message}`));
    });

    req.end();
  });
}

// Extract and save files
async function extractZipFile(zipBuffer) {
  try {
    console.log('Extracting files...');
    const zip = new AdmZip(zipBuffer);
    const outputDir = path.join(process.cwd(), 'i18n'); // Use i18n folder as output directory
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Extract all files to current directory
    zip.extractAllTo(outputDir, true); // true means overwrite existing files
    console.log(`Files successfully extracted to ${outputDir}`);
  } catch (err) {
    console.error('Failed to extract files:', err);
    throw err;
  }
}

async function run() {
  try {
    const zipBuffer = await downloadTranslations();
    console.log(`Download completed, file size: ${zipBuffer.length} bytes`);
    await extractZipFile(zipBuffer);
    console.log('Translation files update completed!');
  } catch (err) {
    console.error('Processing failed:', err);
    process.exit(1);
  }
}

run();