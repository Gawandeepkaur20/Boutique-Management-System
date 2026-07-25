import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    amount: { type: Number, required: true },
    type: { type: String, enum: ['advance', 'full'], default: 'full' },
    status: {
      type: String,
      enum: ['pending', 'initiated', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    currency: { type: String, default: 'INR' },
    method: { type: String, default: 'razorpay' },
    description: String,
    notes: { type: Object },
    errorMessage: String,
    failedAttempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
