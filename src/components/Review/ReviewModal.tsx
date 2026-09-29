import React, { useState, useEffect } from 'react';
import { Modal } from '../Common/Modal';
import { ConfidenceBadge } from '../Common/ConfidenceBadge';
import { ReviewQueueItem } from '../../types';
import { getSampleDocumentSvg } from '../../data/sampleDocumentSvg';
import { Check, X, Save, AlertTriangle, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useLandRecord } from '../../context/LandRecordContext';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ReviewQueueItem | null;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, item }) => {
  const [correctedValue, setCorrectedValue] = useState<string>('');
  const [officerNote, setOfficerNote] = useState<string>(
    'Plot number corrected after checking source document.'
  );

  useEffect(() => {
    if (item) {
      setCorrectedValue(item.suggestedValue || item.extractedValue);
      if (item.field === 'Plot No.') {
        setOfficerNote('Plot number corrected from 372 to 302 based on Cadastral Sheet visual verification.');
      } else {
        setOfficerNote(`Verified field ${item.field} against original Khatian scan.`);
      }
    }
  }, [item]);

  if (!item) return null;

  const docSvgUrl = getSampleDocumentSvg();

  const handleApprove = async () => {
    try {
      await fetch(`/api/records/${item.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Verified' })
      });
      onClose();
      // Optionally trigger a refresh here if you passed a callback
    } catch(err) {
      console.error(err);
    }
  };

  const handleReject = () => {
    // reject logic
    onClose();
  };

  const handleSaveCorrection = async () => {
    try {
      await fetch(`/api/records/${item.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Verified' })
      });
      onClose();
    } catch(err) {
      console.error(err);
    }
  };

  // Crop box
  const cropX = Math.max(0, item.cropCoordinates.x - 20);
  const cropY = Math.max(0, item.cropCoordinates.y - 15);
  const cropWidth = item.cropCoordinates.width + 40;
  const cropHeight = item.cropCoordinates.height + 30;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Verify Record ${item.recordId} · ${item.field}`}
      subtitle="Resolve extraction ambiguity before municipal land mutation"
      maxWidth="3xl"
    >
      <div className="space-y-5">
        {/* Status banner */}
        <div className="flex items-center justify-between p-3 bg-[var(--color-warning-bg)] rounded-xl border border-[var(--color-warning-border)]/30 text-xs">
          <div className="flex items-center gap-2 text-[var(--color-warning)] font-semibold">
            <AlertTriangle className="w-4 h-4" />
            <span>Status: Needs verification</span>
          </div>
          <span className="text-[var(--color-text-secondary)] text-[12px]">
            Flagged Issue: <strong className="text-[var(--color-text-primary)] font-semibold">{item.reason}</strong>
          </span>
        </div>

        {/* 3-Column Workspace: Left Document / Center Extracted / Right Notes */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* LEFT: Document Snippet (5 cols) */}
          <div className="md:col-span-5 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-[var(--color-text-primary)]">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                Original Scan Snippet
              </span>
              <span className="text-[12px] text-[var(--color-text-secondary)]">Page 1</span>
            </div>

            <div className="relative h-48 bg-[#FAF6EE] rounded-xl overflow-hidden border border-[var(--color-border)] shadow-inner flex items-center justify-center p-2">
              <svg
                viewBox={`${cropX} ${cropY} ${cropWidth} ${cropHeight}`}
                className="w-full h-full object-contain"
              >
                <image href={docSvgUrl} x="0" y="0" width="800" height="1100" />
                <rect
                  x={item.cropCoordinates.x}
                  y={item.cropCoordinates.y}
                  width={item.cropCoordinates.width}
                  height={item.cropCoordinates.height}
                  fill="var(--color-warning-border)"
                  fillOpacity="0.25"
                  stroke="var(--color-warning)"
                  strokeWidth="2.5"
                  strokeDasharray="4,2"
                  rx="3"
                />
              </svg>

              <div className="absolute top-2 right-2 bg-white/95 px-2 py-0.5 rounded text-[10.5px] font-bold text-[var(--color-warning)] border border-[var(--color-warning-border)]/30 flex items-center gap-1 shadow-2xs">
                <span>Field Region</span>
              </div>
            </div>
          </div>

          {/* CENTER & RIGHT: Extracted info and officer notes (7 cols) */}
          <div className="md:col-span-7 space-y-3.5">
            {/* Values comparison */}
            <div className="grid grid-cols-2 gap-3 bg-[var(--color-bg)] p-3.5 rounded-xl border border-[var(--color-border)] text-xs">
              <div>
                <span className="text-[var(--color-text-secondary)] text-[12px] block">AI Extracted Value</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold text-[var(--color-text-primary)] text-base font-mono">{item.extractedValue}</span>
                  <ConfidenceBadge confidence={item.confidence} showLevel={false} />
                </div>
              </div>

              <div>
                <span className="text-[var(--color-text-secondary)] text-[12px] block">Suggested Value</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="font-bold text-[var(--color-primary)] text-base font-mono bg-[var(--color-success-bg)] px-2 py-0.5 rounded border border-[var(--color-primary)]/20">
                    {item.suggestedValue}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-success)] shrink-0" />
                </div>
              </div>
            </div>

            {/* Editable Correction Field */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[var(--color-text-primary)]">
                Verified / Corrected Value:
              </label>
              <input
                type="text"
                value={correctedValue}
                onChange={(e) => setCorrectedValue(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] font-bold font-mono focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all shadow-2xs"
                placeholder="Enter verified value..."
              />
            </div>

            {/* Officer Note */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[var(--color-text-secondary)]">
                Officer Verification Note:
              </label>
              <textarea
                rows={2}
                value={officerNote}
                onChange={(e) => setOfficerNote(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReject}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[var(--color-error-bg)] text-[var(--color-error)] text-xs font-semibold border border-[var(--color-border)] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reject</span>
            </button>

            <button
              type="button"
              onClick={handleApprove}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--color-success-bg)] hover:bg-[var(--color-primary)] text-[var(--color-primary)] hover:text-white text-xs font-semibold border border-[var(--color-primary)]/30 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Accept Extracted</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg bg-white hover:bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)] text-xs font-medium border border-[var(--color-border)] transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveCorrection}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-semibold shadow-2xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Correction &amp; Approve</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
