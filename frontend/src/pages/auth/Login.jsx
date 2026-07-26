import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../redux/slices/authSlice';
import { Scissors } from 'lucide-react';
import logo from "../../assets/tb_logo.png";
import { Alert, CircularProgress } from '@mui/material';
import { Eye, EyeOff } from "lucide-react";
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const dispatch = useDispatch();

  const { loading, error } = useSelector(
    (s) => s.auth
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(login(form));
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
      {/* Left Branding Section */}
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
            Manage your
            boutique with
            elegance.
          </h1>

          <p
            className="
            mt-6
            text-lg
            text-[#8B7D6B]
            leading-relaxed
            "
          >
            Orders, customers, workers,
            invoices and payments —
            all in one modern dashboard.
          </p>

          <div className="flex gap-6 mt-12">
            <div>
              <h3 className="text-3xl font-bold text-[#C48A7A]">
                100%
              </h3>
              <p className="text-[#8B7D6B]">
                Organized Workflow
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-[#C9A227]">
                Smart
              </h3>
              <p className="text-[#8B7D6B]">
                Tailoring Operations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
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
              Welcome Back
            </h2>

            <p className="text-[#8B7D6B] mt-2">
              Sign in to continue
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
                placeholder="Enter your email"
              />
            </div>

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
    Password
  </label>

  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
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
        pr-12
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
      placeholder="Enter your password"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="
        absolute
        right-4
        top-1/2
        -translate-y-1/2
        text-[#8B7D6B]
        dark:text-gray-400
        hover:text-[#C48A7A]
        transition-colors
      "
    >
      {showPassword ? (
        <EyeOff size={20} />
      ) : (
        <Eye size={20} />
      )}
    </button>
  </div>
</div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="
                text-sm
                text-[#C48A7A]
                hover:underline
                "
              >
                Forgot Password?
              </Link>
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
                'Sign In'
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
            Don't have an account?{' '}
            <Link
              to="/register"
              className="
              text-[#C48A7A]
              font-medium
              hover:underline
              "
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}