import express from 'express';
import { getInvoices, getInvoice, getMyInvoices } from '../controllers/invoiceController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/my', protect, authorize('customer'), getMyInvoices);
router.get('/', protect, authorize('admin'), getInvoices);
router.get('/:id', protect, getInvoice);

export default router;
