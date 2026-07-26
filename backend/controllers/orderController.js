import Order from '../models/Order.js';
import Customer from '../models/Customer.js';
import Measurement from '../models/Measurement.js';
import Worker from '../models/Worker.js';
import User from '../models/User.js';
import transporter from "../config/mail.js";
import asyncHandler from '../utils/asyncHandler.js';
import { createNotification } from '../services/notificationService.js';
import { generateInvoiceFromOrder } from '../services/invoiceService.js';
import {
  sendEmail,
  orderCreatedEmail,
  orderStatusEmail,
  orderCompletedEmail,
  invoiceEmail,
} from '../services/emailService.js';

const populateOrder = [
  { path: 'customer', populate: { path: 'user', select: 'name email phone' } },
  { path: 'worker', populate: { path: 'user', select: 'name email phone' } },
  { path: 'measurement' },
  { path: 'createdBy', select: 'name' },
];

// @desc    Get all orders with search/filter
export const getOrders = asyncHandler(async (req, res) => {
  const { status, search, worker, page = 1, limit = 10, sort = '-createdAt' } = req.query;
  const query = {};

  if (status) query.status = status;
  if (worker) query.worker = worker;

  let orders = await Order.find(query)
    .populate(populateOrder)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  if (search) {
    const regex = new RegExp(search, 'i');
    orders = orders.filter(
      (o) =>
        regex.test(o.orderNumber) ||
        regex.test(o.customer?.user?.name) ||
        regex.test(o.customer?.user?.email)
    );
  }

  const total = await Order.countDocuments(query);
  res.json({ orders, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// @desc    Get single order
export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(populateOrder);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  res.json(order);
});

// @desc    Create order
export const createOrder = asyncHandler(async (req, res) => {


  const {
    items,
    notes,
    priority,
    deliveryDate,
    aiRecommendation,
  } = req.body;

  const resolvedCustomerId = customerId || customer;
  let resolvedMeasurement = measurement;

  if (!resolvedCustomerId) {
    res.status(400);
    throw new Error('Customer is required');
  }

  if (!items?.length) {
    res.status(400);
    throw new Error('At least one order item is required');
  }

  if (!resolvedMeasurement && measurements) {
    const additionalMeasurements = {};
    if (measurements.length) additionalMeasurements.length = Number(measurements.length);

    const createdMeasurement = await Measurement.create({
      customer: resolvedCustomerId,
      chest: measurements.chest,
      waist: measurements.waist,
      shoulder: measurements.shoulder,
      sleeveLength: measurements.sleeve,
      additionalMeasurements,
      isDefault: false,
    });
    resolvedMeasurement = createdMeasurement._id;
  }

  const totalAmount = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

const order = await Order.create({
  customer: customer._id,
  items: cleanItems,
  measurement: measurement?._id,
  totalAmount,
  notes,
  priority,
  deliveryDate,

 

  createdBy: req.user._id,
});


  const populated = await Order.findById(order._id).populate(populateOrder);
  const customerUser = populated.customer?.user;

  if (customerUser) {
    const emailContent = orderCreatedEmail(customerUser, populated);
    await createNotification({
      userId: customerUser._id,
      title: 'Order Created',
      message: `Your order ${populated.orderNumber} has been created.`,
      type: 'order',
      relatedOrder: order._id,
      emailData: { to: customerUser.email, ...emailContent },
    });
  }

  res.status(201).json(populated);
});

// @desc    Customer creates order request for admin
export const createCustomerOrder = asyncHandler(async (req, res) => {
 const {
  items,
  notes,
  priority,
  deliveryDate,
  aiRecommendation,
} = req.body;

  if (!items?.length) {
    res.status(400);
    throw new Error('At least one order item is required');
  }

  const customer = await Customer.findOne({ user: req.user._id });
  if (!customer) {
    res.status(404);
    throw new Error('Customer profile not found');
  }

  const measurement = await Measurement.findOne({
    customer: customer._id,
    isDefault: true,
  }).sort('-createdAt') || await Measurement.findOne({ customer: customer._id }).sort('-createdAt');

  const cleanItems = items
    .filter((item) => item.name?.trim())
    .map((item) => ({
      name: item.name.trim(),
      description: item.description,
      quantity: Number(item.quantity) || 1,
      price: Number(item.price) || 0,
      fabric: item.fabric,
    }));

  if (!cleanItems.length) {
    res.status(400);
    throw new Error('At least one item name is required');
  }

  const totalAmount = cleanItems.reduce((sum, i) => sum + i.quantity * i.price, 0);

  const order = await Order.create({
    customer: customer._id,
    items: cleanItems,
    measurement: measurement?._id,
    totalAmount,
    notes,
    priority,
    deliveryDate,
      aiRecommendation,
    createdBy: req.user._id,
  });

  const populated = await Order.findById(order._id).populate(populateOrder);
  const admins = await User.find({ role: 'admin', isActive: true });

  await Promise.all(admins.map((admin) =>
    createNotification({
      userId: admin._id,
      title: 'New Customer Order',
      message: `${req.user.name} placed order ${populated.orderNumber}.`,
      type: 'order',
      relatedOrder: order._id,
    })
  ));

  res.status(201).json(populated);
});

// @desc    Update order status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id).populate({
    path: 'customer',
    populate: { path: 'user' },
  });

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;
  await order.save();

  const populated = await Order.findById(order._id).populate(populateOrder);
  const customerUser = order.customer?.user;

  if (customerUser) {
    const emailContent =
      status === 'delivered' || status === 'ready'
        ? orderCompletedEmail(customerUser, populated)
        : orderStatusEmail(customerUser, populated);

    await createNotification({
      userId: customerUser._id,
      title: 'Order Status Updated',
      message: `Order ${populated.orderNumber} is now ${status}.`,
      type: 'status',
      relatedOrder: order._id,
      emailData: { to: customerUser.email, ...emailContent },
    });
  }

  res.json(populated);
});

// @desc    Assign worker to order
export const assignWorker = asyncHandler(async (req, res) => {
  const { workerId } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { worker: workerId, workerStatus: 'pending' },
    { new: true }
  ).populate(populateOrder);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const worker = await Worker.findById(workerId).populate('user');
  if (worker) {
    worker.assignedOrders.push(order._id);
    await worker.save();

    await createNotification({
      userId: worker.user._id,
      title: 'New Task Assigned',
      message: `You have been assigned order ${order.orderNumber}.`,
      type: 'task',
      relatedOrder: order._id,
    });
  }

  res.json(order);
});

// @desc    Generate invoice for order
export const generateBill = asyncHandler(async (req, res) => {
  const invoice = await generateInvoiceFromOrder(req.params.id, req.user._id, req.body);
  const customerUser = invoice.customer?.user;

  if (customerUser) {
    const emailContent = invoiceEmail(customerUser, invoice);
    await createNotification({
      userId: customerUser._id,
      title: 'Invoice Generated',
      message: `Invoice ${invoice.invoiceNumber} for ₹${invoice.total}.`,
      type: 'invoice',
      relatedInvoice: invoice._id,
      relatedOrder: invoice.order?._id || invoice.order,
      emailData: { to: customerUser.email, ...emailContent },
    });
  }

  res.status(201).json(invoice);
});

// @desc    Update order pricing (admin only)
export const updateOrderPrice = asyncHandler(async (req, res) => {
  const { totalAmount, advancePaid } = req.body;
  const order = await Order.findById(req.params.id).populate({
    path: 'customer',
    populate: { path: 'user' },
  });

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (typeof totalAmount !== 'undefined' && totalAmount >= 0) {
    order.totalAmount = totalAmount;
  }

  if (typeof advancePaid !== 'undefined' && advancePaid >= 0) {
    order.advancePaid = advancePaid;
  }

  await order.save();

  const populated = await Order.findById(order._id).populate(populateOrder);
  const customerUser = order.customer?.user;

  if (customerUser && typeof totalAmount !== 'undefined') {
    await createNotification({
      userId: customerUser._id,
      title: 'Order Priced',
      message: `Your order ${populated.orderNumber} has been priced at ₹${populated.totalAmount}.`,
      type: 'order',
      relatedOrder: order._id,
      emailData: {
        to: customerUser.email,
        subject: 'Order Pricing Updated',
        html: `<p>Your order <strong>${populated.orderNumber}</strong> has been priced at <strong>₹${populated.totalAmount}</strong>.</p>`,
      },
    });
  }

  res.json(populated);
});

// @desc    Customer order history
export const getMyOrders = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({ user: req.user._id });
  if (!customer) {
    res.status(404);
    throw new Error('Customer profile not found');
  }

  const orders = await Order.find({ customer: customer._id })
    .populate(populateOrder)
    .sort('-createdAt');

  res.json(orders);
});

// @desc    Track order by number
export const trackOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber }).populate(populateOrder);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  res.json(order);
});

