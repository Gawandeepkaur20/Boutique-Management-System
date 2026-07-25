# Payment Integration Setup Guide

## Overview
This application uses **Razorpay** as the payment gateway for processing both advance and full payments for orders.

## Setup Steps

### 1. Get Razorpay Credentials

1. Visit [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Create a free account
3. Go to **Settings → API Keys**
4. Copy your **Key ID** and **Key Secret**

### 2. Update Backend Environment Variables

Edit `backend/.env` and add:

```
RAZORPAY_KEY_ID=your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
```

### 3. Install Razorpay Package

```bash
cd backend
npm install razorpay
```

### 4. Integrate Payment in Frontend

The payment system is already integrated in:
- **Customer Orders Page** - Add "Pay" button to orders
- **Customer Payment History** - View all payments
- **Admin Payments Dashboard** - Track all customer payments and process refunds

## Features

### Payment Types
- **Advance Payment**: 30% of order amount (or custom amount)
- **Full Payment**: Remaining balance after advance

### Payment Flow
1. Customer clicks "Pay" button on order
2. SelectsPayment type (advance/full)
3. Razorpay checkout opens
4. Payment is verified and recorded
5. Order status updates automatically
6. Customer receives confirmation email

### Admin Features
- View all payments with status
- Filter by payment status
- Process refunds for completed payments
- Export payment records

## API Endpoints

### Customer Endpoints
- `POST /api/payments/initiate` - Start payment
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/my` - Get customer's payments
- `GET /api/payments/order/:orderId` - Get payments for an order

### Admin Endpoints
- `GET /api/payments` - Get all payments (with filters)
- `POST /api/payments/:id/refund` - Refund a payment

## Database Model

### Payment Schema
```javascript
{
  order: ObjectId,
  customer: ObjectId,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  amount: Number,
  type: 'advance' | 'full',
  status: 'pending' | 'initiated' | 'completed' | 'failed' | 'refunded',
  currency: String (default: 'INR'),
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Testing

### Razorpay Test Cards
Use these in test mode:

**Successful Payment:**
- Card: `4111 1111 1111 1111`
- Expiry: Any future date
- CVV: Any 3 digits

**Failed Payment:**
- Card: `4222 2222 2222 2222`

## Security Notes

⚠️ **Important:**
- Never commit your API keys to version control
- Use `.env` file for sensitive credentials
- Payment verification uses HMAC-SHA256 signature verification
- All payments are PCI-DSS compliant through Razorpay

## Customization

### Change Advance Payment Percentage
In `frontend/src/components/PaymentDialog.jsx`, line ~23:
```javascript
Math.ceil(order.totalAmount * 0.3); // Change 0.3 to your percentage
```

### Customize Payment UI
Edit `PaymentDialog.jsx` to match your branding

## Troubleshooting

### Payment not processing
1. Check Razorpay credentials in `.env`
2. Ensure backend is running
3. Verify customer profile exists

### Signature verification failed
- Check if `RAZORPAY_KEY_SECRET` is correct
- Verify Razorpay is in the same mode (test/live)

### Payment dialog not opening
- Check if Razorpay script loaded: `window.Razorpay`
- Check browser console for errors

## Next Steps

1. Add Razorpay credentials to `.env`
2. Add "Pay" button to customer orders page
3. Test payment flow with test cards
4. Go live when ready (get live keys from Razorpay)

