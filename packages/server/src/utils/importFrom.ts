/**
 * Parse imported file content
 */
export function parseImportData(content: string, format: 'json' | 'csv' | 'xml' | 'yaml'): Record<string, string> {
  try {
    switch (format) {
      case 'json':
        return parseJSON(content);
      case 'csv':
        return parseCSV(content);
      case 'xml':
        return parseXML(content);
      case 'yaml':
        return parseYAML(content);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  } catch (error) {
    throw new Error(`Failed to parse ${format} format file: ${error.message}`);
  }
}

/**
 * Parse JSON format translation file
 */
function parseJSON(content: string): Record<string, string> {
  try {
    const data = JSON.parse(content);
    
    // Validate data format
    if (typeof data !== 'object' || data === null) {
      throw new Error('Incorrect JSON format, should be a key-value object');
    }
    
    // Convert to flat format key-value pairs
    const result: Record<string, string> = {};
    flattenObject(data, '', result);
    
    return result;
  } catch (error) {
    throw new Error(`JSON parsing failed: ${error.message}`);
  }
}

/**
 * Parse CSV format translation file
 * Assumes CSV format: first column is key, second column is value
 */
function parseCSV(content: string): Record<string, string> {
  try {
    const result: Record<string, string> = {};
    const lines = content.split('\n').filter(line => line.trim());
    
    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Handle potential quotes and commas
      let columns: string[];
      
      if (line.includes('"')) {
        // Handle CSV with quotes
        columns = parseCSVLine(line);
      } else {
        // Simple comma separation
        columns = line.split(',');
      }
      
      if (columns.length >= 2) {
        const key = columns[0].trim();
        const value = columns[1].trim();
        if (key) {
          result[key] = value;
        }
      }
    }
    
    return result;
  } catch (error) {
    throw new Error(`CSV parsing failed: ${error.message}`);
  }
}

/**
 * Parse a line of CSV data, handling quotes and commas
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Handle double quote escape
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Found delimiter
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add the last element
  result.push(current);
  return result;
}

/**
 * Parse XML format translation file
 * Assumes simple structure, doesn't handle complex nesting
 */
function parseXML(content: string): Record<string, string> {
  try {
    const result: Record<string, string> = {};
    
    // Simple parsing of XML tags
    const regex = /<([^>]+)>([^<]*)<\/\1>/g;
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      const key = match[1].trim();
      const value = match[2].trim();
      result[key] = value;
    }
    
    return result;
  } catch (error) {
    throw new Error(`XML parsing failed: ${error.message}`);
  }
}

/**
 * Parse YAML format translation file
 * Simple implementation, doesn't handle complex YAML
 */
function parseYAML(content: string): Record<string, string> {
  try {
    const result: Record<string, string> = {};
    const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    
    for (const line of lines) {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        const value = valueParts.join(':').trim();
        result[key.trim()] = value;
      }
    }
    
    return result;
  } catch (error) {
    throw new Error(`YAML parsing failed: ${error.message}`);
  }
}

/**
 * Flatten nested objects into key-value pairs
 * For example: { a: { b: "value" } } => { "a.b": "value" }
 * Handling arrays: { a: ["value1", "value2"] } => { "a.0": "value1", "a.1": "value2" }
 * Special handling for complex nested array structures
 */
function flattenObject(obj: any, prefix: string, result: Record<string, string>): void {
  // Handle null or undefined
  if (obj === null || obj === undefined) {
    result[prefix] = '';
    return;
  }
  
  // Handle primitive types
  if (typeof obj !== 'object') {
    result[prefix] = String(obj);
    return;
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    // Empty array
    if (obj.length === 0) {
      // result[prefix] = '[]';
      return;
    }
    
    // Traverse array elements
    obj.forEach((item, index) => {
      const newPrefix = prefix ? `${prefix}.${index}` : `${index}`;
      flattenObject(item, newPrefix, result);
    });
    return;
  }
  
  // Handle objects
  const keys = Object.keys(obj);
  if (keys.length === 0) {
    // Empty object
    // result[prefix] = '{}';
    return;
  }
  
  for (const key of keys) {
    const value = obj[key];
    const newPrefix = prefix ? `${prefix}.${key}` : key;
    flattenObject(value, newPrefix, result);
  }
}
