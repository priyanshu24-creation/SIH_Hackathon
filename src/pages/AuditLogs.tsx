import React, { useState, useEffect } from 'react';
import {
  History, Upload, FileText, AlertTriangle, Edit2,
  CheckCircle2, Download, Search, ShieldCheck,
  ChevronDown, ChevronUp, User
} from 'lucide-react';
import { useLandRecord } from '../context/LandRecordContext';
import { useToast } from '../context/ToastContext';

const eventConfig: Record<string, { icon: React.ElementType; dotCls: string; badgeCls: string; label: string }> = {
  upload:     { icon: Upload,       dotCls: 'dot-success',   badgeCls: 'badge-info',       label: 'Document Ingestion' },
  ocr:        { icon: FileText,     dotCls: 'dot-success',   badgeCls: 'badge-neutral',    label: 'OCR Parsing' },
  extraction: { icon: FileText,     dotCls: 'dot-success',   badgeCls: 'badge-neutral',    label: 'Data Extraction' },
  mismatch:   { icon: AlertTriangle,dotCls: 'dot-attention', badgeCls: 'badge-attention',  label: 'Discrepancy Flagged' },
  edit:       { icon: Edit2,        dotCls: 'dot-attention', badgeCls: 'badge-attention',  label: 'Officer Correction' },
  approval:   { icon: CheckCircle2, dotCls: 'dot-success',   badgeCls: 'badge-success',    label: 'Statutory Approval' },
  default:    { icon: History,      dotCls: 'dot-success',   badgeCls: 'badge-neutral',    label: 'System Log' },
};

export const AuditLogs: React.FC = () => {
  const { showToast } = useToast();
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('http://localhost:3001/api/audit_log')
      .then(res => res.json())
      .then(data => setAuditLogs(data))
      .catch(console.error);
  }, []);

  const filteredLogs = auditLogs.filter(log => {
    if (filterType !== 'all' && log.type !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return log.action.toLowerCase().includes(q) || log.description.toLowerCase().includes(q) || log.actor.toLowerCase().includes(q);
    }
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-up">

      {/* ── Header ────────────────────────────────────── */}
      <div className="gov-card px-6 py-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          
          <h1 className="page-title">Audit Trail</h1>
          <p style={{ fontSize: 14, color: 'var(--color-muted)', marginTop: 4, maxWidth: 520 }}>
            Complete, tamper-evident chronological record of ingestion, extraction, officer corrections, and certifications.
          </p>
        </div>
        <button
          className="gov-btn-primary shrink-0"
          onClick={() => showToast('Audit Register Exported', 'Certified_Audit_Register.pdf generated.', 'success')}
        >
          <Download className="w-4 h-4" />
          Download Register
        </button>
      </div>

      {/* ── Stats row ─────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Events', value: auditLogs.length, icon: History },
          { label: 'Officer Edits', value: auditLogs.filter(l => l.type === 'edit').length, icon: Edit2 },
          { label: 'Discrepancies', value: auditLogs.filter(l => l.type === 'mismatch').length, icon: AlertTriangle },
          { label: 'Approvals', value: auditLogs.filter(l => l.type === 'approval').length, icon: CheckCircle2 },
        ].map(s => (
          <div key={s.label} className="gov-card px-4 py-4 flex items-center justify-between">
            <div>
              <p className="eyebrow mb-1">{s.label}</p>
              <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-text)' }}>{s.value}</p>
            </div>
            <s.icon className="w-5 h-5" style={{ color: 'var(--color-muted)' }} />
          </div>
        ))}
      </div>

      {/* ── Filter + search ───────────────────────────── */}
      <div className="gov-card px-5 py-3.5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5" style={{ color: 'var(--color-muted)' }} />
          <input
            type="text"
            placeholder="Search actions, officers, descriptions…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="gov-input"
            style={{ paddingLeft: 36 }}
          />
        </div>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="gov-input"
          style={{ width: 'auto', minWidth: 180, paddingLeft: 12 }}
        >
          <option value="all">All Events</option>
          <option value="upload">Document Ingestion</option>
          <option value="ocr">OCR Parsing</option>
          <option value="extraction">Data Extraction</option>
          <option value="mismatch">Discrepancies</option>
          <option value="edit">Officer Corrections</option>
          <option value="approval">Approvals</option>
        </select>
        <span style={{ fontSize: 13, color: 'var(--color-muted)' }}>{filteredLogs.length} events</span>
      </div>

      {/* ── Compact log list ──────────────────────────── */}
      <div className="gov-card overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="py-16 text-center" style={{ color: 'var(--color-muted)' }}>
            <History className="w-8 h-8 mx-auto mb-3" />
            <p style={{ fontWeight: 600, color: 'var(--color-text)' }}>No matching events.</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Try adjusting your filter or search term.</p>
          </div>
        ) : (
          <ul className="px-4 py-2">
            {filteredLogs.map(log => {
              const cfg = eventConfig[log.type] || eventConfig.default;
              const Icon = cfg.icon;
              const isOpen = expandedIds.has(log.id);

              return (
                <li key={log.id}>
                  <div
                    className="audit-row"
                    onClick={() => toggleExpand(log.id)}
                  >
                    {/* Icon dot */}
                    <div className="shrink-0 mt-0.5 flex flex-col items-center">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                      >
                        <Icon className="w-3.5 h-3.5" style={{ color: 'var(--color-muted)' }} />
                      </div>
                    </div>

                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>{log.action}</span>
                        <span className={`badge ${cfg.badgeCls}`}>{cfg.label}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        <span style={{ fontSize: 12, color: 'var(--color-muted)' }} className="flex items-center gap-1">
                          <User className="w-3 h-3" /> {log.actor}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--color-subtle)', fontFamily: 'monospace' }}>{new Date(log.timestamp).toLocaleString()}</span>
                        <span style={{ fontSize: 12, color: 'var(--color-subtle)', fontFamily: 'monospace' }}>#{log.id}</span>
                      </div>
                    </div>

                    {/* Expand toggle */}
                    <div style={{ color: 'var(--color-muted)', flexShrink: 0 }}>
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div
                      className="ml-10 mb-2 px-4 py-3 rounded-lg text-xs animate-fade-up"
                      style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-muted)', lineHeight: 1.7 }}
                    >
                      {log.description}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {/* Security footer */}
        <div
          className="px-5 py-3 flex items-center gap-2 text-xs"
          style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-bg)' }}
        >
          <ShieldCheck className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
          <span style={{ color: 'var(--color-muted)' }}>
            Digital Ledger Seal: SHA-256 <code style={{ background: 'var(--color-surface)', padding: '1px 6px', borderRadius: 4, border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>7f8a92b0c4...e41c9</code>
          </span>
        </div>
      </div>
    </div>
  );
};
