import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useUI } from '../../context/UIContext';
import { useRecords } from '../../context/RecordsContext';
import { 
  LayoutDashboard, 
  FolderOpen, 
  UploadCloud, 
  Cpu, 
  FileCheck2, 
  ShieldCheck, 
  CheckSquare, 
  Map, 
  GitCompare, 
  BarChart3, 
  History, 
  Settings, 
  HelpCircle, 
  ChevronDown, 
  ChevronRight,
  Shield,
  Layers,
  Sparkles,
  X
} from 'lucide-react';

export default function Sidebar({ mobileOpen = false, onCloseMobile = () => {} }) {
  const { activeRole } = useUI();
  const { records } = useRecords();
  const location = useLocation();

  // Submenu open states
  const [openGroups, setOpenGroups] = useState({
    documents: true,
    records: true,
    gis: true
  });

  const toggleGroup = (group) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const pendingVerificationCount = records.filter(r => r.status === "Needs Review").length;
  const validationIssuesCount = records.filter(r => r.status === "Needs Review" || r.status === "Rejected").length;

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
      isActive
        ? "bg-brand-50 text-brand-700 font-semibold shadow-xs"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
    }`;

  const subNavLinkClasses = ({ isActive }) =>
    `flex items-center justify-between pl-9 pr-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
      isActive
        ? "text-brand-700 font-semibold bg-brand-50/60"
        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/60"
    }`;

  const [showHelpModal, setShowHelpModal] = useState(false);

  return (
    <>
      <aside className={`
        fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-slate-900">IND</span>
                <span className="font-extrabold text-sm tracking-tight text-brand-600">DIGI-LAND</span>
              </div>
              <span className="text-[10.5px] font-semibold text-slate-400 block tracking-wider uppercase">
                AI Land Intelligence
              </span>
            </div>
          </NavLink>

          {/* Close button for mobile drawer */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {/* Dashboard Main Link */}
          <div>
            <NavLink to="/app" end className={navLinkClasses} onClick={onCloseMobile}>
              <LayoutDashboard className="w-4 h-4 text-slate-500" />
              <span>Dashboard</span>
            </NavLink>
          </div>

          {/* Group: Documents */}
          <div className="space-y-1">
            <button
              onClick={() => toggleGroup("documents")}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[12px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-600"
            >
              <span>Documents</span>
              {openGroups.documents ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
            {openGroups.documents && (
              <div className="space-y-0.5 mt-0.5">
                <NavLink to="/app/documents" className={subNavLinkClasses} onClick={onCloseMobile}>
                  <span className="flex items-center gap-2">
                    <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
                    All Documents
                  </span>
                  <span className="text-[10.5px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                    {records.length}
                  </span>
                </NavLink>
                <NavLink to="/app/upload" className={subNavLinkClasses} onClick={onCloseMobile}>
                  <span className="flex items-center gap-2">
                    <UploadCloud className="w-3.5 h-3.5 text-slate-400" />
                    Upload Document
                  </span>
                </NavLink>
                <NavLink to="/app/processing" className={subNavLinkClasses} onClick={onCloseMobile}>
                  <span className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-slate-400" />
                    Processing Pipeline
                  </span>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                  </span>
                </NavLink>
              </div>
            )}
          </div>

          {/* Group: Land Records */}
          <div className="space-y-1">
            <button
              onClick={() => toggleGroup("records")}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[12px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-600"
            >
              <span>Land Records</span>
              {openGroups.records ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
            {openGroups.records && (
              <div className="space-y-0.5 mt-0.5">
                <NavLink to="/app/records" className={subNavLinkClasses} onClick={onCloseMobile}>
                  <span className="flex items-center gap-2">
                    <FileCheck2 className="w-3.5 h-3.5 text-slate-400" />
                    Digitized Records
                  </span>
                </NavLink>
                <NavLink to="/app/validation" className={subNavLinkClasses} onClick={onCloseMobile}>
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    Validation Rules
                  </span>
                  {validationIssuesCount > 0 && (
                    <span className="text-[10.5px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-semibold">
                      {validationIssuesCount}
                    </span>
                  )}
                </NavLink>
                <NavLink to="/app/verification" className={subNavLinkClasses} onClick={onCloseMobile}>
                  <span className="flex items-center gap-2">
                    <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
                    Verification Queue
                  </span>
                  {pendingVerificationCount > 0 && (
                    <span className="text-[10.5px] text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded font-semibold animate-pulse">
                      {pendingVerificationCount}
                    </span>
                  )}
                </NavLink>
              </div>
            )}
          </div>

          {/* Group: GIS */}
          <div className="space-y-1">
            <button
              onClick={() => toggleGroup("gis")}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[12px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-600"
            >
              <span>GIS & Spatial</span>
              {openGroups.gis ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
            {openGroups.gis && (
              <div className="space-y-0.5 mt-0.5">
                <NavLink to="/app/gis" end className={subNavLinkClasses} onClick={onCloseMobile}>
                  <span className="flex items-center gap-2">
                    <Map className="w-3.5 h-3.5 text-slate-400" />
                    Parcel Map
                  </span>
                  <span className="text-[10.5px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-semibold">
                    7 Parcels
                  </span>
                </NavLink>
                <NavLink to="/app/gis/cross-check" className={subNavLinkClasses} onClick={onCloseMobile}>
                  <span className="flex items-center gap-2">
                    <GitCompare className="w-3.5 h-3.5 text-slate-400" />
                    Doc ↔ Map Cross-check
                  </span>
                </NavLink>
              </div>
            )}
          </div>

          {/* Group: Analytics & Audit */}
          <div className="pt-2 border-t border-slate-100 space-y-0.5">
            <NavLink to="/app/analytics" className={navLinkClasses} onClick={onCloseMobile}>
              <BarChart3 className="w-4 h-4 text-slate-500" />
              <span>Analytics</span>
            </NavLink>
            <NavLink to="/app/audit" className={navLinkClasses} onClick={onCloseMobile}>
              <History className="w-4 h-4 text-slate-500" />
              <span>Audit Trail</span>
            </NavLink>
            <NavLink to="/app/settings" className={navLinkClasses} onClick={onCloseMobile}>
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Settings</span>
            </NavLink>
          </div>
        </div>

        {/* Help & Support Button */}
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={() => setShowHelpModal(true)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200/70 transition-colors"
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-brand-600" />
              <span>Help & SIH 2026 Guide</span>
            </div>
            <span className="text-[10.5px] text-slate-400 font-mono">PS 26018</span>
          </button>
        </div>

        {/* User Profile Card */}
        <div className="p-3 bg-slate-50/70 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
              AM
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-800 truncate">Officer A. Mukherjee</div>
              <div className="text-[12px] text-slate-500 truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                <span>{activeRole.name}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-premium border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-brand-600 tracking-wide uppercase">
                  SIH 2026 Problem Statement 26018
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  IND DIGI-LAND Operational Workflow
                </h3>
              </div>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
              <p>
                <strong>IND DIGI-LAND</strong> demonstrates a 7-stage automated land digitization and verification system:
              </p>
              <ol className="list-decimal pl-4 space-y-1.5 text-slate-700">
                <li><strong>Upload:</strong> Ingest legacy Khatian/Porcha scanned records or image files.</li>
                <li><strong>AI Processing:</strong> Bilingual OCR (Bengali/Hindi/English) with bounding-box coordinate tracking.</li>
                <li><strong>Evidence-Linked Extraction:</strong> Click extracted fields on the right to pinpoint text coordinates on the original document.</li>
                <li><strong>Validation Engine:</strong> Automatically checks area sums, duplicate parcel flags, and survey formats.</li>
                <li><strong>Human Verification Workspace:</strong> Revenue officers inspect ambiguous fields side-by-side.</li>
                <li><strong>Cadastral GIS Cross-Check:</strong> Validate polygon areas against declared deed acreage.</li>
                <li><strong>Audit Trail:</strong> Immutable timestamped logging of every officer and AI action.</li>
              </ol>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
