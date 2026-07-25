import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { PageSkeleton } from '../../components/Skeleton';
import api from '../../services/api';
import { downloadInvoicePdf } from '../../utils/downloadInvoicePdf';

export default function InvoiceDetail() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/invoices/${id}`).then((r) => setInvoice(r.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageSkeleton />;
  if (!invoice) return <p className="text-red-500">Invoice not found</p>;


      return (
  <div className="space-y-6 max-w-6xl">

    {/* Header */}
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-4">

        <Link
          to="/admin/invoices"
          className="
          w-12 h-12
          rounded-2xl
          bg-[#F3EFD9]
          dark:bg-[#2F2A1D]
          flex items-center justify-center
          hover:bg-[#E9DFC4]
          transition
          "
        >
          <ArrowLeft className="w-5 h-5 text-[#5C4033]" />
        </Link>

        <div>
          <p className="text-sm text-[#8B7D6B]">
            Invoice Number
          </p>

          <h1 className="text-3xl font-bold text-[#4A3F35] dark:text-white">
            {invoice.invoiceNumber}
          </h1>
        </div>
      </div>

      <button
        onClick={() => downloadInvoicePdf(invoice)}
        className="
        px-6 py-3
        rounded-2xl
        bg-[#C48A7A]
        hover:bg-[#B17869]
        text-white
        font-medium
        flex items-center gap-2
        transition
        "
      >
        <Download className="w-4 h-4" />
        Download PDF
      </button>
    </div>

    {/* Top Summary */}
    <div className="grid md:grid-cols-3 gap-6">

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
        <p className="text-sm text-[#8B7D6B] mb-2">
          Customer
        </p>

        <h3 className="text-lg font-semibold text-[#4A3F35] dark:text-white">
          {invoice.customer?.user?.name}
        </h3>

        <p className="text-sm text-[#8B7D6B] mt-1">
          {invoice.customer?.user?.email}
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
        p-6
        "
      >
        <p className="text-sm text-[#8B7D6B] mb-2">
          Order Number
        </p>

        <h3 className="text-lg font-semibold text-[#4A3F35] dark:text-white">
          {invoice.order?.orderNumber}
        </h3>

        <p className="text-sm text-[#8B7D6B] mt-1">
          {new Date(
            invoice.createdAt
          ).toLocaleDateString()}
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
        p-6
        "
      >
        <p className="text-sm text-[#8B7D6B] mb-2">
          Status
        </p>

        <span
          className={`
          inline-flex
          px-4 py-2
          rounded-full
          text-sm
          font-medium
          capitalize
          ${
            invoice.status === 'paid'
              ? 'bg-[#E8F4EE] text-[#4E7A61]'
              : invoice.status === 'partial'
              ? 'bg-[#F5EAD7] text-[#A16B2A]'
              : 'bg-[#F8F1EF] text-[#B06D5C]'
          }
          `}
        >
          {invoice.status}
        </span>
      </div>

    </div>

    {/* Invoice Card */}
    <div
      id="invoice-print"
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

      {/* Header */}
      <div
        className="
        px-8 py-6
        border-b
        border-[#EAE3D6]
        dark:border-[#333]
        "
      >
        <h2 className="text-2xl font-bold text-[#4A3F35] dark:text-white">
          Boutique Invoice
        </h2>

        <p className="text-[#8B7D6B] mt-1">
          Invoice Summary & Payment Details
        </p>
      </div>

      {/* Items */}
      <div className="p-8">

        <div
          className="
          overflow-hidden
          border
          border-[#EAE3D6]
          dark:border-[#333]
          rounded-2xl
          "
        >
          <table className="w-full">

            <thead>
              <tr className="bg-[#F3EFD9] dark:bg-[#1F1F1F]">
                <th className="text-left p-4 text-[#4A3F35] dark:text-white">
                  Description
                </th>

                <th className="text-right p-4 text-[#4A3F35] dark:text-white">
                  Qty
                </th>

                <th className="text-right p-4 text-[#4A3F35] dark:text-white">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>

              {invoice.items?.map((item, i) => (
                <tr
                  key={i}
                  className="
                  border-t
                  border-[#EAE3D6]
                  dark:border-[#333]
                  "
                >
                  <td className="p-4 text-[#4A3F35] dark:text-white">
                    {item.description}
                  </td>

                  <td className="p-4 text-right text-[#4A3F35] dark:text-white">
                    {item.quantity}
                  </td>

                  <td className="p-4 text-right font-medium text-[#4A3F35] dark:text-white">
                    ₹{item.amount}
                  </td>
                </tr>
              ))}

            </tbody>

          </table>
        </div>

        {/* Totals */}
        <div className="mt-8 flex justify-end">

          <div
            className="
            w-full
            max-w-md
            bg-white
            dark:bg-[#1F1F1F]
            border
            border-[#EAE3D6]
            dark:border-[#333]
            rounded-3xl
            p-6
            "
          >

            <div className="flex justify-between py-2">
              <span className="text-[#8B7D6B]">
                Subtotal
              </span>

              <span className="font-medium text-[#4A3F35] dark:text-white">
                ₹{invoice.subtotal}
              </span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-[#8B7D6B]">
                Tax
              </span>

              <span className="font-medium text-[#4A3F35] dark:text-white">
                ₹{invoice.tax || 0}
              </span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-[#8B7D6B]">
                Discount
              </span>

              <span className="font-medium text-[#4A3F35] dark:text-white">
                ₹{invoice.discount || 0}
              </span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-[#8B7D6B]">
                Paid
              </span>

              <span className="font-medium text-[#4E7A61]">
                ₹{invoice.amountPaid || 0}
              </span>
            </div>

            <div
              className="
              mt-4
              pt-4
              border-t
              border-[#EAE3D6]
              dark:border-[#333]
              "
            >
              <div className="flex justify-between">

                <span className="text-xl font-semibold text-[#4A3F35] dark:text-white">
                  Total
                </span>

                <span className="text-2xl font-bold text-[#C48A7A]">
                  ₹{invoice.total}
                </span>

              </div>

              <div className="flex justify-between mt-4">

                <span className="font-medium text-[#8B7D6B]">
                  Balance Due
                </span>

                <span className="text-xl font-bold text-[#B06D5C]">
                  ₹{invoice.balanceDue}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  </div>
);

}