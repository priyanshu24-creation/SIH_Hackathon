import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecords } from '../context/RecordsContext';
import { 
  CheckCircle2, 
  Clock, 
  Cpu, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Terminal, 
  Layers,
  MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Processing() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setSelectedRecordId } = useRecords();

  const fileInfo = location.state || {
    fileName: "Khatian_Record_102.pdf",
    fileSize: "4.2 MB",
    language: "Bengali / English",
    documentType: "Land Record (Khatian)"
  };

  const [currentStepIndex, setCurrentStepIndex] = useState(3);
  const [progressPercent, setProgressPercent] = useState(48);
  const [logs, setLogs] = useState([
    { time: "00:01", text: "File ingested: " + fileInfo.fileName + " (" + fileInfo.fileSize + ")" },
    { time: "00:02", text: "Contrast ratio: 4.8:1. Deskewing angle corrected: -1.4°" },
    { time: "00:03", text: "Adaptive binarization applied. Faded ink regions enhanced." },
    { time: "00:04", text: "Bilingual OCR active: Detecting Bengali (বাংলা) & English..." }
  ]);

  const steps = [
    { id: 1, title: "File Uploaded", detail: "Payload received and validated against PDF/A standards", status: "done" },
    { id: 2, title: "Image Quality Analysis", detail: "Deskewing, contrast normalization, resolution check (300 DPI)", status: "done" },
    { id: 3, title: "Document Preprocessing", detail: "Binarization, noise removal, stamp border detection", status: "done" },
    { id: 4, title: "OCR & Language Detection", detail: "Recognizing Bengali and English bilingual print & cursive scripts", status: "active" },
    { id: 5, title: "Field Extraction", detail: "NER mapping: Owner Name, Survey Plot, Khata, Area, Mouza", status: "pending" },
    { id: 6, title: "Validation Engine", detail: "Heuristic area calculations & duplicate parcel verification", status: "pending" },
    { id: 7, title: "Confidence Scoring", detail: "Character-level probability weights & bounding-box tagging", status: "pending" },
    { id: 8, title: "GIS Cross-check", detail: "Matching cadastral boundaries with spatial shapefile", status: "pending" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < 8) {
          const next = prev + 1;
          setProgressPercent(Math.min(100, Math.round((next / 8) * 100)));

          // Append simulated logs
          if (next === 5) {
            setLogs((l) => [
              ...l,
              { time: "00:05", text: "Entities extracted: Owner 'Kiran Subba', Plot '124/3', Area '2.45 acres'" }
            ]);
          } else if (next === 6) {
            setLogs((l) => [
              ...l,
              { time: "00:06", text: "Validation checks executed: 6 rules analyzed. Score: 92/100." }
            ]);
          } else if (next === 7) {
            setLogs((l) => [
              ...l,
              { time: "00:07", text: "Confidence matrix compiled: Overall document accuracy 96.2%." }
            ]);
          } else if (next === 8) {
            setLogs((l) => [
              ...l,
              { time: "00:08", text: "Cadastral link established: Parcel PCL-10284 spatial boundary matched." },
              { time: "00:08", text: "✓ Digitization and validation pipeline finished successfully." }
            ]);
          }

          return next;
        }
        clearInterval(timer);
        return prev;
      });
    }, 1800);

    return () => clearInterval(timer);
  }, []);

  const isFinished = currentStepIndex >= 8;

  const handleGoToResult = () => {
    setSelectedRecordId("LR-2026-001284");
    navigate('/app/records/LR-2026-001284');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              AI Digitization Pipeline
            </h1>
            <span className="text-[10.5px] font-mono bg-sky-50 text-sky-700 px-2 py-0.5 rounded border border-sky-200 font-semibold">
              Frontend Simulation
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Processing <strong>{fileInfo.fileName}</strong> ({fileInfo.fileSize}) • {fileInfo.language}
          </p>
        </div>

        {isFinished && (
          <button
            onClick={handleGoToResult}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <span>View Extracted Record</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Progress Bar Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle p-5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">
            {isFinished ? "Pipeline Complete" : `Step ${currentStepIndex} of 8 In Progress...`}
          </span>
          <span className="font-mono font-bold text-brand-600">{progressPercent}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-600 to-emerald-500 rounded-full"
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Vertical Progress Timeline (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-subtle p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Execution Stages
          </h3>

          <div className="space-y-4">
            {steps.map((step) => {
              const isDone = currentStepIndex > step.id || (currentStepIndex === 8 && step.id === 8);
              const isActive = currentStepIndex === step.id && currentStepIndex < 8;

              return (
                <div key={step.id} className="flex items-start gap-3 relative">
                  {/* Step Icon Node */}
                  <div className="relative z-10 shrink-0">
                    {isDone ? (
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-300">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : isActive ? (
                      <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center border border-sky-300">
                        <Clock className="w-4 h-4 animate-spin text-sky-600" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200 text-xs font-mono">
                        {step.id}
                      </div>
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${
                        isDone ? "text-slate-900" : isActive ? "text-sky-700 font-extrabold" : "text-slate-400"
                      }`}>
                        {step.title}
                      </span>
                      {isActive && (
                        <span className="text-[10.5px] font-mono bg-sky-50 text-sky-600 px-1.5 py-0.2 rounded font-semibold animate-pulse">
                          Running
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-slate-500 mt-0.5 leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live Terminal Log Feed (2 cols) */}
        <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 shadow-elevated p-4 flex flex-col justify-between text-slate-300 font-mono text-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400 text-[12px]">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-brand-400" />
                <span>DocLayout Engine Logs</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-[12px] leading-relaxed">
              {logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-slate-500 shrink-0">[{log.time}]</span>
                  <span className="text-slate-300">{log.text}</span>
                </div>
              ))}
              {!isFinished && (
                <div className="flex items-center gap-2 text-sky-400 animate-pulse">
                  <span>&gt;</span>
                  <span>Executing next model phase...</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 mt-4 text-[10.5px] text-slate-500 flex items-center justify-between">
            <span>Model: Bilingual-ResNet-Transformer</span>
            <span>Batch: #2026-WB-01</span>
          </div>
        </div>
      </div>
    </div>
  );
}
