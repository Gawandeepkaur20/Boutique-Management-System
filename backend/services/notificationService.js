import Notification from '../models/Notification.js';
import { sendEmail } from './emailService.js';

export const createNotification = async ({
  userId,
  title,
  message,
  type = 'system',
  relatedOrder,
  relatedInvoice,
  emailData,
}) => {
  const notification = await Notification.create({
    user: userId,
    title,
    message,
    type,
    relatedOrder,
    relatedInvoice,
  });

  if (emailData) {
    try {
      await sendEmail(emailData);
      notification.emailSent = true;
      await notification.save();
    } catch (err) {
      console.error('Email send failed:', err.message);
    }
  }

  return notification;
};
