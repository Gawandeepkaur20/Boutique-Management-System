import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

import {
  Package,
  Users,
  Wrench,
  IndianRupee
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import OrderPieChart from '../../components/OrderPieChart';
import MonthlyChartCard, { MonthlyOrdersChart, MonthlyRevenueChart } from '../../components/MonthlyChartCard';
import { StatCardSkeleton, ChartSkeleton } from '../../components/Skeleton';
import { showError } from '../../utils/toast';
import api from '../../services/api';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const PIE_COLORS = [
 '#C9A227',
 '#B79A6B',
 '#8B6B3D',
 '#D8C7A3',
 '#6B5E52'
];

const STATUS_COLORS = {

   received: '#C48A7A',   // Rose Gold
  processing: '#E6CA9E', // Champagne
  stitching: '#B79A6B',  // Taupe
  ready: '#7A9B76',      // Sage
  delivered: '#5C4033',  // Chocolate
};
const buildReceivedDeliveredPie = (stats) => {
  const inProgress = Math.max(
    0,
    stats.totalOrders - stats.receivedOrders - stats.deliveredOrders
  );
  return [
    { name: 'Received', value: stats.receivedOrders, color: STATUS_COLORS.received },
    { name: 'Delivered', value: stats.deliveredOrders, color: STATUS_COLORS.delivered },
    { name: 'In Progress', value: inProgress, color: '#f97316' },
  ];
};

const buildReceivedDeliveredOnlyPie = (stats) => [
  { name: 'Orders Received', value: stats.receivedOrders, color: STATUS_COLORS.received },
  { name: 'Orders Delivered', value: stats.deliveredOrders, color: STATUS_COLORS.delivered },
];

const formatChartData = (data, valueKey = 'count') =>
  data.map((d) => ({
    name: `${MONTHS[(d._id?.month || 1) - 1]} ${d._id?.year || ''}`,
    value: d[valueKey] || d.count || 0,
  }));

const presets = {
  week: () => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 7);
    return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) };
  },
  month: () => {
    const to = new Date();
    const from = new Date(to.getFullYear(), to.getMonth(), 1);
    return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) };
  },
  all: () => ({ from: '', to: '' }),
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(presets.all());
const [activeFilter, setActiveFilter] = useState('all');
  const load = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (range.from) params.set('from', range.from);
    if (range.to) params.set('to', range.to);
    api.get(`/dashboard/stats?${params}`)
      .then((res) => setData(res.data))
      .catch((err) => {
        setData(null);
        showError(err.response?.data?.message || 'Could not load dashboard. Is the backend running?');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [range.from, range.to]);

  const monthlyOrders = data ? formatChartData(data.charts.monthlyOrders) : [];
  const monthlyRevenue = data ? formatChartData(data.charts.monthlyRevenue, 'revenue') : [];
  const statusPie =
    data?.charts.statusDistribution.map((s) => ({
      name: s._id,
      value: s.count,
      color: STATUS_COLORS[s._id] || PIE_COLORS[0],
    })) || [];

  const receivedDeliveredPie = data ? buildReceivedDeliveredPie(data.stats) : [];
  const receivedDeliveredOnlyPie = data ? buildReceivedDeliveredOnlyPie(data.stats) : [];

  return (
    <div className="space-y-6">
       <div className="flex flex-col xl:flex-row gap-6">

  {/* Welcome Card */}
  <div
    className="
    flex-1
    min-h-[170px]
    bg-[#FAF8F5]
    dark:bg-[#252525]
    rounded-3xl
    p-6
    border
    border-[#EAE3D6]
    dark:border-[#333]
    flex
    flex-col
    justify-center
    "
  >
    <p className="text-[#8B7D6B] text-sm">
      Boutique Overview
    </p>

    <h1 className="text-3xl font-semibold text-[#4A3F35] dark:text-white mt-2">
      Welcome Back
    </h1>

    <p className="text-[#8B7D6B] mt-2">
      Monitor orders, customers and revenue from one place.
    </p>

    <p className="text-sm text-[#8B7D6B] mt-4">
      {data?.stats?.totalOrders || 0} orders managed this month
    </p>
  </div>

  {/* Filter Card */}
  <div
    className="
    flex-1
    min-h-[170px]
    bg-[#FFFEFC]
    dark:bg-[#252525]
    border
    border-[#EAE3D6]
    dark:border-[#333]
    rounded-3xl
    p-6
    flex
    flex-col
    justify-center
    "
  >
    <p className="text-sm text-[#8B7D6B] mb-4">
      Filter Analytics
    </p>

    <div className="flex flex-wrap gap-3">
      {['week', 'month', 'all'].map((p) => (
        <button
          key={p}
          onClick={() => {
            setActiveFilter(p);
            setRange(presets[p]());
          }}
          className={`
            px-5
            h-11
            rounded-xl
            text-sm
            font-medium
            transition-all
            ${
              activeFilter === p
                ? `
                  bg-[#C48A7A]
                  text-white
                  shadow-sm
                `
                : `
                
                  text-[#8B7D6B]
                  hover:bg-[#FAF4F2]
                `
            }
          `}
        >
          {p === 'all' ? 'All Time' : `This ${p}`}
        </button>
      ))}

      <input
        type="date"
        value={range.from}
        onChange={(e) =>
          setRange({ ...range, from: e.target.value })
        }
        className="
  h-11
  px-4
  rounded-xl
  border
  border-[#EAE3D6]
  dark:border-[#3A3A3A]
  bg-[#FFFEFC]
  dark:bg-[#1E1E1E]
  text-[#5C4033]
  dark:text-[#F5F5F5]
  focus:outline-none
  focus:ring-2
  focus:ring-[#C48A7A]
  "
      />

      <input
        type="date"
        value={range.to}
        onChange={(e) =>
          setRange({ ...range, to: e.target.value })
        }
        className="
  h-11
  px-4
  rounded-xl
  border
  
  border-[#EAE3D6]
  dark:border-[#3A3A3A]
  bg-[#FFFEFC]
  dark:bg-[#1E1E1E]
  text-[#5C4033]
  dark:text-[#F5F5F5]
  focus:outline-none
  focus:ring-2
  focus:ring-[#C48A7A]
  "
      />
    </div>
  </div>


      </div>

     

      {loading ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 7 }).map((_, i) => <StatCardSkeleton key={i} />)}
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ChartSkeleton />
            <ChartSkeleton />
          </div>
        </>
      ) : !data ? (
        <div className="card text-center py-12">
          <p className="text-red-500 font-medium">Failed to load dashboard</p>
          <p className="text-sm text-gray-500 mt-2">Restart the backend and refresh.</p>
          <button onClick={load} className="btn-primary mt-4">Retry</button>
        </div>
      ) : (
        <>
      
         
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
           <StatCard
  title="Active Orders"
  value={data.stats.processingOrders}
  icon={Package}
  color="#C48A7A"
/>

<StatCard
  title="Customers"
  value={data.stats.totalCustomers}
  icon={Users}
  color="#C9A227"
/>

<StatCard
  title="Workers"
  value={data.stats.totalWorkers}
  icon={Wrench}
  color="#7A9B76"
/>

<StatCard
  title="Revenue"
  value={`₹${data.stats.revenue?.toLocaleString() || 0}`}
  icon={IndianRupee}
  color="#6B8E7B"
/>
          </div>

          {/* Monthly charts — primary section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-[#5C4033] dark:text-white"/>
             <h2 className="text-xl font-semibold text-[#5C4033] dark:text-white">
  Business Performance
</h2>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 text-[#5C4033] gap-6">
              <MonthlyChartCard
                title="Monthly Orders"
                subtitle="Number of orders placed per month"
              >
                <MonthlyOrdersChart data={monthlyOrders} />
              </MonthlyChartCard>

              <MonthlyChartCard
                title="Monthly Revenue"
                subtitle="Total invoice revenue per month (₹)"
              >
                <div className="flex items-start gap-2 mb-2 text-xs text-green-600 dark:text-green-400">
                  <TrendingUp className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Based on generated invoices</span>
                </div>
                <MonthlyRevenueChart data={monthlyRevenue} />
              </MonthlyChartCard>
            </div>
          </section>

          {/* Pie charts */}
          <section>
            <div className="flex items-center justify-between mb-4">
   <h2 className="text-xl font-semibold text-[#5C4033] dark:text-white">
Order Distribution
</h2>

  <span className="text-sm text-[#8B7D6B]">
    Live Status Breakdown
  </span>
</div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <OrderPieChart
                title="Orders Received vs Delivered"
                data={receivedDeliveredOnlyPie}
                height={280}
                emptyMessage="No received or delivered orders yet"
              />
             
              <OrderPieChart
                title="All Order Statuses"
                data={statusPie}
                height={280}
                emptyMessage="No orders in range"
              />
            </div>
          </section>
         
        </>
      )}
    </div>
  );
}
