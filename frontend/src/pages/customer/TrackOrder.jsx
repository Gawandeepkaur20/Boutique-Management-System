import { useState } from 'react';
import { Search } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import api from '../../services/api';

const STEPS = ['received', 'processing', 'stitching', 'ready', 'delivered'];

export default function CustomerTrackOrder() {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  const track = async () => {
    setError('');
    try {
      const { data } = await api.get(`/orders/track/${orderNumber}`);
      setOrder(data);
    } catch {
      setError('Order not found');
      setOrder(null);
    }
  };

  const currentStep = order ? STEPS.indexOf(order.status) : -1;

  return (
  
     <div className="space-y-6">

  <div
    className="
    bg-[#FAF8F5]
    dark:bg-[#252525]
    rounded-3xl
    border
    border-[#EAE3D6]
    dark:border-[#333]
    p-6
    "
  >
    <p className="text-sm text-[#8B7D6B]">
      Order Tracking
    </p>

    <h1 className="text-3xl font-bold text-[#4A3F35] dark:text-white mt-2">
      Track Your Order
    </h1>

    <p className="text-[#8B7D6B] mt-3">
      Follow your tailoring progress in real time.
    </p>
  </div>

     <div
  className="
  bg-[#FAF8F5]
  dark:bg-[#252525]
  rounded-3xl
  border
  border-[#EAE3D6]
  dark:border-[#333]
  p-5
  "
>
  <div className="flex gap-3">

    <input
      value={orderNumber}
      onChange={(e) => setOrderNumber(e.target.value)}
      placeholder="Enter Order Number (ORD-00001)"
      className="
      flex-1
      h-12
      px-4
      rounded-2xl
      border
      border-[#EAE3D6]
      dark:border-[#333]
      bg-white
      dark:bg-[#1F1F1F]
      text-[#4A3F35]
      dark:text-white
      "
    />

    <button
      onClick={track}
      className="
      px-6
      rounded-2xl
      bg-[#C48A7A]
      hover:bg-[#B17869]
      text-white
      flex items-center gap-2
      "
    >
      <Search className="w-4 h-4" />
      Track
    </button>

  </div>

  {error && (
    <p className="mt-3 text-[#B85C5C]">
      {error}
    </p>
  )}
</div>
      {error && <p className="text-red-500">{error}</p>}

     {order && (
<div
  className="
  bg-[#FAF8F5]
  dark:bg-[#252525]
  border
  border-[#EAE3D6]
  dark:border-[#333]
  rounded-3xl
  p-6
  space-y-8
  "
>
        <div className="flex items-start justify-between flex-wrap gap-4">

  <div>
    <h2 className="text-3xl font-bold text-[#4A3F35] dark:text-white">
      {order.orderNumber}
    </h2>

    <p className="text-[#8B7D6B] mt-2">
      Ordered on {new Date(order.createdAt).toLocaleDateString()}
    </p>
  </div>

  <span
    className={`
    inline-flex
    items-center
    justify-center
    px-5
    h-11
    rounded-full
    text-sm
    font-medium
    whitespace-nowrap

    ${
      order.status === 'received'
        ? 'bg-[#E8F4EE] text-[#4E7A61]'
        : order.status === 'processing'
        ? 'bg-[#F5EAD7] text-[#A16B2A]'
        : order.status === 'stitching'
        ? 'bg-[#F8F1EF] text-[#B06D5C]'
        : order.status === 'ready'
        ? 'bg-[#E8F0FA] text-[#5478A3]'
        : 'bg-[#E8F4EE] text-[#4E7A61]'
    }
    `}
  >
    {order.status.charAt(0).toUpperCase() +
      order.status.slice(1)}
  </span>

</div>

         <div className="relative">

  <div
    className="
    absolute
    top-5
    left-0
    right-0
    h-1
    bg-[#EAE3D6]
    dark:bg-[#333]
    "
  />

  <div className="grid grid-cols-5 gap-2 relative">

    {STEPS.map((step, index) => {

      const active = index <= currentStep;

      return (
        <div
          key={step}
          className="flex flex-col items-center"
        >
          <div
            className={`
            w-10
            h-10
            rounded-full
            flex
            items-center
            justify-center
            text-sm
            font-bold
            ${
              active
                ? 'bg-[#C48A7A] text-white'
                : 'bg-[#EAE3D6] dark:bg-[#333] text-[#8B7D6B]'
            }
            `}
          >
            {index + 1}
          </div>

          <span
            className="
            mt-3
            text-xs
            text-center
            capitalize
            text-[#4A3F35]
            dark:text-white
            "
          >
            {step}
          </span>
        </div>
      );
    })}

  </div>
</div>
           

         <div
  className="
  rounded-2xl
  bg-white
  dark:bg-[#1F1F1F]
  border
  border-[#EAE3D6]
  dark:border-[#333]
  p-5
  "
>
  <p className="text-[#8B7D6B] text-sm">
    Expected Delivery
  </p>

  <h3 className="text-xl font-semibold text-[#4A3F35] dark:text-white mt-2">
    {order.deliveryDate
      ? new Date(order.deliveryDate).toLocaleDateString()
      : 'Not Assigned Yet'}
  </h3>
</div>
<div>
  <h3 className="text-xl font-semibold text-[#4A3F35] dark:text-white mb-4">
    Order Items
  </h3>

  <div className="space-y-3">

    {order.items?.map((item, i) => (
      <div
        key={i}
        className="
        flex
        justify-between
        items-center
        p-4
        rounded-2xl
        bg-white
        dark:bg-[#1F1F1F]
        border
        border-[#EAE3D6]
        dark:border-[#333]
        "
      >
        <div>
          <p className="font-medium text-[#4A3F35] dark:text-white">
            {item.name}
          </p>

          <p className="text-sm text-[#8B7D6B]">
            Qty: {item.quantity}
          </p>
        </div>

        <p className="font-semibold text-[#4A3F35] dark:text-white">
          ₹{item.price * item.quantity}
        </p>
      </div>
    ))}

  </div>

  <div className="mt-5 text-right">
    <p className="text-lg font-bold text-[#4A3F35] dark:text-white">
      Total: ₹{order.totalAmount}
    </p>
  </div>
</div>
</div>

      )}
      
      
    </div>
  );
}
