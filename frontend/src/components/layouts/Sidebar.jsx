import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { toggleTheme } from '../../redux/slices/themeSlice';

import {
  LayoutGrid,
  ClipboardList,
  Users,
  Scissors,
  Ruler,
  Receipt,
  Wallet,
  Bell,
  Settings,
  LogOut,
  Sun,
  Moon,
    UserCircle,
  PackageSearch,
  Sparkles,
} from 'lucide-react';

// const roleColors = {
//   admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
//   customer: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
//   worker: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
// };

const dashboardHome = { admin: '/admin/dashboard', worker: '/worker', customer: '/customer/dashboard' };

const Sidebar = ({ links, title, onNavigate }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { mode } = useSelector((s) => s.theme);
  const homePath = dashboardHome[user?.role] || '/';

//  const icons = {
//   Dashboard: LayoutGrid,
//   Orders: ClipboardList,
//   Customers: UserRound,
//   Workers: BadgeCheck,
//   Measurements: Ruler,
//   Payments: Wallet,
//   Invoices: Receipt,
//   Notifications: Bell,
// };
const icons = {
  Dashboard: LayoutGrid,
  Orders: ClipboardList,
  Customers: Users,
  Workers: Scissors,
  Measurements: Ruler,
  Payments: Wallet,
  Invoices: Receipt,
  Notifications: Bell,
  Settings: Settings,
  TrackOrder: PackageSearch,
  Profile: UserCircle,
   FashionAdvisor: Sparkles,

};
  return (
<aside className="
w-72
h-screen

bg-[#FAF8F5]
dark:bg-[#1F1F1F]
border-r
border-[#EAE3D6]
dark:border-[#2E2E2E]
flex
flex-col
sticky
top-0
">
    <div className="px-6 py-8 border-b border-[#EAE3D6] dark:border-[#2E2E2E] flex items-center gap-3">
      
      <Scissors
    className="w-5 h-5 text-[#C9A227]"
    strokeWidth={1.75}
  />
  <button
    type="button"
    onClick={() => {
      navigate(homePath);
      onNavigate?.();
    }}
    className="w-full text-left"
  >
    <div>
    <h1 className="text-lg font-bold tracking-[0.25em] text-[#4A3F35] ">
      ATELIER
    </h1>

    <p className="text-xs tracking-[0.15em] uppercase text-[#8B7D6B] dark:text-[#A0A0A0] mt-1">
      Boutique Management
    </p>
    </div>
  </button>
</div>

      <nav className="px-4 py-6 space-y-2">
        {links.map(({ to, label, icon, end: linkEnd }) => {
          const Icon = icons[icon] || LayoutGrid;
          return (
            <NavLink
              key={to}
              to={to}
              onClick={onNavigate}
              end={linkEnd ?? (to.endsWith('/admin') || to.endsWith('/customer') || to.endsWith('/worker'))}
              className={({ isActive }) =>
  `
  flex
  items-center
  gap-3
  px-4
  py-3
  rounded-xl
  transition-all
  ${
    isActive
      ? `
   bg-[#F3EFD9]
dark:bg-[#2F2A1D]
text-[#4A3F35]
dark:text-[#F5F5F5]
border-[#C9A227]
      `
      : `
      text-[#6B5E52]
dark:text-[#D1D1D1]
hover:bg-[#F7F4EC]
dark:hover:bg-[#2A2A2A]
      `
  }
`
}
            >
             <Icon
  strokeWidth={1.75}
  className="w-[18px] h-[18px] shrink-0"
/>
              {label}
            </NavLink>
          );
        })}
      </nav>

<div className="mt-auto p-4 border-t border-[#EAE3D6] dark:border-[#2E2E2E] space-y-3">
        <div className="flex items-center gap-3 px-2">
       <div
  onClick={() => {
    if (user?.role === "customer") {
      navigate("/customer/profile");
    } else if (user?.role === "admin") {
      navigate("/admin/profile");
    } else if (user?.role === "worker") {
      navigate("/worker/profile");
    }
  }}
  className="
  flex
  items-center
  gap-3
  cursor-pointer
  rounded-2xl
  p-2
 
  transition
  "
>
  <div className="
  flex
  items-center
  justify-center
  h-10
  w-10
  rounded-full
  bg-[#C48A7A]
  text-white
  font-semibold
  ">
    {user?.name?.charAt(0).toUpperCase()}
  </div>

  <div className="flex flex-col text-sm truncate">
    <p className="font-medium text-lg truncate text-[#4A3F35] dark:text-white">
      {user?.name}
    </p>

    <span className="text-sm text-gray-500 capitalize">
      {user?.role}
    </span>
  </div>
</div>
        </div>

        <button
          onClick={() => dispatch(toggleTheme())}
          className="
flex items-center gap-3
w-full
px-4 py-2
rounded-xl
text-[#6B5E52]
hover:bg-[#F7F4EC]
"
        >
          {mode === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          onClick={() => dispatch(logout())}
     className="
flex items-center gap-3
w-full
px-4 py-2
rounded-xl
text-[#6B5E52]
dark:text-[#D1D1D1]
hover:bg-[#F7F4EC]
dark:hover:bg-[#2A2A2A]
"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
