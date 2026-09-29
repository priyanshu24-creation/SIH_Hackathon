import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Menu,
  User,
  Settings,
  LogOut,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const location = useLocation();
  const { showToast } = useToast();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Darjeeling Sadar');
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setLocationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    setProfileOpen(false);
    showToast('Signed Out', 'You have been signed out from the administrative session.', 'info');
  };

  return (
    <header className="h-16 bg-[#24483C] text-white border-b border-[var(--color-primary-hover)] px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs" style={{ borderTop: '2px solid #C9A227' }}>
      {/* Left side: Mobile Toggle + Department Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-1.5 text-xs text-white/80">
            <span className="font-medium text-white">Land Record Digitization</span>
            <span className="text-white/40">/</span>
            <div className="relative" ref={locationRef}>
              <button 
                onClick={() => setLocationOpen(!locationOpen)}
                className="font-medium text-white flex items-center gap-1 hover:text-[var(--color-saffron)] transition-colors"
              >
                {selectedLocation} <ChevronDown className="w-3 h-3" />
              </button>
              {locationOpen && (
                <div className="absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-[var(--color-border)] text-[var(--color-text-primary)] py-1 z-50">
                  {['West Bengal', 'Darjeeling Sadar', 'Siliguri', 'Kurseong', 'Kalimpong', 'Jalpaiguri'].map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setSelectedLocation(loc);
                        setLocationOpen(false);
                        showToast('Location Changed', `Workspace updated to ${loc} Office.`, 'info');
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[var(--color-border-subtle)] transition-colors ${selectedLocation === loc ? 'font-bold text-[var(--color-primary)] bg-[var(--color-success-bg)]' : ''}`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-white leading-tight mt-0.5">
            {selectedLocation} Document Processing Office
          </p>
        </div>
      </div>

      {/* Right side: Session Date + Notifications + Officer Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Date & Circle (desktop) */}
        <div className="hidden lg:flex flex-col text-right pr-2 text-xs">
          <span className="font-semibold text-white">29 Sep 2026</span>
          <span className="text-[12px] text-white/80">{selectedLocation.split(' ')[0]} Circle · India</span>
        </div>

        {/* Divider */}
        <div className="hidden lg:block h-7 w-px bg-white/20" />

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors relative border border-white/20"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-saffron)] rounded-full ring-2 ring-[var(--color-primary)]" />
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-[var(--color-border)] text-[var(--color-text-primary)] py-2 z-50">
              <div className="px-4 py-2 border-b border-[var(--color-border)] flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Official Notices</span>
                <span className="text-[12px] bg-[var(--color-success-bg)] text-[var(--color-primary)] px-2 py-0.5 rounded-full font-semibold">2 Pending</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-[var(--color-border)]/50 text-xs">
                <div className="p-3 hover:bg-[var(--color-border-subtle)] flex items-start gap-2.5 transition-colors cursor-pointer">
                  <div className="p-1.5 rounded-full bg-[var(--color-success-bg)] text-[var(--color-primary)] shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-text-primary)]">Khatian #1456 Field Report</p>
                    <p className="text-[var(--color-text-secondary)] text-[12px] mt-0.5">Amin inspection completed for Mouza Kanchenjunga</p>
                    <span className="text-[10.5px] text-[var(--color-text-secondary)]/70">10 minutes ago</span>
                  </div>
                </div>
                <div className="p-3 hover:bg-[var(--color-border-subtle)] flex items-start gap-2.5 transition-colors cursor-pointer">
                  <div className="p-1.5 rounded-full bg-[var(--color-warning-bg)] text-[var(--color-warning)] shrink-0 mt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-text-primary)]">Boundary Area Variance flagged</p>
                    <p className="text-[var(--color-text-secondary)] text-[12px] mt-0.5">Plot #302: 0.82 acre (Doc) vs 0.75 acre (Cadastral)</p>
                    <span className="text-[10.5px] text-[var(--color-text-secondary)]/70">25 minutes ago</span>
                  </div>
                </div>
              </div>
              <div className="px-4 py-2 border-t border-[var(--color-border)] text-center">
                <Link
                  to="/review-queue"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs font-semibold text-[var(--color-primary)] hover:underline"
                >
                  Open Verification Desk →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Officer Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-lg hover:bg-white/10 border border-transparent hover:border-white/20 transition-all text-left"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] border border-[var(--color-accent-hover)] text-white font-bold flex items-center justify-center text-xs">
                AR
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-[var(--color-success)] rounded-full ring-2 ring-[var(--color-primary)]" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1">
                <p className="text-xs font-bold text-white leading-tight">Shri Animesh Roy</p>
                <ChevronDown className="w-3 h-3 text-white/70" />
              </div>
              <p className="text-[12px] text-white/80 leading-tight">Revenue Officer</p>
            </div>
          </button>

          {/* Profile Menu */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[var(--color-border)] text-[var(--color-text-primary)] py-1.5 z-50">
              <div className="px-4 py-2.5 border-b border-[var(--color-border)]/70">
                <p className="text-xs font-bold text-[var(--color-text-primary)]">Shri Animesh Roy</p>
                <p className="text-[12px] text-[var(--color-text-secondary)]">animesh.roy@lrc.wb.gov.in</p>
                <span className="inline-block mt-1 text-[10.5px] bg-[var(--color-success-bg)] text-[var(--color-primary)] px-2 py-0.5 rounded font-medium">
                  Revenue Officer · {selectedLocation}
                </span>
              </div>
              <div className="py-1">
                <Link
                  to="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-[var(--color-text-primary)] hover:bg-[var(--color-border-subtle)] transition-colors"
                >
                  <User className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  <span>My Profile</span>
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-[var(--color-text-primary)] hover:bg-[var(--color-border-subtle)] transition-colors"
                >
                  <Settings className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  <span>Preferences</span>
                </Link>
                <a
                  href="#help"
                  onClick={(e) => {
                    e.preventDefault();
                    setProfileOpen(false);
                    showToast('Officer Helpdesk', 'Helpline: 1800-345-5555 (Toll-Free, 10 AM - 5 PM).', 'info');
                  }}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-[var(--color-text-primary)] hover:bg-[var(--color-border-subtle)] transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  <span>Help &amp; Documentation</span>
                </a>
              </div>
              <div className="border-t border-[var(--color-border)]/70 pt-1">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[var(--color-error)] hover:bg-[var(--color-error-bg)] transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 text-[var(--color-error)]" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
