import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download,
  FileText,
  IndianRupee,
} from 'lucide-react';

import DataTable from '../../components/DataTable';
import EmptyState from '../../components/EmptyState';
import { TableSkeleton } from '../../components/Skeleton';
import api from '../../services/api';
import { downloadInvoicePdf } from '../../utils/downloadInvoicePdf';

const STATUS_STYLES = {
  paid:
    'bg-[#E8F4EE] text-[#4E7A61]',

  pending:
    'bg-[#F8F1EF] text-[#B06D5C]',

  partial:
    'bg-[#F5EAD7] text-[#A16B2A]',
};

export default function AdminInvoices() {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/invoices')
      .then((r) =>
        setInvoices(r.data.invoices || [])
      )
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      field: 'invoiceNumber',
      headerName: 'Invoice',

      render: (r) => (
        <button
          onClick={() =>
            navigate(`/admin/invoices/${r._id}`)
          }
          className="
          font-medium
          text-[#C48A7A]
          hover:text-[#B17869]
          transition
          "
        >
          {r.invoiceNumber}
        </button>
      ),
    },

    {
      field: 'order',
      headerName: 'Order',

      render: (r) => (
        <span className="text-[#4A3F35] dark:text-[#EAE3D6]">
          {r.order?.orderNumber}
        </span>
      ),
    },

    {
      field: 'customer',
      headerName: 'Customer',

      render: (r) => (
        <span className="font-medium text-[#4A3F35] dark:text-[#EAE3D6]">
          {r.customer?.user?.name}
        </span>
      ),
    },

    {
      field: 'total',
      headerName: 'Total',

      render: (r) => (
        <span className="font-semibold text-[#4A3F35] dark:text-white">
          ₹{r.total?.toLocaleString()}
        </span>
      ),
    },

    {
      field: 'balanceDue',
      headerName: 'Balance',

      render: (r) => (
        <span
          className={`
          font-medium
          ${
            r.balanceDue > 0
              ? 'text-[#B06D5C]'
              : 'text-[#4E7A61]'
          }
          `}
        >
          ₹{r.balanceDue?.toLocaleString()}
        </span>
      ),
    },

    {
      field: 'status',
      headerName: 'Status',

      render: (r) => (
        <span
          className={`
          px-3
          py-1
          rounded-full
          text-xs
          font-medium
          capitalize
          ${STATUS_STYLES[r.status]}
          `}
        >
          {r.status}
        </span>
      ),
    },

    {
      field: 'createdAt',
      headerName: 'Date',

      render: (r) => (
        <span className="text-[#8B7D6B]">
          {new Date(
            r.createdAt
          ).toLocaleDateString()}
        </span>
      ),
    },

    {
      field: 'pdf',
      headerName: 'PDF',
      sortable: false,

      render: (r) => (
        <button
          onClick={() =>
            api
              .get(`/invoices/${r._id}`)
              .then((res) =>
                downloadInvoicePdf(
                  res.data
                )
              )
          }
          className="
          flex
          items-center
          gap-2
          px-3
          py-2
          rounded-xl
          bg-[#F8F1EF]
          dark:bg-[#2D2624]
          text-[#C48A7A]
          hover:bg-[#F1E3DF]
          transition
          "
        >
          <Download className="w-4 h-4" />
          PDF
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="grid lg:grid-cols-[1fr_auto] gap-6">

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
          <p className="text-sm text-[#8B7D6B]">
            Invoice Management
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
            Invoices
          </h1>

          <p className="text-[#8B7D6B] mt-3">
            View generated invoices,
            payment status and download PDFs.
          </p>
        </div>

        <div
          className="
          bg-[#FAF8F5]
          dark:bg-[#252525]
          border
          border-[#EAE3D6]
          dark:border-[#333]
          rounded-3xl
          px-8
          py-6
          flex
          items-center
          gap-4
          "
        >
          <div
            className="
            w-14
            h-14
            rounded-2xl
            bg-[#F3EFD9]
            dark:bg-[#2F2A1D]
            flex
            items-center
            justify-center
            "
          >
            <FileText className="w-6 h-6 text-[#C9A227]" />
          </div>

          <div>
            <p className="text-sm text-[#8B7D6B]">
              Total Invoices
            </p>

            <h3
              className="
              text-2xl
              font-bold
              text-[#4A3F35]
              dark:text-white
              "
            >
              {invoices.length}
            </h3>
          </div>
        </div>
      </div>

      {/* Table */}
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
        ) : invoices.length === 0 ? (
          <EmptyState
            title="No invoices yet"
            description="Generate invoices from orders to see them here."
          />
        ) : (
          <DataTable
            columns={columns}
            rows={invoices}
          />
        )}
      </div>
    </div>
  );
}