import Invoice from '../models/Invoice.js';
import Order from '../models/Order.js';

export const generateInvoiceFromOrder = async (orderId, generatedBy, options = {}) => {
  const order = await Order.findById(orderId).populate({
    path: 'customer',
    populate: { path: 'user', select: 'name email' },
  });

  if (!order) throw new Error('Order not found');

  const existing = await Invoice.findOne({ order: orderId });
  if (existing) return existing;

  const tax = options.tax ?? 0;
  const discount = options.discount ?? 0;
  const subtotal = order.totalAmount;
  const total = subtotal + tax - discount;
  const amountPaid = order.advancePaid || 0;

  const items = order.items.map((item) => ({
    description: item.name,
    quantity: item.quantity,
    unitPrice: item.price,
    amount: item.quantity * item.price,
  }));

  const invoice = await Invoice.create({
    order: orderId,
    customer: order.customer._id,
    subtotal,
    tax,
    discount,
    total,
    amountPaid,
    balanceDue: total - amountPaid,
    status: 'sent',
    dueDate: options.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    items,
    notes: options.notes,
    generatedBy,
  });

  return invoice.populate([
    { path: 'order', select: 'orderNumber status' },
    { path: 'customer', populate: { path: 'user', select: 'name email' } },
  ]);
};
