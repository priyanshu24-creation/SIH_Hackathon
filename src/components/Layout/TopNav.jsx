import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useUI } from '../../context/UIContext';
import { 
  Search, 
  Bell, 
  Globe, 
  UserCheck, 
  Menu, 
  CheckCircle, 
  ChevronDown, 
  ExternalLink,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';

export default function TopNav({ onOpenMobileSidebar }) {
  const { 
    activeRole, 
    setActiveRole, 
    roles, 
    activeLanguage, 
    setActiveLanguage, 
    languages, 
    setIsCommandPaletteOpen,
    notifications,
    unreadCount,
    markAllNotificationsRead
  } = useUI();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const location = useLocation();

  // Dynamic breadcrumb generation
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbItems = pathSegments.map((seg, i) => {
    const url = `/${pathSegments.slice(0, i + 1).join('/')}`;
    const name = seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    return { name, url };
  });

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 lg:px-6 flex items-center justify-between">
      {/* Left: Mobile Hamburger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb */}
        <nav className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
          <Link to="/app" className="hover:text-slate-900 font-medium transition-colors">
            Portal
          </Link>
          {breadcrumbItems.map((item, idx) => (
            <React.Fragment key={idx}>
              <span className="text-slate-300">/</span>
              {idx === breadcrumbItems.length - 1 ? (
                <span className="font-semibold text-slate-800">{item.name}</span>
              ) : (
                <Link to={item.url} className="hover:text-slate-900 transition-colors">
                  {item.name}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Center / Search CTA */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg text-xs transition-colors shadow-xs"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <span>Search survey #, owner, record ID, or mouza...</span>
          </div>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10.5px] font-mono bg-white border border-slate-200 rounded text-slate-500 shadow-xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Mobile search button */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* System Operational Indicator */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50/70 border border-emerald-200/80 rounded-full text-[12px] font-semibold text-emerald-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>System Operational</span>
        </div>

        {/* Language Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowLangMenu(!showLangMenu);
              setShowRoleMenu(false);
              setShowNotifications(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">{activeLanguage.native}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-premium border border-slate-200 py-1.5 z-50">
              <div className="px-3 py-1 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                Language / ভাষা / भाषा
              </div>
              <div className="max-h-56 overflow-y-auto">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setActiveLanguage(lang);
                      setShowLangMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors ${
                      activeLanguage.code === lang.code
                        ? "bg-brand-50 text-brand-700 font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{lang.native}</span>
                    <span className="text-[12px] text-slate-400">{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleMenu(!showRoleMenu);
              setShowLangMenu(false);
              setShowNotifications(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-brand-600" />
            <span className="hidden md:inline">{activeRole.badge}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-premium border border-slate-200 py-1.5 z-50">
              <div className="px-3 py-1 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                Simulated User Role
              </div>
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => {
                    setActiveRole(role);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                    activeRole.id === role.id
                      ? "bg-brand-50 text-brand-700 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex flex-col">
                    <span>{role.name}</span>
                    <span className="text-[10.5px] text-slate-400">Simulate permissions & UI</span>
                  </div>
                  {activeRole.id === role.id && (
                    <CheckCircle className="w-4 h-4 text-brand-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Drawer Toggle */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowRoleMenu(false);
              setShowLangMenu(false);
            }}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10.5px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-premium border border-slate-200 z-50 overflow-hidden">
              <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10.5px] font-semibold bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[12px] text-brand-600 hover:underline font-semibold"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-3 text-xs ${n.read ? "bg-white" : "bg-brand-50/20"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-slate-800">{n.title}</span>
                      <span className="text-[10.5px] text-slate-400 shrink-0">{n.time}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[12px]">
                      <span className={`px-1.5 py-0.2 rounded font-medium ${
                        n.priority === "High" ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-600"
                      }`}>
                        {n.priority} Priority
                      </span>
                      <span className="text-slate-400">• Automated AI alert</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                <Link
                  to="/app/audit"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-slate-600 hover:text-brand-600"
                >
                  View full audit log →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
