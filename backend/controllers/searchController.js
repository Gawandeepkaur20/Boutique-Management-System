import Order from '../models/Order.js';
import Customer from '../models/Customer.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

export const globalSearch = asyncHandler(async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q || q.length < 2) {
    return res.json({ orders: [], customers: [], users: [] });
  }

  const regex = new RegExp(q, 'i');

  const [orders, customerUsers] = await Promise.all([
    Order.find({ orderNumber: regex })
      .populate({ path: 'customer', populate: { path: 'user', select: 'name email' } })
      .limit(8)
      .select('orderNumber status totalAmount createdAt'),
    User.find({ $or: [{ name: regex }, { email: regex }], role: 'customer' })
      .limit(8)
      .select('name email phone'),
  ]);

  const customerIds = await Customer.find({
    user: { $in: customerUsers.map((u) => u._id) },
  }).select('user');

  res.json({
    orders,
    customers: customerUsers.map((u) => ({
      _id: customerIds.find((c) => c.user.toString() === u._id.toString())?._id,
      user: u,
    })),
    users: customerUsers,
  });
});
