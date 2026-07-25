import express from 'express';
import {
  getOrders,
  getOrder,
  createOrder,
  createCustomerOrder,
  updateOrderStatus,
  updateOrderPrice,
  assignWorker,
  generateBill,
  getMyOrders,
  trackOrder,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/track/:orderNumber', protect, trackOrder);
router.get('/my', protect, authorize('customer'), getMyOrders);
router.post('/my', protect, authorize('customer'), createCustomerOrder);

router.get('/', protect, authorize('admin'), getOrders);
router.get('/:id', protect, getOrder);
router.post('/', protect, authorize('admin'), createOrder);
router.patch('/:id/status', protect, authorize('admin'), updateOrderStatus);
router.patch('/:id/price', protect, authorize('admin'), updateOrderPrice);
router.patch('/:id/assign', protect, authorize('admin'), assignWorker);
router.post('/:id/invoice', protect, authorize('admin'), generateBill);

export default router;
