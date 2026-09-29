import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  ClipboardCheck,
  ShieldAlert,
  Database,
  Map,
  BarChart3,
  History,
  Users,
  Settings,
  X,
} from 'lucide-react';
import { useLandRecord } from '../../context/LandRecordContext';

interface SidebarProps {
  onCloseMobile?: () => void;
}

const navSections = [
  {
    title: 'Main',
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/documents', label: 'Scanned Documents', icon: FileText, end: false },
    ],
  },
  {
    title: 'Records & Verification',
    items: [
      { to: '/review-queue', label: 'Verification Queue', icon: ClipboardCheck, end: false, badge: true },
      { to: '/validation', label: 'Discrepancy Validation', icon: ShieldAlert, end: false },
      { to: '/land-records', label: 'Land Records Register', icon: Database, end: false },
    ],
  },
  {
    title: 'Map & Analysis',
    items: [
      { to: '/gis-map', label: 'Cadastral GIS Maps', icon: Map, end: false },
      { to: '/reports', label: 'Reports', icon: BarChart3, end: false },
    ],
  },
  {
    title: 'Monitoring',
    items: [
      { to: '/audit-logs', label: 'Audit Trail', icon: History, end: false },
    ],
  },
  {
    title: 'Administration',
    items: [
      { to: '/users', label: 'Officers & Staff', icon: Users, end: false },
      { to: '/settings', label: 'System Settings', icon: Settings, end: false },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { reviewQueue } = useLandRecord();
  const pendingCount = reviewQueue.filter((q) => q.status === 'Pending').length || 12;

  return (
    <aside
      className="w-[256px] flex flex-col h-full select-none"
      style={{ background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)' }}
    >
      {/* ── Brand ───────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid var(--color-border)' }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Icon */}
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'var(--color-primary-light)', border: '1px solid var(--color-success-border)' }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="var(--color-primary)" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 18A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 18a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
          </div>

          <div className="min-w-0 pr-2">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="truncate" style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.2px' }}>
                LAND RECORDS
              </span>
              <span className="badge badge-attention shrink-0" style={{ fontSize: 9, padding: '1.5px 4px' }}>SIH 2026</span>
            </div>
            <p className="truncate" style={{ fontSize: 11, color: 'var(--color-muted)', lineHeight: 1.2 }}>
              Digitization &amp; Verification
            </p>
            <p className="truncate" style={{ fontSize: 11, color: 'var(--color-muted)', lineHeight: 1.2 }}>
              SIH Prototype
            </p>
          </div>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg"
            style={{ color: 'var(--color-muted)' }}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Navigation ──────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" style={{ gap: 0 }}>
        {navSections.map((section, si) => (
          <div key={section.title} style={{ marginBottom: si < navSections.length - 1 ? 24 : 0 }}>
            {section.title !== 'Main' && (
              <p className="eyebrow px-2 mb-2" style={{ color: 'var(--color-text-secondary)', fontWeight: 700, fontSize: 13 }}>{section.title}</p>
            )}

            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onCloseMobile}
                  title={item.label}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-[9px] text-[15px] transition-all duration-150 ${
                      isActive
                        ? 'nav-active'
                        : 'text-[var(--color-text-primary)] font-normal hover:bg-[var(--color-bg)]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <item.icon
                          className="w-4 h-4 shrink-0"
                          style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}
                        />
                        <span className="truncate" style={{ fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
                      </div>

                      {item.badge && pendingCount > 0 && (
                        <span className="badge badge-critical" style={{ fontSize: 11.5 }}>
                          {pendingCount}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Footer status ────────────────────────────── */}
      <div
        className="px-4 py-3"
        style={{ borderTop: '1px solid var(--color-border)' }}
      >
        <div
          className="rounded-xl px-3 py-2.5"
          style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <span className="dot-success" />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>Office System</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-success)' }}>Active</span>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>Demo Revenue Circle</span>
            <span style={{ fontSize: 11.5, color: 'var(--color-subtle)' }}>Prototype</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 mt-2.5 px-1">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[13px] font-bold"
            style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
          >
            AR
          </div>
          <div className="min-w-0">
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }} className="truncate">
              Animesh Roy
            </p>
            <p style={{ fontSize: 12, color: 'var(--color-muted)' }}>Revenue Officer</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
