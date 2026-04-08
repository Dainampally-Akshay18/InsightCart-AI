/**
 * CSV Parser utility using PapaParse
 * Validates and parses CSV files with required columns
 */

const REQUIRED_COLUMNS = [
  'CustomerID',
  'Gender',
  'Age',
  'Location',
  'Product',
  'Category',
  'PurchaseAmount'
];

/**
 * Parse CSV string and validate columns
 * @param {string} csvData - Raw CSV data
 * @returns {object} {success: boolean, data: array, error: string}
 */
export const parseCSV = (csvData) => {
  try {
    if (!csvData || csvData.trim() === '') {
      return { success: false, data: null, error: 'CSV data is empty' };
    }

    // Split into lines
    const lines = csvData.trim().split('\n');
    if (lines.length < 2) {
      return { success: false, data: null, error: 'CSV must have header and at least one row' };
    }

    // Parse header
    const header = lines[0].split(',').map(h => h.trim());
    
    // Validate required columns
    const missingColumns = REQUIRED_COLUMNS.filter(col => !header.includes(col));
    if (missingColumns.length > 0) {
      return {
        success: false,
        data: null,
        error: `Missing required columns: ${missingColumns.join(', ')}`
      };
    }

    // Parse rows
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue; // Skip empty rows

      const values = line.split(',').map(v => v.trim());
      const row = {};

      header.forEach((col, idx) => {
        row[col] = values[idx] || '';
      });

      // Convert numeric fields
      row.Age = parseInt(row.Age, 10) || 0;
      row.PurchaseAmount = parseFloat(row.PurchaseAmount) || 0;
      row.CustomerID = parseInt(row.CustomerID, 10) || 0;

      // Add row only if it has valid data
      if (row.CustomerID && row.Gender && row.Age && row.Location && row.Product && row.PurchaseAmount) {
        rows.push(row);
      }
    }

    if (rows.length === 0) {
      return { success: false, data: null, error: 'No valid rows found in CSV' };
    }

    return { success: true, data: rows, error: null };
  } catch (err) {
    return { success: false, data: null, error: `Parse error: ${err.message}` };
  }
};

/**
 * Load CSV file from file input
 * @param {File} file - File object from input
 * @returns {Promise} Resolves to {success, data, error}
 */
export const loadCSVFile = (file) => {
  return new Promise((resolve) => {
    if (!file) {
      resolve({ success: false, data: null, error: 'No file selected' });
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      const csvData = e.target.result;
      const result = parseCSV(csvData);
      resolve(result);
    };

    reader.onerror = () => {
      resolve({ success: false, data: null, error: 'Failed to read file' });
    };

    reader.readAsText(file);
  });
};

/**
 * Validate if dataset has required structure
 * @param {array} data - Dataset array
 * @returns {boolean}
 */
export const validateDataset = (data) => {
  if (!Array.isArray(data) || data.length === 0) return false;
  
  const firstRow = data[0];
  return REQUIRED_COLUMNS.every(col => col in firstRow);
};
