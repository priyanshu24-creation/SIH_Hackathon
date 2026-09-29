import React, { useState } from 'react';
import { mockAuditTrail } from '../data/mockAuditTrail';
import { 
  History, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  UserCheck, 
  Clock, 
  Shield, 
  Download, 
  FileText,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AuditTrail() {
  const [filterAction, setFilterAction] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLogs = mockAuditTrail.filter(log => {
    const matchesAction = filterAction === "all" || log.type === filterAction;
    const matchesQuery = !searchQuery ||
      log.recordId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAction && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Audit Trail & Immutable Activity Log
            </h1>
            <span className="text-[10.5px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 font-bold">
              Ledger Cryptographically Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete chronological history of document uploads, automated OCR inferences, validation scores, and officer approvals.
          </p>
        </div>

        <button
          onClick={() => alert("Audit certificate exported as PDF/A with SHA-256 integrity hash.")}
          className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Certificate</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Record ID, Officer, or Action keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All Event Types</option>
            <option value="success">Approvals & Validations</option>
            <option value="edit">Officer Corrections</option>
            <option value="warning">Discrepancies & Flags</option>
            <option value="system">AI Engine Events</option>
          </select>
        </div>
      </div>

      {/* Timeline View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
        <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {filteredLogs.map((log) => {
            let nodeIcon = <Cpu className="w-3.5 h-3.5 text-slate-600" />;
            let nodeBg = "bg-slate-100 border-slate-300";

            if (log.type === "success") {
              nodeIcon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
              nodeBg = "bg-emerald-50 border-emerald-300";
            } else if (log.type === "warning") {
              nodeIcon = <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />;
              nodeBg = "bg-amber-50 border-amber-300";
            } else if (log.type === "edit") {
              nodeIcon = <UserCheck className="w-3.5 h-3.5 text-brand-600" />;
              nodeBg = "bg-brand-50 border-brand-300";
            }

            return (
              <div key={log.id} className="relative group">
                {/* Node circle on the vertical line */}
                <div className={`absolute -left-[30px] top-0.5 w-6 h-6 rounded-full border flex items-center justify-center ${nodeBg}`}>
                  {nodeIcon}
                </div>

                {/* Event Card */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-subtle transition-all space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{log.action}</span>
                      <Link 
                        to={`/app/records/${log.recordId}`}
                        className="font-mono text-[12px] font-semibold text-brand-600 hover:underline bg-brand-50 px-2 py-0.2 rounded border border-brand-200"
                      >
                        {log.recordId}
                      </Link>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 font-mono text-[12px]">
                      <span>{log.date}</span>
                      <span>•</span>
                      <span className="font-bold text-slate-600">{log.timestamp}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {log.details}
                  </p>

                  <div className="flex items-center justify-between text-[12px] text-slate-400 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 font-medium">Actor:</span>
                      <span className="text-slate-700 font-semibold">{log.user}</span>
                      <span>({log.role})</span>
                    </div>
                    <span className="font-mono text-[10.5px] text-slate-400">{log.id}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
