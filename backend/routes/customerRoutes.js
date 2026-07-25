import express from 'express';
import {
  getCustomers,
  getCustomerProfile,
  updateCustomerProfile,
  uploadReferenceImages,
  addModificationRequest,
  createCustomer,
  getFashionRecommendation,
   generateOutfitImage,
   getSizeRecommendation,
} from '../controllers/customerController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import {
  virtualTryOn,
} from "../controllers/customerController.js";

import {
  uploadTryOn,
} from "../middleware/uploadTryOn.js";




const router = express.Router();

router.get('/profile', protect, authorize('customer'), getCustomerProfile);
router.put('/profile', protect, authorize('customer'), updateCustomerProfile);
router.post(
  '/reference-images',
  protect,
  authorize('customer'),
  upload.array('images', 5),
  uploadReferenceImages
);
router.post('/modifications', protect, authorize('customer'), addModificationRequest);
router.post(
  "/fashion-recommendation",
  protect,
  getFashionRecommendation
);
router.get('/', protect, authorize('admin'), getCustomers);
router.post('/', protect, authorize('admin'), createCustomer);
router.post(
  "/try-on",
  protect,
  uploadTryOn.fields([
    {
      name: "personImage",
      maxCount: 1,
    },
    {
      name: "outfitImage",
      maxCount: 1,
    },
  ]),
  virtualTryOn
);
router.post(
  "/generate-outfit-image",
  protect,
  generateOutfitImage
);
router.post(
  "/size-recommendation",
  protect,
  authorize("customer"),
  getSizeRecommendation
);
export default router;
