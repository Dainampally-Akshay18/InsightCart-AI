/**
 * LangChain Wrapper Service
 * Handles LLM integration with context injection
 * Prevents hallucination by restricting to provided data
 */

import { formatContextForPrompt } from '../utils/contextBuilder';
import { buildRecommendationContext } from '../utils/recommendationEngine';

/**
 * Create system prompt that prevents LLM hallucinations
 * @param {object} context - Structured context from contextBuilder
 * @returns {string} System prompt
 */
const createSystemPrompt = (context) => {
  return `You are a data analyst AI assistant specialized in customer insights.

IMPORTANT RULES:
1. Answer questions ONLY using the provided dataset summary below.
2. If a question cannot be answered with the available data, respond: "I don't have sufficient data to answer this question."
3. Do NOT make up or assume data that isn't provided.
4. Do NOT suggest things outside the dataset.
5. Be specific with numbers and percentages.
6. Always cite the data source when providing insights.

DATASET SUMMARY:
================
${formatContextForPrompt(context)}

START OF CONVERSATION:`;
};

/**
 * Create system prompt for recommendations
 * @param {object} recommendationData - Analysis data from recommendationEngine
 * @returns {string} System prompt
 */
const createRecommendationPrompt = (recommendationData) => {
  return `You are a business strategist AI assistant specializing in data-driven product recommendations.

Your job is to generate actionable, specific product recommendations based on the customer data analysis provided below.

IMPORTANT RULES:
1. Base recommendations ONLY on the provided analysis data.
2. Provide 5-7 strategic recommendations with clear business rationale.
3. For each recommendation, explain: WHAT to recommend, WHY (based on data), and EXPECTED IMPACT.
4. Format recommendations clearly with headers and bullet points.
5. Be specific with metrics, percentages, and customer segments.
6. Include both immediate actions and long-term strategies.

CUSTOMER DATA ANALYSIS:
=======================
${buildRecommendationContext(recommendationData)}

Generate recommendations that will help maximize revenue and customer satisfaction.`;
};

/**
 * Initialize LangChain service
 * @param {object} config - Configuration {apiKey, provider}
 * @returns {object} LangChain service object
 */
export const initializeLangChain = (config = {}) => {
  const {
    apiKey = '',
    provider = 'none', // 'openai', 'anthropic', 'demo', 'none'
    model = 'gpt-3.5-turbo'
  } = config;

  return {
    apiKey,
    provider,
    model,

    /**
     * Check if service is configured
     */
    isConfigured() {
      return this.provider !== 'none' && this.apiKey !== '';
    },

    /**
     * Make LLM call with context injection
     * @param {string} userMessage - User input
     * @param {object} context - Dataset context
     * @param {array} conversationHistory - Previous messages
     * @returns {Promise<string>} LLM response
     */
    async chat(userMessage, context, conversationHistory = []) {
      try {
        // Build messages array
        const systemPrompt = createSystemPrompt(context);
        
        const messages = [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: userMessage }
        ];

        // Route to appropriate provider
        if (this.provider === 'openai') {
          return await this.callOpenAI(messages);
        } else if (this.provider === 'anthropic') {
          return await this.callAnthropic(messages);
        } else if (this.provider === 'demo') {
          return this.callDemo(userMessage, context);
        } else {
          return this.callDemo(userMessage, context);
        }
      } catch (err) {
        console.error('LangChain error:', err);
        throw new Error(`Failed to get LLM response: ${err.message}`);
      }
    },

    /**
     * OpenAI API call
     * @param {array} messages - Message array
     * @returns {Promise<string>}
     */
    async callOpenAI(messages) {
      if (!this.apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'No response from LLM';
    },

    /**
     * Anthropic API call
     * @param {array} messages - Message array
     * @returns {Promise<string>}
     */
    async callAnthropic(messages) {
      if (!this.apiKey) {
        throw new Error('Anthropic API key not configured');
      }

      // Extract system prompt
      const systemPrompt = messages[0].content;
      const otherMessages = messages.slice(1);

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 500,
          system: systemPrompt,
          messages: otherMessages
        })
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.content[0]?.text || 'No response from LLM';
    },

    /**
     * Demo mode - rule-based responses
     * Works without API key for testing
     * @param {string} userMessage - User question
     * @param {object} context - Dataset context
     * @returns {string} Response
     */
    callDemo(userMessage, context) {
      const query = userMessage.toLowerCase();

      // Top product query
      if (query.includes('top') || query.includes('popular') || query.includes('best')) {
        if (query.includes('product')) {
          return `Based on the dataset, the most popular product is **${context.insights.mostPopularProduct}** with the highest customer count.`;
        }
      }

      // Revenue query
      if (query.includes('revenue') || query.includes('total') || query.includes('money')) {
        return `The total revenue from all customers is **₹${context.summary.totalRevenue.toLocaleString('en-IN')}** across ${context.totalRecords} customers.`;
      }

      // Average spending
      if (query.includes('average') || query.includes('mean') || query.includes('typical')) {
        return `The average spending per customer is **₹${context.summary.averageSpending.toLocaleString('en-IN')}**.`;
      }

      // Age group query
      if (query.includes('age') || query.includes('young') || query.includes('old')) {
        const topAge = context.insights.highestSpendingAgeGroup;
        const topAgeStat = context.demographics.ageGroups.find(ag => ag.range === topAge);
        return `The highest spending age group is **${topAge}** with an average spending of **₹${topAgeStat.averageSpending.toLocaleString('en-IN')}** and **${topAgeStat.customerCount}** customers.`;
      }

      // Location query
      if (query.includes('location') || query.includes('city') || query.includes('where')) {
        const topLocation = context.locations.distribution[0];
        return `**${topLocation.name}** has the most customers with **${topLocation.customers}** customers (${topLocation.percentage}% of total).`;
      }

      // Gender query
      if (query.includes('gender') || query.includes('male') || query.includes('female')) {
        const genderInfo = context.demographics.gender.map(g => 
          `${g.type}: ${g.count} customers (${g.percentage}%)`
        ).join(', ');
        return `Gender distribution: ${genderInfo}`;
      }

      // Product list
      if (query.includes('product') && (query.includes('list') || query.includes('what'))) {
        return `There are **${context.products.total}** unique products in the dataset: ${context.products.list.slice(0, 10).join(', ')}${context.products.list.length > 10 ? '...' : ''}.`;
      }

      // Category query
      if (query.includes('categor')) {
        return `The dataset contains **${context.categories.total}** categories: ${context.categories.list.join(', ')}.`;
      }

      // Default response
      return `I can help you analyze the customer dataset. I have access to:\n- **${context.totalRecords}** customer records\n- **${context.products.total}** unique products\n- **${context.locations.total}** locations\n- Demographic data (age, gender)\n\nFeel free to ask about sales trends, customer distribution, or specific insights!`;
    },

    /**
     * Get AI-powered product recommendations
     * @param {object} context - Dataset context
     * @param {object} recommendationData - Analysis from recommendationEngine
     * @returns {Promise<string>} LLM recommendations
     */
    async getRecommendations(context, recommendationData) {
      try {
        const systemPrompt = createRecommendationPrompt(recommendationData);
        
        const messages = [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: 'Based on the customer data analysis, provide strategic product recommendations to maximize revenue and customer satisfaction.' 
          }
        ];

        // Route to appropriate provider
        if (this.provider === 'openai') {
          return await this.callOpenAI(messages);
        } else if (this.provider === 'anthropic') {
          return await this.callAnthropic(messages);
        } else if (this.provider === 'demo') {
          return this.generateDemoRecommendations(recommendationData);
        } else {
          return this.generateDemoRecommendations(recommendationData);
        }
      } catch (err) {
        console.error('Recommendation error:', err);
        throw new Error(`Failed to generate recommendations: ${err.message}`);
      }
    },

    /**
     * Generate demo recommendations without API
     */
    generateDemoRecommendations(data) {
      if (!data) return 'Unable to generate recommendations - no data available.';

      const { topProducts, topCategories, ageGroupAnalysis, spendingStats } = data;
      
      return `## 🎯 Strategic Product Recommendations

### 1. **Focus on Top Revenue Generators**
**What:** Prioritize **${topProducts[0]?.product}** and **${topProducts[1]?.product}** as featured products
**Why:** These products generated $${topProducts[0]?.revenue} and $${topProducts[1]?.revenue} respectively, representing the highest customer demand
**Impact:** Expected 15-20% increase in revenue by optimizing inventory and marketing

### 2. **Cross-Category Bundling Strategy**
**What:** Create bundle deals combining top categories: ${topCategories.slice(0, 3).map(c => c.category).join(', ')}
**Why:** These categories account for majority of orders and have strong performance
**Impact:** Average order value increase of $${((parseInt(spendingStats.avg) * 0.25).toFixed(2))} through strategic bundling

### 3. **Age-Targeted Product Personalization**
**What:** Customize product recommendations by age group
- Age 18-25: Focus on **${ageGroupAnalysis[0]?.topProduct || 'trending items'}**
- Age 26-35: Emphasize **${ageGroupAnalysis[1]?.topProduct || 'quality products'}**
- Age 36-50: Highlight **${ageGroupAnalysis[2]?.topProduct || 'premium options'}**
- Age 51+: Promote **${ageGroupAnalysis[3]?.topProduct || 'value products'}**

**Why:** Demographic analysis shows distinct product preferences by age
**Impact:** 25-30% improvement in conversion rates through personalization

### 4. **High-Value Customer Retention Program**
**What:** Create VIP program targeting top ${Math.ceil(parseInt(spendingStats.total) / parseInt(spendingStats.max))} customers
**Why:** These customers show spending from $${spendingStats.min} to $${spendingStats.max}, with average of $${spendingStats.avg}
**Impact:** 40% increase in customer lifetime value through loyalty rewards

### 5. **Regional Marketing Optimization**
**What:** Implement location-specific campaigns highlighting local preferences
**Why:** Different regions show distinct product preferences based on order patterns
**Impact:** 20% improvement in regional conversion rates

### 6. **Inventory Optimization**
**What:** Allocate 60% of inventory to top 3 products, 30% to mid-tier, 10% to experimental
**Why:** Concentrated inventory reduces carrying costs while meeting customer demand
**Impact:** Reduce carrying costs by 15-20% while maintaining 99%+ availability

---
**Implementation Priority:** Start with recommendations 1 & 3 for immediate impact, then roll out remaining strategies within 90 days.`;
    }
  };
};

/**
 * React hook for LangChain integration
 */
import { useState, useCallback } from 'react';

export const useLangChain = (config = {}) => {
  const [service] = useState(() => initializeLangChain(config));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const chat = useCallback(async (userMessage, context, history = []) => {
    setLoading(true);
    setError(null);

    try {
      const response = await service.chat(userMessage, context, history);
      return response;
    } catch (err) {
      const errorMsg = err.message;
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);

  const getRecommendations = useCallback(async (context, recommendationData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await service.getRecommendations(context, recommendationData);
      return response;
    } catch (err) {
      const errorMsg = err.message;
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);

  return {
    chat,
    getRecommendations,
    loading,
    error,
    isConfigured: service.isConfigured(),
    service
  };
};
