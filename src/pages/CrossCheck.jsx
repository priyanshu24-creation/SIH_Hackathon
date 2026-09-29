import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useRecords } from '../context/RecordsContext';
import CadastralMap from '../components/gis/CadastralMap';
import { 
  GitCompare, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Eye,
  Layers,
  Sparkles
} from 'lucide-react';

export default function CrossCheck() {
  const [searchParams] = useSearchParams();
  const initialRecordId = searchParams.get('recordId') || "LR-2026-001284";

  // Switch between Demonstration Cases
  const [demoMode, setDemoMode] = useState(
    initialRecordId === "LR-2026-008421" ? "mismatch" : "match"
  );

  const demoCases = {
    match: {
      title: "Case A: Match Confirmed (Standard Validation)",
      recordId: "LR-2026-001284",
      docName: "Khatian_Record_102.pdf",
      owner: "Kiran Subba",
      surveyNumber: "124/3",
      docArea: "2.45 acres",
      gisArea: "2.45 acres",
      village: "Singamari",
      parcelId: "PCL-10284",
      result: "Match Confirmed",
      status: "success",
      diff: "0.00 acres (100% boundary parity)",
      notes: "Deed boundary lengths and calculated polygon area are identical within survey tolerance standards."
    },
    mismatch: {
      title: "Case B: Area Mismatch Detected (Spatial Alert)",
      recordId: "LR-2026-008421",
      docName: "Mutation_Deed_8421.pdf",
      owner: "Anjali Basnet",
      surveyNumber: "125/2",
      docArea: "2.45 acres",
      gisArea: "2.61 acres",
      village: "Singamari",
      parcelId: "PCL-10285",
      result: "Area Mismatch Detected",
      status: "warning",
      diff: "+0.16 acres (6.5% boundary deviation)",
      notes: "The physical cadastral shapefile encompasses 2.61 acres, while the deed asserts 2.45 acres. Field survey re-measurement required."
    }
  };

  const activeCase = demoCases[demoMode];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Document ↔ Map Cross-check
            </h1>
            <span className="text-[10.5px] font-mono bg-brand-50 text-brand-700 px-2 py-0.5 rounded border border-brand-200 font-bold">
              Spatial Parity Analysis
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Bi-directional cross-verification between extracted deed text attributes and GIS cadastral polygon boundaries.
          </p>
        </div>

        {/* Demo Mode Toggle */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setDemoMode("match")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              demoMode === "match"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            ✓ Demo 1: Match Confirmed
          </button>
          <button
            onClick={() => setDemoMode("mismatch")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              demoMode === "mismatch"
                ? "bg-white text-amber-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            ⚠ Demo 2: Area Mismatch
          </button>
        </div>
      </div>

      {/* Result Status Banner */}
      <div className={`p-5 rounded-2xl border shadow-card flex flex-col sm:flex-row items-center justify-between gap-4 ${
        activeCase.status === "success"
          ? "bg-emerald-50/80 border-emerald-200 text-emerald-950"
          : "bg-amber-50/80 border-amber-200 text-amber-950"
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            activeCase.status === "success"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "bg-amber-600 text-white shadow-md shadow-amber-600/20"
          }`}>
            {activeCase.status === "success" ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <AlertTriangle className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="text-sm font-extrabold flex items-center gap-2">
              <span>{activeCase.result}</span>
              <span className="text-xs font-mono font-normal">({activeCase.diff})</span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 max-w-xl">
              {activeCase.notes}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to={`/app/records/${activeCase.recordId}`}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs font-semibold transition-colors shadow-xs"
          >
            View Document Deed
          </Link>
          <Link
            to={`/app/verification/${activeCase.recordId}`}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
          >
            Verify in Queue
          </Link>
        </div>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT: Extracted Document Information */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Extracted Document Information
                </h3>
                <span className="text-[12px] font-mono text-slate-400">
                  {activeCase.recordId} • {activeCase.docName}
                </span>
              </div>
            </div>
            <span className="text-[10.5px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              OCR Extracted
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Survey Number / Plot</span>
              <span className="text-sm font-extrabold text-slate-900">{activeCase.surveyNumber}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Deed Stated Area</span>
              <span className="text-sm font-extrabold text-slate-900">{activeCase.docArea}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Recorded Owner</span>
              <span className="font-bold text-slate-800">{activeCase.owner}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Mouza / Village</span>
              <span className="font-semibold text-slate-800">{activeCase.village}</span>
            </div>
          </div>
        </div>

        {/* RIGHT: GIS Cadastral Parcel Information */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  GIS Cadastral Parcel Geometry
                </h3>
                <span className="text-[12px] font-mono text-slate-400">
                  Parcel ID: {activeCase.parcelId}
                </span>
              </div>
            </div>
            <span className="text-[10.5px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 font-medium">
              Spatial Layer
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500 font-medium">GIS Survey Plot No</span>
              <span className="text-sm font-extrabold text-slate-900">{activeCase.surveyNumber}</span>
            </div>

            <div className={`p-3 rounded-xl border flex items-center justify-between ${
              activeCase.status === "success"
                ? "bg-emerald-50/50 border-emerald-200"
                : "bg-rose-50/60 border-rose-200"
            }`}>
              <span className="text-slate-600 font-medium">GIS Calculated Area</span>
              <span className={`text-sm font-extrabold ${
                activeCase.status === "success" ? "text-emerald-700" : "text-rose-600"
              }`}>
                {activeCase.gisArea}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Cadastral Boundary Hash</span>
              <span className="font-mono text-slate-700 text-[12px]">GEO-WB-BALLY-10284</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Survey Coordinate System</span>
              <span className="font-mono text-slate-700 text-[12px]">WGS84 (Lat 22.6505, Lng 88.3450)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cadastral Map Context Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Spatial Parcel Boundary Preview: {activeCase.parcelId}
          </h3>
          <span className="text-[12px] text-slate-500">
            Selected Plot {activeCase.surveyNumber} highlighted in blue on cadastral map
          </span>
        </div>

        <CadastralMap
          selectedParcelId={activeCase.parcelId}
          height="380px"
          showControls={false}
        />
      </div>
    </div>
  );
}
