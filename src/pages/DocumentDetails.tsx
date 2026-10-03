import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight, ChevronDown, ChevronUp,
  FileText, Eye, CheckCircle2, AlertTriangle,
  XCircle, ArrowLeft, Save, MoreHorizontal,
  Map, Search, Edit2, ShieldCheck, Info,
  Download, ZoomIn, ZoomOut, RotateCw, Maximize2,
  CheckSquare, Send, X
} from 'lucide-react';
import { DocumentViewer } from '../components/DocumentViewer/DocumentViewer';
import { SourceEvidenceModal } from '../components/DocumentViewer/SourceEvidenceModal';
import { ConfidenceBadge } from '../components/Common/ConfidenceBadge';
import { ExtractedField } from '../types';
import { useLandRecord } from '../context/LandRecordContext';
import { useToast } from '../context/ToastContext';

// ── Helpers ──────────────────────────────────────────────────────────────────
type FieldFilter = 'all' | 'review' | 'low' | 'validated';

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="eyebrow mb-3">{children}</p>
);

// ── Confirmation dialog ──────────────────────────────────────────────────────
const ConfirmDialog: React.FC<{
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  note: string;
  issueCount: number;
}> = ({ open, onConfirm, onCancel, note, issueCount }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="slide-over-backdrop" onClick={onCancel} />
      <div
        className="relative z-50 bg-white rounded-2xl shadow-2xl border p-6 max-w-md w-full mx-4 animate-fade-up"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-lg bg-[var(--color-attention-bg)]">
            <ShieldCheck className="w-5 h-5" style={{ color: 'var(--color-attention)' }} />
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)' }}>
              Confirm Record Approval
            </h3>
            <p style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 4 }}>
              This action certifies that you, as the authorised Revenue Officer, have personally
              reviewed the scanned Khatian and extracted fields.
            </p>
          </div>
        </div>

        {issueCount > 0 && (
          <div
            className="flex items-center gap-2 p-3 rounded-lg mb-4"
            style={{ background: 'var(--color-attention-bg)', border: '1px solid var(--color-attention-border)' }}
          >
            <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: 'var(--color-attention)' }} />
            <p style={{ fontSize: 13, color: 'var(--color-attention)', fontWeight: 500 }}>
              {issueCount} validation issue{issueCount !== 1 ? 's' : ''} remain unresolved.
              Your approval overrides these findings.
            </p>
          </div>
        )}

        {note && (
          <div
            className="p-3 rounded-lg mb-4"
            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', fontSize: 13, color: 'var(--color-muted)' }}
          >
            <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>Reviewer note: </span>
            {note}
          </div>
        )}

        <div className="flex items-center justify-end gap-2">
          <button className="gov-btn-outline" onClick={onCancel}>Cancel</button>
          <button
            className="gov-btn-primary"
            style={{ background: 'var(--color-success)' }}
            onClick={onConfirm}
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve — I have personally verified this record
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main page ────────────────────────────────────────────────────────────────
export const DocumentDetails: React.FC = () => {
  const navigate = useNavigate();
  const {
    activeRecord,
    highlightedField,
    setHighlightedField,
    evidenceModalOpen,
    activeEvidenceField,
    openEvidenceModal,
    closeEvidenceModal,
    updateRecordStatus,
    currentProcessingFile,
  } = useLandRecord();
  const { showToast } = useToast();

  const [fieldFilter, setFieldFilter] = useState<FieldFilter>('all');
  const [fieldSearch, setFieldSearch] = useState('');
  const [reviewNote, setReviewNote] = useState('');
  const [masterOpen, setMasterOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [hasUnsaved, setHasUnsaved] = useState(false);

  const fields = activeRecord.extractedFields;
  const validationRules = activeRecord.validationRules;

  const issueCount = validationRules.filter(r => r.status === 'Mismatch').length;
  const needsReviewCount = fields.filter(f => f.confidence < 90).length;

  // Field filtering
  const filteredFields = fields.filter(f => {
    const matchesSearch = !fieldSearch || f.field.toLowerCase().includes(fieldSearch.toLowerCase()) || f.value.toLowerCase().includes(fieldSearch.toLowerCase());
    if (fieldFilter === 'review') return f.confidence >= 75 && f.confidence < 90 && matchesSearch;
    if (fieldFilter === 'low') return f.confidence < 75 && matchesSearch;
    if (fieldFilter === 'validated') return f.confidence >= 90 && matchesSearch;
    return matchesSearch;
  });

  const handleFieldSelect = (field: ExtractedField) => {
    setHighlightedField(field);
  };

  const handleSaveDraft = () => {
    setHasUnsaved(false);
    showToast('Draft Saved', 'Verification progress saved. Record remains in queue.', 'success');
  };

  const handleApprove = () => {
    setConfirmOpen(false);
    updateRecordStatus(activeRecord.id, 'Verified');
    showToast('Record Approved', `Khatian KH-${activeRecord.khatianNo} verified and certified by officer.`, 'success');
    navigate('/review-queue');
  };

  const handleRequestCorrection = () => {
    showToast('Correction Requested', 'Record flagged for field correction by digitization unit.', 'info');
    navigate('/review-queue');
  };

  const handleFieldVerification = () => {
    updateRecordStatus(activeRecord.id, 'Flagged');
    showToast('Sent for Field Verification', 'Cadastral surveyor notified for on-site measurement.', 'info');
    navigate('/review-queue');
  };

  // Field state indicator
  const getFieldState = (confidence: number) => {
    if (confidence >= 90) return {
      dot: 'dot-success',
      badge: 'badge-success',
      label: 'High confidence',
      border: 'var(--color-success-border)',
      bg: 'transparent',
    };
    if (confidence >= 75) return {
      dot: 'dot-attention',
      badge: 'badge-attention',
      label: 'Needs review',
      border: 'var(--color-attention-border)',
      bg: 'var(--color-attention-bg)',
    };
    return {
      dot: 'dot-critical',
      badge: 'badge-critical',
      label: 'Low confidence',
      border: 'var(--color-critical-border)',
      bg: 'var(--color-critical-bg)',
    };
  };

  const filterTabs: { key: FieldFilter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: fields.length },
    { key: 'review', label: 'Needs Review', count: fields.filter(f => f.confidence >= 75 && f.confidence < 90).length },
    { key: 'low', label: 'Low Confidence', count: fields.filter(f => f.confidence < 75).length },
    { key: 'validated', label: 'Validated', count: fields.filter(f => f.confidence >= 90).length },
  ];

  return (
    <>
      {/* ── Page wrapper — allow sticky action bar ────────── */}
      <div className="flex flex-col min-h-[calc(100vh-40px)] animate-fade-up">

        {/* ════════════════════════════════════════════════════
            A. RECORD HEADER
        ════════════════════════════════════════════════════ */}
        <div className="space-y-4 mb-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[13px] font-medium text-[var(--color-text-secondary)]">
            <button onClick={() => navigate('/')} className="hover:text-[var(--color-primary)] transition-colors">Dashboard</button>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <button onClick={() => navigate('/review-queue')} className="hover:text-[var(--color-primary)] transition-colors">Verification Queue</button>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <span className="text-[var(--color-text-primary)] font-semibold">Khatian KH-{activeRecord.khatianNo}</span>
          </nav>

          {/* Header Layout */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-5" style={{ borderBottom: '1px solid var(--color-border)' }}>
            {/* LEFT — record identity */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                  Scanned Khatian
                </span>
                <span className="badge badge-attention">Needs Review</span>
                {hasUnsaved && <span className="badge badge-neutral">Unsaved changes</span>}
              </div>
              <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight mb-2">
                Khatian No. KH-{activeRecord.khatianNo}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] text-[var(--color-text-secondary)] font-medium">
                <span className="flex items-center gap-1.5"><Map className="w-4 h-4 opacity-60" /> Mouza: <strong className="text-[var(--color-text-primary)]">{activeRecord.village}</strong></span>
                <span className="text-[var(--color-border)]">|</span>
                <span>Tehsil: <strong className="text-[var(--color-text-primary)]">{activeRecord.tehsil}</strong></span>
                <span className="text-[var(--color-border)]">|</span>
                <span>District: <strong className="text-[var(--color-text-primary)]">{activeRecord.district}</strong></span>
              </div>
            </div>

            {/* RIGHT — actions */}
            <div className="flex items-center gap-3 shrink-0">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-white text-[13px] font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-border-subtle)] transition-colors shadow-2xs" onClick={() => navigate('/review-queue')}>
                <ArrowLeft className="w-4 h-4 opacity-70" /> Back to Queue
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-white text-[13px] font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-border-subtle)] transition-colors shadow-2xs" onClick={handleSaveDraft}>
                <Save className="w-4 h-4 opacity-70" /> Save Progress
              </button>
              <button className="flex items-center justify-center w-10 h-10 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text-primary)] hover:bg-[var(--color-border-subtle)] transition-colors shadow-2xs" title="More actions">
                <MoreHorizontal className="w-5 h-5 opacity-70" />
              </button>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            B. VERIFICATION STATUS SUMMARY
        ════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Doc status */}
          <div className="bg-white p-5 rounded-xl border border-[var(--color-border)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-success)] opacity-80" />
            <div className="flex items-center justify-between mb-3">
              <p className="text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Document Status</p>
              <div className="w-8 h-8 rounded-lg bg-[var(--color-success-bg)] text-[var(--color-success)] flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#111827]">Processed</p>
            <p className="text-[13px] text-[var(--color-text-secondary)] mt-1">Ready for verification</p>
          </div>

          {/* OCR confidence */}
          <div className="bg-white p-5 rounded-xl border border-[var(--color-border)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-primary)] opacity-80" />
            <div className="flex items-center justify-between mb-3">
              <p className="text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">OCR Confidence</p>
              <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-[#111827]">{activeRecord.confidence}%</p>
              <span className="text-[12px] font-semibold text-[var(--color-success)] bg-[var(--color-success-bg)] px-2 py-0.5 rounded-full">High</span>
            </div>
            <p className="text-[13px] text-[var(--color-text-secondary)] mt-1">Average extraction accuracy</p>
          </div>

          {/* Fields */}
          <div className="bg-white p-5 rounded-xl border border-[var(--color-border)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#111827] opacity-80" />
            <div className="flex items-center justify-between mb-3">
              <p className="text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Fields Identified</p>
              <div className="w-8 h-8 rounded-lg bg-[var(--color-border-subtle)] text-[#111827] flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#111827]">{fields.length} / {fields.length}</p>
            <p className="text-[13px] mt-1 font-medium" style={{ color: needsReviewCount > 0 ? 'var(--color-attention)' : 'var(--color-text-secondary)' }}>
              {needsReviewCount > 0 ? `${needsReviewCount} fields need manual review` : 'All fields extracted successfully'}
            </p>
          </div>

          {/* Validation issues */}
          <div className="bg-white p-5 rounded-xl border border-[var(--color-border)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full opacity-80" style={{ background: issueCount > 0 ? 'var(--color-error)' : 'var(--color-success)' }} />
            <div className="flex items-center justify-between mb-3">
              <p className="text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Validation Issues</p>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: issueCount > 0 ? 'var(--color-critical-bg)' : 'var(--color-success-bg)', color: issueCount > 0 ? 'var(--color-error)' : 'var(--color-success)' }}>
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#111827]">{issueCount}</p>
            <p className="text-[13px] mt-1 font-medium" style={{ color: issueCount > 0 ? 'var(--color-error)' : 'var(--color-text-secondary)' }}>
              {issueCount === 1 ? '1 cadastral mismatch found' : issueCount === 0 ? 'No cross-check issues' : `${issueCount} cadastral mismatches found`}
            </p>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            C. MAIN WORKSPACE — 55 / 45 split
        ════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-5 mb-5">

          {/* ── LEFT: Document Viewer (6/11 ≈ 55%) ─────── */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            <div>
              <SectionLabel>Original Khatian Document</SectionLabel>
              <p style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: -8, marginBottom: 8 }}>
                Click highlighted regions to view source evidence for each extracted field
              </p>
            </div>
            <DocumentViewer
              fields={fields}
              activeField={highlightedField}
              onFieldClick={handleFieldSelect}
              documentUrl={currentProcessingFile.documentUrl}
              fileName={currentProcessingFile.name || activeRecord.fileName}
              heightClass="h-[580px]"
            />
            {/* Highlight legend */}
            <div className="flex items-center gap-4 px-1" style={{ fontSize: 12, color: 'var(--color-muted)' }}>
              <div className="flex items-center gap-1.5">
                <span style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(23,130,75,0.25)', border: '1.5px solid var(--color-success)', display: 'inline-block' }} />
                High confidence
              </div>
              <div className="flex items-center gap-1.5">
                <span style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(245,158,11,0.20)', border: '1.5px solid var(--color-warning)', display: 'inline-block' }} />
                Needs review
              </div>
              <div className="flex items-center gap-1.5">
                <span style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(185,28,28,0.18)', border: '1.5px solid var(--color-error)', display: 'inline-block' }} />
                Discrepancy
              </div>
            </div>
          </div>

          {/* ── RIGHT: Extracted Information (5/11 ≈ 45%) ─ */}
          <div
            className="lg:col-span-5 gov-card flex flex-col overflow-hidden"
            style={{ maxHeight: 660 }}
          >
            {/* Panel header */}
            <div className="px-4 pt-4 pb-3 shrink-0" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <SectionLabel>Extracted Information</SectionLabel>
                  <p style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: -8 }}>
                    {fields.length} fields identified
                    {highlightedField && <span style={{ color: 'var(--color-primary)', fontWeight: 500 }}> · {highlightedField.field} selected</span>}
                  </p>
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-2.5">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5" style={{ color: 'var(--color-muted)' }} />
                <input
                  type="text"
                  placeholder="Search extracted fields…"
                  value={fieldSearch}
                  onChange={e => setFieldSearch(e.target.value)}
                  className="gov-input"
                  style={{ paddingLeft: 30, height: 34, fontSize: 13 }}
                />
              </div>

              {/* Filter tabs */}
              <div className="flex gap-1 flex-wrap">
                {filterTabs.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setFieldFilter(tab.key)}
                    className="px-2.5 py-1 rounded-md text-xs font-medium transition-colors"
                    style={{
                      background: fieldFilter === tab.key ? 'var(--color-primary)' : 'var(--color-bg)',
                      color: fieldFilter === tab.key ? '#fff' : 'var(--color-muted)',
                      border: '1px solid',
                      borderColor: fieldFilter === tab.key ? 'var(--color-primary)' : 'var(--color-border)',
                    }}
                  >
                    {tab.label}
                    <span
                      className="ml-1 px-1.5 py-0.5 rounded-full"
                      style={{
                        fontSize: 10.5, fontWeight: 700,
                        background: fieldFilter === tab.key ? 'rgba(255,255,255,0.25)' : 'var(--color-border)',
                        color: fieldFilter === tab.key ? '#fff' : 'var(--color-muted)',
                      }}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Field list — scrollable */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {filteredFields.length === 0 ? (
                <div className="py-12 text-center" style={{ color: 'var(--color-muted)' }}>
                  <Search className="w-6 h-6 mx-auto mb-2" />
                  <p style={{ fontSize: 14, fontWeight: 500 }}>No fields match your filter.</p>
                </div>
              ) : filteredFields.map(field => {
                const state = getFieldState(field.confidence);
                const isSelected = highlightedField?.id === field.id;

                return (
                  <div
                    key={field.id}
                    onClick={() => handleFieldSelect(field)}
                    className="rounded-xl cursor-pointer transition-all"
                    style={{
                      border: `1.5px solid ${isSelected ? 'var(--color-primary)' : state.border}`,
                      background: isSelected ? 'var(--color-primary-light)' : state.bg || 'var(--color-surface)',
                      padding: '10px 12px',
                    }}
                  >
                    {/* Field name + confidence dot */}
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className={state.dot} style={{ display: 'inline-block' }} />
                        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-muted)' }}>
                          {field.field}
                        </span>
                        {field.labelBengali && (
                          <span style={{ fontSize: 10.5, color: 'var(--color-subtle)' }}>({field.labelBengali})</span>
                        )}
                      </div>
                      <span className={`badge ${state.badge}`} style={{ fontSize: 10.5 }}>
                        {field.confidence}%
                      </span>
                    </div>

                    {/* Extracted value — prominent */}
                    <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)', fontFamily: 'monospace', letterSpacing: '-0.2px', marginBottom: 6 }}>
                      {field.value}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2" style={{ fontSize: 11, color: 'var(--color-muted)' }}>
                        <span>Page {field.coordinates.page}</span>
                        <span style={{ color: 'var(--color-border)' }}>·</span>
                        <span>{field.method}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {field.confidence < 90 && (
                          <button
                            onClick={e => { e.stopPropagation(); setHasUnsaved(true); showToast('Edit Field', `Editing ${field.field}`, 'info'); }}
                            className="gov-btn-ghost"
                            style={{ padding: '2px 8px', fontSize: 12, gap: 3, color: 'var(--color-attention)' }}
                            title="Edit extracted value"
                          >
                            <Edit2 className="w-3 h-3" /> Edit
                          </button>
                        )}
                        <button
                          onClick={e => { e.stopPropagation(); openEvidenceModal(field); }}
                          className="gov-btn-ghost"
                          style={{ padding: '2px 8px', fontSize: 12, gap: 3, color: 'var(--color-primary)' }}
                          title="View source evidence"
                        >
                          <Eye className="w-3 h-3" /> Source
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Panel footer */}
            <div
              className="px-4 py-2.5 shrink-0 flex items-center justify-between"
              style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-bg)' }}
            >
              <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>Record #{activeRecord.id}</span>
              <button
                className="gov-btn-ghost"
                style={{ fontSize: 12, color: 'var(--color-primary)', padding: '4px 8px' }}
                onClick={() => navigate('/structured-record')}
              >
                Master Record Sheet <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            D. VALIDATION FINDINGS
        ════════════════════════════════════════════════════ */}
        <div className="gov-card p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <SectionLabel>Validation Findings</SectionLabel>
              <p style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: -8 }}>
                Automated checks performed against extracted fields and cadastral references
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge badge-success">{validationRules.filter(r => r.status === 'Match').length} passed</span>
              {issueCount > 0 && <span className="badge badge-attention">{issueCount} require review</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {validationRules.map(rule => {
              const isPassed = rule.status === 'Match';
              const isMismatch = rule.status === 'Mismatch';
              const Icon = isPassed ? CheckCircle2 : isMismatch ? AlertTriangle : Info;
              const borderColor = isPassed ? 'var(--color-success-border)' : isMismatch ? 'var(--color-attention-border)' : 'var(--color-border)';
              const iconColor = isPassed ? 'var(--color-success)' : isMismatch ? 'var(--color-attention)' : 'var(--color-muted)';
              const bgColor = isPassed ? 'var(--color-success-bg)' : isMismatch ? 'var(--color-attention-bg)' : 'var(--color-bg)';

              return (
                <div
                  key={rule.id}
                  className="rounded-xl p-3.5"
                  style={{ border: `1px solid ${borderColor}`, background: bgColor }}
                >
                  <div className="flex items-start gap-2.5">
                    <Icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: iconColor }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)' }}>{rule.field}</span>
                        <span className={isPassed ? 'badge badge-success' : isMismatch ? 'badge badge-attention' : 'badge badge-neutral'}
                          style={{ fontSize: 10.5 }}>
                          {isPassed ? 'Passed' : isMismatch ? 'Mismatch' : 'Review'}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 8 }}>{rule.ruleDescription}</p>
                      <div className="flex items-center gap-3 text-xs">
                        <div>
                          <span style={{ color: 'var(--color-muted)', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Document</span>
                          <span style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--color-text)' }}>{rule.documentValue}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5" style={{ color: 'var(--color-muted)' }} />
                        <div>
                          <span style={{ color: 'var(--color-muted)', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Cadastral Ref.</span>
                          <span style={{ fontWeight: 700, fontFamily: 'monospace', color: isMismatch ? 'var(--color-attention)' : 'var(--color-success)' }}>{rule.referenceValue}</span>
                        </div>
                        {isMismatch && rule.field === 'Area' && (
                          <>
                            <ChevronRight className="w-3.5 h-3.5" style={{ color: 'var(--color-muted)' }} />
                            <div>
                              <span style={{ color: 'var(--color-muted)', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Variance</span>
                              <span style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--color-attention)' }}>+0.07 ac</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            E. CADASTRAL CROSS-CHECK
        ════════════════════════════════════════════════════ */}
        <div className="gov-card p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <SectionLabel>Cadastral Cross-Check</SectionLabel>
              <p style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: -8 }}>
                Document record vs. GIS cadastral reference
              </p>
            </div>
            <button className="gov-btn-outline" style={{ fontSize: 13 }} onClick={() => navigate('/gis-map')}>
              <Map className="w-3.5 h-3.5" /> Open Cadastral Map
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            {/* Document side */}
            <div className="rounded-xl p-4" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
              <p className="eyebrow mb-3">Document Record</p>
              {[
                { label: 'Plot No.', value: activeRecord.plotNo },
                { label: 'Area', value: `${activeRecord.areaAcre} acre` },
                { label: 'Owner', value: activeRecord.ownerName },
                { label: 'Mouza', value: activeRecord.village },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-baseline py-1.5" style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>{row.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'monospace', color: 'var(--color-text)' }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Variance indicator */}
            <div className="flex flex-col items-center justify-center gap-3 py-4">
              <div className="flex items-center gap-2">
                <div style={{ height: 1, width: 40, background: 'var(--color-border)' }} />
                <span style={{ fontSize: 12, color: 'var(--color-muted)', fontWeight: 600 }}>VS</span>
                <div style={{ height: 1, width: 40, background: 'var(--color-border)' }} />
              </div>
              {issueCount > 0 && (
                <div
                  className="rounded-xl px-4 py-3 text-center"
                  style={{ background: 'var(--color-attention-bg)', border: '1px solid var(--color-attention-border)', minWidth: 140 }}
                >
                  <p style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-attention)', marginBottom: 4 }}>Area Variance</p>
                  <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-attention)', fontFamily: 'monospace', lineHeight: 1 }}>+0.07 ac</p>
                  <p style={{ fontSize: 10.5, color: 'var(--color-attention)', marginTop: 4 }}>+9.3% over GIS reference</p>
                  <span className="badge badge-attention mt-2 inline-block">Needs Field Verification</span>
                </div>
              )}
              {issueCount === 0 && (
                <div className="badge badge-success text-center">All values match</div>
              )}
            </div>

            {/* GIS side */}
            <div className="rounded-xl p-4" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
              <p className="eyebrow mb-3">GIS / Cadastral Record</p>
              {[
                { label: 'Plot No.', value: `${activeRecord.plotNo}/1`, mismatch: false },
                { label: 'Area', value: `${activeRecord.referenceAreaAcre} acre`, mismatch: activeRecord.areaAcre !== activeRecord.referenceAreaAcre },
                { label: 'Owner', value: activeRecord.ownerName, mismatch: false },
                { label: 'Mouza', value: activeRecord.village, mismatch: false },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-baseline py-1.5" style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>{row.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'monospace', color: row.mismatch ? 'var(--color-attention)' : 'var(--color-text)' }}>
                    {row.value}
                    {row.mismatch && <AlertTriangle className="w-3 h-3 inline ml-1" style={{ color: 'var(--color-attention)' }} />}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            F. MASTER RECORD DETAILS — collapsible
        ════════════════════════════════════════════════════ */}
        <div className="gov-card mb-24">
          <button
            className="w-full px-5 py-4 flex items-center justify-between text-left transition-colors hover:bg-[var(--color-bg)] rounded-[14px]"
            onClick={() => setMasterOpen(o => !o)}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>Master Record Details</span>
              <span className="badge badge-neutral" style={{ fontSize: 10.5 }}>All 12 fields</span>
            </div>
            {masterOpen ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--color-muted)' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'var(--color-muted)' }} />}
          </button>

          {masterOpen && (
            <div
              className="px-5 pb-5 animate-fade-up"
              style={{ borderTop: '1px solid var(--color-border)' }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0 mt-4">
                {[
                  { label: 'Khatian Number', value: `KH-${activeRecord.khatianNo}` },
                  { label: 'Owner Name', value: activeRecord.ownerName },
                  { label: 'Father / Husband Name', value: activeRecord.fatherName },
                  { label: 'Plot Number', value: activeRecord.plotNo },
                  { label: 'Mouza', value: activeRecord.village },
                  { label: 'JL Number', value: '42' },
                  { label: 'District', value: activeRecord.district },
                  { label: 'Tehsil / Block', value: activeRecord.tehsil },
                  { label: 'Land Classification', value: activeRecord.landType },
                  { label: 'Area (Document)', value: `${activeRecord.areaAcre} acre` },
                  { label: 'Share', value: '1/1 (Sole Holder)' },
                  { label: 'Mutation Status', value: 'Under Process' },
                ].map(f => (
                  <div key={f.label} className="flex justify-between items-baseline py-2.5" style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <span style={{ fontSize: 13, color: 'var(--color-muted)' }}>{f.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', textAlign: 'right', maxWidth: '55%' }}>{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ════════════════════════════════════════════════════
            G. STICKY BOTTOM ACTION BAR
        ════════════════════════════════════════════════════ */}
        <div
          className="fixed bottom-0 left-0 right-0 z-30"
          style={{
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(12px)',
            borderTop: '1px solid var(--color-border)',
            boxShadow: '0 -4px 24px rgba(26,39,33,0.08)',
          }}
        >
          {/* Responsive inner: constrain to same max-width as page */}
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center gap-3">

            {/* LEFT: issue status */}
            <div className="flex items-center gap-2 shrink-0">
              {issueCount > 0 ? (
                <span className="badge badge-attention">
                  <AlertTriangle className="w-3 h-3" />
                  {issueCount} issue{issueCount !== 1 ? 's' : ''} require attention
                </span>
              ) : (
                <span className="badge badge-success">
                  <CheckCircle2 className="w-3 h-3" />
                  All validation checks passed
                </span>
              )}
              <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                Officer: Shri Sujan Thapa, Revenue Officer
              </span>
            </div>

            {/* CENTER: note input */}
            <div className="flex-1 min-w-0">
              <input
                type="text"
                placeholder="Add verification note (optional)…"
                value={reviewNote}
                onChange={e => { setReviewNote(e.target.value); setHasUnsaved(true); }}
                className="gov-input w-full"
                style={{ height: 36, fontSize: 13 }}
              />
            </div>

            {/* RIGHT: actions — escalating hierarchy */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                className="gov-btn-outline"
                style={{ fontSize: 13, padding: '7px 12px' }}
                onClick={handleSaveDraft}
              >
                <Save className="w-3.5 h-3.5" /> Save Draft
              </button>
              <button
                className="gov-btn-outline"
                style={{ fontSize: 13, padding: '7px 12px', color: 'var(--color-critical)', borderColor: 'var(--color-critical-border)' }}
                onClick={handleRequestCorrection}
              >
                <X className="w-3.5 h-3.5" /> Request Correction
              </button>
              <button
                className="gov-btn-outline"
                style={{ fontSize: 13, padding: '7px 12px', color: 'var(--color-attention)', borderColor: 'var(--color-attention-border)' }}
                onClick={handleFieldVerification}
              >
                <Send className="w-3.5 h-3.5" /> Field Verification
              </button>
              <button
                className="gov-btn-primary"
                style={{
                  fontSize: 13, padding: '7px 14px',
                  background: issueCount === 0 ? 'var(--color-success)' : '#888',
                  cursor: 'pointer',
                  opacity: 1,
                }}
                title={issueCount > 0 ? `${issueCount} validation issues remain — you may still approve after personal review` : 'Approve this record'}
                onClick={() => setConfirmOpen(true)}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Approve Record
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Confirmation dialog ─────────────────────────── */}
      <ConfirmDialog
        open={confirmOpen}
        onConfirm={handleApprove}
        onCancel={() => setConfirmOpen(false)}
        note={reviewNote}
        issueCount={issueCount}
      />

      {/* ── Source Evidence Modal ───────────────────────── */}
      <SourceEvidenceModal
        isOpen={evidenceModalOpen}
        onClose={closeEvidenceModal}
        field={activeEvidenceField}
      />
    </>
  );
};
