import XLSX from 'xlsx';

export const ordersToExcel = (orders) => {
 const rows = orders.map((order) => ({
  OrderNumber: order.orderNumber,

  CustomerEmail: order.customer?.user?.email || '',
  CustomerName: order.customer?.user?.name || '',

  Item: order.items?.[0]?.name || '',
  Quantity: order.items?.[0]?.quantity || 1,
  Price: order.items?.[0]?.price || 0,
  Fabric: order.items?.[0]?.fabric || '',

  DeliveryDate: order.deliveryDate
    ? new Date(order.deliveryDate).toLocaleDateString()
    : '',

  Notes: order.notes || '',

  Status: order.status || '',
}));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, 'Orders');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
};

export const parseOrdersFromExcel = (buffer) => {
  const wb = XLSX.read(buffer, { type: 'buffer' });
  const ws = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(ws);
};


export const customersToExcel = (customers) => {
  const rows = customers.map((c) => ({
    Name: c.user?.name,
    Email: c.user?.email,
    Phone: c.user?.phone,
    City: c.city,
    State: c.state,
    Address: c.address,
  }));
  

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, 'Customers');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
};
export const paymentsToExcel = (payments) => {
  const rows = payments.map((p) => ({
    PaymentID: p.razorpayPaymentId || '',
    OrderNumber: p.order?.orderNumber || '',
    Customer: p.order?.customer?.user?.name || '',
    Amount: p.amount || 0,
    Type: p.type || '',
    Status: p.status || '',
    Date: new Date(p.createdAt).toLocaleDateString(),
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);

  XLSX.utils.book_append_sheet(
    wb,
    ws,
    'Payments'
  );

  return XLSX.write(wb, {
    type: 'buffer',
    bookType: 'xlsx',
  });
};
