/**
 * Context Builder utility
 * Converts raw dataset into structured summary for LLM
 * This is the "brain before LLM" - creates the context that LLM receives
 */

import {
  getProductPopularity,
  getAgeGroupSpending,
  getGenderDistribution,
  getLocationDistribution,
  calculateSummary,
  getUniqueValues
} from './analytics';

/**
 * Build structured context summary from dataset
 * This ONLY sends summarized data to LLM, never raw CSV
 * @param {array} dataset - Full dataset
 * @returns {object} Structured context object
 */
export const buildContext = (dataset) => {
  if (!dataset || dataset.length === 0) {
    return {
      isEmpty: true,
      totalRecords: 0,
      summary: {}
    };
  }

  try {
    // Calculate all analytics
    const summary = calculateSummary(dataset);
    const productPopularity = getProductPopularity(dataset);
    const ageGroupSpending = getAgeGroupSpending(dataset);
    const genderDistribution = getGenderDistribution(dataset);
    const locationDistribution = getLocationDistribution(dataset);

    // Get unique values for filtering/reference
    const categories = getUniqueValues(dataset, 'Category');
    const locations = getUniqueValues(dataset, 'Location');
    const products = getUniqueValues(dataset, 'Product');

    // Build comprehensive context
    const context = {
      isEmpty: false,
      totalRecords: dataset.length,
      
      summary: {
        totalCustomers: summary.totalCustomers,
        totalRevenue: parseFloat(summary.totalRevenue),
        averageSpending: parseFloat(summary.avgSpending),
        topProduct: summary.topProduct
      },

      products: {
        total: products.length,
        list: products,
        popularity: productPopularity.slice(0, 10).map(p => ({
          name: p.name,
          count: p.count,
          percentage: parseFloat(p.percentage)
        }))
      },

      categories: {
        total: categories.length,
        list: categories
      },

      locations: {
        total: locations.length,
        list: locations,
        distribution: locationDistribution.map(l => ({
          name: l.name,
          customers: l.value,
          percentage: parseFloat(l.percentage)
        }))
      },

      demographics: {
        ageGroups: ageGroupSpending.map(ag => ({
          range: ag.ageGroup,
          averageSpending: parseFloat(ag.avgSpending),
          customerCount: ag.count
        })),
        gender: genderDistribution.map(g => ({
          type: g.name,
          count: g.value,
          percentage: parseFloat(g.percentage)
        }))
      },

      insights: generateInsights(dataset, productPopularity, ageGroupSpending, summary)
    };

    return context;
  } catch (err) {
    console.error('Error building context:', err);
    return {
      isEmpty: true,
      totalRecords: 0,
      error: err.message
    };
  }
};

/**
 * Generate additional insights from dataset
 * These help the LLM provide better analysis
 * @param {array} dataset - Full dataset
 * @param {array} products - Product popularity
 * @param {array} ageGroups - Age group spending
 * @param {object} summary - Summary statistics
 * @returns {object} Additional insights
 */
const generateInsights = (dataset, products, ageGroups, summary) => {
  // Find highest and lowest spending age groups
  const sortedBySpending = [...ageGroups].sort((a, b) => 
    parseFloat(b.avgSpending) - parseFloat(a.avgSpending)
  );

  // Find highest and lowest spending products
  const sortedProducts = [...products].sort((a, b) => b.count - a.count);

  // Calculate spending statistics
  const allAmounts = dataset.map(d => d.PurchaseAmount).sort((a, b) => a - b);
  const minSpending = allAmounts[0];
  const maxSpending = allAmounts[allAmounts.length - 1];
  const medianSpending = allAmounts[Math.floor(allAmounts.length / 2)];

  return {
    highestSpendingAgeGroup: sortedBySpending[0]?.ageGroup || 'N/A',
    lowestSpendingAgeGroup: sortedBySpending[sortedBySpending.length - 1]?.ageGroup || 'N/A',
    mostPopularProduct: sortedProducts[0]?.name || 'N/A',
    leastPopularProduct: sortedProducts[sortedProducts.length - 1]?.name || 'N/A',
    spendingRange: {
      min: minSpending,
      max: maxSpending,
      median: medianSpending
    }
  };
};

/**
 * Format context as readable text for LLM system prompt
 * @param {object} context - Structured context from buildContext()
 * @returns {string} Formatted text summary
 */
export const formatContextForPrompt = (context) => {
  if (context.isEmpty) {
    return 'No dataset loaded yet.';
  }

  const lines = [
    `DATASET SUMMARY`,
    `================`,
    `Total Customers: ${context.totalRecords}`,
    `Total Revenue: ₹${context.summary.totalRevenue.toLocaleString('en-IN')}`,
    `Average Spending: ₹${context.summary.averageSpending.toLocaleString('en-IN')}`,
    ``,
    `TOP PRODUCTS (by customer count)`,
    `================================`,
    ...context.products.popularity.slice(0, 5).map(p => 
      `- ${p.name}: ${p.count} customers (${p.percentage}%)`
    ),
    ``,
    `LOCATIONS`,
    `=========`,
    ...context.locations.distribution.map(l =>
      `- ${l.name}: ${l.customers} customers (${l.percentage}%)`
    ),
    ``,
    `AGE GROUP ANALYSIS`,
    `==================`,
    ...context.demographics.ageGroups.map(ag =>
      `- ${ag.range}: Average spending ₹${ag.averageSpending.toLocaleString('en-IN')} (${ag.customerCount} customers)`
    ),
    ``,
    `GENDER DISTRIBUTION`,
    `===================`,
    ...context.demographics.gender.map(g =>
      `- ${g.type}: ${g.count} customers (${g.percentage}%)`
    ),
    ``,
    `KEY INSIGHTS`,
    `============`,
    `- Most popular: ${context.insights.mostPopularProduct}`,
    `- Highest spending age group: ${context.insights.highestSpendingAgeGroup}`,
    `- Spending range: ₹${context.insights.spendingRange.min} - ₹${context.insights.spendingRange.max}`
  ];

  return lines.join('\n');
};

/**
 * Get context statistics summary
 * @param {object} context - Structured context
 * @returns {object} Quick reference stats
 */
export const getContextStats = (context) => {
  if (context.isEmpty) {
    return { isEmpty: true };
  }

  return {
    isEmpty: false,
    records: context.totalRecords,
    revenue: context.summary.totalRevenue,
    avgSpending: context.summary.averageSpending,
    products: context.products.total,
    categories: context.categories.total,
    locations: context.locations.total
  };
};
