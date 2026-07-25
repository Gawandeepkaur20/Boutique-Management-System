import express from 'express';
import {
  getWorkers,
  createWorker,
  getMyTasks,
  updateTaskStatus,
  submitCompletedWork,
} from '../controllers/workerController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/tasks', protect, authorize('worker'), getMyTasks);
router.patch('/tasks/:id/status', protect, authorize('worker'), updateTaskStatus);
router.post('/tasks/:id/submit', protect, authorize('worker'), submitCompletedWork);

router.get('/', protect, authorize('admin'), getWorkers);
router.post('/', protect, authorize('admin'), createWorker);

export default router;
