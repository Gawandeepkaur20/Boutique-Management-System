import nodemailer from 'nodemailer';
import emailLayout from "../templates/emailLayout.js";

const createTransporter = () => {
  if (!process.env.SMTP_USER) {
    console.warn("SMTP not configured");
    return null;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  transporter.verify((err) => {
    if (err) {
      console.error("SMTP Error:", err.message);
    } else {
    }
  });

  return transporter;
};

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""),
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully");
  

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (err) {
    console.error("❌ sendMail Error:", err);
    throw err;
  }
};
export const orderCreatedEmail = (user, order) => ({
  subject: `🎉 Order ${order.orderNumber} Confirmed`,
  html: emailLayout(
    "Order Confirmation",
    `
    <p>Hello <strong>${user.name}</strong>,</p>

    <p>Thank you for choosing <strong>Trendora Boutique</strong>.</p>

    <p>Your order has been successfully placed.</p>

    <table>
      <tr>
        <td><strong>Order Number</strong></td>
        <td>${order.orderNumber}</td>
      </tr>

      <tr>
        <td><strong>Status</strong></td>
        <td>${order.status}</td>
      </tr>

      <tr>
        <td><strong>Total Amount</strong></td>
        <td>₹${order.totalAmount}</td>
      </tr>
    </table>

    <p>
      Our tailoring team has started processing your order.
      You'll receive another email whenever the status changes.
    </p>
    `
  ),
});
export const orderStatusEmail = (user, order) => ({
  subject: `📦 Order ${order.orderNumber} Updated`,
  html: emailLayout(
    "Order Status Updated",
    `
    <p>Hello <strong>${user.name}</strong>,</p>

    <p>Your order status has changed.</p>

    <table>
      <tr>
        <td><strong>Order Number</strong></td>
        <td>${order.orderNumber}</td>
      </tr>

      <tr>
        <td><strong>Current Status</strong></td>
        <td>${order.status}</td>
      </tr>
    </table>

   
    `
  ),
});
export const orderCompletedEmail = (user, order) => ({
  subject: `✅ Your Order is Ready`,
  html: emailLayout(
    "Order Ready",
    `
    <p>Hello <strong>${user.name}</strong>,</p>

    <p>Your order is now ready for pickup or delivery.</p>

    <table>
      <tr>
        <td><strong>Order Number</strong></td>
        <td>${order.orderNumber}</td>
      </tr>

      <tr>
        <td><strong>Status</strong></td>
        <td>${order.status}</td>
      </tr>
    </table>

    
    `
  ),
});

export const invoiceEmail = (user, invoice) => ({
  subject: `🧾 Invoice ${invoice.invoiceNumber}`,
  html: emailLayout(
    "Invoice Generated",
    `
    <p>Hello <strong>${user.name}</strong>,</p>

    <p>Your invoice has been generated successfully.</p>

    <table>
      <tr>
        <td><strong>Invoice Number</strong></td>
        <td>${invoice.invoiceNumber}</td>
      </tr>

      <tr>
        <td><strong>Total</strong></td>
        <td>₹${invoice.total}</td>
      </tr>

      <tr>
        <td><strong>Balance Due</strong></td>
        <td>₹${invoice.balanceDue}</td>
      </tr>
    </table>

   
    `
  ),
});
export const welcomeEmail = (user) => ({
  subject: "🎉 Welcome to Trendora Boutique!",
  html: emailLayout(
    "Welcome to Trendora Boutique",
    `
    <p>Hello <strong>${user.name}</strong>,</p>

    <p>We're delighted to welcome you to <strong>Trendora Boutique</strong>.</p>

    <p>Your account has been created successfully. You can now:</p>

    <ul>
      <li>✨ Place tailoring orders</li>
      <li>📏 Save your measurements</li>
      <li>📦 Track order progress</li>
      <li>🧾 View invoices and payments</li>
      <li>🔔 Receive order notifications</li>
    </ul>

    <p>
      We look forward to creating outfits tailored perfectly for you.
    </p>

    `
  ),
});

export const forgotPasswordEmail = (user, resetLink) => ({
  subject: "🔒 Reset Your Trendora Boutique Password",
  html: emailLayout(
    "Password Reset Request",
    `
    <p>Hello <strong>${user.name}</strong>,</p>

    <p>We received a request to reset your password.</p>

    <p>If you requested this change, click the button below:</p>

    <p style="text-align:center;margin:35px 0;">
      <a
        href="${resetLink}"
        style="
          background:#B8893A;
          color:white;
          padding:14px 28px;
          border-radius:8px;
          text-decoration:none;
          font-weight:bold;
        "
      >
        Reset Password
      </a>
    </p>

    <p>This link will expire in <strong>15 minutes</strong>.</p>

    <p>If you didn't request a password reset, you can safely ignore this email.</p>
    `
  ),
});

export const passwordChangedEmail = (user) => ({
  subject: "✅ Password Changed Successfully",
  html: emailLayout(
    "Password Updated",
    `
    <p>Hello <strong>${user.name}</strong>,</p>

    <p>Your Trendora Boutique account password has been changed successfully.</p>

    <p>If you made this change, no further action is required.</p>

    <p><strong>If you did not change your password, please contact Trendora Boutique support immediately.</strong></p>

    `
  ),
});