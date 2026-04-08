import React, { useState, useEffect } from 'react';
import { useLangChain } from '../services/langchainService';
import { buildContext } from '../utils/contextBuilder';
import { analyzeDataForRecommendations } from '../utils/recommendationEngine';

const RecommendationsPage = ({ user, dataset }) => {
  const [recommendations, setRecommendations] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [llmConfig] = useState(() => {
    const config = localStorage.getItem('insightcart_llm_config');
    return config ? JSON.parse(config) : { provider: 'demo' };
  });

  const { getRecommendations } = useLangChain(llmConfig);

  useEffect(() => {
    const generateRecommendations = async () => {
      try {
        if (!dataset || dataset.length === 0) {
          setError('No dataset available. Please upload a CSV file first.');
          setLoading(false);
          return;
        }

        // Analyze data for recommendations
        const analysis = analyzeDataForRecommendations(dataset);
        setAnalysisData(analysis);

        // Build context from dataset
        const context = buildContext(dataset);

        // Get LLM recommendations
        const recs = await getRecommendations(context, analysis);
        setRecommendations(recs);
        setError(null);
      } catch (err) {
        console.error('Error generating recommendations:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    generateRecommendations();
  }, [dataset, getRecommendations]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🚀 AI Recommendations</h1>
              <p className="text-gray-600 text-sm mt-1">
                Data-driven product and strategy recommendations for your business
              </p>
            </div>
            {user && (
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-600">Logged in as</p>
                <p className="font-semibold text-gray-900">{user.name}</p>
              </div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => window.goToPage('dashboard')}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition duration-200"
            >
              ← Dashboard
            </button>
            <button
              onClick={() => window.goToPage('chat')}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition duration-200"
            >
              💬 Chat
            </button>
            <button
              onClick={() => window.goToPage('about')}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition duration-200"
            >
              ℹ️ About Us
            </button>
            <button
              onClick={() => window.logout()}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 font-semibold rounded-lg transition duration-200"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Analysis Summary Cards */}
        {analysisData && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Customers</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {analysisData.datasetSize.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                ₹{parseFloat(analysisData.spendingStats.total).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Avg Spend</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                ₹{parseFloat(analysisData.spendingStats.avg).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Top Product</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {analysisData.topProducts[0]?.product}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                ₹{analysisData.topProducts[0]?.revenue}
              </p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 mt-4 text-lg">Generating AI recommendations...</p>
            <p className="text-gray-500 text-sm mt-2">This may take up to 30 seconds</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Generating Recommendations</h3>
                <p className="text-sm text-red-700 mt-2">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations Content */}
        {recommendations && !loading && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-8">
              <div className="prose prose-sm max-w-none">
                {/* Parse and render markdown-style recommendations */}
                <div className="space-y-6">
                  {recommendations.split('\n\n').map((section, idx) => (
                    <div key={idx}>
                      {section.split('\n').map((line, lineIdx) => {
                        // Headers
                        if (line.startsWith('## ')) {
                          return (
                            <h2 key={lineIdx} className="text-2xl font-bold text-gray-900 mt-6 mb-4">
                              {line.replace('## ', '')}
                            </h2>
                          );
                        }
                        // Subheaders
                        if (line.startsWith('### ')) {
                          return (
                            <h3 key={lineIdx} className="text-lg font-bold text-blue-600 mt-4 mb-2">
                              {line.replace('### ', '')}
                            </h3>
                          );
                        }
                        // Bold text
                        if (line.startsWith('**')) {
                          return (
                            <p key={lineIdx} className="font-semibold text-gray-900">
                              {line.replace(/\*\*/g, '')}
                            </p>
                          );
                        }
                        // Bullet points
                        if (line.startsWith('- ')) {
                          return (
                            <li key={lineIdx} className="ml-6 text-gray-700">
                              {line.replace('- ', '')}
                            </li>
                          );
                        }
                        // Regular text
                        if (line.trim()) {
                          return (
                            <p key={lineIdx} className="text-gray-700 leading-relaxed">
                              {line}
                            </p>
                          );
                        }
                        return null;
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
                >
                  🔄 Refresh Recommendations
                </button>
                <button
                  onClick={() => {
                    const element = document.documentElement;
                    const opt = {
                      margin: 10,
                      filename: 'recommendations.pdf',
                      image: { type: 'jpeg', quality: 0.98 },
                      html2canvas: { scale: 2 },
                      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
                    };
                    // Note: Would need html2pdf library to actually generate PDF
                    alert('PDF export requires html2pdf library - copy content instead');
                  }}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-200"
                >
                  📥 Export as PDF
                </button>
                <button
                  onClick={() => {
                    const text = recommendations;
                    navigator.clipboard.writeText(text);
                    alert('Recommendations copied to clipboard!');
                  }}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-200"
                >
                  📋 Copy to Clipboard
                </button>
              </div>
            </div>
          </div>
        )}

        {/* No Data Message */}
        {!loading && !dataset && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <p className="text-2xl mb-2">📊</p>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">No Dataset Available</h3>
            <p className="text-blue-700 mb-4">
              Upload a customer dataset in the Dashboard to generate AI recommendations.
            </p>
            <button
              onClick={() => window.goToPage('dashboard')}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationsPage;
