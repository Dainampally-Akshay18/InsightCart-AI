/**
 * Gender Distribution Chart Component
 * Pie chart showing gender breakdown
 */

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#FF6B6B', '#4ECDC4'];

export default function GenderDistributionChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Limit to 2 genders (Male, Female)
  const chartData = data.slice(0, 2).map(item => ({
    name: item.name,
    value: item.value,
    percentage: item.percentage
  }));

  const renderCustomLabel = (entry) => {
    return `${entry.name} (${entry.percentage}%)`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">👥 Gender Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name, props) => {
              return [`${value} customers (${props.payload.percentage}%)`, 'Gender'];
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
