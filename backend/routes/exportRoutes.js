import express from 'express';
import {
  exportOrders,
  exportCustomers,
  exportPayments,
  importCustomers,
  importOrders,
  confirmOrderImport,
  downloadOrderTemplate
} from '../controllers/exportController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadMemory } from '../middleware/uploadMemory.js';

const router = express.Router();

router.get('/orders', protect, authorize('admin'), exportOrders);
router.get('/customers', protect, authorize('admin'), exportCustomers);
router.post('/import/customers', protect, authorize('admin'), uploadMemory.single('file'), importCustomers);
router.post('/import/orders', protect, authorize('admin'), uploadMemory.single('file'), importOrders);
router.get(
  '/payments',
  protect,
  authorize('admin'),
  exportPayments
);
router.post(
  '/import/orders/confirm',
  protect,
  authorize('admin'),
  confirmOrderImport
);
router.get(
  '/order-template',
  protect,
  authorize('admin'),
  downloadOrderTemplate
);
export default router;
