import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
const COLORS = {
  gold: '#C9A227',
  bronze: '#B79A6B',
  brown: '#8B6B3D',
  dark: '#4A3F35',
  ivory: '#FAF8F5',
};
export function MonthlyOrdersChart({ data, height = 320 }) {
  if (!data?.length) {
    return (
      <p className="text-gray-500 text-sm py-24 text-center">
        No monthly order data yet. Create orders to see this chart.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
        <Tooltip
          formatter={(value) => [value, 'Orders']}
          contentStyle={{ borderRadius: 8 }}
        />
  <Bar
  dataKey="value"
  name="Orders"
  fill="#C48A7A"
  radius={[8, 8, 0, 0]}
  maxBarSize={42}
/>
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MonthlyRevenueChart({ data, height = 320 }) {
  if (!data?.length) {
    return (
      <p className="text-gray-500 text-sm py-24 text-center">
        
        No order activity available yet. Generate orders and invoices to see this chart.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid
  stroke="#EAE3D6"
  vertical={false}
/>
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
        <Tooltip
          formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Revenue']}
          contentStyle={{ borderRadius: 8 }}
        />
        <Line
  type="monotone"
  dataKey="value"
  name="Revenue"
 stroke="#C48A7A"
  strokeWidth={3}
  dot={{
    r: 4,
    fill: COLORS.brown
  }}
  activeDot={{
    r: 6,
    fill: COLORS.gold
  }}
/>
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function MonthlyChartCard({ title, subtitle, children }) {
  return (
    <div
  className="
  h-full
  flex
  flex-col
  bg-[#FAF8F5]
  dark:bg-[#252525]
  rounded-3xl
  border
  border-[#EAE3D6]
  dark:border-[#333]
  p-6
  "
>
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-[#4A3F35] dark:text-white">{title}</h3>
        {subtitle && <p className="text-sm text-[#8B7D6B] dark:text-gray-400 mt-1">{subtitle}</p>}
      </div>
      <div className="flex-1 min-h-[320px]">{children}</div>
    </div>
  );
}
