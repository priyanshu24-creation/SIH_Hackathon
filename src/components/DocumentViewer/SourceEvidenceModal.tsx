import React from 'react';
import { Modal } from '../Common/Modal';
import { ConfidenceBadge } from '../Common/ConfidenceBadge';
import { ExtractedField } from '../../types';
import { getSampleDocumentSvg } from '../../data/sampleDocumentSvg';
import { FileText, MapPin, Eye, CheckCircle2, Search } from 'lucide-react';
import { useLandRecord } from '../../context/LandRecordContext';
import { useToast } from '../../context/ToastContext';

interface SourceEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  field: ExtractedField | null;
}

export const SourceEvidenceModal: React.FC<SourceEvidenceModalProps> = ({
  isOpen,
  onClose,
  field
}) => {
  const { setHighlightedField } = useLandRecord();
  const { showToast } = useToast();

  if (!field) return null;

  const docSvgUrl = getSampleDocumentSvg();

  const handleViewInDocument = () => {
    setHighlightedField(field);
    onClose();
    showToast('Document Position Focused', `Highlighted ${field.field} in document viewer.`, 'info');
  };

  // Compute crop box offset for snippet preview
  const cropX = Math.max(0, field.coordinates.x - 25);
  const cropY = Math.max(0, field.coordinates.y - 20);
  const cropWidth = field.coordinates.width + 50;
  const cropHeight = field.coordinates.height + 40;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Where did this value come from?"
      subtitle={`Original document evidence for ${field.field}`}
      maxWidth="3xl"
    >
      <div className="space-y-5">
        {/* Top Field Summary Card */}
        <div className="flex flex-wrap items-center justify-between p-4 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)]">
          <div>
            <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
              {field.field} {field.labelBengali && <span className="text-[var(--color-text-secondary)]/70 font-normal">({field.labelBengali})</span>}
            </span>
            <h4 className="text-xl font-bold text-[var(--color-text-primary)] mt-0.5">{field.value}</h4>
          </div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <ConfidenceBadge confidence={field.confidence} level={field.confidenceLevel} />
            <span className="text-xs text-[var(--color-text-secondary)] font-medium bg-white px-2.5 py-1 rounded-full border border-[var(--color-border)]">
              Source: Page {field.coordinates.page || 1}
            </span>
          </div>
        </div>

        {/* Two-column layout: Source Location snippet & Extraction details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Left Column: Cropped Source Location (7 cols) */}
          <div className="md:col-span-7 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[var(--color-text-primary)]">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[var(--color-primary)]" />
                Cropped Document Area
              </span>
              <span className="text-[12px] text-[var(--color-text-secondary)] font-mono">Page {field.coordinates.page}</span>
            </div>

            {/* Cropped Document Viewport */}
            <div className="relative h-56 bg-[#FAF6EE] rounded-xl overflow-hidden border border-[var(--color-border)] shadow-inner flex items-center justify-center p-2">
              <svg
                viewBox={`${cropX} ${cropY} ${cropWidth} ${cropHeight}`}
                className="w-full h-full object-contain"
              >
                <image href={docSvgUrl} x="0" y="0" width="800" height="1100" />
                {/* Visual Highlight rectangle around target text */}
                <rect
                  x={field.coordinates.x}
                  y={field.coordinates.y}
                  width={field.coordinates.width}
                  height={field.coordinates.height}
                  fill="var(--color-primary)"
                  fillOpacity="0.2"
                  stroke="var(--color-primary)"
                  strokeWidth="2.5"
                  strokeDasharray="4,2"
                  rx="3"
                />
              </svg>

              {/* Verified badge */}
              <div className="absolute bottom-2.5 right-2.5 bg-white/90 backdrop-blur-xs px-2 py-1 rounded-md text-[11px] font-semibold text-[var(--color-primary)] border border-[var(--color-border)] flex items-center gap-1 shadow-2xs">
                <CheckCircle2 className="w-3 h-3 text-[var(--color-success)]" />
                <span>Text Bounding Box</span>
              </div>
            </div>
          </div>

          {/* Right Column: Metadata & Transparency Details (5 cols) */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
                Extraction Details
              </h5>

              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]">
                  <span className="text-[var(--color-text-secondary)] block text-[12px]">Extraction Method</span>
                  <span className="font-semibold text-[var(--color-text-primary)]">Optical Character Recognition</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]">
                  <span className="text-[var(--color-text-secondary)] block text-[12px]">Language Script</span>
                  <span className="font-semibold text-[var(--color-text-primary)]">Bengali (বাংলা) Manuscript</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]">
                  <span className="text-[var(--color-text-secondary)] block text-[12px]">Review Status</span>
                  <span className="font-semibold text-[var(--color-primary)]">
                    {field.confidence >= 90 ? 'Passed automated checks' : 'Flagged for officer confirmation'}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleViewInDocument}
              className="w-full py-2 px-3 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Eye className="w-4 h-4" />
              <span>Locate in Full Document</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
