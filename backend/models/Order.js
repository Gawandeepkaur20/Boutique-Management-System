import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' },
    measurement: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Measurement',
},

aiRecommendation: {
  recommendedSize: {
    type: String,
    default: '',
  },
  fitType: {
    type: String,
    default: '',
  },
  recommendedNeck: {
    type: String,
    default: '',
  },
  recommendedSleeves: {
    type: String,
    default: '',
  },
  recommendedBottom: {
    type: String,
    default: '',
  },
  recommendedFabric: {
    type: String,
    default: '',
  },
  confidence: {
    type: String,
    default: '',
  },
  reason: {
    type: String,
    default: '',
  },
},
    items: [
      {
        name: { type: String, required: true },
        description: String,
        quantity: { type: Number, default: 1 },
        price: { type: Number, default: 0 },
        fabric: String,
      },
    ],
    totalAmount: { type: Number, default: 0 },
    advancePaid: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['received', 'processing', 'stitching', 'ready', 'delivered'],
      default: 'received',
    },
    workerStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed'],
      default: 'pending',
    },
    workerNotes: { type: String },
    completedWorkDetails: { type: String },
    deliveryDate: { type: Date },
    notes: { type: String },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Auto-generate order number
orderSchema.pre('save', async function (next) {
  if (this.orderNumber) return next();
  const count = await mongoose.model('Order').countDocuments();
  this.orderNumber = `ORD-${String(count + 1).padStart(5, '0')}`;
  next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
