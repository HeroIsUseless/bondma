import { Logger } from '@nestjs/common';
import * as JSZip from 'jszip';

export function exportToJSON(tokens: any[], project: any, languages: string[], prettify: boolean = false) {
    // Build basic structure
    const output: Record<string, any> = {};

    // Add project info as metadata
    output.metadata = {
        projectName: project.name,
        projectId: project.id,
        exportDate: new Date().toISOString(),
        languages
    };

    // Add translation data
    output.translations = {};
    tokens.forEach(token => {
        // Handle keys with dots, create nested structure
        if (token.key.includes('.')) {
            const parts = token.key.split('.');
            let current = output.translations;
            
            // Traverse path except the last part, create nested objects
            for (let i = 0; i < parts.length - 1; i++) {
                const part = parts[i];
                if (!current[part]) {
                    current[part] = {};
                }
                current = current[part];
            }
            
            // Set translation value for the last level
            const lastPart = parts[parts.length - 1];
            current[lastPart] = token.translations;
        } else {
            // Keys without dots are set directly
            output.translations[token.key] = token.translations;
        }
    });

    // Return based on whether prettification is needed
    return prettify ? JSON.stringify(output, null, 2) : JSON.stringify(output);
}

export function exportToCSV(tokens: any[], languages: string[]) {
    // CSV header: key and all languages
    let csv = ['key', ...languages].join(',') + '\n';

    // Add each row
    tokens.forEach(token => {
        const translations = token.translations as Record<string, string> || {};
        const row = [
            token.key,
            ...languages.map(lang => {
                // Ensure values in CSV do not break the format
                const value = translations[lang] || '';
                return `"${value.replace(/"/g, '""')}"`;
            })
        ];
        csv += row.join(',') + '\n';
    });

    return csv;
}

export function exportToXML(tokens: any[], project: any, languages: string[]) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += `<translations project="${project.name}">\n`;

    tokens.forEach(token => {
        const translations = token.translations as Record<string, string> || {};
        xml += `  <string name="${escapeXml(token.key)}">\n`;

        languages.forEach(lang => {
            const value = translations[lang] || '';
            xml += `    <${lang}>${escapeXml(value)}</${lang}>\n`;
        });

        xml += '  </string>\n';
    });

    xml += '</translations>';
    return xml;
}

export function exportToYAML(tokens: any[], project: any, languages: string[], prettify: boolean = false) {
    let yaml = '---\n';
    yaml += `# Project: ${project.name}\n`;
    yaml += `# Export Date: ${new Date().toISOString()}\n\n`;

    tokens.forEach(token => {
        const translations = token.translations as Record<string, string> || {};
        yaml += `${token.key}:\n`;

        languages.forEach(lang => {
            const value = translations[lang] || '';
            // Handle multi-line text
            if (value.includes('\n')) {
                yaml += `  ${lang}: |\n`;
                value.split('\n').forEach(line => {
                    yaml += `    ${line}\n`;
                });
            } else {
                yaml += `  ${lang}: "${escapeYaml(value)}"\n`;
            }
        });

        if (prettify) yaml += '\n';
    });

    return yaml;
}

// Escape special characters in XML
export function escapeXml(unsafe: string): string {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// Escape special characters in YAML
export function escapeYaml(unsafe: string): string {
    return unsafe
        .replace(/"/g, '\\"')
        .replace(/\t/g, '\\t');
}

// Added: Create single language JSON file
export function createSingleLanguageJSON(tokens: any[], language: string, prettify: boolean = false) {
  const output: Record<string, any> = {};
  
  tokens.forEach(token => {
    const translations = token.translations as Record<string, string> || {};
    if (translations[language] !== undefined) {
      // Handle keys with dots, create nested structure
      if (token.key.includes('.')) {
        const parts = token.key.split('.');
        let current = output;
        
        // Traverse path except the last part, create nested objects
        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i];
          if (typeof current[part] !== 'object') {
            current[part] = {};
          }
          current = current[part];
        }
        // Set translation value for the last level
        const lastPart = parts[parts.length - 1];
        current[lastPart] = translations[language];
      } else {
        // Keys without dots are set directly
        output[token.key] = translations[language];
      }
    }
  });

  return prettify ? JSON.stringify(output, null, 2) : JSON.stringify(output);
}

// Added: Create single language YAML file
export function createSingleLanguageYAML(tokens: any[], language: string, prettify: boolean = false) {
  let yaml = '---\n';
  yaml += `# Language: ${language}\n`;
  yaml += `# Export Date: ${new Date().toISOString()}\n\n`;

  tokens.forEach(token => {
    const translations = token.translations as Record<string, string> || {};
    const value = translations[language] || '';
    
    if (value) {
      // Handle multi-line text
      if (value.includes('\n')) {
        yaml += `${token.key}: |\n`;
        value.split('\n').forEach(line => {
          yaml += `  ${line}\n`;
        });
      } else {
        yaml += `${token.key}: "${escapeYaml(value)}"\n`;
      }
      
      if (prettify) yaml += '\n';
    }
  });

  return yaml;
}

// Added: Create single language XML file
export function createSingleLanguageXML(tokens: any[], language: string) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += `<resources>\n`;

  tokens.forEach(token => {
    const translations = token.translations as Record<string, string> || {};
    const value = translations[language] || '';
    
    if (value) {
      xml += `  <string name="${escapeXml(token.key)}">${escapeXml(value)}</string>\n`;
    }
  });

  xml += '</resources>';
  return xml;
}

// Added: Create ZIP file containing all language files
export async function createZipWithLanguageFiles(
  tokens: any[], 
  project: any, 
  languages: string[], 
  format: 'json' | 'csv' | 'xml' | 'yaml',
  options: {
    prettify?: boolean;
  } = {}
) {
  const zip = new JSZip();
  const { prettify = false } = options;

  // 1. Add files for each language
  languages.forEach(language => {
    let content: string;
    let extension: string;
    
    switch (format) {
      case 'json':
        content = createSingleLanguageJSON(tokens, language, prettify);
        extension = 'json';
        break;
      case 'yaml':
        content = createSingleLanguageYAML(tokens, language, prettify);
        extension = 'yaml';
        break;
      case 'xml':
        content = createSingleLanguageXML(tokens, language);
        extension = 'xml';
        break;
      case 'csv':
        // Special handling for CSV, as it's usually used as a merged file
        content = exportToCSV([...tokens], [language]);
        extension = 'csv';
        break;
    }
    
    zip.file(`${language}.${extension}`, content);
  });

  // 2. Add a merged file containing all languages
  switch (format) {
    case 'json':
      zip.file(`all.json`, exportToJSON(tokens, project, languages, prettify));
      break;
    case 'csv':
      zip.file(`all.csv`, exportToCSV(tokens, languages));
      break;
    case 'xml':
      zip.file(`all.xml`, exportToXML(tokens, project, languages));
      break;
    case 'yaml':
      zip.file(`all.yaml`, exportToYAML(tokens, project, languages, prettify));
      break;
  }

  // 3. Generate zip file
  return await zip.generateAsync({ type: 'nodebuffer' });
}