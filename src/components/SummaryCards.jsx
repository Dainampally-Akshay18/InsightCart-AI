/**
 * Summary Cards Component
 * Displays key metrics and statistics
 */

export default function SummaryCards({ summary }) {
  if (!summary) {
    return (
      <div className="text-center text-gray-500 py-8">
        Load a dataset to see summary statistics
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Customers',
      value: summary.totalCustomers.toLocaleString(),
      icon: '👥',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Revenue',
      value: `₹${parseFloat(summary.totalRevenue).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      icon: '💰',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Avg Spending',
      value: `₹${parseFloat(summary.avgSpending).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      icon: '📈',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Top Product',
      value: summary.topProduct,
      icon: '🏆',
      bgColor: 'bg-yellow-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div key={idx} className={`${card.bgColor} rounded-lg p-6 shadow`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 font-semibold">{card.title}</h3>
            <span className="text-2xl">{card.icon}</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
