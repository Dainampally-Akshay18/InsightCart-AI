/**
 * Chat Page
 * Full-page chat experience with dataset context
 * Combines Dashboard, Chat, Context Builder, Memory, and LangChain
 */

import { useState, useEffect, useCallback } from 'react';
import Chat from '../components/Chat';
import { useDataset } from '../utils/useDataset';
import { buildContext } from '../utils/contextBuilder';
import { useChatMemory } from '../utils/chatMemory';
import { useLangChain } from '../services/langchainService';
import Upload from '../components/Upload';

export default function ChatPage({ user }) {
  const { dataset, hasDataset, loadDataset } = useDataset();
  const { messages, addMessage, getContext, clearHistory } = useChatMemory();
  const { chat, loading, error } = useLangChain({ provider: 'demo' }); // Default to demo mode

  const [context, setContext] = useState(null);
  const [message, setMessage] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const [sessionMessage, setSessionMessage] = useState('');

  // Build context when dataset changes
  useEffect(() => {
    if (hasDataset && dataset) {
      try {
        const builtContext = buildContext(dataset);
        setContext(builtContext);
        setMessage('');
      } catch (err) {
        console.error('Error building context:', err);
        setMessage(`Error: ${err.message}`);
      }
    }
  }, [dataset, hasDataset]);

  /**
   * Handle dataset loading
   */
  const handleDatasetLoaded = (data, msg) => {
    if (data) {
      loadDataset(data);
      setSessionMessage(msg);
      // Clear chat when new dataset loaded
      clearHistory();
      setTimeout(() => setSessionMessage(''), 3000);
    } else {
      setSessionMessage(msg);
    }
  };

  /**
   * Handle user message submission
   */
  const handleSendMessage = useCallback(async (userMessage) => {
    if (!userMessage.trim() || !context || context.isEmpty) {
      setSessionMessage('Please load a dataset first');
      return;
    }

    // Add user message to history
    addMessage('user', userMessage);
    setShowLoader(true);

    try {
      // Get conversation history for context
      const conversationHistory = getContext(20);

      // Call LLM with context injection
      const response = await chat(userMessage, context, conversationHistory);

      // Add assistant response to history
      addMessage('assistant', response);
    } catch (err) {
      console.error('Chat error:', err);
      addMessage('assistant', `Error: ${err.message}`);
      setSessionMessage(`Failed to get response: ${err.message}`);
    } finally {
      setShowLoader(false);
    }
  }, [context, addMessage, getContext, chat]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">💬 AI Chat Assistant</h1>
              <p className="text-gray-600 text-sm mt-1">Ask questions about your customer data</p>
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
              onClick={() => window.goToPage('recommendations')}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-200"
            >
              🚀 Recommendations
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
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        {/* Session Message */}
        {sessionMessage && (
          <div className={`mb-6 p-4 rounded-lg ${sessionMessage.includes('Error') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
            {sessionMessage}
          </div>
        )}

        {!hasDataset ? (
          // Dataset upload section
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">📁 Load Dataset to Start Chatting</h2>
            <Upload
              onDatasetLoaded={handleDatasetLoaded}
              defaultDataset={undefined}
            />
            <p className="text-gray-600 text-center mt-6 text-sm">
              Upload a CSV file or load the sample dataset to begin asking questions about your data.
            </p>
          </div>
        ) : (
          // Chat interface
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Chat Window */}
            <div className="lg:col-span-3 h-96 lg:h-auto lg:min-h-screen">
              <Chat
                messages={messages}
                onSendMessage={handleSendMessage}
                loading={showLoader || loading}
                error={error}
              />
            </div>

            {/* Sidebar - Context Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-20">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Dataset Info</h3>

                {context && !context.isEmpty ? (
                  <div className="space-y-3 text-sm">
                    <div className="border-b pb-2">
                      <p className="text-gray-600">Records</p>
                      <p className="text-xl font-bold text-blue-600">{context.totalRecords.toLocaleString()}</p>
                    </div>

                    <div className="border-b pb-2">
                      <p className="text-gray-600">Total Revenue</p>
                      <p className="text-lg font-bold text-green-600">
                        ₹{context.summary.totalRevenue.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="border-b pb-2">
                      <p className="text-gray-600">Avg Spending</p>
                      <p className="text-lg font-bold text-purple-600">
                        ₹{context.summary.averageSpending.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="border-b pb-2">
                      <p className="text-gray-600">Top Product</p>
                      <p className="text-lg font-bold text-orange-600">{context.summary.topProduct}</p>
                    </div>

                    <div className="border-b pb-2">
                      <p className="text-gray-600">Locations</p>
                      <p className="text-lg font-bold">{context.locations.total}</p>
                    </div>

                    <div className="pt-2">
                      <p className="text-gray-600">Products</p>
                      <p className="text-lg font-bold">{context.products.total}</p>
                    </div>

                    {/* Quick actions */}
                    <div className="mt-4 pt-4 border-t space-y-2">
                      <p className="text-gray-700 font-semibold text-xs uppercase">Quick Questions</p>
                      <button
                        onClick={() => handleSendMessage("What's the most popular product?")}
                        className="w-full text-left text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 p-2 rounded transition"
                      >
                        Most popular product?
                      </button>
                      <button
                        onClick={() => handleSendMessage("Which age group spends the most?")}
                        className="w-full text-left text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 p-2 rounded transition"
                      >
                        Biggest spenders?
                      </button>
                      <button
                        onClick={() => handleSendMessage("Show me the revenue breakdown by location")}
                        className="w-full text-left text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 p-2 rounded transition"
                      >
                        Revenue by location?
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">No dataset loaded</p>
                )}

                {/* Clear History */}
                {messages.length > 0 && (
                  <button
                    onClick={() => {
                      clearHistory();
                      setSessionMessage('Chat history cleared');
                      setTimeout(() => setSessionMessage(''), 3000);
                    }}
                    className="w-full mt-6 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded transition"
                  >
                    🗑️ Clear Chat History
                  </button>
                )}

                {/* Load New Dataset */}
                <button
                  onClick={() => {
                    loadDataset(null);
                    clearHistory();
                  }}
                  className="w-full mt-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold rounded transition"
                >
                  📂 Load New Dataset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {hasDataset && (
        <div className="bg-white border-t mt-8">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 text-center text-xs text-gray-600">
            <p>💡 AI responses are based solely on your dataset. Only ask about data present in your CSV.</p>
          </div>
        </div>
      )}
    </div>
  );
}
