import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Tooltip } from '@mui/material';
import StatusBadge from '../../components/StatusBadge';
import DataTable from '../../components/DataTable';
import api from '../../services/api';
import { showError, showSuccess } from '../../utils/toast';
import PaymentDialog from '../../components/PaymentDialog';


export default function CustomerOrders() {
  const emptyItem = {
  name: "",
  quantity: 1,
  price: 0,
  fabric: "",
};

const emptyForm = {
  items: [{ ...emptyItem }],
  priority: "medium",
  deliveryDate: "",
  notes: "",
  aiRecommendation: null,
};
  const [orders, setOrders] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
const [paymentOpen, setPaymentOpen] = useState(false);
const [selectedOrder, setSelectedOrder] = useState(null);
  const [highlightedOrderId, setHighlightedOrderId] = useState(null);
  const load = () => api.get('/orders/my').then((r) => setOrders(r.data || []));
const [aiRecommendation, setAiRecommendation] = useState(null);
const [recommendationApplied, setRecommendationApplied] = useState(false);

const [profile, setProfile] = useState(null);
const MEASUREMENT_FIELDS = [
  ['height', 'Height'],
  ['chest', 'Chest'],
  ['waist', 'Waist'],
  ['shoulder', 'Shoulder'],
  ['sleeveLength', 'Sleeve'],
  ['hip', 'Hip'],
  ['neck', 'Neck'],
  ['inseam', 'Inseam'],
];
useEffect(() => {
  console.log("AI Recommendation:", aiRecommendation);
}, [aiRecommendation]);
useEffect(() => {
  load();

 api.get("/customers/profile").then((r) => {

    setProfile(r.data);

    setMeasurements(
        Array.isArray(r.data.measurements)
            ? r.data.measurements
            : []
    );

});

  const savedRecommendation =
    localStorage.getItem("aiSizeRecommendation");

  if (savedRecommendation) {
    setAiRecommendation(JSON.parse(savedRecommendation));
  }

  const aiOrder =
    localStorage.getItem("aiRecommendedOrder");

  if (aiOrder) {
    const parsed = JSON.parse(aiOrder);

    setForm((prev) => ({
      ...prev,
      ...parsed,
    }));

    setOpen(true);

    localStorage.removeItem("aiRecommendedOrder");
  }
}, []);

  const defaultMeasurement = measurements.find((m) => m.isDefault) || measurements[0];
const applyRecommendation = () => {

  setForm(prev => ({
    ...prev,

    aiRecommendation: {

      recommendedSize:
        aiRecommendation.kurtaSize,

      shirtSize:
        aiRecommendation.shirtSize,

      blazerSize:
        aiRecommendation.blazerSize,

      trouserSize:
        aiRecommendation.trouserSize,

      lehengaWaist:
        aiRecommendation.lehengaWaist,

      fitType:
        aiRecommendation.fitType,

      recommendedNeck:
        aiRecommendation.recommendedNeck,

      recommendedSleeves:
        aiRecommendation.recommendedSleeves,

      recommendedBottom:
        aiRecommendation.recommendedBottom,

      recommendedFabric:
        aiRecommendation.recommendedFabric,

      confidence:
        aiRecommendation.confidence,

      reason:
        aiRecommendation.reason,

    }

  }));
 setRecommendationApplied(true);

  showSuccess("AI recommendation attached to this order.");
};
  const updateItem = (index, field, value) => {
    const items = [...form.items];
    items[index] = {
      ...items[index],
      [field]: field === 'quantity' ? Number(value) : value,
    };
    setForm({ ...form, items });
  };

  const addItem = () => setForm({ ...form, items: [...form.items, { ...emptyItem }] });

  const removeItem = (index) => {
    setForm({ ...form, items: form.items.filter((_, i) => i !== index) });
  };

  const resetForm = () => {
  setForm(emptyForm);
  setRecommendationApplied(false);
  setOpen(false);
};

  const handleSubmit = async () => {
    try {
      setSaving(true);
      console.log(form);
      await api.post('/orders/my', form);
      showSuccess('Order sent to admin');
      resetForm();
      load();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
  {
    field: 'orderNumber',
    headerName: 'Order #',
    render: (r) => (
      <span className="font-medium text-[#4A3F35] dark:text-white">
        {r.orderNumber}
      </span>
    ),
  },

  {
    field: 'status',
    headerName: 'Status',
    render: (r) => <StatusBadge status={r.status} />,
  },

  {
    field: 'totalAmount',
    headerName: 'Total',
    render: (r) => (
      <span className="font-medium text-[#4A3F35] dark:text-white">
        {r.totalAmount > 0
          ? `₹${r.totalAmount}`
          : 'Pending pricing'}
      </span>
    ),
  },

  {
    field: 'items',
    headerName: 'Items',
    render: (r) => (
      <span className="text-[#4A3F35] dark:text-white">
        {r.items?.map((i) => i.name).join(', ')}
      </span>
    ),
  },

  {
    field: 'deliveryDate',
    headerName: 'Delivery',
    render: (r) => (
      <span className="text-[#4A3F35] dark:text-white">
        {r.deliveryDate
          ? new Date(r.deliveryDate).toLocaleDateString()
          : '-'}
      </span>
    ),
  },

  {
    field: 'createdAt',
    headerName: 'Ordered',
    render: (r) => (
      <span className="text-[#4A3F35] dark:text-white">
        {new Date(r.createdAt).toLocaleDateString()}
      </span>
    ),
  },

  {
    field: 'payment',
    headerName: 'Payment',
    render: (row) => {
      if (!row.totalAmount || row.totalAmount <= 0) {
        return (
         <span
  className="
  inline-flex
  items-center
  justify-center
  px-4
  py-2
  rounded-full
  bg-[#F5EAD7]
  dark:bg-[#3A2F1F]
  text-[#A16B2A]
  dark:text-[#E2B86C]
  text-sm
  font-medium
  min-w-[130px]
  "
>
  Pending Price
</span>
        );
      }

      const remaining =
        (row.totalAmount || 0) -
        (row.advancePaid || 0);

      if (remaining <= 0) {
        return (
  <span
    className="
    inline-flex
    items-center
    justify-center
    px-4
    py-2
    rounded-full
    bg-[#E8F4EE]
    dark:bg-[#1F3A21]
    text-[#4E7A61]
    dark:text-[#8FD1A6]
    text-sm
    font-medium
    min-w-[90px]
    "
  >
    Paid
  </span>
);
      }

      return (
     
  <button
    onClick={() => {
      setSelectedOrder(row);
      setPaymentOpen(true);
    }}
    className="
    inline-flex
    items-center
    justify-center
    h-11
    min-w-[120px]
    px-5
    rounded-2xl
    bg-[#C48A7A]
    hover:bg-[#B17869]
    text-white
    font-medium
    shadow-sm
    hover:shadow-md
    transition-all
    "
  >
    Pay Now
  </button>
);
      
    },
  },
];
  const handlePaymentSuccess = (order) => {
    // reload orders and highlight the paid order briefly
    load();
    if (order?._id) {
      setHighlightedOrderId(order._id);
      setTimeout(() => setHighlightedOrderId(null), 5000);
    }
    showSuccess('Payment confirmed');
  };

  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-[3fr_1fr] gap-6">

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
      Customer Orders
    </p>

    <h1
      className="
      text-3xl
      font-bold
      text-[#4A3F35]
      dark:text-white
      mt-2
      "
    >
      Order History
    </h1>

    <p className="text-[#8B7D6B] mt-3">
      Create new orders and track tailoring progress.
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
    flex
    flex-col
    justify-center
    "
  >
    <p className="text-sm text-[#8B7D6B]">
      Total Orders
    </p>

    <h2 className="text-3xl font-bold text-[#4A3F35] dark:text-white">
      {orders.length}
    </h2>

    <button
      onClick={() => setOpen(true)}
      className="
      mt-4
      h-12
      rounded-2xl
      bg-[#C48A7A]
      hover:bg-[#B17869]
      text-white
      flex
      items-center
      justify-center
      gap-2
      "
    >
      <Plus className="w-4 h-4" />
      Place Order
    </button>
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
  overflow-hidden
  "
>
        {orders.length === 0 ? (
  <div className="py-24 text-center">
    <p className="text-2xl font-semibold text-[#4A3F35] dark:text-white">
      No Orders Yet
    </p>

    <p className="text-[#8B7D6B] mt-2">
      Create your first tailoring order.
    </p>

    <button
      onClick={() => setOpen(true)}
      className="
      mt-6
      px-6
      py-3
      rounded-2xl
      bg-[#C48A7A]
      text-white
      "
    >
      Place Order
    </button>
  </div>
) : (
  <DataTable
    columns={columns}
    rows={orders}
    highlightedRowId={highlightedOrderId}
  />
)}
      </div>

 <Dialog
  open={open}
  onClose={resetForm}
  maxWidth="lg"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: "28px",
      backgroundColor: document.documentElement.classList.contains("dark")
        ? "#252525"
        : "#FAF8F5",
      border: `1px solid ${
        document.documentElement.classList.contains("dark")
          ? "#333"
          : "#EAE3D6"
      }`,
      overflow: "hidden",
    },
  }}
>
       <DialogTitle
  sx={{
    px: 4,
    py: 3,
    borderBottom: `1px solid ${
      document.documentElement.classList.contains("dark")
        ? "#333"
        : "#EAE3D6"
    }`,
    backgroundColor: document.documentElement.classList.contains("dark")
      ? "#252525"
      : "#FAF8F5",
  }}
>
  <p className="text-sm text-[#8B7D6B]">
    Customer Orders
  </p>

  <h2 className="text-3xl font-bold text-[#4A3F35] dark:text-white mt-1">
    Place New Order
  </h2>
</DialogTitle>

        <DialogContent
  sx={{
    backgroundColor: document.documentElement.classList.contains("dark")
      ? "#252525"
      : "#FAF8F5",
    padding: "24px",
  }}
>
  <div className="space-y-5">
    <div
  className="
  rounded-2xl
  border
  border-[#EAE3D6]
  dark:border-[#333]
  bg-white
  dark:bg-[#1F1F1F]
  p-5
  "
>
            <p cclassName="
text-sm
font-semibold
text-[#4A3F35]
dark:text-white
mb-3
">Measurements from your profile</p>
            {defaultMeasurement ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                {MEASUREMENT_FIELDS.map(([key, label]) => (
                  defaultMeasurement[key] != null && (
                    <div key={key}>
                    <span className="text-[#8B7D6B]">{label}:</span> {defaultMeasurement[key]}
                    </div>
                  )
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No measurements saved yet. You can still place the order, but add measurements for faster processing.
              </p>
            )}
          </div>
{aiRecommendation && (
  <div className="mb-6 rounded-2xl border border-[#EAE3D6] dark:border-[#333] bg-[#FAF8F5] dark:bg-[#1F1F1F] p-5">

    <div className="flex items-center justify-between">

      <div>
        <h3 className="text-lg font-semibold">
          AI Size Recommendation
        </h3>

        <p className="text-sm text-[#8B7D6B]">
          AI recommends this fitting
        </p>
      </div>

      <button
    type="button"
    onClick={applyRecommendation}
    disabled={recommendationApplied}
    className={`
      px-5
      py-2
      rounded-xl
      text-white
      transition
      ${
        recommendationApplied
          ? "bg-green-800 cursor-default"
          : "bg-[#C48A7A] hover:bg-[#B17869]"
      }
    `}
>
    {recommendationApplied
      ? "✓ Recommendation Attached"
      : "Apply Recommendation"}
</button>

    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-5">

      <div>
        <p className="text-xs text-[#8B7D6B]">Kurta</p>
        <p>{aiRecommendation.kurtaSize}</p>
      </div>

      <div>
        <p className="text-xs text-[#8B7D6B]">Fit</p>
        <p>{aiRecommendation.fitType}</p>
      </div>

      <div>
        <p className="text-xs text-[#8B7D6B]">Neck</p>
        <p>{aiRecommendation.recommendedNeck}</p>
      </div>

    </div>

  </div>
)}
{profile?.customer?.referenceImages?.length > 0 && (

<div
className="
rounded-2xl
border
border-[#EAE3D6]
dark:border-[#333]
bg-white
dark:bg-[#1F1F1F]
p-5
"
>

<h3 className="font-semibold text-lg mb-4">
Reference Designs
</h3>

<div className="grid grid-cols-2 md:grid-cols-4 gap-4">

{profile.customer.referenceImages.map((img,index)=>(

<img
key={index}
src={img.url}
alt=""
className="
h-36
w-full
rounded-2xl
object-cover
border
border-[#EAE3D6]
dark:border-[#333]
"
/>

))}

</div>

</div>

)}
{profile?.customer?.modificationRequests?.length > 0 && (

<div
className="
rounded-2xl
border
border-[#EAE3D6]
dark:border-[#333]
bg-white
dark:bg-[#1F1F1F]
p-5
"
>

<h3 className="font-semibold text-lg mb-4">
Modification Requests
</h3>

<div className="space-y-3">

{profile.customer.modificationRequests
.filter(m=>m.title || m.description)
.map((m,index)=>(

<div
key={index}
className="
rounded-xl
bg-[#F8F3EA]
dark:bg-[#252525]
p-4
"
>

<p className="font-semibold">
{m.title}
</p>

<p className="text-sm text-[#8B7D6B] mt-1">
{m.description}
</p>

</div>

))}

</div>

</div>

)}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-sm">Order Items</h4>
              <button type="button" onClick={addItem} className="
flex
items-center
gap-2
px-4
py-2
rounded-xl
bg-[#F3EFD9]
dark:bg-[#2F2A1D]
text-[#4A3F35]
dark:text-[#EAE3D6]
">
                <Plus className="w-4 h-4" /> Add item
              </button>
            </div>
            {form.items.map((item, index) => (
              <div key={index} className="
  p-4
  rounded-2xl
  border
  border-[#EAE3D6]
  dark:border-[#333]
  bg-[#FFFFFF]
dark:bg-[#1B1B1B]
  grid
  md:grid-cols-12
  gap-3
  items-center
  ">
                <input
                className="
w-full
h-12
px-4
rounded-2xl
border
border-[#EAE3D6]
dark:border-[#333]
bg-white
dark:bg-[#1B1B1B]
text-[#4A3F35]
dark:text-white
placeholder:text-[#8B7D6B]
focus:outline-none
focus:ring-2
focus:ring-[#C48A7A]
transition
"
                  placeholder="Item name"
                  value={item.name}
                  onChange={(e) => updateItem(index, 'name', e.target.value)}
                />
                <input
              className="
w-full
h-12
px-4
rounded-2xl
border
border-[#EAE3D6]
dark:border-[#333]
bg-white
dark:bg-[#1B1B1B]
text-[#4A3F35]
dark:text-white
placeholder:text-[#8B7D6B]
focus:outline-none
focus:ring-2
focus:ring-[#C48A7A]
transition
"
                  type="number"
                  min="1"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                />
                <input
               className="
w-full
h-12
px-4
rounded-2xl
border
border-[#EAE3D6]
dark:border-[#333]
bg-white
dark:bg-[#1B1B1B]
text-[#4A3F35]
dark:text-white
placeholder:text-[#8B7D6B]
focus:outline-none
focus:ring-2
focus:ring-[#C48A7A]
transition
"
                  placeholder="Fabric"
                  value={item.fabric}
                  onChange={(e) => updateItem(index, 'fabric', e.target.value)}
                />
                <input
                 className="
w-full
h-12
px-4
rounded-2xl
border
border-[#EAE3D6]
dark:border-[#333]
bg-white
dark:bg-[#1B1B1B]
text-[#4A3F35]
dark:text-white
placeholder:text-[#8B7D6B]
focus:outline-none
focus:ring-2
focus:ring-[#C48A7A]
transition
"
                  placeholder="Details"
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                />
                {form.items.length > 1 && (
                  <button type="button" onClick={() => removeItem(index)} className="
h-12
w-12
rounded-xl
bg-[#FCE8E8]
text-[#B85C5C]
flex
items-center
justify-center
">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
            className="
w-full
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
focus:outline-none
focus:ring-2
focus:ring-[#C48A7A]
"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <input
              type="date"
              className="
w-full
h-12
px-4
rounded-2xl
border
border-[#EAE3D6]
dark:border-[#333]
bg-white
dark:bg-[#1B1B1B]
text-[#4A3F35]
dark:text-white
placeholder:text-[#8B7D6B]
focus:outline-none
focus:ring-2
focus:ring-[#C48A7A]
transition
"
              value={form.deliveryDate}
              onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })}
            />
          </div>
<div
className="
rounded-2xl
bg-[#F8F3EA]
dark:bg-[#1B1B1B]
border
border-[#EAE3D6]
dark:border-[#333]
p-5
"
>

<div
className="
grid
grid-cols-2
gap-5
text-sm
"
>

<div className="flex items-center gap-2">
<span>📏</span>
<span>Measurements Attached</span>
</div>

<div className="flex items-center gap-2">
<span>
{recommendationApplied ? "✅" : "❌"}
</span>

<span>
AI Recommendation
</span>
</div>

<div className="flex items-center gap-2">
<span>🖼️</span>

<span>
{profile?.customer?.referenceImages?.length || 0}
{" "}
Reference Images
</span>
</div>

<div className="flex items-center gap-2">
<span>📝</span>

<span>
{profile?.customer?.modificationRequests?.length || 0}
{" "}
Modification Requests
</span>
</div>

</div>

</div>
          <textarea
            className="
  w-full
  mt-4
  p-4
  rounded-2xl
  border
  border-[#EAE3D6]
  dark:border-[#333]
  bg-white
  dark:bg-[#1F1F1F]
  text-[#4A3F35]
  dark:text-white
  resize-none
  "
            rows={3}
            placeholder="Notes for admin"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          </div>
        </DialogContent>
       <DialogActions
  sx={{
    padding: "20px 24px",
    borderTop: `1px solid ${
      document.documentElement.classList.contains("dark")
        ? "#333"
        : "#EAE3D6"
    }`,
    backgroundColor: document.documentElement.classList.contains("dark")
      ? "#252525"
      : "#FAF8F5",
  }}
>
  <button
    onClick={resetForm}
    className="
    px-5
    py-3
    rounded-2xl
    border
    border-[#EAE3D6]
    dark:border-[#333]
    bg-white
    dark:bg-[#1B1B1B]
    text-[#4A3F35]
    dark:text-white
    hover:bg-[#F7F4EC]
    dark:hover:bg-[#2A2A2A]
    transition
    "
  >
    Cancel
  </button>

  <button
    onClick={handleSubmit}
    disabled={saving}
    className="
    px-6
    py-3
    rounded-2xl
    bg-[#C48A7A]
    hover:bg-[#B17869]
    text-white
    font-medium
    transition
    disabled:opacity-50
    "
  >
    {saving ? "Sending..." : "Send to Admin"}
  </button>
</DialogActions>
      </Dialog>
      <PaymentDialog
        open={paymentOpen}
        order={selectedOrder}
        onClose={() => {
          setPaymentOpen(false);
          setSelectedOrder(null);
        }}
        onPaymentSuccess={() => handlePaymentSuccess(selectedOrder)}
      />
    </div>
  );
}
