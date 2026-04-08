/**
 * Location Distribution Chart Component
 * Bar chart showing customer distribution by location
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function LocationDistributionChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const chartData = data.map(item => ({
    name: item.name,
    value: item.value,
    percentage: item.percentage
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">📍 Location Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart 
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" width={100} />
          <Tooltip 
            formatter={(value, name, props) => {
              if (name === 'value') return [`${value} customers (${props.payload.percentage}%)`, 'Count'];
              return [value, name];
            }}
            labelStyle={{ color: '#000' }}
          />
          <Legend />
          <Bar dataKey="value" fill="#A855F7" name="Customer Count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
