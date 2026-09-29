import React, { createContext, useContext, useState, useEffect } from 'react';

const UIContext = createContext();

export const ROLES = [
  { id: "officer", name: "Revenue Verification Officer", badge: "Officer", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "admin", name: "Administrator", badge: "Admin", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { id: "gis", name: "Survey / GIS Officer", badge: "GIS", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { id: "citizen", name: "Citizen / Public Viewer", badge: "Public", color: "bg-slate-100 text-slate-700 border-slate-300" }
];

export const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" }
];

export function UIProvider({ children }) {
  const [activeRole, setActiveRole] = useState(ROLES[0]);
  const [activeLanguage, setActiveLanguage] = useState(LANGUAGES[0]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "12 records require verification", time: "10m ago", read: false, type: "warning", priority: "High" },
    { id: 2, title: "3 duplicate records detected in Mouza Bally", time: "25m ago", read: false, type: "error", priority: "High" },
    { id: 3, title: "5 documents completed OCR processing", time: "1h ago", read: true, type: "success", priority: "Normal" },
    { id: 4, title: "Validation issue detected in LR-2026-008421", time: "2h ago", read: true, type: "warning", priority: "Medium" }
  ]);

  // Global keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <UIContext.Provider value={{
      activeRole,
      setActiveRole,
      roles: ROLES,
      activeLanguage,
      setActiveLanguage,
      languages: LANGUAGES,
      isCommandPaletteOpen,
      setIsCommandPaletteOpen,
      isSidebarCollapsed,
      setIsSidebarCollapsed,
      isNotificationsOpen,
      setIsNotificationsOpen,
      notifications,
      unreadCount,
      markAllNotificationsRead
    }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
