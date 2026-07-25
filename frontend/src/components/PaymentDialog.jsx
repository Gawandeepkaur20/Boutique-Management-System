import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import api from '../services/api';
import { showError, showSuccess } from '../utils/toast';

// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

export default function PaymentDialog({ open, onClose, order, onPaymentSuccess }) {
     if (!order) return null;
  const [paymentType, setPaymentType] = useState('full');
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const calculateAmount = () => {
    if (paymentType === 'advance') {
      return customAmount ? Number(customAmount) : Math.ceil(order.totalAmount * 0.3); // 30% advance
    }
    return order.totalAmount;
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      const amount = calculateAmount();

      if (amount <= 0) {
        showError('Invalid payment amount');
        return;
      }

      // Initiate payment
      const { data } = await api.post('/payments/initiate', {
        orderId: order._id,
        amount,
        type: paymentType,
      });

      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        const options = {
          key: data.keyId,
          amount: Math.round(amount * 100),
          currency: 'INR',
          name: 'Boutique',
          description: `${paymentType.toUpperCase()} Payment - Order ${order.orderNumber}`,
          order_id: data.razorpayOrder.id,
          handler: async (response) => {
            try {
              const verifyRes = await api.post('/payments/verify', {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });

              showSuccess('Payment successful!');
              onPaymentSuccess?.();
              onClose();
            } catch (error) {
              showError(error.response?.data?.message || 'Payment verification failed');
            }
          },
          prefill: {
            name: data.customerDetails.name,
            email: data.customerDetails.email,
            contact: data.customerDetails.phone,
          },
          theme: {
            color: '#3b82f6',
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      };
      document.body.appendChild(script);}
    //  } catch (error) {
    //   showError(error.response?.data?.message || 'Failed to initiate payment');
      catch (error) {

  console.log(
    "Payment Error:",
    error.response?.data
  );

  showError(
    error.response?.data?.message ||
    "Failed to initiate payment"
  );


    } finally {
      setLoading(false);
    }
  };

  const amount = calculateAmount();
  const remaining = order.totalAmount - order.advancePaid;

  return (
  <Dialog
  open={open}
  onClose={onClose}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      bgcolor: 'transparent',
      backgroundImage: 'none',
      overflow: 'hidden',
      borderRadius: '28px',
      border: '1px solid',
      borderColor: 'divider',
    }
  }}
>
 <DialogTitle
  className="
  bg-[#FAF8F5]
  dark:bg-[#252525]
  border-b
  border-[#EAE3D6]
  dark:border-[#333]
  "
>
  <p className="text-sm text-[#8B7D6B]">
    Order Payment
  </p>

  <div className="flex items-center gap-3 mt-2">
    <CreditCard className="w-7 h-7 text-[#C48A7A]" />

    <h2 className="text-2xl font-bold text-[#4A3F35] dark:text-white">
      Make Payment
    </h2>
  </div>
</DialogTitle>
 <DialogContent
  className="
  bg-[#FAF8F5]
  dark:bg-[#252525]
  text-[#4A3F35]
  dark:text-white
  "
>
    <div className="space-y-5">

      {/* Order Summary */}
      <div
        className="
        rounded-2xl
        border
        border-[#EAE3D6]
        dark:border-[#333]
        bg-white
        dark:bg-[#1F1F1F]
        p-5
        "
      >
        <div className="space-y-3 text-sm">

          <div className="flex justify-between">
            <span className="text-[#8B7D6B]">
              Order Number
            </span>

            <span className="font-medium text-[#4A3F35] dark:text-white">
              {order.orderNumber}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#8B7D6B]">
              Total Amount
            </span>

            <span className="font-medium text-[#4A3F35] dark:text-white">
              ₹{order.totalAmount}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#8B7D6B]">
              Already Paid
            </span>

            <span className="font-medium text-[#4E7A61]">
              ₹{order.advancePaid}
            </span>
          </div>

          <div className="flex justify-between border-t border-[#EAE3D6] dark:border-[#333] pt-3">
            <span className="font-medium text-[#4A3F35] dark:text-white">
              Remaining
            </span>

            <span className="font-bold text-[#C48A7A]">
              ₹{remaining}
            </span>
          </div>

        </div>
      </div>

      {/* Payment Type */}
      <div>
        <label
          className="
          block
          text-sm
          font-medium
          text-[#4A3F35]
          dark:text-white
          mb-3
          "
        >
          Payment Type
        </label>

        <div className="space-y-3">

          <label
            className="
            flex
            items-center
            gap-3
            p-4
            rounded-2xl
            border
            border-[#EAE3D6]
            dark:border-[#333]
            bg-white
            dark:bg-[#1F1F1F]
            cursor-pointer
            "
          >
           <input
  type="radio"
  value="advance"
  checked={paymentType === 'advance'}
  onChange={(e) => {
    setPaymentType(e.target.value);
    setCustomAmount('');
  }}
  className="
  w-5 h-5
  accent-[#C48A7A]
  cursor-pointer
  "
/>

            <span className="text-[#4A3F35] dark:text-white">
              Advance Payment
              <span className="ml-2 text-[#C48A7A] font-medium">
                ₹{Math.ceil(order.totalAmount * 0.3)}
              </span>
            </span>
          </label>

          {remaining > 0 && (
            <label
              className="
              flex
              items-center
              gap-3
              p-4
              rounded-2xl
              border
              border-[#EAE3D6]
              dark:border-[#333]
              bg-white
              dark:bg-[#1F1F1F]
              cursor-pointer
              "
            >
             <input
  type="radio"
  value="full"
  checked={paymentType === 'full'}
  onChange={(e) => setPaymentType(e.target.value)}
  className="
  w-5 h-5
  accent-[#C48A7A]
  cursor-pointer
  "
/>

              <span className="text-[#4A3F35] dark:text-white">
                Full Payment
                <span className="ml-2 text-[#4E7A61] font-medium">
                  ₹{remaining}
                </span>
              </span>
            </label>
          )}

        </div>
      </div>

      {/* Custom Amount */}
      {paymentType === "advance" && (
        <div>
          <label
            className="
            block
            text-sm
            font-medium
            text-[#4A3F35]
            dark:text-white
            mb-2
            "
          >
            Custom Amount (Optional)
          </label>

          <input
            type="number"
            value={customAmount}
            onChange={(e) =>
              setCustomAmount(e.target.value)
            }
            placeholder="Enter amount"
            min="0"
            className="
            w-full
            h-12
            px-4
            rounded-2xl
            border
            border-[#EAE3D6]
            dark:border-[#333]
            bg-white
            dark:bg-[#1F1F1F]
            text-[#4A3F35]
            dark:text-white
            focus:outline-none
            focus:ring-2
            focus:ring-[#C48A7A]
            "
          />
        </div>
      )}

      {/* Amount Card */}
      <div
        className="
        rounded-2xl
        bg-[#F3EFD9]
        dark:bg-[#2F2A1D]
        p-5
        text-center
        "
      >
        <p className="text-sm text-[#8B7D6B]">
          Payment Amount
        </p>

        <h2
          className="
          text-3xl
          font-bold
          text-[#C48A7A]
          mt-1
          "
        >
          ₹{amount}
        </h2>
      </div>

    </div>
  </DialogContent>

 <DialogActions
  className="
  bg-[#FAF8F5]
  dark:bg-[#252525]
  border-t
  border-[#EAE3D6]
  dark:border-[#333]
  px-6
  py-5
  "
>
   <button
  onClick={onClose}
  className="
  px-6 py-3
  rounded-2xl
  border
  border-[#EAE3D6]
  dark:border-[#333]
  bg-white
  dark:bg-[#1F1F1F]
  text-[#4A3F35]
  dark:text-white
  hover:bg-[#F8F1EF]
  dark:hover:bg-[#2A2A2A]
  transition
  "
>
  Cancel
</button>

   <button
  onClick={handlePayment}
  disabled={loading || amount <= 0}
  className="
  flex items-center gap-2
  px-7 py-3
  rounded-2xl
  bg-[#C48A7A]
  hover:bg-[#B17869]
  text-white
  font-medium
  disabled:opacity-50
  transition
  "
>
  <CreditCard className="w-4 h-4" />

  {loading
    ? 'Processing...'
    : `Pay ₹${amount}`}
</button>
  </DialogActions>
</Dialog>
  );
}
