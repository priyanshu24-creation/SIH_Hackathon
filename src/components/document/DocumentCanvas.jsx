import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, FileText, Stamp, CheckCircle, AlertCircle } from 'lucide-react';

export default function DocumentCanvas({ 
  record, 
  activeFieldKey = "surveyNumber", 
  onFieldClick = () => {} 
}) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);

  if (!record || !record.fields) return null;

  const fields = record.fields;

  return (
    <div className="bg-slate-900/90 rounded-2xl p-4 flex flex-col h-full border border-slate-800 shadow-elevated">
      {/* Canvas Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-300 text-xs">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-brand-400" />
          <span className="font-semibold text-white truncate max-w-[200px]">
            {record.documentName}
          </span>
          <span className="text-[10.5px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
            Page {currentPage} of {record.pages || 3}
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setZoomLevel(prev => Math.max(75, prev - 15))}
            className="p-1 hover:bg-slate-700 rounded text-slate-300 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[12px] font-mono px-1 text-slate-300">{zoomLevel}%</span>
          <button
            onClick={() => setZoomLevel(prev => Math.min(150, prev + 15))}
            className="p-1 hover:bg-slate-700 rounded text-slate-300 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(100)}
            className="p-1 hover:bg-slate-700 rounded text-slate-300 transition-colors"
            title="Reset Zoom"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Document Viewport */}
      <div className="flex-1 overflow-auto p-4 flex justify-center items-start min-h-[520px]">
        <div 
          className="relative document-paper border border-amber-900/20 rounded shadow-2xl transition-transform duration-200 origin-top text-slate-800"
          style={{
            width: `${(620 * zoomLevel) / 100}px`,
            minHeight: `${(840 * zoomLevel) / 100}px`,
            padding: `${(28 * zoomLevel) / 100}px`,
            fontSize: `${(12 * zoomLevel) / 100}px`
          }}
        >
          {/* Faded Official Background Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <Stamp className="w-80 h-80 text-amber-950" />
          </div>

          {/* Official Document Header */}
          <div className="border-b-2 border-amber-950/30 pb-3 mb-4 text-center">
            <div className="text-[12px] tracking-widest uppercase font-bold text-amber-950/80">
              Government of West Bengal • Revenue & Land Reforms
            </div>
            <h2 className="text-base font-extrabold tracking-wide text-amber-950 font-serif mt-0.5">
              খতিয়ান ও সত্যলিপি (Record of Rights — ROR)
            </h2>
            <div className="flex items-center justify-between text-[10.5px] text-amber-900/70 font-mono mt-1">
              <span>FORM NO. 54B / REVISED 1974</span>
              <span>MOUZA: BALLY • J.L. NO: 12</span>
              <span>DISTRICT: HOWRAH</span>
            </div>
          </div>

          {/* Form Metadata Grid */}
          <div className="border border-amber-950/30 bg-amber-50/40 p-2.5 rounded mb-4 text-[12px] font-mono grid grid-cols-2 gap-2 text-amber-950/90">
            <div><strong>Record ID:</strong> {record.id}</div>
            <div><strong>Registration Date:</strong> 14-Aug-1998</div>
            <div><strong>Touzi No:</strong> 2841 / Sadar</div>
            <div><strong>P.S. / Thana:</strong> Bally Police Station</div>
          </div>

          {/* Document Table Mockup */}
          <div className="border border-amber-950/40 rounded overflow-hidden mb-4 bg-white/70">
            <div className="grid grid-cols-4 bg-amber-900/10 border-b border-amber-950/30 text-[10.5px] font-bold text-amber-950 p-1.5 text-center">
              <div>রায়ত / খতিয়ান নং<br/>(Owner / Khata)</div>
              <div>দাগ নম্বর<br/>(Survey / Plot)</div>
              <div>জমির পরিমাণ<br/>(Area in Acres)</div>
              <div>জমির শ্রেণী<br/>(Classification)</div>
            </div>

            <div className="divide-y divide-amber-950/20 text-[12px]">
              <div className="grid grid-cols-4 p-2 text-center items-center">
                <div className="font-semibold text-slate-800">
                  {fields.khataNumber?.value || "KT-89"}
                  <div className="text-[9.45px] text-slate-500 font-serif">রায়তি খতিয়ান</div>
                </div>
                <div className="font-bold text-slate-900">
                  {fields.surveyNumber?.value || "124/3"}
                  <div className="text-[9.45px] text-slate-500">বালী মৌজা</div>
                </div>
                <div className="font-semibold text-slate-900">
                  {fields.area?.value || "2.45 acres"}
                  <div className="text-[9.45px] text-slate-500">২ একর ৪৫ শতক</div>
                </div>
                <div className="text-slate-700">
                  {fields.landClassification?.value || "Agricultural"}
                  <div className="text-[9.45px] text-slate-500">ধানী জমি</div>
                </div>
              </div>

              <div className="p-2 text-xs space-y-1 bg-amber-50/20">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950">মালিকের বিবরণ (Owner Details):</span>
                  <span className="text-[10.5px] font-mono text-amber-900">আংশিক হস্তান্তরিত</span>
                </div>
                <div className="font-medium text-slate-800 pl-2 border-l-2 border-amber-800/40">
                  {fields.ownerName?.rawText || "শ্রী রাহুল কুমার দাস (S/O স্বর্গীয় বঙ্কিম দাস)"}
                </div>
              </div>
            </div>
          </div>

          {/* Legal / Mutation Remarks Section */}
          <div className="border border-dashed border-amber-950/40 p-2.5 rounded mb-4 text-[10.5px] text-amber-950/80 space-y-1 bg-white/50">
            <div className="font-bold">মিউটেশন ও দখল সত্যের মন্তব্য (Remarks & Mutation Notes):</div>
            <p>
              নামপত্তন কেস নং {fields.mutationNumber?.value || "MUT-2024-819"} মারফত স্বত্বাধিকার লিপিবদ্ধ হইল। 
              দলিল নং {fields.registrationNumber?.value || "REG-WB-1998-041"} বলে দখল স্বীকৃত।
            </p>
          </div>

          {/* Stamps & Seals Area */}
          <div className="flex items-end justify-between pt-4 border-t border-amber-950/30 text-[10.5px] font-mono text-amber-900/80">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-2 border-red-700/60 text-red-700/80 flex flex-col items-center justify-center p-1 text-[8.4px] font-bold rotate-[-12deg] tracking-tighter">
                <span>SUB REGISTRAR</span>
                <span>HOWRAH</span>
                <span>1998</span>
              </div>
              <span className="mt-1">District Seal</span>
            </div>

            <div className="text-right">
              <div className="h-8 border-b border-amber-950/40 w-32 ml-auto mb-1"></div>
              <div className="font-bold">Revenue Officer (RO)</div>
              <div>Bally Settlement Camp</div>
            </div>
          </div>

          {/* Bounding Box Overlays (Evidence-Linked Extraction) */}
          {Object.entries(fields).map(([key, field]) => {
            if (!field.bbox) return null;
            const isActive = activeFieldKey === key;
            const { top, left, width, height } = field.bbox;

            return (
              <div
                key={key}
                onClick={() => onFieldClick(key)}
                className={`absolute cursor-pointer transition-all duration-300 rounded border ${
                  isActive
                    ? "bg-brand-500/25 border-brand-500 ring-2 ring-brand-400 ring-offset-1 highlight-box-active z-20"
                    : "bg-brand-500/10 border-brand-400/40 hover:bg-brand-500/20 hover:border-brand-500 z-10"
                }`}
                style={{
                  top: `${top}%`,
                  left: `${left}%`,
                  width: `${width}%`,
                  height: `${height}%`
                }}
                title={`Click to view OCR evidence for ${field.label}`}
              >
                {isActive && (
                  <div className="absolute -top-5 left-0 bg-brand-600 text-white text-[9.45px] font-bold px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1 whitespace-nowrap">
                    <CheckCircle className="w-2.5 h-2.5" />
                    <span>{field.label}: {field.confidence}%</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Canvas Footer Explainer */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-400"></span>
          <span>Click on bounding boxes or fields to inspect source evidence</span>
        </div>
        <span className="text-[12px] font-mono text-slate-500">Coordinates mapped: 11 fields</span>
      </div>
    </div>
  );
}
