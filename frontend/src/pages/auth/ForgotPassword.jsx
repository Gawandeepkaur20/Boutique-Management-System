import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "../../assets/tb_logo.png";
import { Alert, CircularProgress } from '@mui/material';
import api from '../../services/api';
import { showSuccess } from '../../utils/toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [devToken, setDevToken] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { data } = await api.post(
        '/auth/forgot-password',
        { email }
      );

      setMessage(data.message);

      if (data.resetToken) {
        setDevToken(data.resetToken);
      }

      showSuccess(
        'Reset instructions sent successfully'
      );
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          'Request failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
      min-h-screen
      flex
      bg-[#F8F6F2]
      dark:bg-[#171717]
      "
    >
      {/* Left Side */}
      <div
        className="
        hidden
        lg:flex
        flex-col
        justify-center
        flex-1
        px-20
        bg-[#FAF8F5]
        dark:bg-[#1F1F1F]
        border-r
        border-[#EAE3D6]
        dark:border-[#333]
        "
      >
        <div className="max-w-lg">
      <div className="px-6 py-7 border-b border-[#EAE3D6] dark:border-[#2E2E2E]">
  <div className="flex items-center gap-4">
    <img
      src={logo}
      alt="Trendora Boutique"
      className="
        w-16
        h-16
        rounded-2xl
        object-cover
        shadow-lg
      "
    />

    <div>
      <h1 className="text-2xl font-bold text-[#4A3F35] dark:text-white">
        Trendora
      </h1>

      <p className="text-sm text-[#8B7D6B] dark:text-gray-400">
        Boutique
      </p>
    </div>
  </div>
</div>

          <h1
            className="
            text-4xl
            font-bold
            text-[#4A3F35]
            dark:text-white
            mt-4
            leading-tight
            "
          >
            Reset your
            account password.
          </h1>

          <p
            className="
            mt-6
            text-lg
            text-[#8B7D6B]
            leading-relaxed
            "
          >
            Enter your registered email address
            and we'll send instructions to
            securely reset your password.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div
        className="
        flex
        items-center
        justify-center
        flex-1
        p-6
        "
      >
        <div
          className="
          w-full
          max-w-md
          bg-[#FAF8F5]
          dark:bg-[#252525]
          border
          border-[#EAE3D6]
          dark:border-[#333]
          rounded-[32px]
          p-8
          shadow-[0_10px_40px_rgba(0,0,0,0.08)]
          "
        >
          <div className="text-center mb-8">
            <div className="mb-5 flex justify-center">
  <img
    src={logo}
    alt="Trendora Boutique"
    className="
      w-24
      h-24
      rounded-3xl
      object-cover
      shadow-xl
    "
  />
</div>

            <h2
              className="
              text-3xl
              font-bold
              text-[#4A3F35]
              dark:text-white
              "
            >
              Forgot Password
            </h2>

            <p className="text-[#8B7D6B] mt-2">
              We'll send a reset link to your email
            </p>
          </div>

          {message && (
            <Alert severity="info" sx={{ mb: 3 }}>
              {message}
            </Alert>
          )}

          {devToken && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              Development Mode:{' '}
              <Link
                to={`/reset-password/${devToken}`}
                className="underline font-medium"
              >
                Reset Password
              </Link>
            </Alert>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label
                className="
                block
                mb-2
                text-sm
                font-medium
                text-[#4A3F35]
                dark:text-white
                "
              >
                Email Address
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
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

            <button
              type="submit"
              disabled={loading}
              className="
              w-full
              h-12
              rounded-2xl
              bg-[#C48A7A]
              hover:bg-[#B17869]
              text-white
              font-medium
              flex
              items-center
              justify-center
              transition
              "
            >
              {loading ? (
                <CircularProgress
                  size={22}
                  color="inherit"
                />
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          <p
            className="
            text-center
            mt-6
            text-sm
            text-[#8B7D6B]
            "
          >
            Remember your password?{' '}
            <Link
              to="/login"
              className="
              text-[#C48A7A]
              font-medium
              hover:underline
              "
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}