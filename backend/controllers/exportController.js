import Order from '../models/Order.js';
import Customer from '../models/Customer.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ordersToExcel, customersToExcel,paymentsToExcel, parseOrdersFromExcel } from '../services/excelService.js';
import XLSX from 'xlsx';
export const downloadOrderTemplate = asyncHandler(async (req, res) => {
  const XLSX = await import('xlsx');

  const data = [
    {
      CustomerEmail: 'customer@example.com',
      CustomerName: 'John Doe',
      Item: 'Designer Suit',
      Quantity: 1,
      Price: 1500,
      Fabric: 'Cotton',
      DeliveryDate: '2026-06-20',
      Notes: 'Urgent delivery',
    },
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);

  XLSX.utils.book_append_sheet(wb, ws, 'Orders');

  const buffer = XLSX.write(wb, {
    type: 'buffer',
    bookType: 'xlsx',
  });

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );

  res.setHeader(
    'Content-Disposition',
    'attachment; filename=order-import-template.xlsx'
  );

  res.send(buffer);
});
export const exportOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate([
      { path: 'customer', populate: { path: 'user', select: 'name email' } },
      { path: 'worker', populate: { path: 'user', select: 'name' } },
    ])
    .sort('-createdAt');

  const buffer = ordersToExcel(orders);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=orders.xlsx');
  res.send(buffer);
});

export const exportCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find().populate('user', 'name email phone');
  const buffer = customersToExcel(customers);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=customers.xlsx');
  res.send(buffer);
});

export const importCustomers = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const wb = XLSX.read(req.file.buffer, { type: 'buffer' });
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

  const results = { created: 0, skipped: 0, errors: [] };

  for (const row of rows) {
    const email = row.Email || row.email;
    const name = row.Name || row.name;
    if (!email || !name) {
      results.skipped++;
      continue;
    }
    const exists = await User.findOne({ email: String(email).toLowerCase() });
    if (exists) {
      results.skipped++;
      continue;
    }
    try {
      const user = await User.create({
        name,
        email,
        password: 'customer123',
        role: 'customer',
        phone: row.Phone || row.phone || '',
      });
      await Customer.create({
        user: user._id,
        city: row.City || row.city,
        address: row.Address || row.address,
      });
      results.created++;
    } catch (err) {
      results.errors.push(`${email}: ${err.message}`);
    }
  }

  res.json(results);
});

export const importOrders = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const rows = parseOrdersFromExcel(req.file.buffer);

  let created = 0;
  let skipped = 0;
  const errors = [];

  for (const row of rows) {
    try {
      const email =
        row.CustomerEmail ||
        row.customerEmail;

      if (!email) {
        skipped++;
        errors.push('CustomerEmail missing');
        continue;
      }

      const user = await User.findOne({
        email: email.toLowerCase(),
      });

      if (!user) {
        skipped++;
        errors.push(`Customer not found: ${email}`);
        continue;
      }

      const customer = await Customer.findOne({
        user: user._id,
      });

      if (!customer) {
        skipped++;
        errors.push(`Customer profile missing: ${email}`);
        continue;
      }

      // Safe date handling
      let deliveryDate = undefined;

      if (row.DeliveryDate) {
        const parsedDate = new Date(row.DeliveryDate);

        if (!isNaN(parsedDate.getTime())) {
          deliveryDate = parsedDate;
        }
      }

      await Order.create({
        customer: customer._id,

        items: [
          {
            name: row.Item || '',
            quantity: Number(row.Quantity || 1),
            price: Number(row.Price || 0),
            fabric: row.Fabric || '',
          },
        ],

        totalAmount: Number(row.Price || 0),

        status: row.Status || 'received',

        deliveryDate,

        notes: row.Notes || '',

        createdBy: req.user._id,
      });

      created++;

    } catch (err) {
      skipped++;
      errors.push(err.message);
    }
  }

  res.json({
    created,
    skipped,
    errors,
  });
});

export const exportPayments = asyncHandler(
  async (req, res) => {
    const payments = await Payment.find()
      .populate({
        path: 'order',
        populate: {
          path: 'customer',
          populate: {
            path: 'user',
            select: 'name email',
          },
        },
      })
      .sort('-createdAt');

    const buffer =
      paymentsToExcel(payments);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=payments.xlsx'
    );

    res.send(buffer);
  }
);
export const confirmOrderImport = asyncHandler(async (req, res) => {
  const { orders } = req.body;

  let created = 0;

  for (const row of orders) {
    await Order.create({
      customer: row.customerId,

      items: [
        {
          name: row.item,
          quantity: Number(row.quantity || 1),
          price: Number(row.price || 0),
          fabric: row.fabric || '',
        },
      ],

      totalAmount: Number(row.price || 0),

      deliveryDate: row.deliveryDate,

      status: 'received',

      createdBy: req.user._id,
    });

    created++;
  }

  res.json({
    message: `${created} orders imported successfully`,
    created,
  });
});