import express from 'express';
import {
  initiatePayment,
  verifyPayment,
  getOrderPayments,
  getCustomerPayments,
  getAllPayments,
  refundPayment,
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Customer routes
router.post('/initiate', protect, initiatePayment);
router.post('/verify', protect, verifyPayment);
router.get('/my', protect, authorize('customer'), getCustomerPayments);
router.get('/order/:orderId', protect, getOrderPayments);

// Admin routes
router.get('/', protect, authorize('admin'), getAllPayments);
router.post('/:id/refund', protect, authorize('admin'), refundPayment);

export default router;
