import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface MacroChartProps {
  protein: number;
  carbs: number;
  fat: number;
}

const MacroChart: React.FC<MacroChartProps> = ({ protein, carbs, fat }) => {
  const data = [
    { name: 'Protein', value: protein, color: '#c084fc' }, // purple-400
    { name: 'Carbs', value: carbs, color: '#60a5fa' },     // blue-400
    { name: 'Fat', value: fat, color: '#facc15' },         // yellow-400
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ 
    cx, cy, midAngle, innerRadius, outerRadius, percent 
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            animationDuration={750}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value}g`, '']}
            contentStyle={{ 
              backgroundColor: 'var(--color-card)', 
              borderColor: 'var(--color-border)',
              borderRadius: '0.375rem',
              color: 'var(--color-card-foreground)'
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MacroChart;
