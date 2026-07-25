import { useEffect, useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import DataTable from '../../components/DataTable';
import { TableSkeleton } from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';
import api from '../../services/api';
import { showSuccess, showError } from '../../utils/toast';

const STATUSES = ['pending', 'initiated', 'completed', 'failed', 'refunded'];

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [refundOpen, setRefundOpen] = useState(null);
  const [refundForm, setRefundForm] = useState({ amount: '', reason: '' });
  const [refunding, setRefunding] = useState(false);

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    params.set('page', page);
    params.set('limit', 10);

    api.get(`/payments?${params}`)
      .then((res) => setPayments(res.data.payments || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [statusFilter, page]);

  const openRefundDialog = (payment) => {
    setRefundForm({ amount: payment.amount, reason: '' });
    setRefundOpen(payment._id);
  };

  const handleRefund = async () => {
    try {
      setRefunding(true);
      await api.post(`/payments/${refundOpen}/refund`, {
        amount: Number(refundForm.amount),
        reason: refundForm.reason,
      });
      showSuccess('Refund processed successfully');
      setRefundOpen(null);
      load();
    } catch (error) {
      showError(error.response?.data?.message || 'Refund failed');
    } finally {
      setRefunding(false);
    }
  };

  const getStatusColor = (status) => {
  const colors = {
  pending:
    'bg-[#F8F1EF] text-[#B06D5C]',

  initiated:
    'bg-[#E8F0FA] text-[#5478A3]',

  completed:
    'bg-[#E8F4EE] text-[#4E7A61]',

  failed:
    'bg-[#FCE8E8] text-[#B85C5C]',

  refunded:
    'bg-[#F5EAD7] text-[#A16B2A]',
};
  return colors[status];
};

const exportPayments = async () => {
  try {
    const response = await api.get(
      '/export/payments',
      {
        responseType: 'blob',
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link = document.createElement('a');

    link.href = url;
    link.download = 'payments.xlsx';

    document.body.appendChild(link);

    link.click();

    link.remove();

    showSuccess('Payments exported');
  } catch (err) {
    console.log(err);

    showError(
      err.response?.data?.message ||
      'Export failed'
    );
  }
};
  const columns = [
    {
      field: 'razorpayPaymentId',
      headerName: 'Payment ID',
      render: (r) => <span className="font-mono text-xs">{r.razorpayPaymentId || 'N/A'}</span>,
    },
    {
      field: 'order',
      headerName: 'Order',
     render: (r) => (
  <div>
    <p className="font-medium text-[#4A3F35] dark:text-white">
      {r.order?.orderNumber}
    </p>

    <p className="text-xs text-[#8B7D6B]">
      {r.order?.customer?.user?.name}
    </p>
  </div>
)
    },
    {
      field: 'amount',
      headerName: 'Amount',
     render: (r) => (
  <span className="font-semibold text-[#4A3F35] dark:text-white">
    ₹{r.amount}
  </span>
)
    },
    {
      field: 'type',
      headerName: 'Type',
      render: (r) => (
        <span className="text-xs px-2 py-1 bg-[#F3EFD9]
dark:bg-[#2F2A1D]
text-[#4A3F35]
dark:text-[#EAE3D6]
rounded-full
px-3
py-1">
          {r.type.toUpperCase()}
        </span>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      render: (r) => (
        <span className={`text-xs px-2 py-1 rounded font-medium ${getStatusColor(r.status)}`}>
          {r.status.toUpperCase()}
        </span>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      render: (r) => new Date(r.createdAt).toLocaleDateString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      render: (r) => (
        <div className="flex gap-2">
          {r.status === 'completed' && (
            <button
             className="
flex items-center gap-1
px-3 py-2
rounded-xl
bg-[#F8F1EF]
text-[#B06D5C]
hover:bg-[#F1E3DF]
transition
"
              onClick={() => openRefundDialog(r)}
            >
              <RefreshCw className="w-3 h-3 inline mr-1" /> Refund
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
  <div className="space-y-6">
      <div className="grid lg:grid-cols-[3fr_1fr] gap-6 items-center">
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
      Payment Management
    </p>

    <h1 className="text-3xl font-bold text-[#4A3F35] dark:text-white mt-2">
      Payments
    </h1>

    <p className="text-[#8B7D6B] mt-3">
      Track customer payments, refunds and transaction history.
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
min-w-[260px]

flex-col
gap-4
justify-center
"
>
  <p className="text-sm text-[#8B7D6B]">
    Total Payments
  </p>

  <h2 className="text-3xl font-bold text-[#4A3F35] dark:text-white">
    {payments.length}
  </h2>

  <button
    onClick={exportPayments}

    className="
    w-full
    h-12
    flex items-center justify-center gap-2
    px-5 py-3
    rounded-2xl
    bg-[#C48A7A]
    hover:bg-[#B17869]
    text-white
    font-small
    transition
    "
  >
    <Download className="w-4 h-4" />
    Export Payments
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
  p-5
  flex
  flex-wrap
  gap-3
  items-center
  "
>
        <select  className="
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
  " value={statusFilter} onChange={(e) => {
          setStatusFilter(e.target.value);
          setPage(1);
        }}>
          <option value="">All Status</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.toUpperCase()}
            </option>
          ))}
        </select>
    <button
  onClick={load}
  className="
  px-5 py-3
  rounded-2xl
  border
  border-[#EAE3D6]
  dark:border-[#333]
  bg-white
  dark:bg-[#1F1F1F]
  text-[#5C4033]
  dark:text-white
  "
>Refresh</button>
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
        {loading ? (
  <TableSkeleton />
) : payments.length === 0 ? (
  <EmptyState
    title="No payments yet"
    description="Payment records will appear here when customers make payments."
  />
) : (
  <DataTable columns={columns} rows={payments} />
)}
      </div>

      <Dialog
  open={!!refundOpen}
  onClose={() => setRefundOpen(null)}
  maxWidth="sm"
  fullWidth
PaperProps={{
  sx: {
    borderRadius: '24px',
    backgroundColor:
      document.documentElement.classList.contains('dark')
        ? '#252525'
        : '#FAF8F5',
    border: '1px solid #EAE3D6',
  },
}}

>
      <DialogTitle
  sx={{
    borderBottom: '1px solid #EAE3D6',
    p: 3,
  }}
>
  <p
    style={{
      color: '#8B7D6B',
      fontSize: 14,
      marginBottom: 4,
    }}
  >
    Payment Management
  </p>

  <h2
    style={{
      fontSize: 28,
      fontWeight: 700,
      color: '#4A3F35',
    }}
  >
    Process Refund
  </h2>
</DialogTitle>
        <DialogContent className="space-y-4 pt-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-[#4A3F35] dark:text-white">Refund Amount (₹)</label>
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
text-[#5C4033]
dark:text-white
focus:ring-2
focus:ring-[#C48A7A]
"
              value={refundForm.amount}
              onChange={(e) => setRefundForm({ ...refundForm, amount: e.target.value })}
            />
          </div>
          <div>
          <label className="block text-sm font-medium mb-2 text-[#4A3F35] dark:text-white">Reason</label>
          
             <textarea
  rows={3}
  className="
  w-full
  p-4
  rounded-2xl
  border
  border-[#EAE3D6]
  dark:border-[#333]
  bg-white
  dark:bg-[#1F1F1F]
  text-[#5C4033]
  dark:text-white
  resize-none
  "
           
              value={refundForm.reason}
              onChange={(e) => setRefundForm({ ...refundForm, reason: e.target.value })}
              placeholder="Enter refund reason"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <button
  onClick={() => setRefundOpen(null)}
  className="
  px-5 py-3
  rounded-2xl
  border
  border-[#EAE3D6]
  text-[#5C4033]
  "
>
  Cancel
</button>

<button
  onClick={handleRefund}
  disabled={refunding || !refundForm.amount}
  className="
  px-6 py-3
  rounded-2xl
  bg-[#C48A7A]
  hover:bg-[#B17869]
  text-white
  font-medium
  disabled:opacity-50
  "
>
  {refunding ? 'Processing...' : 'Process Refund'}
</button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
