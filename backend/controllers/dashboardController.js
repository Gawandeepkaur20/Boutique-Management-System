import Order from '../models/Order.js';
import Customer from '../models/Customer.js';
import Worker from '../models/Worker.js';
import Invoice from '../models/Invoice.js';
import asyncHandler from '../utils/asyncHandler.js';

const buildDateFilter = (from, to) => {
  const filter = {};
  if (from) filter.$gte = new Date(from);
  if (to) {
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);
    filter.$lte = end;
  }
  return Object.keys(filter).length ? filter : null;
};

export const getDashboardStats = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const dateRange = buildDateFilter(from, to);
  const orderQuery = dateRange ? { createdAt: dateRange } : {};
  const invoiceMatch = dateRange ? { createdAt: dateRange } : {};

  const [
    totalOrders,
    receivedOrders,
    processingOrders,
    deliveredOrders,
    totalCustomers,
    totalWorkers,
    revenueAgg,
  ] = await Promise.all([
    Order.countDocuments(orderQuery),
    Order.countDocuments({ ...orderQuery, status: 'received' }),
    Order.countDocuments({ ...orderQuery, status: { $in: ['processing', 'stitching'] } }),
    Order.countDocuments({ ...orderQuery, status: 'delivered' }),
    Customer.countDocuments(),
    Worker.countDocuments(),
    Invoice.aggregate([
      ...(dateRange ? [{ $match: invoiceMatch }] : []),
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
  ]);

  const revenue = revenueAgg[0]?.total || 0;

  // Monthly charts always use last 6 months for a meaningful trend line
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const monthlyChartMatch = { createdAt: { $gte: sixMonthsAgo, $lte: new Date() } };

  const monthlyOrders = await Order.aggregate([
    { $match: monthlyChartMatch },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
        revenue: { $sum: '$totalAmount' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const statusDistribution = await Order.aggregate([
    ...(Object.keys(orderQuery).length ? [{ $match: orderQuery }] : []),
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const monthlyRevenue = await Invoice.aggregate([
    { $match: monthlyChartMatch },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        revenue: { $sum: '$total' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  res.json({
    stats: {
      totalOrders,
      receivedOrders,
      processingOrders,
      deliveredOrders,
      totalCustomers,
      totalWorkers,
      revenue,
    },
    charts: { monthlyOrders, monthlyRevenue, statusDistribution },
    filters: { from, to },
  });
});
