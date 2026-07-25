import Invoice from '../models/Invoice.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getInvoices = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const invoices = await Invoice.find()
    .populate([
      { path: 'order', select: 'orderNumber status' },
      { path: 'customer', populate: { path: 'user', select: 'name email' } },
    ])
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Invoice.countDocuments();
  res.json({ invoices, total, page: Number(page) });
});

export const getInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id).populate([
    { path: 'order' },
    { path: 'customer', populate: { path: 'user', select: 'name email phone' } },
  ]);

  if (!invoice) {
    res.status(404);
    throw new Error('Invoice not found');
  }

  res.json(invoice);
});

export const getMyInvoices = asyncHandler(async (req, res) => {
  const Customer = (await import('../models/Customer.js')).default;
  const customer = await Customer.findOne({ user: req.user._id });
  const invoices = await Invoice.find({ customer: customer._id })
    .populate('order', 'orderNumber status')
    .sort('-createdAt');
  res.json(invoices);
});
