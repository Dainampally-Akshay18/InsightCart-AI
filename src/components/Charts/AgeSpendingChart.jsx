/**
 * Age vs Spending Chart Component
 * Line chart showing average spending by age group
 */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function AgeSpendingChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Transform data for better readability
  const chartData = data.map(item => ({
    ageGroup: item.ageGroup,
    'Avg Spending': parseFloat(item.avgSpending),
    'Customer Count': item.count
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">💵 Age Group vs Spending</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="ageGroup"
            label={{ value: 'Age Group', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            label={{ value: 'Avg Spending (₹)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'Avg Spending') return [`₹${value.toFixed(2)}`, name];
              return [value, name];
            }}
            labelStyle={{ color: '#000' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="Avg Spending" 
            stroke="#10B981" 
            strokeWidth={2}
            dot={{ fill: '#10B981', r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
