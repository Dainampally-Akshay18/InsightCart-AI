/**
 * Recommendation Engine - Analyzes datasets to generate personalized product recommendations
 */

export const analyzeDataForRecommendations = (data) => {
  if (!data || data.length === 0) return null;

  // 1. Product popularity analysis
  const productCount = {};
  const productRevenue = {};
  const categoryCount = {};
  const categoryRevenue = {};

  data.forEach((row) => {
    productCount[row.Product] = (productCount[row.Product] || 0) + 1;
    productRevenue[row.Product] = (productRevenue[row.Product] || 0) + parseFloat(row.PurchaseAmount);
    categoryCount[row.Category] = (categoryCount[row.Category] || 0) + 1;
    categoryRevenue[row.Category] = (categoryRevenue[row.Category] || 0) + parseFloat(row.PurchaseAmount);
  });

  // 2. Top products and categories
  const topProducts = Object.entries(productRevenue)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([product, revenue]) => ({
      product,
      revenue: revenue.toFixed(2),
      orders: productCount[product],
      avgOrder: (revenue / productCount[product]).toFixed(2),
    }));

  const topCategories = Object.entries(categoryRevenue)
    .sort((a, b) => b[1] - a[1])
    .map(([category, revenue]) => ({
      category,
      revenue: revenue.toFixed(2),
      orders: categoryCount[category],
      percentage: ((categoryCount[category] / data.length) * 100).toFixed(1),
    }));

  // 3. Demographic insights
  const ageGroups = {
    '18-25': { count: 0, revenue: 0, products: {} },
    '26-35': { count: 0, revenue: 0, products: {} },
    '36-50': { count: 0, revenue: 0, products: {} },
    '51+': { count: 0, revenue: 0, products: {} },
  };

  const genderProducts = { Male: {}, Female: {}, Other: {} };
  const locationProducts = {};

  data.forEach((row) => {
    const age = parseInt(row.Age);
    const revenue = parseFloat(row.PurchaseAmount);

    // Age group analysis
    let ageGroup;
    if (age <= 25) ageGroup = '18-25';
    else if (age <= 35) ageGroup = '26-35';
    else if (age <= 50) ageGroup = '36-50';
    else ageGroup = '51+';

    ageGroups[ageGroup].count += 1;
    ageGroups[ageGroup].revenue += revenue;
    ageGroups[ageGroup].products[row.Product] =
      (ageGroups[ageGroup].products[row.Product] || 0) + 1;

    // Gender analysis
    genderProducts[row.Gender] = genderProducts[row.Gender] || {};
    genderProducts[row.Gender][row.Product] =
      (genderProducts[row.Gender][row.Product] || 0) + 1;

    // Location analysis
    locationProducts[row.Location] = locationProducts[row.Location] || {};
    locationProducts[row.Location][row.Product] =
      (locationProducts[row.Location][row.Product] || 0) + 1;
  });

  // Convert age groups data
  const ageGroupAnalysis = Object.entries(ageGroups).map(([group, data]) => ({
    ageGroup: group,
    customerCount: data.count,
    totalRevenue: data.revenue.toFixed(2),
    avgSpend: ((data.revenue / data.count) || 0).toFixed(2),
    topProduct: getTopKey(data.products),
  }));

  // Top products by gender
  const genderPreferences = Object.entries(genderProducts).map(([gender, products]) => ({
    gender,
    topProduct: getTopKey(products),
  }));

  // Top products by location
  const locationInsights = Object.entries(locationProducts)
    .map(([location, products]) => ({
      location,
      topProduct: getTopKey(products),
      productCount: Object.keys(products).length,
    }))
    .sort((a, b) => b.productCount - a.productCount)
    .slice(0, 5);

  // 4. Customer spending patterns
  const spendingStats = {
    min: Math.min(...data.map((r) => parseFloat(r.PurchaseAmount))).toFixed(2),
    max: Math.max(...data.map((r) => parseFloat(r.PurchaseAmount))).toFixed(2),
    avg: (
      data.reduce((sum, r) => sum + parseFloat(r.PurchaseAmount), 0) / data.length
    ).toFixed(2),
    total: data.reduce((sum, r) => sum + parseFloat(r.PurchaseAmount), 0).toFixed(2),
  };

  return {
    datasetSize: data.length,
    topProducts,
    topCategories,
    ageGroupAnalysis,
    genderPreferences,
    locationInsights,
    spendingStats,
  };
};

// Helper: Get the key with highest value from an object
const getTopKey = (obj) => {
  return Object.entries(obj).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
};

/**
 * Generate recommendation context for LLM
 */
export const buildRecommendationContext = (recommendations) => {
  if (!recommendations) return '';

  const {
    datasetSize,
    topProducts,
    topCategories,
    ageGroupAnalysis,
    genderPreferences,
    locationInsights,
    spendingStats,
  } = recommendations;

  return `
## Customer Dataset Analysis Summary
- Total Customers: ${datasetSize}
- Total Spend: $${spendingStats.total}
- Average Spend per Customer: $${spendingStats.avg}
- Spending Range: $${spendingStats.min} - $${spendingStats.max}

## Top Revenue Generators
${topProducts.map((p, i) => `${i + 1}. ${p.product}: $${p.revenue} from ${p.orders} orders (Avg: $${p.avgOrder})`).join('\n')}

## Category Performance
${topCategories.slice(0, 3).map((c) => `- ${c.category}: $${c.revenue} (${c.percentage}% of orders)`).join('\n')}

## Customer Demographics
${ageGroupAnalysis.map((a) => `- Age ${a.ageGroup}: ${a.customerCount} customers, $${a.totalRevenue} revenue, prefers ${a.topProduct}`).join('\n')}

## Market Preferences
${genderPreferences.map((g) => `- ${g.gender} customers prefer: ${g.topProduct}`).join('\n')}

## Regional Insights
${locationInsights.map((l) => `- ${l.location}: Top product is ${l.topProduct}`).join('\n')}
`;
};

/**
 * Parse LLM recommendations response
 */
export const parseRecommendations = (response) => {
  // Extract recommendations from LLM response
  // LLM should return structured recommendations
  return {
    recommendations: response,
    timestamp: new Date().toISOString(),
  };
};
