import React, { useState, useRef } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Download,
  Search,
  Check,
  Eye
} from 'lucide-react';
import { ExtractedField } from '../../types';
import { useLandRecord } from '../../context/LandRecordContext';
import { useToast } from '../../context/ToastContext';

interface DocumentViewerProps {
  fields?: ExtractedField[];
  activeField?: ExtractedField | null;
  onFieldClick?: (field: ExtractedField) => void;
  heightClass?: string;
  showToolbar?: boolean;
  documentUrl?: string;
  fileName?: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  fields = [],
  activeField,
  onFieldClick,
  heightClass = 'h-[560px]',
  showToolbar = true,
  documentUrl,
  fileName = 'Uploaded land record'
}) => {
  const { showToast } = useToast();
  const { openEvidenceModal } = useLandRecord();
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const documentSource = documentUrl || `${import.meta.env.BASE_URL}documents/Hackathon_Demo_real.png`;
  const isPdf = /\.pdf(?:$|\?)/i.test(documentSource) || /\.pdf$/i.test(fileName);
  const [imageNaturalWidth, setImageNaturalWidth] = useState(1240);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.6));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = documentSource;
    link.download = fileName || 'land-record-document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Download Started', 'Original scanned land-record image downloaded.', 'info');
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-xs">
      {/* Document Toolbar */}
      {showToolbar && (
        <div className="bg-white text-[var(--color-text-primary)] px-4 py-3 flex items-center justify-between border-b border-[var(--color-border)] text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--color-text-primary)] truncate max-w-[220px]">{fileName}</span>
            <span className="text-[12px] font-semibold px-2 py-0.5 rounded-md bg-[var(--color-success-bg)] text-[var(--color-primary)] border border-[var(--color-success-border)]">
              Sheet 1 / 1
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Search Button & Input */}
            <div className="relative flex items-center">
              {searchOpen ? (
                <div className="flex items-center bg-[var(--color-border-subtle)] rounded-lg px-2 py-1 border border-[var(--color-border)]">
                  <input
                    type="text"
                    placeholder="Search in document..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none w-32 sm:w-40"
                    autoFocus
                  />
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] ml-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  title="Search in Document"
                  className="p-1.5 rounded-lg hover:bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="h-4 w-px bg-[var(--color-border)] mx-1" />

            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              className="p-1.5 rounded-lg hover:bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[12px] font-mono font-semibold text-[var(--color-text-primary)] w-10 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              title="Zoom In"
              className="p-1.5 rounded-lg hover:bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-[var(--color-border)] mx-1" />

            <button
              onClick={handleRotate}
              title="Rotate 90° Clockwise"
              className="p-1.5 rounded-lg hover:bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            <button
              onClick={handleReset}
              title="Fit to Window"
              className="p-1.5 rounded-lg hover:bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-[var(--color-border)] mx-1" />

            <button
              onClick={handleDownload}
              title="Download Original Scanned Document"
              className="p-1.5 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white transition-colors flex items-center gap-1.5 px-2.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[12px] font-semibold">Download</span>
            </button>
          </div>
        </div>
      )}

      {/* Viewer Canvas Area */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative ${heightClass} w-full bg-[#343D39] overflow-hidden flex items-center justify-center select-none ${
          zoom > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
        }`}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out'
          }}
          className="relative shadow-2xl shrink-0"
        >
          {isPdf ? (
            <iframe
              src={documentSource}
              title={`Original document: ${fileName}`}
              className="w-[620px] h-[760px] bg-white rounded border border-black/30 shadow-2xl"
            />
          ) : (
            <>
              <img
                src={documentSource}
                alt={`Original scanned land record: ${fileName}`}
                className="w-[620px] h-auto max-w-none block pointer-events-none rounded shadow-2xl border border-black/30 object-contain"
                draggable={false}
                onError={(e) => {
                  console.error('Failed to load land record document:', documentSource);
                  e.currentTarget.style.display = 'none';
                }}
                onLoad={(e) => {
                  setImageNaturalWidth(e.currentTarget.naturalWidth || 1240);
                }}
              />

          {/* Interactive Bounding Box Overlays — colour by confidence */}
          {fields.map((field) => {
            const isSelected = activeField?.id === field.id;
            const matchesSearch =
              searchQuery &&
              (field.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
                field.value.toLowerCase().includes(searchQuery.toLowerCase()));

            // Coordinate mapping (scaled to 620px canvas width vs 800px SVG viewbox)
            const scaleFactor = 620 / imageNaturalWidth;
            const left = field.coordinates.x * scaleFactor;
            const top = field.coordinates.y * scaleFactor;
            const width = field.coordinates.width * scaleFactor;
            const height = field.coordinates.height * scaleFactor;

            // Three-state colour
            let normalBg: string, normalBorder: string, activeBg: string, activeBorder: string;
            if (field.confidence >= 90) {
              normalBg = 'rgba(23,130,75,0.15)'; normalBorder = 'rgba(23,130,75,0.7)';
              activeBg = 'rgba(23,130,75,0.30)'; activeBorder = 'var(--color-success)';
            } else if (field.confidence >= 75) {
              normalBg = 'rgba(245,158,11,0.15)'; normalBorder = 'rgba(245,158,11,0.7)';
              activeBg = 'rgba(245,158,11,0.28)'; activeBorder = 'var(--color-warning)';
            } else {
              normalBg = 'rgba(185,28,28,0.15)'; normalBorder = 'rgba(185,28,28,0.65)';
              activeBg = 'rgba(185,28,28,0.25)'; activeBorder = 'var(--color-error)';
            }

            const highlighted = isSelected || !!matchesSearch;

            return (
              <div
                key={field.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onFieldClick) onFieldClick(field);
                  openEvidenceModal(field);
                }}
                style={{
                  left: `${left}px`,
                  top: `${top}px`,
                  width: `${width}px`,
                  height: `${height}px`,
                  background: highlighted ? activeBg : normalBg,
                  border: `1.5px solid ${highlighted ? activeBorder : normalBorder}`,
                  boxShadow: highlighted ? `0 0 0 3px ${activeBorder}40` : 'none',
                }}
                className="absolute rounded cursor-pointer transition-all duration-200 group z-10"
                title={`${field.field}: ${field.value} (${field.confidence}% confidence)`}
              >
                {/* Floating tooltip on hover or selection */}
                <div
                  className={`absolute -top-8 left-0 whitespace-nowrap px-2 py-1 rounded text-[10.5px] font-semibold shadow-md pointer-events-none transition-opacity ${
                    highlighted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                  style={{ background: 'var(--color-text-primary)', color: '#fff', zIndex: 30 }}
                >
                  {field.field}: {field.value} · {field.confidence}%
                </div>
              </div>
            );
          })}
            </>
          )}
        </div>

        {/* Floating Instruction Banner */}
        <div className="absolute bottom-3 left-3 bg-[var(--color-text-primary)]/85 backdrop-blur-xs text-white text-[12px] px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 pointer-events-none shadow-sm">
          <Eye className="w-3.5 h-3.5 text-[var(--color-warning-border)]" />
          <span>Click highlighted regions to compare extracted data with the original document</span>
        </div>
      </div>
    </div>
  );
};
