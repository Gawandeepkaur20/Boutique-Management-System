import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    specialization: { type: String, trim: true },
    experience: { type: Number, default: 0 },
    assignedOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Worker = mongoose.model('Worker', workerSchema);
export default Worker;
