import Worker from '../models/Worker.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Customer from '../models/Customer.js';
import asyncHandler from '../utils/asyncHandler.js';
import { createNotification } from '../services/notificationService.js';

const orderPopulate = [
  { path: 'customer', populate: { path: 'user', select: 'name email phone' } },
  { path: 'measurement' },
];

// @desc    Get all workers
export const getWorkers = asyncHandler(async (req, res) => {
  const workers = await Worker.find()
    .populate('user', 'name email phone isActive')
    .sort('-createdAt');
  res.json(workers);
});

// @desc    Create worker (admin)
export const createWorker = asyncHandler(async (req, res) => {
  const { name, email, password, phone, specialization, experience } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('Email already registered');
  }

  const user = await User.create({
    name,
    email,
    password: password || 'worker123',
    role: 'worker',
    phone,
  });

  const worker = await Worker.create({
    user: user._id,
    specialization,
    experience,
  });

  const populated = await Worker.findById(worker._id).populate('user', 'name email phone');
  res.status(201).json(populated);
});

// @desc    Worker dashboard - assigned tasks
export const getMyTasks = asyncHandler(async (req, res) => {
  const worker = await Worker.findOne({ user: req.user._id });
  if (!worker) {
    res.status(404);
    throw new Error('Worker profile not found');
  }

  const { status, page = 1, limit = 10 } = req.query;
  const query = { worker: worker._id };
  if (status) query.workerStatus = status;

  const orders = await Order.find(query)
    .populate(orderPopulate)
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Order.countDocuments(query);
  res.json({ orders, total, page: Number(page) });
});

// @desc    Update worker task status
export const updateTaskStatus = asyncHandler(async (req, res) => {
  const { workerStatus, workerNotes, completedWorkDetails } = req.body;
  const worker = await Worker.findOne({ user: req.user._id });

  const order = await Order.findOne({ _id: req.params.id, worker: worker._id });
  if (!order) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (workerStatus) order.workerStatus = workerStatus;
  if (workerNotes) order.workerNotes = workerNotes;
  if (completedWorkDetails) order.completedWorkDetails = completedWorkDetails;

  if (workerStatus === 'processing') order.status = 'processing';
  if (workerStatus === 'completed') order.status = 'stitching';

  await order.save();

  const populated = await Order.findById(order._id).populate(orderPopulate);

  // Notify admins
  const admins = await User.find({ role: 'admin' });
  for (const admin of admins) {
    await createNotification({
      userId: admin._id,
      title: 'Worker Update',
      message: `Order ${order.orderNumber} updated to ${workerStatus} by ${req.user.name}.`,
      type: 'task',
      relatedOrder: order._id,
    });
  }

  res.json(populated);
});

// @desc    Submit completed work to admin
export const submitCompletedWork = asyncHandler(async (req, res) => {
  const { completedWorkDetails, workerNotes } = req.body;
  const worker = await Worker.findOne({ user: req.user._id });

  const order = await Order.findOneAndUpdate(
    { _id: req.params.id, worker: worker._id },
    {
      workerStatus: 'completed',
      completedWorkDetails,
      workerNotes,
      status: 'ready',
    },
    { new: true }
  ).populate(orderPopulate);

  if (!order) {
    res.status(404);
    throw new Error('Task not found');
  }

  const admins = await User.find({ role: 'admin' });
  for (const admin of admins) {
    await createNotification({
      userId: admin._id,
      title: 'Work Completed',
      message: `${req.user.name} completed work on ${order.orderNumber}.`,
      type: 'task',
      relatedOrder: order._id,
    });
  }

  res.json(order);
});
