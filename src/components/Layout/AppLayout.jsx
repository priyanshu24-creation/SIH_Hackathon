import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import CommandPalette from './CommandPalette';
import Toast from '../Common/Toast';

export default function AppLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar 
        mobileOpen={mobileSidebarOpen} 
        onCloseMobile={() => setMobileSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <TopNav onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />
        
        <main className="flex-1 p-4 lg:p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <CommandPalette />
      <Toast />
    </div>
  );
}
