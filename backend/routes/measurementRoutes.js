import express from 'express';
import { saveMeasurement, getMeasurements, getMeasurement,getAllMeasurements } from '../controllers/measurementController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('customer', 'admin'), saveMeasurement);
router.get(
  "/all",
  protect,
  authorize("admin"),
  getAllMeasurements
);
router.get('/customer/:customerId', protect, getMeasurements);
router.get('/:id', protect, getMeasurement);

export default router;
