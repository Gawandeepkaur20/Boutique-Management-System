import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const renderLabel = ({ percent }) =>
  percent > 0
    ? `${(percent * 100).toFixed(0)}%`
    : '';

export default function OrderPieChart({ title, data, height = 300, emptyMessage = 'No order data' }) {
  const filtered = (data || []).filter((d) => d.value > 0);
  const total = filtered.reduce((sum, d) => sum + d.value, 0);

  return (
    <div
  className="
  bg-[#FAF8F5]
  dark:bg-[#252525]
  border
  border-[#EAE3D6]
  dark:border-[#333]
  rounded-3xl
  p-6
  h-full
  "
>
    <h3 className="text-xl font-semibold text-[#4A3F35] dark:text-white mb-2">{title}</h3>
      {total > 0 && (
        <p className="text-sm text-[#8B7D6B] dark:text-gray-400 mb-5">Total orders: {total}</p>
      )}
      {filtered.length === 0 ? (
        <p className="text-[#8B7D6B] dark:text-gray-400 text-sm py-20 text-center">{emptyMessage}</p>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={filtered}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              
              paddingAngle={2}
              label={renderLabel}
              labelLine={{ strokeWidth: 1 }}
            >
              {filtered.map((entry, i) => (
                <Cell key={entry.name || i} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [value, name]}
             contentStyle={{
  borderRadius: '16px',
  border: '1px solid #EAE3D6',
  backgroundColor: '#FAF8F5',
}}
            />
            <Legend
              verticalAlign="bottom"
              formatter={(value, entry) => (
               <span className="text-sm text-[#4A3F35] dark:text-gray-300 capitalize">{value}: {entry.payload?.value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
