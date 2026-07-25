import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { X } from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function AppShell({ links, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="
      flex
      min-h-screen
      bg-[#FAF8F5]
      dark:bg-[#1B1B1B]
      transition-colors
      duration-300
      "
    >
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="
          fixed
          inset-0
          bg-black/50
          backdrop-blur-sm
          z-40
          lg:hidden
          "
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed
        lg:static
        inset-y-0
        left-0
        z-50
        transform
        transition-transform
        duration-300
        ease-in-out
        ${
          sidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }
      `}
      >
        <Sidebar
          links={links}
          title={title}
          onNavigate={() => setSidebarOpen(false)}
        />

        {/* Mobile Close */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="
          lg:hidden
          absolute
          top-5
          -right-14
          h-11
          w-11
          rounded-xl
          bg-white
          dark:bg-[#252525]
          border
          border-[#EAE3D6]
          dark:border-[#333]
          flex
          items-center
          justify-center
          shadow-lg
          "
        >
          <X className="w-5 h-5 text-[#4A3F35] dark:text-white" />
        </button>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        <main
          className="
          flex-1
          overflow-y-auto
          bg-[#FAF8F5]
          dark:bg-[#1B1B1B]
          transition-colors
          duration-300
          "
        >
          <div
            className="
            p-4
            md:p-6
            lg:p-7
            max-w-[1800px]
            mx-auto
            "
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}