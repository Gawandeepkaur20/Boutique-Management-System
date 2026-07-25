import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['order', 'invoice', 'status', 'system', 'task', 'payment'],
      default: 'system',
    },
    relatedOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    relatedInvoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
    isRead: { type: Boolean, default: false },
    emailSent: { type: Boolean, default: false },
    
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
