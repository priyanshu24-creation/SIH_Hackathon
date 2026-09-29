import React, { useState } from 'react';
import {
  Search,
  Layers,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Maximize2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { GISParcel } from '../../types';
import { gisParcels } from '../../data/mockData';
import { useLandRecord } from '../../context/LandRecordContext';
import { StatusBadge } from '../Common/StatusBadge';
import { useToast } from '../../context/ToastContext';

interface CadastralMapProps {
  initialPlot?: string;
  heightClass?: string;
  compact?: boolean;
}

export const CadastralMap: React.FC<CadastralMapProps> = ({
  initialPlot = '302',
  heightClass = 'h-[580px]',
  compact = false
}) => {
  const { showToast } = useToast();
  const { activeParcel, setActiveParcel } = useLandRecord();
  const [selectedPlot, setSelectedPlot] = useState<string>(initialPlot);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCadastral, setShowCadastral] = useState<boolean>(true);
  const [showParcels, setShowParcels] = useState<boolean>(true);
  const [showSatellite, setShowSatellite] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const currentParcel =
    gisParcels.find((p) => p.plotNo === selectedPlot) ||
    activeParcel ||
    gisParcels[0];

  const handleParcelClick = (parcel: GISParcel) => {
    setSelectedPlot(parcel.plotNo);
    setActiveParcel(parcel);
    showToast('Parcel Selected', `Plot #${parcel.plotNo} loaded into Cadastral inspector.`, 'info');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = gisParcels.find(
      (p) =>
        p.plotNo.includes(searchQuery.trim()) ||
        p.khatianNo.includes(searchQuery.trim()) ||
        p.village.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
    if (found) {
      handleParcelClick(found);
    } else {
      showToast('Search Result', `No parcel found matching "${searchQuery}". Showing Plot 302.`, 'warning');
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-xl border border-[var(--color-border)] shadow-2xs overflow-hidden">
      {/* Top GIS Search & Control Bar */}
      <div className="p-3.5 bg-[var(--color-bg)] border-b border-[var(--color-border)] flex flex-wrap items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 min-w-[240px] max-w-md">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search Khatian, Plot, Village (e.g. 302, 1456, Kanchenjunga)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] shadow-2xs"
            />
            <Search className="w-4 h-4 text-[var(--color-text-secondary)] absolute left-2.5 top-2" />
          </div>
          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-semibold shadow-2xs transition-colors shrink-0"
          >
            Search
          </button>
        </form>

        {/* Map Layers Toggles */}
        <div className="flex items-center gap-4 text-xs font-medium text-[var(--color-text-primary)] bg-white px-3 py-1.5 rounded-lg border border-[var(--color-border)]">
          <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)] text-[12px] font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            Layers:
          </span>

          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showCadastral}
              onChange={(e) => setShowCadastral(e.target.checked)}
              className="rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)] w-3.5 h-3.5"
            />
            <span>Cadastral Boundary</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showParcels}
              onChange={(e) => setShowParcels(e.target.checked)}
              className="rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)] w-3.5 h-3.5"
            />
            <span>Land Parcels</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showSatellite}
              onChange={(e) => setShowSatellite(e.target.checked)}
              className="rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)] w-3.5 h-3.5"
            />
            <span>Satellite / Base Map</span>
          </label>
        </div>
      </div>

      {/* Main Map Viewer & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[var(--color-border)]">
        {/* LEFT: Map Canvas (8 cols) */}
        <div className={`lg:col-span-8 ${heightClass} relative bg-[#F4F6F1] overflow-hidden flex items-center justify-center select-none`}>
          {/* Satellite base simulation */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${
              showSatellite ? 'opacity-90' : 'opacity-0'
            }`}
            style={{
              backgroundImage:
                'radial-gradient(#CBD5CD 1px, transparent 1px), radial-gradient(#9DB0A4 1px, #E5ECE5 1px)',
              backgroundSize: '32px 32px',
              backgroundPosition: '0 0, 16px 16px'
            }}
          />

          {/* Interactive SVG Cadastral Canvas */}
          <svg
            viewBox="100 120 540 480"
            className="w-full h-full p-4 relative z-10"
            style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease-out' }}
          >
            {/* Village Outer Cadastral Boundary */}
            {showCadastral && (
              <polygon
                points="150,160 560,170 580,330 550,510 320,570 140,460"
                fill="none"
                stroke="#8C6D1F"
                strokeWidth="3"
                strokeDasharray="8,5"
              />
            )}

            {/* Irrigation Canal on east side */}
            <path
              d="M 540,160 Q 570,300 520,530"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="10"
              strokeLinecap="round"
              opacity="0.5"
            />
            <text x="560" y="380" fontSize="10" fill="var(--color-primary)" fontWeight="bold" transform="rotate(75 560,380)">
              Irrigation Canal (খাল)
            </text>

            {/* Village Road traversing across boundary */}
            <path
              d="M 120,380 Q 280,350 400,380 T 600,420"
              fill="none"
              stroke="#CBD5CD"
              strokeWidth="9"
              opacity="0.8"
            />
            <path
              d="M 120,380 Q 280,350 400,380 T 600,420"
              fill="none"
              stroke="var(--color-surface)"
              strokeWidth="2"
              strokeDasharray="6,6"
            />

            {/* Land Parcel Polygons */}
            {showParcels &&
              gisParcels.map((parcel) => {
                const isSelected = parcel.plotNo === selectedPlot;
                return (
                  <g
                    key={parcel.plotNo}
                    onClick={() => handleParcelClick(parcel)}
                    className="cursor-pointer group"
                  >
                    <path
                      d={parcel.path}
                      fill={
                        isSelected
                          ? 'var(--color-primary)'
                          : parcel.status === 'Mismatch'
                          ? 'var(--color-warning-border)'
                          : 'var(--color-accent)'
                      }
                      fillOpacity={isSelected ? 0.6 : showSatellite ? 0.35 : 0.22}
                      stroke={isSelected ? 'var(--color-primary-hover)' : 'var(--color-text-primary)'}
                      strokeWidth={isSelected ? '3' : '1.5'}
                      className="transition-all duration-200 group-hover:fill-opacity-45"
                    />

                    {/* Plot label and area badge on map */}
                    <g transform={`translate(${parcel.labelPos.x}, ${parcel.labelPos.y})`}>
                      <rect
                        x="-28"
                        y="-14"
                        width="56"
                        height="28"
                        rx="4"
                        fill={isSelected ? 'var(--color-primary)' : 'var(--color-surface)'}
                        fillOpacity="0.95"
                        stroke={isSelected ? 'var(--color-primary-hover)' : 'var(--color-border)'}
                        strokeWidth="1"
                        className="shadow-2xs"
                      />
                      <text
                        x="0"
                        y="-1"
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="bold"
                        fill={isSelected ? 'var(--color-surface)' : 'var(--color-text-primary)'}
                      >
                        Plot {parcel.plotNo}
                      </text>
                      <text
                        x="0"
                        y="10"
                        textAnchor="middle"
                        fontSize="8.5"
                        fill={isSelected ? 'var(--color-success-bg)' : 'var(--color-text-secondary)'}
                      >
                        {parcel.gisArea} ac
                      </text>
                    </g>
                  </g>
                );
              })}
          </svg>

          {/* Map floating tools */}
          <div className="absolute top-3 left-3 bg-white rounded-lg p-1 border border-[var(--color-border)] shadow-2xs flex flex-col gap-1 z-20">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
              className="p-1.5 hover:bg-[var(--color-border-subtle)] rounded text-[var(--color-text-primary)]"
              title="Zoom in map"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
              className="p-1.5 hover:bg-[var(--color-border-subtle)] rounded text-[var(--color-text-primary)]"
              title="Zoom out map"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 hover:bg-[var(--color-border-subtle)] rounded text-[var(--color-text-primary)]"
              title="Reset view"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Compass rose badge */}
          <div className="absolute top-3 right-3 bg-white px-2.5 py-1 rounded-lg border border-[var(--color-border)] shadow-2xs flex items-center gap-1.5 text-[12px] font-bold text-[var(--color-text-primary)] z-20">
            <Compass className="w-4 h-4 text-[var(--color-error)]" />
            <span>N · Cadastral Grid</span>
          </div>

          {/* Map legend bottom */}
          <div className="absolute bottom-3 left-3 bg-white px-3 py-1.5 rounded-lg border border-[var(--color-border)] shadow-2xs flex items-center gap-3 text-[12px] text-[var(--color-text-primary)] z-20">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-[var(--color-primary)] rounded-xs inline-block" /> Selected Plot
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-[var(--color-accent)] rounded-xs inline-block" /> Validated
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-[var(--color-warning-border)] rounded-xs inline-block" /> Variance Flag
            </span>
          </div>
        </div>

        {/* RIGHT: Selected Parcel Details (4 cols) */}
        <div className="lg:col-span-4 p-5 bg-white flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div className="border-b border-[var(--color-border)] pb-3 flex items-start justify-between">
              <div>
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Cadastral Inspection
                </span>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mt-0.5">
                  Plot No. {currentParcel.plotNo}
                </h3>
              </div>
              <StatusBadge status={currentParcel.status} />
            </div>

            {/* Key Field Grid */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[var(--color-border)]/60">
                <span className="text-[var(--color-text-secondary)] font-medium">Khatian No.:</span>
                <span className="font-bold text-[var(--color-text-primary)] font-mono">{currentParcel.khatianNo}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[var(--color-border)]/60">
                <span className="text-[var(--color-text-secondary)] font-medium">Owner (Registry):</span>
                <span className="font-semibold text-[var(--color-text-primary)]">{currentParcel.owner}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[var(--color-border)]/60">
                <span className="text-[var(--color-text-secondary)] font-medium">Village / Mouza:</span>
                <span className="font-semibold text-[var(--color-text-primary)]">{currentParcel.village}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[var(--color-border)]/60">
                <span className="text-[var(--color-text-secondary)] font-medium">Land Type:</span>
                <span className="font-semibold text-[var(--color-text-primary)]">{currentParcel.landType}</span>
              </div>

              {/* Area Comparison with Mismatch Flag */}
              <div className="p-3 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--color-text-secondary)]">GIS Polygon Area:</span>
                  <span className="font-bold text-[var(--color-text-primary)] font-mono text-sm">
                    {currentParcel.gisArea} acre
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[var(--color-text-secondary)]">Document Area:</span>
                  <span className="font-bold text-[var(--color-text-primary)] font-mono text-sm">
                    {currentParcel.docArea} acre
                  </span>
                </div>

                {currentParcel.gisArea !== currentParcel.docArea ? (
                  <div className="pt-2 border-t border-[var(--color-border)] flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-[var(--color-warning)] flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-[var(--color-warning)]" />
                      Difference:
                    </span>
                    <span className="text-xs font-bold text-[var(--color-warning)] bg-[var(--color-warning-bg)] px-2 py-0.5 rounded border border-[var(--color-warning-border)]/30">
                      +{(currentParcel.docArea - currentParcel.gisArea).toFixed(2)} acre
                    </span>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-[var(--color-border)] flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-[var(--color-primary)] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-success)]" />
                      Area Matched
                    </span>
                    <span className="text-xs font-bold text-[var(--color-primary)] bg-[var(--color-success-bg)] px-2 py-0.5 rounded">
                      Exact match
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Action */}
          <div className="pt-4 border-t border-[var(--color-border)] space-y-2">
            <button
              type="button"
              onClick={() =>
                showToast(
                  'Cadastral Verification',
                  `Spatial polygon for Plot #${currentParcel.plotNo} confirmed for Darjeeling Sadar Mouza.`,
                  'success'
                )
              }
              className="w-full py-2.5 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-semibold shadow-2xs transition-colors"
            >
              Confirm Parcel Boundary
            </button>
            <p className="text-[10.5px] text-[var(--color-text-secondary)] text-center">
              Coordinates referenced from Survey of India Mouza Kanchenjunga Cadastral Sheet #42.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
