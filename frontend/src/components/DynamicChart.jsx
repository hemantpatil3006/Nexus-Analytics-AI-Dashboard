import React from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const DynamicChart = ({ config }) => {
  if (!config || !config.data || config.data.length === 0) return null;

  const { type, xAxisKey, dataKey, data } = config;

  const renderChartType = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={xAxisKey} tick={{fontSize: 12}} />
            <YAxis tick={{fontSize: 12}} />
            <Tooltip contentStyle={{ borderRadius: '8px' }} />
            <Legend />
            <Bar dataKey={dataKey} fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={xAxisKey} tick={{fontSize: 12}} />
            <YAxis tick={{fontSize: 12}} />
            <Tooltip contentStyle={{ borderRadius: '8px' }} />
            <Legend />
            <Line type="monotone" dataKey={dataKey} stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Tooltip contentStyle={{ borderRadius: '8px' }} />
            <Legend />
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={xAxisKey}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        );
      default:
        return <p className="text-sm text-gray-500 italic">Unsupported chart type requested by AI.</p>;
    }
  };

  return (
    <div className="w-full h-64 mt-4 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        {renderChartType()}
      </ResponsiveContainer>
    </div>
  );
};

export default DynamicChart;
