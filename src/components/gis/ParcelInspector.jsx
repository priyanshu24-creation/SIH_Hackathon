import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../Common/StatusBadge';
import ConfidenceMeter from '../Common/ConfidenceMeter';
import { 
  MapPin, 
  User, 
  Maximize2, 
  FileText, 
  GitCompare, 
  CheckCircle2, 
  AlertTriangle, 
  X,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function ParcelInspector({ parcel, onClose }) {
  const navigate = useNavigate();

  if (!parcel) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 text-center text-slate-500">
        <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <h4 className="text-sm font-semibold text-slate-700">No Parcel Selected</h4>
        <p className="text-xs text-slate-500 mt-1">
          Click any cadastral boundary on the map to inspect parcel ownership, GIS area, and validation link.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold text-slate-900">
              Parcel {parcel.parcelId}
            </span>
            <StatusBadge status={parcel.status} size="sm" />
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Plot No: {parcel.surveyNumber} • {parcel.village}, {parcel.district}</span>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Grid of Key Parcel Properties */}
      <div className="grid grid-cols-2 gap-2.5 text-xs">
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[10.5px] text-slate-400 font-semibold uppercase block">Survey / Plot No</span>
          <span className="text-sm font-bold text-slate-900 mt-0.5 block">{parcel.surveyNumber}</span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[10.5px] text-slate-400 font-semibold uppercase block">Cadastral Area (GIS)</span>
          <span className="text-sm font-bold text-slate-900 mt-0.5 block">{parcel.area}</span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 col-span-2">
          <span className="text-[10.5px] text-slate-400 font-semibold uppercase block">Registered Owner</span>
          <span className="text-xs font-bold text-slate-800 mt-0.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            {parcel.owner}
          </span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[10.5px] text-slate-400 font-semibold uppercase block">Land Classification</span>
          <span className="text-xs font-semibold text-slate-700 mt-0.5 block">{parcel.classification}</span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[10.5px] text-slate-400 font-semibold uppercase block">Mutation Status</span>
          <span className="text-xs font-semibold text-slate-700 mt-0.5 block truncate">{parcel.mutationStatus || "Verified"}</span>
        </div>
      </div>

      {/* Confidence meter */}
      <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600 font-medium">Record Match Confidence</span>
          <span className="font-bold text-slate-800">{parcel.confidence}%</span>
        </div>
        <ConfidenceMeter value={parcel.confidence} showBar={true} showLabel={false} />
      </div>

      {/* Area Cross-check notice */}
      {parcel.areaMatch === false ? (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-rose-700 font-bold">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Area Discrepancy Detected</span>
          </div>
          <p className="text-rose-600 text-[12px] leading-relaxed">
            GIS area is {parcel.gisArea} acres vs Document area of {parcel.docArea} acres (Delta: {parcel.areaDiff}).
          </p>
        </div>
      ) : (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs flex items-center gap-2 text-emerald-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium text-[12px]">GIS boundary aligns with deed dimensions.</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2 pt-1">
        {parcel.recordId && (
          <button
            onClick={() => navigate(`/app/records/${parcel.recordId}`)}
            className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View Extracted Record</span>
          </button>
        )}

        <div className="grid grid-cols-2 gap-2">
          {parcel.recordId && (
            <button
              onClick={() => navigate(`/app/verification/${parcel.recordId}`)}
              className="py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Verify</span>
            </button>
          )}

          <button
            onClick={() => navigate(`/app/gis/cross-check?recordId=${parcel.recordId || ''}`)}
            className="py-2 px-3 bg-white hover:bg-slate-50 text-brand-600 border border-brand-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Cross-check</span>
          </button>
        </div>
      </div>
    </div>
  );
}
