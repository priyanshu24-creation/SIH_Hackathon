import React from 'react';
import { Map, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CadastralMap } from '../components/MapPanel/CadastralMap';
import { useToast } from '../context/ToastContext';

export const GISMap: React.FC = () => {
  const { showToast } = useToast();

  const handleExportGeoJson = () => {
    showToast('Export Initiated', 'Mouza_Kanchenjunga_Cadastral_Parcels.geojson downloaded.', 'info');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title Card */}
      <div className="gov-card px-8 py-6 mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div>
          
          <h1 className="page-title">
            Cadastral Map
          </h1>
          <p className="mt-1" style={{ fontSize: 14, color: 'var(--color-muted)' }}>
            View land parcels and compare them with digitized records.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 mt-2 sm:mt-0">
          <button
            type="button"
            onClick={handleExportGeoJson}
            className="gov-btn-outline"
          >
            <Download className="w-4 h-4 text-[var(--color-primary)]" />
            <span>Export GeoJSON Layer</span>
          </button>
        </div>
      </div>

      {/* Cadastral Map Component */}
      <CadastralMap initialPlot="302" heightClass="h-[620px]" />

      {/* Auxiliary Metadata Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="gov-card p-5">
          <span className="eyebrow block mb-1">Spatial Reference</span>
          <h4 className="font-bold text-[var(--color-text-primary)] mt-1">EPSG:3857 / WGS84 Pseudo-Mercator</h4>
          <p className="text-[var(--color-muted)] text-[12px] mt-0.5">Mouza Kanchenjunga, J.L. No. 42, Darjeeling Sadar</p>
        </div>

        <div className="gov-card p-5">
          <span className="eyebrow block mb-1">Cadastral Sheet</span>
          <h4 className="font-bold text-[var(--color-text-primary)] mt-1">Survey Sheet No. DRJ-1968-04</h4>
          <p className="text-[var(--color-muted)] text-[12px] mt-0.5">Scale: 16 inches = 1 mile (Revisional Survey)</p>
        </div>

        <div className="gov-card p-5">
          <span className="eyebrow block mb-1">Integrity Check</span>
          <h4 className="font-bold text-[var(--color-success)] mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Topologically Closed Parcels</span>
          </h4>
          <p className="text-[var(--color-muted)] text-[12px] mt-0.5">Zero polygon overlaps or unmapped slivers</p>
        </div>
      </div>
    </div>
  );
};
