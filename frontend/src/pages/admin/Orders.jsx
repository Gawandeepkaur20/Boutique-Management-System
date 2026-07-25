import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Download,
  Search,
  Upload,
  IndianRupee,
  Clock3,
  PackageCheck,
  Eye,
  FileText,
  UserPlus
} from 'lucide-react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import OrderFormDialog from '../../components/OrderFormDialog';
import { TableSkeleton } from '../../components/Skeleton';
import api from '../../services/api';
import { showSuccess, showError } from '../../utils/toast';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTheme } from "@mui/material/styles";
import StatCard from '../../components/StatCard';
import { Menu, MenuItem, IconButton } from '@mui/material';

const STATUSES = ['received', 'processing', 'stitching', 'ready', 'delivered'];
const defaultForm = {
  customerId: '', items: [{ name: '', quantity: 1, price: 0, fabric: '' }],
  priority: 'medium', advancePaid: 0, deliveryDate: '', notes: '',
};

export default function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(null);
  const [priceForm, setPriceForm] = useState({ totalAmount: '', advancePaid: '' });
  const [savingPrice, setSavingPrice] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [previewOrders, setPreviewOrders] = useState([]);
const [previewErrors, setPreviewErrors] = useState([]);
const [selectedOrder, setSelectedOrder] = useState(null);
const theme = useTheme();
const isDark = theme.palette.mode === "dark";
const color= {
  primary: {
    bg: 'bg-[#F8F1EF]',
    icon: 'text-[#C48A7A]'
  },
  gold: {
    bg: 'bg-[#FBF7E8]',
    icon: 'text-[#C9A227]'
  },
  sage: {
    bg: 'bg-[#EEF4EE]',
    icon: 'text-[#7A9B76]'
  }
};
const handleMenuOpen = (event, order) => {
  setAnchorEl(event.currentTarget);
  setSelectedOrder(order);
};

const handleMenuClose = () => {
  setAnchorEl(null);
  setSelectedOrder(null);
};
  const [form,setForm]=useState({

    customerId: '',
    customerName: '',
    phone: '',
    email: '',
    city: '',
    measurements: { chest: '', waist: '', shoulder: '', sleeve: '', length: '' },
    priority: 'low',
    advancePaid: 0,
    deliveryDate: '',
    notes: '',
    items: [{ name: '', quantity: 1, price: 0, fabric: '' }],
  });

  const totalRevenue =
  orders.reduce(
    (sum, o) => sum + (o.advancePaid || 0),
    0
  );

const pendingPayments =
  orders.filter(
    o => (o.totalAmount || 0) >
         (o.advancePaid || 0)
  ).length;

const readyOrders =
  orders.filter(
    o => o.status === "ready"
  ).length;
  const load = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    if (search) params.set('search', search);
    api.get(`/orders?${params}`)
      .then((res) => setOrders(res.data.orders || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    api.get('/customers').then((r) => setCustomers(r.data.customers || []));
    api.get('/workers').then((r) => setWorkers(r.data || []));
  }, [statusFilter]);

  const handleCreate = async () => {
    try {
      const payload = {
        customer: form.customerId === 'new' ? null : form.customerId,
        customerName: form.customerName || '',
        phone: form.phone || '',
        email: form.email || '',
        city: form.city || '',
        measurements: form.measurements,
        items: form.items,
        priority: form.priority,
        advancePaid: form.advancePaid,
        deliveryDate: form.deliveryDate,
        notes: form.notes,
      };
      await api.post('/orders', payload);
      showSuccess('Order created');
      load();
      setOpen(false);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to create order');
    }
  };
  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      showSuccess('Status updated');
      load();
    } catch {
      showError('Failed to update status');
    }
  };

  const openPriceDialog = (order) => {
    setPriceForm({
      totalAmount: order.totalAmount || '',
      advancePaid: order.advancePaid || '',
    });
    setPriceOpen(order._id);
  };

  const savePrice = async () => {
    try {
      setSavingPrice(true);
      await api.patch(`/orders/${priceOpen}/price`, {
        totalAmount: Number(priceForm.totalAmount) || 0,
        advancePaid: Number(priceForm.advancePaid) || 0,
      });
      showSuccess('Order pricing updated');
      setPriceOpen(null);
      load();
    } catch {
      showError('Failed to update pricing');
    } finally {
      setSavingPrice(false);
    }
  };

  const assignWorker = async (orderId, workerId) => {
    try {
      await api.patch(`/orders/${orderId}/assign`, { workerId });
      showSuccess('Worker assigned');
      setAssignOpen(null);
      load();
    } catch {
      showError('Failed to assign worker');
    }
  };

  const generateInvoice = async (id) => {
    try {
      await api.post(`/orders/${id}/invoice`);
      showSuccess('Invoice generated and email sent');
    } catch {
      showError('Failed to generate invoice');
    }
  };

  const handleImport = async (e) => {
  const file = e.target.files?.[0];

  if (!file) {
    showError('Please select a file');
    return;
  }
console.log("FILE SELECTED:", e.target.files?.[0]);
  const fd = new FormData();
  fd.append('file', file);

  try {
   const { data } = await api.post(
  '/export/import/orders',
  fd,
  {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }
);

showSuccess(
  `Created ${data.created} orders`
);

if (data.errors?.length) {
  console.log(data.errors);
}

load();
//    setPreviewOrders(data.validOrders);
// setPreviewErrors(data.errors);
// setImportOpen(true);



//     load(); 
    setImportOpen(false);

  } catch (err) {
  console.log("IMPORT ERROR:", err);
  console.log("SERVER RESPONSE:", err.response?.data);

  showError(
    err.response?.data?.message || "Import failed"
  );
}
};
const confirmImport = async () => {
  try {
    const { data } = await api.post(
      '/export/import/orders/confirm',
      {
        orders: previewOrders,
      }
    );

    showSuccess(data.message);

    setPreviewOrders([]);
    setPreviewErrors([]);

    load();
  } catch {
    showError('Import failed');
  }
};
const downloadTemplate = async () => {
  try {
    const response = await api.get(
      '/export/order-template',
      {
        responseType: 'blob',
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link = document.createElement('a');

    link.href = url;
    link.download = 'order-import-template.xlsx';

    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.log(err);
  }
};
const exportOrders = async () => {
  try {
    const response = await api.get('/export/orders', {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'orders.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();

    showSuccess('Orders exported successfully');
  } catch (err) {
    showError('Export failed');
  }
};
  const columns = [
    {
      field: 'orderNumber',
      headerName: 'Order #',
      render: (r) => (
        <button className="text-[#C48A7A] hover:text-[#B17869] font-semibold" onClick={() => navigate(`/admin/orders/${r._id}`)}>
          {r.orderNumber}
        </button>
      ),
    },
    { field: 'customer', headerName: 'Customer', render: (r) => r.customer?.user?.name },
    { field: 'status', headerName: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    {
  field: 'worker',
  headerName: 'Worker',
  render: (r) => (
    r.worker?.user?.name
      ? r.worker.user.name
      : (
          <span className="text-[#A76F60] font-medium">
            Unassigned
          </span>
        )
  ),
},
    {
      field: 'totalAmount',
      headerName: 'Total',
      render: (r) => {

  const remaining =
    (r.totalAmount || 0) -
    (r.advancePaid || 0);

  return (
    <div>
      <div className="font-semibold">
        ₹{r.totalAmount || 0}
      </div>

      {r.advancePaid > 0 && (
        <div className="text-xs text-green-600">
          Paid: ₹{r.advancePaid}
        </div>
      )}

      {remaining > 0 && (
        <div className="text-xs text-[#C48A7A]">
          Due: ₹{remaining}
        </div>
      )}
    </div>
  );
}
    },
    {
  field: 'paymentStatus',
  headerName: 'Payment',
  render: (r) => {

    const remaining =
      (r.totalAmount || 0) -
      (r.advancePaid || 0);

    if (!r.totalAmount) {
      return (
        <span className="text-[#C48A7A] font-medium">
          Pricing Pending
        </span>
      );
    }

    if (remaining <= 0) {
      return (
        <span className="text-[#7A9B76] font-medium">
          Paid
        </span>
      );
    }

    return (
      <span className="text-[#C9A227] font-medium">
        ₹{remaining} Due
      </span>
    );
  }
},
    { field: 'createdAt', headerName: 'Date', render: (r) => new Date(r.createdAt).toLocaleDateString() },
   {
  field: 'actions',
  headerName: 'Actions',
  sortable: false,
  render: (r) => (
    <>
      <IconButton
        size="small"
        onClick={(e) => handleMenuOpen(e, r)}
      >
        <MoreVertIcon />
      </IconButton>
    </>
  ),
},
  ];
  return (
    <div className="space-y-4">
<div className="grid lg:grid-cols-[1fr_auto] gap-6 items-center">
        <div
  className="
  bg-[#FAF8F5]
  dark:bg-[#252525]
  rounded-3xl
  border
  border-[#EAE3D6]
  dark:border-[#333]
  p-5
w-full
h-full
  "
>
  <p className="text-sm text-[#8B7D6B]">
    Order Management
  </p>

  <h1 className="text-3xl font-semibold text-[#4A3F35] dark:text-white">
    Orders
  </h1>

  <p className="text-[#8B7D6B] mt-2">
    Manage customer orders, pricing, assignments and invoices.
  </p>
</div>
        <div
 
  className="
  flex
  items-center
  justify-end
  gap-3
  bg-[#FAF8F5]
  dark:bg-[#252525]
  rounded-3xl
  border
  border-[#EAE3D6]
  dark:border-[#333]
  px-6
  py-5
  min-h-[140px]
  "

>
      <button
  onClick={downloadTemplate}
  className="
flex items-center gap-2
px-5 py-3
rounded-xl
bg-white
dark:bg-[#1F1F1F]
border border-[#EAE3D6]
dark:border-[#333]
text-[#5C4033]
dark:text-[#EAE3D6]
font-medium
hover:border-[#C48A7A]
transition
"
>
  Download Template
</button>
          <button onClick={() => setImportOpen(true)} className="
flex items-center gap-2
px-5 py-3
rounded-xl
bg-white
dark:bg-[#1F1F1F]
border border-[#EAE3D6]
dark:border-[#333]
text-[#5C4033]
dark:text-[#EAE3D6]
font-medium
hover:border-[#C48A7A]
transition
">
            <Upload className="w-4 h-4" /> Import
          </button>
<button
  onClick={exportOrders}
  className="
flex items-center gap-2
px-5 py-3
rounded-xl
bg-white
dark:bg-[#1F1F1F]
border border-[#EAE3D6]
dark:border-[#333]
text-[#5C4033]

dark:text-[#EAE3D6]
font-medium
hover:border-[#C48A7A]
transition
"
>
  <Download className="w-4 h-4" />
  Export
</button>
          <button onClick={() => setOpen(true)} className="
flex items-center gap-2
px-6 py-3
rounded-xl
bg-[#C48A7A]
hover:bg-[#B17869]
text-white
font-semibold
shadow-sm
transition
">
  
            <Plus className="w-4 h-4" /> New Order
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
  rounded-2xl
  p-4
  flex
  flex-wrap
  gap-3
  "
>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400  " />
          <input
           className="
w-full
h-10
pl-12
pr-4
rounded-3xl
shadow-[0_8px_24px_rgba(0,0,0,0.04)]
border
border-[#EAE3D6]
bg-white
dark:bg-[#1F1F1F]
dark:border-[#3A3A3A]
focus:outline-none
focus:ring-2
focus:ring-[#C48A7A]
focus:border-[#C48A7A]
"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
          />
        </div>
        <select
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
  className="
    h-12
    px-4
    rounded-2xl
    border
    border-[#EAE3D6]
    dark:border-[#333]
    bg-white
    dark:bg-[#1F1F1F]
    text-[#5C4033]
    dark:text-white
    focus:outline-none
    focus:ring-2
    focus:ring-[#C48A7A]
    focus:border-[#C48A7A]
  "
>
  <option className="bg-white text-[#5C4033] dark:bg-[#1F1F1F] dark:text-white" value="">
    All Status
  </option>

  {STATUSES.map((s) => (
    <option
      key={s}
      value={s}
      className="bg-white text-[#5C4033] dark:bg-[#1F1F1F] dark:text-white"
    >
      {s}
    </option>
  ))}
</select>
        <button
  onClick={load}
  className="
  px-6
  py-3
  rounded-xl
  bg-[#C48A7A]
  hover:bg-[#B17869]
  text-white
  font-medium
  transition
  "
>
  Filter
</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
<StatCard
  title="Revenue Collected"
  value={`₹${totalRevenue.toLocaleString()}`}
  icon={IndianRupee}
  color="#C9A227"
/>

<StatCard
  title="Pending Payments"
  value={pendingPayments}
  icon={Clock3}
  color="#C48A7A"
/>

<StatCard
  title="Ready Orders"
  value={readyOrders}
  icon={PackageCheck}
  color="#7A9B76"
/>
</div>
<div
  className="
  bg-[#FAF8F5]
  dark:bg-[#252525]
  rounded-3xl
  border
  border-[#EAE3D6]
  dark:border-[#333]
  overflow-hidden
  "
>
        {loading ? (
          <TableSkeleton />
        ) : orders.length === 0 ? (
         <EmptyState
  title="No Orders Yet"
  description="Create your first order to start managing customer work."
  action={() => setOpen(true)}
  actionLabel="Create Order"
/>
        ) : (
          <DataTable columns={columns} rows={orders} />
        )}
      </div>
<Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleMenuClose}
  PaperProps={{
    sx: {
      borderRadius: 3,
      bgcolor: isDark ? "#1F1F1F" : "#FAF8F5",
      color: isDark ? "#fff" : "#4A3F35",
      border: isDark
        ? "1px solid #333"
        : "1px solid #EAE3D6",
      boxShadow: "0 10px 30px rgba(0,0,0,.18)"
    }
  }}
>
<MenuItem
  sx={{
    color: isDark ? "#fff" : "#4A3F35",
    "&:hover": {
      bgcolor: isDark ? "#2F2F2F" : "#F8F1EF"
    }
  }}
  onClick={() => {
    openPriceDialog(selectedOrder);
    handleMenuClose();
  }}
>
  <IndianRupee className="w-4 h-4 mr-2" />
  Set Price
</MenuItem>

<MenuItem 
 sx={{
    color: isDark ? "#fff" : "#4A3F35",
    "&:hover": {
      bgcolor: isDark ? "#2F2F2F" : "#F8F1EF"
    }
  }}
  onClick={() => {
  setAssignOpen(selectedOrder._id);
  handleMenuClose();
}}>
  <UserPlus className="w-4 h-4 mr-2" />
  Assign Worker
</MenuItem>

<MenuItem
 sx={{
    color: isDark ? "#fff" : "#4A3F35",
    "&:hover": {
      bgcolor: isDark ? "#2F2F2F" : "#F8F1EF"
    }
  }}
   onClick={() => {
  generateInvoice(selectedOrder._id);
  handleMenuClose();
}}>
  <FileText className="w-4 h-4 mr-2" />
  Generate Invoice
</MenuItem>

<MenuItem
 sx={{
    color: isDark ? "#fff" : "#4A3F35",
    "&:hover": {
      bgcolor: isDark ? "#2F2F2F" : "#F8F1EF"
    }
  }}
   onClick={() => {
  navigate(`/admin/orders/${selectedOrder._id}`);
  handleMenuClose();
}}>
  <Eye className="w-4 h-4 mr-2" />
  View Details
</MenuItem>
</Menu>
      <OrderFormDialog open={open} onClose={() => setOpen(false)} customers={customers} form={form} setForm={setForm} onSubmit={handleCreate} />

<Dialog
  open={!!assignOpen}
  onClose={() => setAssignOpen(null)}
  maxWidth="sm"
  fullWidth
  PaperProps={{
  sx:{
    borderRadius:3,
    bgcolor:isDark ? "#252525" : "#FAF8F5",
    color:isDark ? "#fff" : "#4A3F35",
    border:isDark
      ? "1px solid #333"
      : "1px solid #EAE3D6",
  }
}}
><DialogTitle
 sx={{
  borderBottom:isDark
      ? "1px solid #333"
      : "1px solid #EAE3D6",

  color:isDark
      ? "#fff"
      : "#4A3F35",

  fontWeight:700,
  fontSize:24
}}
>
  Assign Worker
</DialogTitle>
        <DialogContent>
          {workers.length === 0 ? (
            <p className="text-sm text-gray-500">No workers available</p>
          ) : (
            workers.map((w) => (
              <button
                key={w._id}
               className="
w-full
text-left
p-4
rounded-2xl
border
border-[#EAE3D6]
dark:border-[#333]
bg-white
dark:bg-[#1F1F1F]
text-[#4A3F35]
dark:text-white
hover:border-[#C48A7A]
hover:bg-[#F8F1EF]
dark:hover:bg-[#2C2C2C]
transition

  "
                onClick={() => assignWorker(assignOpen, w._id)}
              >
                {w.user?.name} — {w.specialization}
              </button>
            ))
          )}
        </DialogContent>
      </Dialog>

     <Dialog
  open={!!priceOpen}
  onClose={() => setPriceOpen(null)}
  maxWidth="sm"
  fullWidth
PaperProps={{
  sx:{
    borderRadius:3,
    bgcolor:isDark ? "#252525" : "#FAF8F5",
    color:isDark ? "#fff" : "#4A3F35",
    border:isDark
      ? "1px solid #333"
      : "1px solid #EAE3D6",
  }
}}
>
        <DialogTitle
  sx={{
    color:isDark ? "#fff" : "#4A3F35",
    borderBottom:isDark
      ? "1px solid #333"
      : "1px solid #EAE3D6"
  }}
>
  Set Order Pricing
</DialogTitle>
        <DialogContent className="space-y-4 pt-4">
          <div>
            <label className="block text-sm font-medium mb-2">Total Amount (₹)</label>
            <input
              type="number"
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
              value={priceForm.totalAmount}
              onChange={(e) => setPriceForm({ ...priceForm, totalAmount: e.target.value })}
              placeholder="Enter total amount"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Advance Paid (₹)</label>
            <input
              type="number"
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
              value={priceForm.advancePaid}
              onChange={(e) => setPriceForm({ ...priceForm, advancePaid: e.target.value })}
              placeholder="Enter advance paid"
            />
          </div>
          {priceForm.totalAmount && priceForm.advancePaid && (
            <div className="
bg-[#F8F1EF]
dark:bg-[#1F1F1F]
border
border-[#EAE3D6]
dark:border-[#333]
rounded-2xl
p-4
">
              <p className="font-semibold text-[#C48A7A]">Balance due: ₹{Number(priceForm.totalAmount) - Number(priceForm.advancePaid)}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions className="px-6 pb-5">

  <button
    onClick={() => setPriceOpen(null)}
    className="
      px-5
      py-2.5
      rounded-2xl
      border
      border-[#EAE3D6]
      dark:border-[#333]
      bg-white
      dark:bg-[#1F1F1F]
      text-[#5C4033]
      dark:text-white
      hover:bg-[#F8F1EF]
      dark:hover:bg-[#2C2C2C]
      transition
    "
  >
    Cancel
  </button>

  <button
    onClick={savePrice}
    disabled={savingPrice || !priceForm.totalAmount}
    className="
      px-5
      py-2.5
      rounded-2xl
      bg-[#C48A7A]
      hover:bg-[#B17869]
      disabled:bg-gray-400
      text-white
      font-medium
      transition
    "
  >
    {savingPrice ? "Saving..." : "Save Pricing"}
  </button>

</DialogActions>
      </Dialog>
        
<Dialog
  open={importOpen}
  onClose={() => setImportOpen(false)}
  maxWidth="sm"
  fullWidth
  PaperProps={{
  sx: {
    borderRadius: 3,
    bgcolor: isDark ? "#1F1F1F" : "#FAF8F5",
    color: isDark ? "#F5F5F5" : "#4A3F35",
    border: isDark
      ? "1px solid #333"
      : "1px solid #EAE3D6",
    boxShadow: "0 10px 30px rgba(0,0,0,.18)"
  }
}}
><DialogTitle
  sx={{
    color:isDark ? "#fff" : "#4A3F35",
    borderBottom:isDark
      ? "1px solid #333"
      : "1px solid #EAE3D6"
  }}
>
  Import Orders (Excel)
</DialogTitle>
        <DialogContent className="pt-4">
          <p className="text-sm text-gray-500 mb-4">Upload .xlsx file for preview. Use export format as template.</p>
        <label
  className="
  cursor-pointer
  block
  border-2
  border-dashed
  border-[#EAE3D6]
  rounded-3xl
  p-10
  text-center
 hover:bg-[#F8F1EF]
dark:hover:bg-[#2C2C2C]
dark:border-[#333]
dark:text-white
  transition
  "
>
  <Upload className="w-8 h-8 mx-auto mb-2" />

  <p>Select Excel File</p>

  <input
    type="file"
    accept=".xlsx,.xls"
    className="hidden"
    onChange={handleImport}
  />
</label>
        </DialogContent>
      </Dialog>
    </div>
  );
}
