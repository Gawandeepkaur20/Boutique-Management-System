import { jsPDF } from 'jspdf';

/** jsPDF default font only supports Latin-1 — avoid Rupee symbol and other Unicode */
const formatMoney = (amount) => {
  const n = Number(amount) || 0;
  return `Rs. ${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/** Avoid characters that break jsPDF built-in fonts (e.g. Rupee sign) */
const safeText = (value) =>
  String(value ?? '')
    .replace(/\u20B9/g, 'Rs.')
    .replace(/\u2014|\u2013/g, '-')
    .replace(/[^\u0000-\u00FF]/g, '') // WinAnsi-safe only
    .trim() || '-';

export const downloadInvoicePdf = (invoice) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  const customerName = safeText(invoice.customer?.user?.name) || 'Customer';
  const orderNum = safeText(invoice.order?.orderNumber) || '-';
  const invoiceNum = safeText(invoice.invoiceNumber);
  const dateStr = new Date(invoice.createdAt).toLocaleDateString('en-IN');

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('Boutique Invoice', 20, 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text('Custom Tailoring & Boutique Services', 20, 29);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  let metaY = 42;
  const metaLines = [
    `Invoice No: ${invoiceNum}`,
    `Order No: ${orderNum}`,
    `Customer: ${customerName}`,
    `Date: ${dateStr}`,
    `Status: ${safeText(invoice.status)}`,
  ];
  metaLines.forEach((line) => {
    doc.text(line, 20, metaY);
    metaY += 6;
  });

  // Table header
  let y = metaY + 8;
  doc.setFillColor(240, 240, 240);
  doc.rect(20, y - 5, pageWidth - 40, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Description', 22, y);
  doc.text('Qty', 120, y);
  doc.text('Amount', 155, y);

  doc.setFont('helvetica', 'normal');
  y += 8;

  const items = invoice.items?.length
    ? invoice.items
    : [{ description: 'Order items', quantity: 1, amount: invoice.subtotal }];

  items.forEach((item) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(safeText(item.description).slice(0, 45), 22, y);
    doc.text(String(Number(item.quantity) || 0), 120, y);
    doc.text(formatMoney(item.amount), 155, y);
    y += 7;
  });

  // Totals
  y += 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, y, pageWidth - 20, y);
  y += 8;

  doc.setFontSize(10);
  const totals = [
    ['Subtotal:', formatMoney(invoice.subtotal)],
    ['Tax:', formatMoney(invoice.tax)],
    ['Discount:', formatMoney(invoice.discount)],
    ['Amount Paid:', formatMoney(invoice.amountPaid)],
  ];

  totals.forEach(([label, value]) => {
    doc.text(label, 120, y);
    doc.text(value, 155, y);
    y += 6;
  });

  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Total:', 120, y);
  doc.text(formatMoney(invoice.total), 155, y);

  y += 8;
  doc.setFontSize(11);
  doc.setTextColor(180, 0, 120);
  doc.text('Balance Due:', 120, y);
  doc.text(formatMoney(invoice.balanceDue), 155, y);
  doc.setTextColor(0, 0, 0);

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text('Thank you for your business!', 20, 285);

  const filename = `${invoiceNum.replace(/[^a-zA-Z0-9-_]/g, '_')}.pdf`;
  doc.save(filename);
};
