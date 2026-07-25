// import Razorpay from 'razorpay';
// import crypto from 'crypto';
// import Payment from '../models/Payment.js';
// import Order from '../models/Order.js';
// import Customer from '../models/Customer.js';
// import asyncHandler from '../utils/asyncHandler.js';
// import { createNotification } from '../services/notificationService.js';

// // let razorpay = null;

// // Initialize Razorpay only if credentials are available
// // if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
// //   razorpay = new Razorpay({
// //     key_id: process.env.RAZORPAY_KEY_ID,
// //     key_secret: process.env.RAZORPAY_KEY_SECRET,
// //   });
// // }

// // @desc    Initiate payment for order
// export const initiatePayment = asyncHandler(async (req, res) => {
//   try {

//     console.log("KEY:", process.env.RAZORPAY_KEY_ID);
//     console.log("BODY:", req.body);

//     const razorpay = new Razorpay({
//       key_id: process.env.RAZORPAY_KEY_ID,
//       key_secret: process.env.RAZORPAY_KEY_SECRET,
//     });

//     const { orderId, amount, type = "full" } = req.body;

//     console.log("OrderId:", orderId);

//     const order = await Order.findById(orderId).populate({
//       path: "customer",
//       populate: { path: "user" },
//     });

//     console.log("Order:", order);

//     if (!order) {
//       throw new Error("Order not found");
//     }

//     console.log("Customer:", order.customer);

//     const razorpayOrder = await razorpay.orders.create({
//       amount: Math.round(amount * 100),
//       currency: "INR",
//       receipt: `ORD-${order.orderNumber}-${type}`,
//     });

//     console.log("Razorpay Order:", razorpayOrder);
//     const payment = await Payment.create({
//   order: orderId,
//   customer: order.customer._id,
//   razorpayOrderId: razorpayOrder.id,
//   amount,
//   type,
//   status: "initiated",
//   description: `${type.toUpperCase()} Payment for Order ${order.orderNumber}`,
// });
// res.json({
//   payment,
//   razorpayOrder,
//   keyId: process.env.RAZORPAY_KEY_ID,
//   customerDetails: {
//     name: order.customer.user?.name,
//     email: order.customer.user?.email,
//     phone: order.customer.user?.phone,
//   },
// });

//   } catch (err) {

//     console.error("INITIATE PAYMENT ERROR:");
//     console.error(err);

//     res.status(500).json({
//       message: err.message,
//       stack: err.stack,
//     });

//   }
// });

// // @desc    Verify Razorpay payment
// export const verifyPayment = asyncHandler(async (req, res) => {
    
//   const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

//   if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
//     res.status(400);
//     throw new Error('Missing payment verification details');
//   }
//   // Verify signature
//   const body = razorpayOrderId + '|' + razorpayPaymentId;
//   const expectedSignature = crypto
//     .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//     .update(body)
//     .digest('hex');

//   if (expectedSignature !== razorpaySignature) {
//     const payment = await Payment.findOne({ razorpayOrderId });
//     if (payment) {
//       payment.status = 'failed';
//       payment.errorMessage = 'Signature verification failed';
//       payment.failedAttempts += 1;
//       await payment.save();
//     }

//     res.status(400);
//     throw new Error('Invalid payment signature');
//   }

//   // Get payment details from Razorpay
//   const paymentDetails = await razorpay.payments.fetch(razorpayPaymentId);

//   let payment = await Payment.findOne({ razorpayOrderId });

//   if (!payment) {
//     res.status(404);
//     throw new Error('Payment record not found');
//   }

//   if (paymentDetails.status === 'captured') {
//     payment.razorpayPaymentId = razorpayPaymentId;
//     payment.razorpaySignature = razorpaySignature;
//     payment.status = 'completed';
//     await payment.save();

//     const order = await Order.findById(payment.order).populate({
//       path: 'customer',
//       populate: { path: 'user' },
//     });

//     if (payment.type === 'advance') {
//       order.advancePaid += payment.amount;
//     }

//     await order.save();

//     // Create notification
//     await createNotification({
//       userId: order.customer.user._id,
//       title: 'Payment Successful',
//       message: `Payment of ₹${payment.amount} received for order ${order.orderNumber}`,
//       type: 'payment',
//       relatedOrder: order._id,
//       emailData: {
//         to: order.customer.user.email,
//         subject: 'Payment Confirmation',
//         html: `<p>Your payment of <strong>₹${payment.amount}</strong> has been confirmed for order <strong>${order.orderNumber}</strong>.</p>`,
//       },
//     });

//     res.json({ success: true, payment, order });
//   } else {
//     payment.status = 'failed';
//     payment.errorMessage = `Payment status: ${paymentDetails.status}`;
//     payment.failedAttempts += 1;
//     await payment.save();

//     res.status(400);
//     throw new Error('Payment not captured');
//   }
// });

// // @desc    Get payment history for order
// export const getOrderPayments = asyncHandler(async (req, res) => {
//   const payments = await Payment.find({ order: req.params.orderId }).sort('-createdAt');
//   res.json(payments);
// });

// // @desc    Get all payments for customer
// export const getCustomerPayments = asyncHandler(async (req, res) => {
//   const customer = await Customer.findOne({ user: req.user._id });

//   if (!customer) {
//     res.status(404);
//     throw new Error('Customer not found');
//   }

//   const payments = await Payment.find({ customer: customer._id })
//     .populate({
//       path: 'order',
//       select: 'orderNumber status totalAmount',
//     })
//     .sort('-createdAt');

//   res.json(payments);
// });

// // @desc    Get all payments (admin)
// export const getAllPayments = asyncHandler(async (req, res) => {
//   const { status, orderId, page = 1, limit = 10 } = req.query;
//   const query = {};

//   if (status) query.status = status;
//   if (orderId) query.order = orderId;

//   const payments = await Payment.find(query)
//     .populate({
//       path: 'order',
//       select: 'orderNumber status totalAmount advancePaid',
//       populate: {
//         path: 'customer',
//         populate: { path: 'user', select: 'name email' },
//       },
//     })
//     .sort('-createdAt')
//     .skip((page - 1) * limit)
//     .limit(Number(limit));

//   const total = await Payment.countDocuments(query);

//   res.json({
//     payments,
//     total,
//     page: Number(page),
//     pages: Math.ceil(total / limit),
//   });
// });

// // @desc    Refund payment
// export const refundPayment = asyncHandler(async (req, res) => {
    
//   const { paymentId, amount, reason } = req.body;

//   const payment = await Payment.findById(paymentId);



//   if (!payment) {
//     res.status(404);
//     throw new Error('Payment not found');
//   }

//   if (payment.status !== 'completed') {
//     res.status(400);
//     throw new Error('Can only refund completed payments');
//   }

//   try {
//     const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
//       amount: Math.round((amount || payment.amount) * 100),
//       notes: { reason: reason || 'Refund requested' },
//     });

//     payment.status = 'refunded';
//     await payment.save();

//     const order = await Order.findById(payment.order).populate({
//       path: 'customer',
//       populate: { path: 'user' },
//     });

//     // Create notification
//     await createNotification({
//       userId: order.customer.user._id,
//       title: 'Payment Refunded',
//       message: `Refund of ₹${amount || payment.amount} processed for order ${order.orderNumber}`,
//       type: 'payment',
//       relatedOrder: order._id,
//     });

//     res.json({ success: true, refund, payment });
//   } catch (error) {
//     res.status(400);
//     throw new Error(`Refund failed: ${error.message}`);
//   }
// });



import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import Customer from '../models/Customer.js';
import asyncHandler from '../utils/asyncHandler.js';
import User from "../models/User.js";
import { createNotification } from '../services/notificationService.js';

const getRazorpay = () =>
  new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

// =======================
// Initiate Payment
// =======================
export const initiatePayment = asyncHandler(async (req, res) => {
  try {
    const { orderId, amount, type = 'full' } = req.body;

    if (!orderId || !amount) {
      res.status(400);
      throw new Error('Order ID and amount are required');
    }

    const order = await Order.findById(orderId).populate({
      path: 'customer',
      populate: { path: 'user' },
    });

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    const razorpay = getRazorpay();

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `ORD-${order.orderNumber}-${Date.now()}`,
    });

    const payment = await Payment.create({
      order: order._id,
      customer: order.customer._id,
      razorpayOrderId: razorpayOrder.id,
      amount,
      type,
      status: 'initiated',
      description: `${type.toUpperCase()} payment for order ${order.orderNumber}`,
    });

    res.json({
      payment,
      razorpayOrder,
      keyId: process.env.RAZORPAY_KEY_ID,
      customerDetails: {
        name: order.customer.user?.name || '',
        email: order.customer.user?.email || '',
        phone: order.customer.user?.phone || '',
      },
    });
  } catch (err) {
    console.error('INITIATE PAYMENT ERROR:', err);
    res.status(500).json({
      message: err.message,
    });
  }
});

// =======================
// Verify Payment
// =======================
export const verifyPayment = asyncHandler(async (req, res) => {
  try {
    const razorpay = getRazorpay();

    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    const body = `${razorpayOrderId}|${razorpayPaymentId}`;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      res.status(400);
      throw new Error('Invalid payment signature');
    }

    const paymentDetails =
      await razorpay.payments.fetch(razorpayPaymentId);

    let payment = await Payment.findOne({
      razorpayOrderId,
    });

    if (!payment) {
      res.status(404);
      throw new Error('Payment record not found');
    }

    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.status = 'completed';

    await payment.save();

    const order = await Order.findById(payment.order).populate({
      path: 'customer',
      populate: { path: 'user' },
    });

    // if (order && payment.type === 'advance') {
    //   order.advancePaid =
    //     (order.advancePaid || 0) + payment.amount;

    //   await order.save();
    // }
    if (order) {

  order.advancePaid =
    (order.advancePaid || 0) + payment.amount;

  await order.save();

}

    if (order?.customer?.user) {
      await createNotification({
        userId: order.customer.user._id,
        title: 'Payment Successful',
        message: `Payment of ₹${payment.amount} received for order ${order.orderNumber}`,
        type: 'payment',
        relatedOrder: order._id,
      });
    }
const adminUser = await User.findOne({ role: "admin" });

if (adminUser) {
  await createNotification({
    userId: adminUser._id,
    title: "Payment Received",
    message: `${order.customer.user.name} paid ₹${payment.amount} for Order ${order.orderNumber}`,
    type: "payment",
    relatedOrder: order._id,
  });
}
    res.json({
      success: true,
      payment,
      paymentDetails,
    });
  } catch (err) {
    console.error('VERIFY PAYMENT ERROR:', err);
    res.status(500).json({
      message: err.message,
    });
  }
});



// =======================
// Get Payments For Order
// =======================
export const getOrderPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({
    order: req.params.orderId,
  }).sort('-createdAt');

  res.json(payments);
});

// =======================
// Customer Payments
// =======================
export const getCustomerPayments = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({
    user: req.user._id,
  });

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  const payments = await Payment.find({
    customer: customer._id,
  })
    .populate({
      path: 'order',
      select: 'orderNumber totalAmount status',
    })
    .sort('-createdAt');

  res.json(payments);
});

// =======================
// Admin Payments
// =======================
export const getAllPayments = asyncHandler(async (req, res) => {
 
  const payments = await Payment.find()
    .populate({
      path: "order",
      select: "orderNumber totalAmount status advancePaid customer",
      populate: {
        path: "customer",
        populate: {
          path: "user",
          select: "name email phone",
        },
      },
    })
    .sort("-createdAt");

  res.json({
    payments,
  });
});

 



// =======================
// Refund Payment
// =======================
export const refundPayment = asyncHandler(async (req, res) => {
  try {
    const razorpay = getRazorpay();

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      res.status(404);
      throw new Error('Payment not found');
    }
console.log({
    paymentId: payment.razorpayPaymentId,
    refundAmount: Number(req.body.amount) * 100,
});
   const refund = await razorpay.payments.refund(
  payment.razorpayPaymentId,
  {
    amount: Math.round(payment.amount * 100), // amount in paise
    speed: "normal",
    notes: {
      reason: req.body.reason || "Customer refund",
    },
  }
);

console.log(refund);

    payment.status = 'refunded';

    await payment.save();

    res.json({
      success: true,
      payment,
    });
  } catch (err) {
    console.error('REFUND ERROR:', err);
    res.status(500).json({
      message: err.message,
    });
  }
});

