import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../../redux/slices/authSlice';
import { Scissors } from 'lucide-react';
import { Alert, CircularProgress } from '@mui/material';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer',
  });

  const dispatch = useDispatch();

  const { loading, error } = useSelector(
    (s) => s.auth
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(register(form));
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
          <div
            className="
            w-20
            h-20
            rounded-3xl
            bg-[#F3EFD9]
            dark:bg-[#2F2A1D]
            flex
            items-center
            justify-center
            mb-8
            "
          >
            <Scissors
              className="w-10 h-10 text-[#C9A227]"
            />
          </div>

          <p className="text-sm text-[#8B7D6B] uppercase tracking-[0.25em]">
            Boutique Management
          </p>

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
            Create your
            boutique account.
          </h1>

          <p
            className="
            mt-6
            text-lg
            text-[#8B7D6B]
            leading-relaxed
            "
          >
            Join the platform and manage
            customers, tailoring orders,
            workers, invoices and payments
            effortlessly.
          </p>

          <div className="flex gap-8 mt-12">
            <div>
              <h3 className="text-3xl font-bold text-[#C48A7A]">
                Fast
              </h3>

              <p className="text-[#8B7D6B]">
                Customer Management
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-[#C9A227]">
                Smart
              </h3>

              <p className="text-[#8B7D6B]">
                Order Tracking
              </p>
            </div>
          </div>
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
            <div
              className="
              w-16
              h-16
              mx-auto
              rounded-2xl
              bg-[#F3EFD9]
              dark:bg-[#2F2A1D]
              flex
              items-center
              justify-center
              mb-4
              "
            >
              <Scissors
                className="
                w-8
                h-8
                text-[#C9A227]
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
              Create Account
            </h2>

            <p className="text-[#8B7D6B] mt-2">
              Start managing your boutique today
            </p>
          </div>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
            >
              {error}
            </Alert>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <input
              type="text"
              placeholder="Full Name"
              required
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
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

            <input
              type="email"
              placeholder="Email Address"
              required
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
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

            <input
              type="text"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value,
                })
              }
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

            <input
              type="password"
              placeholder="Password"
              required
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
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
                'Create Account'
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
            Already have an account?{' '}
            <Link
              to="/login"
              className="
              text-[#C48A7A]
              font-medium
              hover:underline
              "
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}