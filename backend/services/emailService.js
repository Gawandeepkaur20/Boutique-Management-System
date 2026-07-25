import nodemailer from 'nodemailer';

const createTransporter = () => {
  if (!process.env.SMTP_USER) {
    console.warn('SMTP not configured - emails will be logged only');
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ''),
  };

  if (!transporter) {
    console.log('[Email mock]', { to, subject });
    return { success: true, mock: true };
  }

  const info = await transporter.sendMail(mailOptions);
  return { success: true, messageId: info.messageId };
};

export const orderCreatedEmail = (user, order) => ({
  subject: `Order ${order.orderNumber} Created`,
  html: `<h2>Hello ${user.name},</h2>
    <p>Your order <strong>${order.orderNumber}</strong> has been received.</p>
    <p>Status: <strong>${order.status}</strong></p>
    <p>Total: ₹${order.totalAmount}</p>`,
});

export const orderStatusEmail = (user, order) => ({
  subject: `Order ${order.orderNumber} - Status Updated`,
  html: `<h2>Hello ${user.name},</h2>
    <p>Your order <strong>${order.orderNumber}</strong> status is now: <strong>${order.status}</strong></p>`,
});

export const orderCompletedEmail = (user, order) => ({
  subject: `Order ${order.orderNumber} Completed`,
  html: `<h2>Hello ${user.name},</h2>
    <p>Great news! Your order <strong>${order.orderNumber}</strong> is ready/completed.</p>`,
});

export const invoiceEmail = (user, invoice) => ({
  subject: `Invoice ${invoice.invoiceNumber}`,
  html: `<h2>Hello ${user.name},</h2>
    <p>Your invoice <strong>${invoice.invoiceNumber}</strong> has been generated.</p>
    <p>Total: ₹${invoice.total} | Balance Due: ₹${invoice.balanceDue}</p>`,
});
