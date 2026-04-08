/**
 * About Us Page
 * Company information and project details
 */

export default function AboutUs({ onGoBack }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">About InsightCart AI</h1>
          <button
            onClick={onGoBack}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 Our Mission</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            InsightCart AI Copilot makes data analytics accessible to everyone. 
            We believe that understanding customer insights shouldn't require technical expertise. 
            Our AI-powered chatbot converts raw customer data into actionable intelligence, 
            enabling businesses to make smarter decisions faster.
          </p>
        </div>
         {/* Team Section */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">👥 Meet Our Team</h2>
          <p className="text-gray-700 leading-relaxed mb-8">
            InsightCart AI was built by a talented team of engineers who are passionate about 
            democratizing access to advanced analytics and making data-driven decisions accessible to everyone.
          </p>
          
          {/* Developers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Developer 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-center hover:shadow-lg transition duration-200">
              <div className="text-6xl mb-3">👨‍💻</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">B. ESHWAR</h3>
              <p className="text-sm text-gray-600">Full-Stack Developer</p>
              <p className="text-xs text-gray-500 mt-2">React • LangChain • UI/UX</p>
            </div>

            {/* Developer 2 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 text-center hover:shadow-lg transition duration-200">
              <div className="text-6xl mb-3">👨‍💼</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">D. ROHIT REDDY</h3>
              <p className="text-sm text-gray-600">Backend Engineer</p>
              <p className="text-xs text-gray-500 mt-2">Data Processing • APIs • Architecture</p>
            </div>

            {/* Developer 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 text-center hover:shadow-lg transition duration-200">
              <div className="text-6xl mb-3">👩‍💻</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">M. MADHU</h3>
              <p className="text-sm text-gray-600">Full-Stack Developer</p>
              <p className="text-xs text-gray-500 mt-2">Analytics • ML • Dashboards</p>
            </div>

            {/* Developer 4 */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 text-center hover:shadow-lg transition duration-200">
              <div className="text-6xl mb-3">🚀</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Y. AKASH</h3>
              <p className="text-sm text-gray-600">Full-Stack Developer</p>
              <p className="text-xs text-gray-500 mt-2">Deployment • Performance • QA</p>
            </div>
          </div>
        </div>
        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-blue-50 rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-3">📊 Data Analytics</h3>
            <p className="text-gray-700">
              Upload your CSV dataset and instantly get comprehensive analytics including 
              product popularity, revenue trends, customer demographics, and location insights.
            </p>
          </div>

          <div className="bg-green-50 rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-green-900 mb-3">💬 AI Chat Assistant</h3>
            <p className="text-gray-700">
              Ask natural language questions about your data. 
              Our AI understands context and provides accurate, data-backed answers 
              without making assumptions.
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-purple-900 mb-3">🎨 Interactive Dashboards</h3>
            <p className="text-gray-700">
              Visualize your data with beautiful, responsive charts. 
              Understand trends at a glance and drill down for detailed analysis.
            </p>
          </div>

          <div className="bg-orange-50 rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-orange-900 mb-3">💾 Local Storage</h3>
            <p className="text-gray-700">
              Your data never leaves your browser. All processing happens locally 
              for maximum privacy and security.
            </p>
          </div>
        </div>

        {/* Technology Section */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🛠️ Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Frontend</h4>
              <ul className="space-y-2 text-gray-700">
                <li>✅ React 19.2.4 - Modern UI framework</li>
                <li>✅ Vite 8.0.4 - Lightning-fast build tool</li>
                <li>✅ Tailwind CSS - Utility-first styling</li>
                <li>✅ Recharts - Data visualization</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">AI & Data</h4>
              <ul className="space-y-2 text-gray-700">
                <li>✅ LangChain JS - LLM orchestration</li>
                <li>✅ PapaParse - CSV parsing</li>
                <li>✅ OpenAI/Anthropic API - LLM providers</li>
                <li>✅ localStorage - Persistent storage</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Key Features Section */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">✨ Key Features</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-500 text-white">
                  1
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-gray-900">CSV Upload & Parsing</h4>
                <p className="text-gray-600 mt-1">
                  Supports customer data with columns: CustomerID, Gender, Age, Location, Product, Category, PurchaseAmount
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-500 text-white">
                  2
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-gray-900">Instant Analytics</h4>
                <p className="text-gray-600 mt-1">
                  Automatic calculation of revenue, customer counts, spending trends, and demographics
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-500 text-white">
                  3
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-gray-900">Smart Context Building</h4>
                <p className="text-gray-600 mt-1">
                  Converts raw data into structured summaries that LLM can understand and reason about
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-500 text-white">
                  4
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-gray-900">Hallucination Prevention</h4>
                <p className="text-gray-600 mt-1">
                  AI responses are restricted to data in your dataset through prompt engineering
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-500 text-white">
                  5
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-gray-900">Conversation Memory</h4>
                <p className="text-gray-600 mt-1">
                  Chat history persists across sessions, enabling context-aware multi-turn conversations
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="bg-green-50 rounded-lg shadow p-8 mb-8 border-l-4 border-green-500">
          <h2 className="text-2xl font-bold text-green-900 mb-4">🔒 Privacy & Security</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-600 font-bold mr-3">✓</span>
              <span>All data processing happens in your browser - no server uploads</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 font-bold mr-3">✓</span>
              <span>User credentials stored locally with basic validation</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 font-bold mr-3">✓</span>
              <span>Chat history saved to browser localStorage</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 font-bold mr-3">✓</span>
              <span>Clear all data option available in settings</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 font-bold mr-3">✓</span>
              <span>No third-party cookies or tracking</span>
            </li>
          </ul>
        </div>

        {/* Future Roadmap */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🚀 Future Roadmap</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Planned Features</h4>
              <ul className="space-y-2 text-gray-700">
                <li>📱 Mobile app version</li>
                <li>🔄 Real-time data streaming</li>
                <li>📈 Advanced predictive analytics</li>
                <li>🎯 Recommendation engine</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Integration Plans</h4>
              <ul className="space-y-2 text-gray-700">
                <li>🔗 Database connectors (SQL)</li>
                <li>📊 Excel/Google Sheets support</li>
                <li>☁️ Cloud storage integration</li>
                <li>🔐 Enterprise authentication</li>
              </ul>
            </div>
          </div>
        </div>

       

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg shadow p-8 border-l-4 border-blue-500">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📧 Get in Touch</h2>
          <p className="text-gray-700 mb-4">
            Have questions or feedback? We'd love to hear from you!
          </p>
          <div className="space-y-2">
            <p className="text-gray-700">
              📧 <strong>Email:</strong> support@insightcart.ai
            </p>
            <p className="text-gray-700">
              🌐 <strong>Website:</strong> www.insightcart.ai
            </p>
            <p className="text-gray-700">
              💬 <strong>Twitter:</strong> @insightcart_ai
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 py-8 border-t border-gray-200">
          <p className="text-gray-600">
            © 2026 InsightCart AI. Built with ❤️ for data-driven decisions.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Version 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
