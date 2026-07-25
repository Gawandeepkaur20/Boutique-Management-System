import { useSelector } from 'react-redux';
import { Menu } from 'lucide-react';
import NotificationDropdown from '../NotificationDropdown';
import GlobalSearch from '../GlobalSearch';

export default function TopBar({ onMenuClick }) {
  const { user } = useSelector((s) => s.auth);

  const greeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <header
      className="
      h-20
      bg-[#FAF8F5]
      dark:bg-[#1F1F1F]
      border-b
      border-[#EAE3D6]
      dark:border-[#2E2E2E]
      flex
      items-center
      justify-between
      px-6
      "
    >
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={onMenuClick}
          className="
          lg:hidden
          p-2
          rounded-xl
          hover:bg-[#F3EFD9]
          dark:hover:bg-[#2A2A2A]
          "
        >
          <Menu className="w-5 h-5 text-[#4A3F35] dark:text-white" />
        </button>

        <div>
          <p className="text-sm text-[#8B7D6B] dark:text-gray-400">
            {greeting()}
          </p>

          <h2
            className="
            text-xl
            font-semibold
            text-[#4A3F35]
            dark:text-white
            truncate
            "
          >
            {user?.name}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <GlobalSearch />
        <NotificationDropdown />
      </div>
    </header>
  );
}