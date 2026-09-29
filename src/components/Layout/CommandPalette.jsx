import React, { useState, useEffect } from 'react';
import { useUI } from '../../context/UIContext';
import { useRecords } from '../../context/RecordsContext';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, MapPin, CheckCircle, ShieldAlert, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CommandPalette() {
  const { isCommandPaletteOpen, setIsCommandPaletteOpen } = useUI();
  const { records, setSelectedRecordId } = useRecords();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery("");
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  // Filter records across multiple attributes
  const filtered = records.filter(rec => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      rec.id.toLowerCase().includes(q) ||
      rec.documentName.toLowerCase().includes(q) ||
      (rec.fields?.ownerName?.value || "").toLowerCase().includes(q) ||
      (rec.fields?.surveyNumber?.value || "").toLowerCase().includes(q) ||
      (rec.fields?.village?.value || "").toLowerCase().includes(q) ||
      (rec.parcelId || "").toLowerCase().includes(q)
    );
  }).slice(0, 6);

  const handleSelectRecord = (rec, destination = "record") => {
    setSelectedRecordId(rec.id);
    setIsCommandPaletteOpen(false);
    if (destination === "verification") {
      navigate(`/app/verification/${rec.id}`);
    } else if (destination === "crosscheck") {
      navigate(`/app/gis/cross-check?recordId=${rec.id}`);
    } else {
      navigate(`/app/records/${rec.id}`);
    }
  };

  const quickLinks = [
    { label: "Go to GIS Parcel Map", path: "/app/gis", icon: MapPin },
    { label: "Open Verification Queue", path: "/app/verification", icon: ShieldAlert },
    { label: "Upload New Document", path: "/app/upload", icon: FileText },
    { label: "System Validation Rules", path: "/app/validation", icon: CheckCircle }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-sm">
        <div 
          className="fixed inset-0" 
          onClick={() => setIsCommandPaletteOpen(false)} 
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-premium border border-slate-200 overflow-hidden z-10"
        >
          {/* Search Header */}
          <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
            <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
            <input
              type="text"
              autoFocus
              placeholder="Search by Survey No, Owner, Document ID, Village, Parcel ID (e.g. 124/3 or Rahul)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            <button
              onClick={() => setIsCommandPaletteOpen(false)}
              className="text-xs px-2 py-1 bg-slate-200/70 hover:bg-slate-300 text-slate-600 rounded-md font-mono"
            >
              ESC
            </button>
          </div>

          {/* Results Area */}
          <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-slate-100">
            {/* Record results */}
            <div className="py-2">
              <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1.5">
                Matched Land Records ({filtered.length})
              </div>
              {filtered.length === 0 ? (
                <div className="px-3 py-6 text-center text-xs text-slate-500">
                  No records matching "{query}". Try searching "124/3" or "Rahul" or "Howrah".
                </div>
              ) : (
                filtered.map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => handleSelectRecord(rec, "record")}
                    className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-900 group-hover:text-brand-600">
                            {rec.fields?.ownerName?.value || "Unknown Owner"}
                          </span>
                          <span className="text-[12px] font-mono text-slate-500">
                            Plot {rec.fields?.surveyNumber?.value || "N/A"}
                          </span>
                          <span className="text-[12px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            {rec.id}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{rec.fields?.village?.value}, {rec.fields?.district?.value}</span>
                          <span>•</span>
                          <span>{rec.fields?.area?.value}</span>
                          <span>•</span>
                          <span className="text-emerald-600 font-medium">{rec.confidence}% OCR confidence</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-600">
                      <span className="text-xs font-medium">View Record</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Navigation Links */}
            <div className="pt-2">
              <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1.5">
                Quick Navigation
              </div>
              <div className="grid grid-cols-2 gap-1 px-1">
                {quickLinks.map((link, idx) => {
                  const Icon = link.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setIsCommandPaletteOpen(false);
                        navigate(link.path);
                      }}
                      className="flex items-center gap-2.5 p-2 hover:bg-slate-50 text-left rounded-lg text-xs font-medium text-slate-700 transition-colors"
                    >
                      <Icon className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>{link.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer hint */}
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[12px] text-slate-500">
            <span>Tip: Press <kbd className="px-1 py-0.5 bg-white border border-slate-300 rounded text-[10.5px] font-mono">⌘K</kbd> anywhere to open</span>
            <span>SIH 2026 • Demo Database</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
