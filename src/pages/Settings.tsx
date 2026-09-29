import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Sliders,
  Languages,
  Palette,
  Save,
  Shield,
  Check,
  Building,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const Settings: React.FC = () => {
  const { showToast } = useToast();

  // Profile State
  const [profile, setProfile] = useState({
    name: 'Sujan Thapa',
    title: 'Revenue Officer (Class I)',
    employeeId: 'WB-REV-2024-891',
    email: 'animesh.roy@lrc.wb.gov.in',
    phone: '+91 98301 45672',
    division: 'Darjeeling Sadar Circle'
  });

  // Notifications State
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    lowConfidenceWarning: true,
    dailySummary: true,
    mismatchNotifications: true
  });

  // Processing Preferences State
  const [preferences, setPreferences] = useState({
    confidenceThreshold: 75,
    autoValidation: true,
    defaultDistrict: 'Darjeeling',
    ocrModelEngine: 'Bilingual Bengali/English Indic Transformer v4.2'
  });

  // Language & Theme State
  const [language, setLanguage] = useState<string>('English');
  const [theme, setTheme] = useState<string>('Administrative Light');

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Settings Saved', 'Official administrative preferences updated successfully.', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title Card */}
      <div className="gov-card px-8 py-6 mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div>
          
          <h1 className="page-title">
            Officer Profile &amp; Preferences
          </h1>
          <p className="mt-1" style={{ fontSize: 14, color: 'var(--color-muted)' }}>
            Configure revenue officer credentials, AI digitization sensitivity thresholds, and regional administrative settings.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 mt-2 sm:mt-0">
          <button
            type="button"
            onClick={handleSaveAll}
            className="gov-btn-primary"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Main Settings Sections */}
      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* Section 1: Profile Settings */}
        <div className="gov-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-[var(--color-primary)]" />
            Revenue Officer Profile Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[var(--color-text-primary)] font-bold mb-1">Officer Name:</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl font-semibold text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>

            <div>
              <label className="block text-[var(--color-text-primary)] font-bold mb-1">Civil Designation:</label>
              <input
                type="text"
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>

            <div>
              <label className="block text-[var(--color-text-primary)] font-bold mb-1">Employee Cadre ID:</label>
              <input
                type="text"
                disabled
                value={profile.employeeId}
                className="w-full px-3 py-2 border border-[var(--color-border)] bg-[var(--color-border-subtle)] rounded-xl font-mono text-[var(--color-text-secondary)] cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[var(--color-text-primary)] font-bold mb-1">Official NIC Email:</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>

            <div>
              <label className="block text-[var(--color-text-primary)] font-bold mb-1">Official Contact Phone:</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>

            <div>
              <label className="block text-[var(--color-text-primary)] font-bold mb-1">Subdivision / Revenue Circle:</label>
              <input
                type="text"
                value={profile.division}
                onChange={(e) => setProfile({ ...profile, division: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: AI Digitization Preferences */}
        <div className="gov-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-3 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[var(--color-primary)]" />
            Digitization &amp; Verification Sensitivity Thresholds
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[var(--color-text-primary)] font-bold">
                  OCR Minimum Confidence Cutoff:
                </label>
                <span className="font-mono font-bold text-[var(--color-primary)] text-sm bg-[var(--color-success-bg)] px-2 py-0.5 rounded border border-[var(--color-success-border)]">
                  {preferences.confidenceThreshold}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                step="5"
                value={preferences.confidenceThreshold}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    confidenceThreshold: parseInt(e.target.value)
                  })
                }
                className="w-full h-2 bg-[var(--color-border)] rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
              />
              <p className="text-[12px] text-[var(--color-text-secondary)] mt-1.5">
                Extracted fields scoring below this threshold are automatically queued for mandatory manual officer review.
              </p>
            </div>

            <div>
              <label className="block text-[var(--color-text-primary)] font-bold mb-1">Default Jurisdiction Circle:</label>
              <select
                value={preferences.defaultDistrict}
                onChange={(e) =>
                  setPreferences({ ...preferences, defaultDistrict: e.target.value })
                }
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                <option value="Darjeeling">Darjeeling Sadar</option>
                <option value="Darjeeling">Darjeeling Sonada</option>
                <option value="Darjeeling">Darjeeling (Darjeeling Pulbazar)</option>
                <option value="Darjeeling">Darjeeling (Sonada)</option>
              </select>
            </div>

            <div className="sm:col-span-2 flex items-center justify-between p-4 bg-[var(--color-border-subtle)] rounded-xl border border-[var(--color-border)]">
              <div>
                <h4 className="font-bold text-[var(--color-text-primary)]">Automatic Cadastral Shapefile Validation</h4>
                <p className="text-[12px] text-[var(--color-text-secondary)] mt-0.5">
                  Cross-verify extracted plot area &amp; boundaries against GIS digital cadastre layers automatically upon document ingestion.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.autoValidation}
                  onChange={(e) =>
                    setPreferences({ ...preferences, autoValidation: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-[var(--color-border)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--color-border)] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--color-accent)]" />
              </label>
            </div>
          </div>
        </div>

        {/* Section 3: Notification Alerts */}
        <div className="gov-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-[var(--color-primary)]" />
            Official Alert Notifications
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3.5 rounded-xl hover:bg-[var(--color-border-subtle)] cursor-pointer border border-[var(--color-border)]/60 hover:border-[var(--color-border)] transition-colors">
              <div>
                <span className="font-bold text-[var(--color-text-primary)] block">Discrepancy &amp; Boundary Overlap Alerts</span>
                <span className="text-[12px] text-[var(--color-text-secondary)]">Receive urgent notification when plot geometry mismatches by &gt;0.05 acre.</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.emailAlerts}
                onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
                className="w-4 h-4 text-[var(--color-primary)] rounded accent-[var(--color-primary)]"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl hover:bg-[var(--color-border-subtle)] cursor-pointer border border-[var(--color-border)]/60 hover:border-[var(--color-border)] transition-colors">
              <div>
                <span className="font-bold text-[var(--color-text-primary)] block">Low Confidence Document Ingestion Alerts</span>
                <span className="text-[12px] text-[var(--color-text-secondary)]">Notify when historical handwritten records fail basic OCR clarity checks.</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.lowConfidenceWarning}
                onChange={(e) => setNotifications({ ...notifications, lowConfidenceWarning: e.target.checked })}
                className="w-4 h-4 text-[var(--color-primary)] rounded accent-[var(--color-primary)]"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl hover:bg-[var(--color-border-subtle)] cursor-pointer border border-[var(--color-border)]/60 hover:border-[var(--color-border)] transition-colors">
              <div>
                <span className="font-bold text-[var(--color-text-primary)] block">Daily Morning Briefing</span>
                <span className="text-[12px] text-[var(--color-text-secondary)]">Receive a daily 8:30 AM summary of pending verifications and approved Khatians.</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.dailySummary}
                onChange={(e) => setNotifications({ ...notifications, dailySummary: e.target.checked })}
                className="w-4 h-4 text-[var(--color-primary)] rounded accent-[var(--color-primary)]"
              />
            </label>
          </div>
        </div>

        {/* Section 4: Language & Regional Localization */}
        <div className="gov-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-3 flex items-center gap-2">
            <Languages className="w-4 h-4 text-[var(--color-primary)]" />
            Language &amp; Regional Localization
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[var(--color-text-primary)] font-bold mb-1">Administrative Display Language:</label>
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  showToast('Language Selected', `Interface locale set to ${e.target.value}.`, 'info');
                }}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                <option value="English">English (Official Civil Default)</option>
                <option value="Bengali">Bengali (বাংলা · রাজ্য সরকারি ভাষা)</option>
                <option value="Hindi">Hindi (हिन्दी)</option>
              </select>
            </div>

            <div>
              <label className="block text-[var(--color-text-primary)] font-bold mb-1">Interface Color Scheme:</label>
              <select
                value={theme}
                onChange={(e) => {
                  setTheme(e.target.value);
                  showToast('Theme Applied', `${e.target.value} active.`, 'info');
                }}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                <option value="Administrative Light">Administrative Warm Light (var(--color-border-subtle))</option>
                <option value="High Contrast">High Contrast Accessibility (WCAG AAA)</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
