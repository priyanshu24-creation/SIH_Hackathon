import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar/Sidebar';

export const MainLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden gov-bg-main text-[var(--color-text-primary)]">
      {/* Desktop Sidebar (hidden on mobile, fixed ~248px on md+) */}
      <div className="hidden md:flex h-full shrink-0 border-r gov-border bg-[var(--color-card)] shadow-[4px_0_24px_rgba(23,35,31,0.02)] z-10">
        <Sidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[var(--color-text-primary)]/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
            onClick={() => setMobileSidebarOpen(false)}
          />
          {/* Sidebar Drawer */}
          <div className="relative flex flex-col w-[280px] max-w-[80vw] h-full z-10 bg-[var(--color-card)] shadow-2xl animate-in slide-in-from-left duration-300 ease-out">
            <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden gov-bg-main relative">

        <main className="flex-1 overflow-y-auto gov-bg-main p-4 sm:p-6 lg:p-8 scroll-smooth animate-fade-in relative z-0">
          <div className="max-w-[1360px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

