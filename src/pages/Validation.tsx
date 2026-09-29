import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Map,
  ArrowRight,
  Check,
  Info,
  RefreshCw
} from 'lucide-react';
import { useLandRecord } from '../context/LandRecordContext';
import { useToast } from '../context/ToastContext';

export const Validation: React.FC = () => {
  const navigate = useNavigate();
  const { activeRecord, updateRecordStatus } = useLandRecord();
  const { showToast } = useToast();
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const handleReRun = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      showToast('Validation Re-evaluated', 'Rule engine re-checked Record #1024 against Cadastral Survey of India layer.', 'info');
    }, 800);
  };

  const handleApproveRecord = () => {
    updateRecordStatus('1024', 'Verified');
    showToast('Record Verified', 'Record #1024 approved by officer override with area note.', 'success');
    navigate('/structured-record');
  };

  const checklistItems = [
    { label: 'Khatian number format', passed: true, note: 'Form 5440 valid 4-digit code (1456)' },
    { label: 'Required fields present', passed: true, note: 'Owner, Plot, Share, Classification all extracted' },
    { label: 'Plot number found', passed: true, note: 'Plot #302 verified against Cadastral Sheet 42' },
    {
      label: 'Area differs from cadastral reference',
      passed: false,
      isWarning: true,
      note: 'Document 0.82 acre vs Cadastral reference 0.75 acre (Variance: +0.07 acre)'
    },
    { label: 'Owner name matched', passed: true, note: 'Binod Pradhan s/o Kamal Pradhan matches District Ledger' }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title & Record Header */}
      <div className="gov-card px-8 py-6 mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div>
          
          <h1 className="page-title flex items-center gap-2.5">
            Check Record
            <span className="badge badge-success border border-[var(--color-success)]/30 font-mono">
              Record #{activeRecord.id}
            </span>
          </h1>
          <p className="mt-1" style={{ fontSize: 14, color: 'var(--color-muted)' }}>
            This record has 4 checks passed and 1 issue requiring attention.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 mt-2 sm:mt-0">
          <button
            type="button"
            onClick={handleReRun}
            disabled={isVerifying}
            className="gov-btn-outline"
          >
            <RefreshCw className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>Re-run Checks</span>
          </button>

          <button
            type="button"
            onClick={handleApproveRecord}
            className="gov-btn-primary"
          >
            <Check className="w-4 h-4" />
            <span>Approve Record</span>
          </button>
        </div>
      </div>

      {/* Area Discrepancy Card */}
      <div className="gov-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border)] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[var(--color-warning)]" />
              Area Variance Comparison
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Plot 302 · Mouza Kanchenjunga (JL 42)</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-warning-bg)] text-[var(--color-warning)] border border-[var(--color-warning-border)]/30 text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" />
            Needs field verification
          </span>
        </div>

        {/* 3 Metric Comparison Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-center">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block">
              Document Area
            </span>
            <span className="text-2xl font-bold text-[var(--color-text-primary)] font-mono mt-1 block">
              0.82 acre
            </span>
            <span className="text-[12px] text-[var(--color-text-secondary)] mt-0.5 block">From Khatian #1456 manuscript</span>
          </div>

          <div className="p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-center">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block">
              Cadastral Reference
            </span>
            <span className="text-2xl font-bold text-[var(--color-primary)] font-mono mt-1 block">
              0.75 acre
            </span>
            <span className="text-[12px] text-[var(--color-text-secondary)] mt-0.5 block">From GIS Cadastral Parcel #302</span>
          </div>

          <div className="p-4 rounded-xl bg-[var(--color-warning-bg)]/60 border border-[var(--color-warning-border)]/40 text-center">
            <span className="text-xs font-semibold text-[var(--color-warning)] uppercase tracking-wider block">
              Difference
            </span>
            <span className="text-2xl font-bold text-[var(--color-warning)] font-mono mt-1 block">
              +0.07 acre
            </span>
            <span className="text-[12px] text-[var(--color-warning)] mt-0.5 block">Exceeds ±0.05 tolerance limit</span>
          </div>
        </div>

        {/* Human Explanatory Notice */}
        <div className="p-3.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl flex items-start gap-3 text-xs text-[var(--color-text-primary)]">
          <Info className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Officer Note:</span>
            <p className="text-[var(--color-text-secondary)] mt-0.5">
              The document and cadastral area do not match. Please review the source record before approval.
            </p>
          </div>
        </div>
      </div>

      {/* Validation Checklist Card */}
      <div className="gov-card p-6 space-y-4 mb-6">
        <h3 className="text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
          <ShieldCheck className="w-4 h-4 text-[var(--color-primary)]" />
          Rule Verification Checklist
        </h3>

        <div className="divide-y divide-[var(--color-border)]/60">
          {checklistItems.map((item, idx) => (
            <div key={idx} className="py-3 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {item.passed ? (
                    <div className="w-5 h-5 rounded-full bg-[var(--color-success-bg)] text-[var(--color-success)] flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[var(--color-warning-bg)] text-[var(--color-warning)] flex items-center justify-center">
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--color-text-primary)]">{item.label}</h4>
                  <p className="text-[12px] text-[var(--color-text-secondary)] mt-0.5">{item.note}</p>
                </div>
              </div>

              <span
                className={`text-[12px] font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${
                  item.passed
                    ? 'bg-[var(--color-success-bg)] text-[var(--color-primary)]'
                    : 'bg-[var(--color-warning-bg)] text-[var(--color-warning)] border border-[var(--color-warning-border)]/30'
                }`}
              >
                {item.passed ? 'Passed' : 'Needs Review'}
              </span>
            </div>
          ))}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="pt-4 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => navigate('/documents/1024')}
            className="text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] flex items-center gap-1"
          >
            <span>← Return to Extracted Fields</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('/gis-map')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-[var(--color-border-subtle)] text-[var(--color-primary)] border border-[var(--color-primary)]/30 text-xs font-semibold transition-colors"
            >
              <Map className="w-3.5 h-3.5" />
              <span>Locate on Cadastral Map</span>
            </button>

            <button
              onClick={handleApproveRecord}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-semibold shadow-2xs transition-colors"
            >
              <span>Approve Record</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
