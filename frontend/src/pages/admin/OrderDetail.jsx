import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import { ArrowLeft, Ruler } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import { PageSkeleton } from '../../components/Skeleton';
import api from '../../services/api';
import { showSuccess, showError } from '../../utils/toast';

const STATUSES = ['received', 'processing', 'stitching', 'ready', 'delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get(`/orders/${id}`).then((r) => setOrder(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    api.get('/workers').then((r) => setWorkers(r.data || []));
  }, [id]);

  const updateStatus = async (status) => {
    await api.patch(`/orders/${id}/status`, { status });
    showSuccess('Status updated');
    load();
  };

  const assignWorker = async (workerId) => {
    await api.patch(`/orders/${id}/assign`, { workerId });
    showSuccess('Worker assigned');
    load();
  };

  const generateBill = async () => {
    try {
      await api.post(`/orders/${id}/invoice`);
      showSuccess('Invoice generated and email sent');
    } catch {
      showError('Failed to generate invoice');
    }
  };

  if (loading) return <PageSkeleton />;
  if (!order) return <p className="text-red-500">Order not found</p>;

  const steps = STATUSES;
  const currentIdx = steps.indexOf(order.status);

  return (
   <div className="space-y-6 max-w-6xl">
   <div className="flex items-center justify-between">
  <div className="flex items-center gap-4">
    <Link
      to="/admin/orders"
      className="
      w-12 h-12
      rounded-2xl
      bg-[#F3EFD9]
      flex items-center justify-center
      hover:bg-[#E9DFC4]
      transition
      "
    >
      <ArrowLeft className="w-5 h-5 text-[#5C4033]" />
    </Link>

    <div>
      <p className="text-sm text-[#8B7D6B]">
        Order Number
      </p>

      <h1 className="text-3xl font-bold text-[#4A3F35]">
        {order.orderNumber}
      </h1>
    </div>
  </div>

  
</div>
     

      <div
  className="
  bg-[#FAF8F5]
  dark:bg-[#252525]
  border
  border-[#EAE3D6]
  dark:border-[#333]
  rounded-3xl
  p-6
"
>
       <div className="flex items-center justify-between mb-8">
  <div>
    <h3 className="text-xl font-semibold text-[#4A3F35] dark:text-white">
      Status Timeline
    </h3>

    <p className="text-sm text-[#8B7D6B] mt-1">
      Track and update order progress
    </p>
  </div>

  <div className="flex items-center gap-3">
    

    <select
      value={order.status}
      onChange={(e) => updateStatus(e.target.value)}
      className="
      h-11
      px-4
      rounded-xl
       border
  border-[#EAE3D6]
  bg-white
  dark:bg-[#1F1F1F]
  dark:border-[#333]
  text-[#5C4033]
  focus:outline-none
  focus:ring-2
  focus:ring-[#C48A7A]
      min-w-[180px]
      "
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  </div>
</div>
       <div className="relative flex justify-between mt-8 px-4">
         <div
  className="
  absolute
  top-4
  left-8
  right-8
  h-[2px]
  bg-[#EAE3D6]
  "
/>
          {steps.map((step, i) => (
            <div key={step} className="relative flex flex-col items-center z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
               i <= currentIdx
  ? 'bg-[#C48A7A] text-white shadow-md': 'bg-[#ECECEC] text-[#7A7A7A]'
              }`}>{i + 1}</div>
              <span className="text-xs mt-2 capitalize">{step}</span>
            </div>
          ))}
        </div>
       
      </div>

      <div className="grid md:grid-cols-2 gap-6">
      <div
  className="
  bg-[#FAF8F5]
  dark:bg-[#252525]
  border
  border-[#EAE3D6]
  dark:border-[#333]
  rounded-3xl
  p-6
"
>
          <h3 className="font-semibold mb-3 text-[#4A3F35] dark:text-white">Customer</h3>
          <p className="font-medium">{order.customer?.user?.name}</p>
          <p className="text-sm text-gray-500">{order.customer?.user?.email}</p>
          <p className="text-sm text-gray-500">{order.customer?.user?.phone}</p>
        </div>
       <div
  className="
  bg-[#FAF8F5]
  dark:bg-[#252525]
  border
  border-[#EAE3D6]
  dark:border-[#333]
  rounded-3xl
  p-6
"
>
          <h3 className="font-semibold mb-3">Worker</h3>
          <p>{order.worker?.user?.name || 'Unassigned'}</p>
          <select
  className="
  mt-3
  h-12
  w-full
  px-4
  rounded-2xl
  border
  border-[#EAE3D6]
  bg-white
  dark:bg-[#1F1F1F]
  dark:border-[#333]
  text-[#5C4033]
  focus:outline-none
  focus:ring-2
  focus:ring-[#C48A7A]
  "
value={order.worker?._id || ''}
            onChange={(e) => e.target.value && assignWorker(e.target.value)}>
            <option value="">Assign worker...</option>
            {workers.map((w) => (
              <option key={w._id} value={w._id}>{w.user?.name}</option>
            ))}
          </select>
        </div>
      </div>

     
        {order.measurement && (
  <div className="card">
    <div className="flex items-center gap-3 mb-5">
      <div
        className="
        w-10 h-10
        rounded-xl
        bg-[#F3EFD9]
        flex items-center justify-center
        "
      >
        <Ruler className="w-5 h-5 text-[#C9A227]" />
      </div>

      <h3 className="text-xl font-semibold text-[#4A3F35] dark:text-white">
        Measurements
      </h3>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {['height', 'chest', 'waist', 'shoulder', 'sleeveLength'].map(
        (k) =>
          order.measurement[k] != null && (
            <div
              key={k}
              className="
              bg-white
              dark:bg-[#1F1F1F]
              border
              border-[#EAE3D6]
              dark:border-[#333]
              rounded-2xl
              p-4
              "
            >
              <p className="text-xs uppercase text-[#8B7D6B]">
                {k.replace(/([A-Z])/g, ' $1')}
              </p>

              <p className="text-xl font-semibold text-[#4A3F35] dark:text-white mt-1">
                {order.measurement[k]}
              </p>
            </div>
          )
      )}
    </div>
  </div>
)}
{order.customer?.referenceImages?.length > 0 && (

<div
className="
bg-[#FAF8F5]
dark:bg-[#252525]
border
border-[#EAE3D6]
dark:border-[#333]
rounded-3xl
p-6
"
>

<h3
className="
text-xl
font-semibold
text-[#4A3F35]
dark:text-white
mb-5
"
>
Reference Designs
</h3>

<div className="grid grid-cols-2 md:grid-cols-4 gap-4">

{order.customer.referenceImages.map((img,index)=>(

<img
key={index}
src={img.url}
alt="Reference"
className="
h-44
w-full
rounded-2xl
object-cover
border
border-[#EAE3D6]
dark:border-[#333]
cursor-pointer
hover:scale-105
transition
"
/>

))}

</div>

</div>

)}
{order.customer?.modificationRequests?.length > 0 && (

<div
className="
bg-[#FAF8F5]
dark:bg-[#252525]
border
border-[#EAE3D6]
dark:border-[#333]
rounded-3xl
p-6
"
>

<h3
className="
text-xl
font-semibold
text-[#4A3F35]
dark:text-white
mb-5
"
>
Customer Modification Requests
</h3>

<div className="space-y-4">

{order.customer.modificationRequests.map((m,index)=>(

<div
key={index}
className="
border
border-[#EAE3D6]
dark:border-[#333]
rounded-2xl
p-5
bg-white
dark:bg-[#1F1F1F]
"
>

<div className="flex justify-between">

<h4 className="font-semibold">

{m.title}

</h4>

<span
className="
px-3
py-1
rounded-full
bg-[#F3EFD9]
dark:bg-[#2F2A1D]
text-sm
capitalize
"
>

{m.status}

</span>

</div>

<p className="mt-3 text-[#8B7D6B]">

{m.description}

</p>

</div>

))}

</div>

</div>

)}
{order.aiRecommendation && (
  <div
    className="
    bg-[#FAF8F5]
    dark:bg-[#252525]
    border
    border-[#EAE3D6]
    dark:border-[#333]
    rounded-3xl
    p-6
    "
  >
    <div className="flex items-center gap-3 mb-6">

      

      <div>
        <h3 className="text-xl font-semibold text-[#4A3F35] dark:text-white">
          AI Size Recommendation
        </h3>

        <p className="text-sm text-[#8B7D6B]">
          Suggested by AI based on customer measurements
        </p>
      </div>

    </div>

    <div className="grid md:grid-cols-3 gap-5">

      <div className="bg-white dark:bg-[#1F1F1F] rounded-2xl border border-[#EAE3D6] dark:border-[#333] p-4">
        <p className="text-xs text-[#8B7D6B] uppercase">Recommended Size</p>
        <p className="text-xl font-semibold mt-1">
          {order.aiRecommendation.recommendedSize}
        </p>
      </div>

      <div className="bg-white dark:bg-[#1F1F1F] rounded-2xl border border-[#EAE3D6] dark:border-[#333] p-4">
        <p className="text-xs text-[#8B7D6B] uppercase">Fit Type</p>
        <p className="text-xl font-semibold mt-1">
          {order.aiRecommendation.fitType}
        </p>
      </div>

      <div className="bg-white dark:bg-[#1F1F1F] rounded-2xl border border-[#EAE3D6] dark:border-[#333] p-4">
        <p className="text-xs text-[#8B7D6B] uppercase">Fabric</p>
        <p className="text-xl font-semibold mt-1">
          {order.aiRecommendation.recommendedFabric}
        </p>
      </div>

      <div className="bg-white dark:bg-[#1F1F1F] rounded-2xl border border-[#EAE3D6] dark:border-[#333] p-4">
        <p className="text-xs text-[#8B7D6B] uppercase">Neck Design</p>
        <p className="text-xl font-semibold mt-1">
          {order.aiRecommendation.recommendedNeck}
        </p>
      </div>

      <div className="bg-white dark:bg-[#1F1F1F] rounded-2xl border border-[#EAE3D6] dark:border-[#333] p-4">
        <p className="text-xs text-[#8B7D6B] uppercase">Sleeves</p>
        <p className="text-xl font-semibold mt-1">
          {order.aiRecommendation.recommendedSleeves}
        </p>
      </div>

      <div className="bg-white dark:bg-[#1F1F1F] rounded-2xl border border-[#EAE3D6] dark:border-[#333] p-4">
        <p className="text-xs text-[#8B7D6B] uppercase">Bottom Style</p>
        <p className="text-xl font-semibold mt-1">
          {order.aiRecommendation.recommendedBottom}
        </p>
      </div>

    </div>
  </div>
)}
    <div
  className="
  bg-[#FAF8F5]
  dark:bg-[#252525]
  border
  border-[#EAE3D6]
  dark:border-[#333]
  rounded-3xl
  p-6
"
>
        <h3 className="font-semibold mb-3">Items</h3>
        {order.items?.map((item, i) => (
          <div
  key={i}
  className="
  flex
  justify-between
  items-center
  py-3
  border-b
  border-[#EFE7D6]
  dark:border-[#333]
"
>
            <span>{item.name} {item.fabric && `(${item.fabric})`} x{item.quantity}</span>
            <span>₹{item.quantity * item.price}</span>
          </div>
        ))}
        <p className="text-right text-2xl font-semibold text-[#4A3F35]">
  Total: ₹{order.totalAmount}
</p>
        <p className="text-right text-sm text-gray-500">Advance: ₹{order.advancePaid || 0}</p>
      </div>

      {order.workerNotes && (
        <div className="card">
          <h3 className="font-semibold mb-2">Worker Notes</h3>
          <p className="text-sm">{order.workerNotes}</p>
          {order.completedWorkDetails && <p className="text-sm mt-2">{order.completedWorkDetails}</p>}
        </div>
      )}

     <div className="flex gap-3">
  <button
    onClick={generateBill}
    className="
    px-6
    py-3
    rounded-2xl
    bg-[#C48A7A]
    hover:bg-[#B17869]
    text-white
    font-medium
    transition
    "
  >
    Generate Invoice
  </button>

  <button
    onClick={() => navigate('/admin/invoices')}
    className="
    px-6
    py-3
    rounded-2xl
    bg-white
    dark:bg-[#1F1F1F]
    border
    border-[#EAE3D6]
    dark:border-[#333]
    text-[#5C4033]
    "
  >
    View Invoices
  </button>
</div>
    </div>
  );
}
