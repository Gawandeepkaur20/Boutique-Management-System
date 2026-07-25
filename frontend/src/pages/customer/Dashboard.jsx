import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Ruler, Search } from 'lucide-react';
import StatCard from '../../components/StatCard';
import OnboardingHint from '../../components/OnboardingHint';
import { StatCardSkeleton } from '../../components/Skeleton';
import StatusBadge from '../../components/StatusBadge';
import api from '../../services/api';

export default function CustomerDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my').then((r) => setOrders(r.data || [])).finally(() => setLoading(false));
  }, []);

  const active = orders.filter((o) => o.status !== 'delivered').length;

  return (
    <div className="space-y-6">
     <div
  className="
  bg-[#FAF8F5]
  dark:bg-[#252525]
  rounded-3xl
  p-6
  border
  border-[#EAE3D6]
  dark:border-[#333]
  "
>
  <p className="text-[#8B7D6B] text-sm">
    Customer Portal
  </p>

  <h1 className="text-3xl font-semibold text-[#5C4033] dark:text-white mt-1">
    Welcome Back
  </h1>

  <p className="text-[#8B7D6B] mt-2">
    Track your tailoring progress, update measurements and manage orders.
  </p>
</div>

      

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
         <StatCard
  title="Total Orders"
  value={orders.length}
  icon={ShoppingBag}
  color="#C48A7A"
/>

<StatCard
  title="In Progress"
  value={active}
  icon={Search}
  color="#C9A227"
/>

<StatCard
  title="Completed"
  value={orders.length - active}
  icon={ShoppingBag}
  color="#7A9B76"
/>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Link
  to="/customer/measurements"
  className="
  bg-white
  dark:bg-[#252525]
  rounded-3xl
  border
  border-[#EAE3D6]
  dark:border-[#333]
  p-6
  hover:shadow-lg
  transition-all
  "
>
          <Ruler className="w-8 h-8 text-[#C48A7A]" />

<p className="font-semibold text-[#5C4033] dark:text-white">
  Measurements
</p>

<p className="text-sm text-[#8B7D6B]">
  Keep your sizes updated for perfect fitting.
</p>
        </Link>
        <Link to="/customer/track" className="
  bg-white
  dark:bg-[#252525]
  rounded-3xl
  border
  border-[#EAE3D6]
  dark:border-[#333]
  p-6
  hover:shadow-lg
  transition-all
  ">
         <Search className="w-8 h-8 text-[#C9A227]" />
          <div>
          <p className="font-semibold text-[#5C4033] dark:text-white">
  Track Orders
</p>

<p className="text-sm text-[#8B7D6B]">
  Follow the status of your ongoing orders.
</p>
          </div>
        </Link>
      </div>
<div
  className="
  bg-white
  dark:bg-[#252525]
  rounded-3xl
  border
  border-[#EAE3D6]
  dark:border-[#333]
  p-6
  "
>
        <div className="flex justify-between items-center mb-5">
  <h2 className="text-xl font-semibold text-[#5C4033] dark:text-white">
    Recent Orders
  </h2>
   <Link
    to="/customer/orders"
    className="text-[#C48A7A] text-sm font-medium"
  >
    View All
  </Link>
</div>
        {orders.length === 0 ? (
          <p className="text-gray-500 text-sm">No orders yet.</p>
        ) : (
          <ul className="space-y-3">
            {orders.slice(0, 5).map((o) => (
             <li
  key={o._id}
  className="
  flex
  items-center
  justify-between
  py-4
  border-b
  border-[#F0EBE2]
  dark:border-[#333]
  last:border-0
  "
>
  <div>
    <p className="font-medium text-[#5C4033] dark:text-white">
      {o.orderNumber}
    </p>

    <p className="text-xs text-[#8B7D6B]">
      {new Date(o.createdAt).toLocaleDateString()}
    </p>
  </div>

  <StatusBadge status={o.status} />
</li>
            ))}
          </ul>
        )}
        <Link to="/customer/orders" className="text-md mt-4 inline-block  text-[#5C4033]
hover:text-[#5C4033] dark:text-white  font-medium">
          View all orders →
        </Link>
      </div>
    </div>
  );
}
