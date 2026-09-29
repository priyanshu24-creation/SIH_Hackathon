import React from 'react';
import ConfidenceMeter from '../Common/ConfidenceMeter';
import { Eye, MapPin, CheckCircle2, Sparkles, FileSearch, ShieldCheck } from 'lucide-react';

export default function EvidenceCard({ field, fieldKey }) {
  if (!field) {
    return (
      <div className="bg-slate-50 rounded-xl p-4 border border-dashed border-slate-300 text-center text-xs text-slate-500">
        <FileSearch className="w-6 h-6 text-slate-400 mx-auto mb-1" />
        <span>Click any extracted field on the left or document bounding box to view source evidence.</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-card p-4 space-y-3">
      {/* Evidence Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Source Evidence
            </h4>
            <div className="text-[12px] text-slate-500">
              Page {field.page || 1} • Bounding Box Bounding coordinates mapped
            </div>
          </div>
        </div>

        <span className="text-[10.5px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
          Field: {field.label}
        </span>
      </div>

      {/* Raw Detected Text in Document */}
      <div className="space-y-1">
        <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">
          Detected Text from Original Document
        </label>
        <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-lg text-xs font-mono text-amber-950 leading-relaxed">
          {field.rawText || field.value}
        </div>
      </div>

      {/* Normalized Structured Extracted Value */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
          <div className="text-[10.5px] text-slate-500 font-semibold uppercase">Extracted Value</div>
          <div className="text-sm font-bold text-slate-900 mt-0.5">{field.value}</div>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
          <div className="text-[10.5px] text-slate-500 font-semibold uppercase">Bilingual Script</div>
          <div className="text-sm font-serif font-bold text-slate-800 mt-0.5">
            {field.bengali || "বাংলা প্রতিলিপি"}
          </div>
        </div>
      </div>

      {/* OCR Confidence Breakdown */}
      <div className="space-y-1 pt-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600 font-medium">Character OCR Confidence</span>
        </div>
        <ConfidenceMeter value={field.confidence} showBar={true} />
      </div>

      {/* Verification status footnote */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[12px] text-slate-500">
        <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Bi-directional link verified</span>
        </div>
        <span className="font-mono text-[10.5px]">Model: DocLayout-LM v3</span>
      </div>
    </div>
  );
}
