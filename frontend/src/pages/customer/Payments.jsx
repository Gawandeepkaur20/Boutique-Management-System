import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import DataTable from '../../components/DataTable';
import { TableSkeleton } from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';
import api from '../../services/api';

export default function CustomerPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/payments/my')
      .then((res) => setPayments(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      initiated: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const columns = [
    {
      field: 'order',
      headerName: 'Order',
      render: (r) => <span className="font-medium">{r.order?.orderNumber}</span>,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      render: (r) => <span className="font-medium">₹{r.amount}</span>,
    },
    {
      field: 'type',
      headerName: 'Type',
      render: (r) => (
        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
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
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Payment History</h1>
      </div>

      <div className="card">
        {loading ? (
          <TableSkeleton />
        ) : payments.length === 0 ? (
          <EmptyState title="No payments yet" description="Your payment history will appear here once you make a payment." />
        ) : (
          <DataTable columns={columns} rows={payments} />
        )}
      </div>
    </div>
  );
}
