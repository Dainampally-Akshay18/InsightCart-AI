/**
 * Analytics utilities for processing dataset
 * Generates insights used by dashboard and context builder
 */

/**
 * Generate product popularity data
 * @param {array} data - Dataset
 * @returns {array} [{name, count, percentage}]
 */
export const getProductPopularity = (data) => {
  const productCount = {};
  
  data.forEach(row => {
    const product = row.Product;
    productCount[product] = (productCount[product] || 0) + 1;
  });

  const total = data.length;
  return Object.entries(productCount)
    .map(([name, count]) => ({
      name,
      count,
      percentage: ((count / total) * 100).toFixed(2)
    }))
    .sort((a, b) => b.count - a.count);
};

/**
 * Generate age group spending analysis
 * @param {array} data - Dataset
 * @returns {array} [{ageGroup, avgSpending, count}]
 */
export const getAgeGroupSpending = (data) => {
  const ageGroups = {
    '18-25': { total: 0, count: 0 },
    '26-35': { total: 0, count: 0 },
    '36-45': { total: 0, count: 0 },
    '46-55': { total: 0, count: 0 },
    '56+': { total: 0, count: 0 }
  };

  data.forEach(row => {
    const age = row.Age;
    const amount = row.PurchaseAmount;
    let group;

    if (age >= 18 && age <= 25) group = '18-25';
    else if (age >= 26 && age <= 35) group = '26-35';
    else if (age >= 36 && age <= 45) group = '36-45';
    else if (age >= 46 && age <= 55) group = '46-55';
    else group = '56+';

    ageGroups[group].total += amount;
    ageGroups[group].count += 1;
  });

  return Object.entries(ageGroups).map(([ageGroup, { total, count }]) => ({
    ageGroup,
    avgSpending: count > 0 ? (total / count).toFixed(2) : 0,
    count
  }));
};

/**
 * Generate gender distribution
 * @param {array} data - Dataset
 * @returns {array} [{name, value, percentage}]
 */
export const getGenderDistribution = (data) => {
  const genderCount = {};
  
  data.forEach(row => {
    genderCount[row.Gender] = (genderCount[row.Gender] || 0) + 1;
  });

  const total = data.length;
  return Object.entries(genderCount).map(([name, value]) => ({
    name,
    value,
    percentage: ((value / total) * 100).toFixed(2)
  }));
};

/**
 * Generate location distribution
 * @param {array} data - Dataset
 * @returns {array} [{name, value, percentage}]
 */
export const getLocationDistribution = (data) => {
  const locationCount = {};
  
  data.forEach(row => {
    locationCount[row.Location] = (locationCount[row.Location] || 0) + 1;
  });

  const total = data.length;
  return Object.entries(locationCount)
    .map(([name, value]) => ({
      name,
      value,
      percentage: ((value / total) * 100).toFixed(2)
    }))
    .sort((a, b) => b.value - a.value);
};

/**
 * Calculate summary statistics
 * @param {array} data - Dataset
 * @returns {object} {totalCustomers, totalRevenue, avgSpending, topProduct}
 */
export const calculateSummary = (data) => {
  if (!data || data.length === 0) {
    return {
      totalCustomers: 0,
      totalRevenue: 0,
      avgSpending: 0,
      topProduct: 'N/A'
    };
  }

  const totalCustomers = data.length;
  const totalRevenue = data.reduce((sum, row) => sum + row.PurchaseAmount, 0);
  const avgSpending = (totalRevenue / totalCustomers).toFixed(2);

  const products = getProductPopularity(data);
  const topProduct = products.length > 0 ? products[0].name : 'N/A';

  return {
    totalCustomers,
    totalRevenue: totalRevenue.toFixed(2),
    avgSpending,
    topProduct
  };
};

/**
 * Get top N products
 * @param {array} data - Dataset
 * @param {number} n - Number of top products
 * @returns {array}
 */
export const getTopProducts = (data, n = 5) => {
  const popularity = getProductPopularity(data);
  return popularity.slice(0, n);
};

/**
 * Get unique values for a column
 * @param {array} data - Dataset
 * @param {string} column - Column name
 * @returns {array}
 */
export const getUniqueValues = (data, column) => {
  const values = new Set();
  data.forEach(row => {
    if (row[column]) values.add(row[column]);
  });
  return Array.from(values).sort();
};

/**
 * Filter dataset by criteria
 * @param {array} data - Dataset
 * @param {object} filters - {column: value} pairs
 * @returns {array}
 */
export const filterDataset = (data, filters) => {
  return data.filter(row => {
    return Object.entries(filters).every(([col, val]) => {
      if (Array.isArray(val)) return val.includes(row[col]);
      return row[col] === val;
    });
  });
};
