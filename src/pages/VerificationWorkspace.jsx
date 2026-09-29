import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useRecords } from '../context/RecordsContext';
import DocumentCanvas from '../components/document/DocumentCanvas';
import EditableField from '../components/verification/EditableField';
import StatusBadge from '../components/Common/StatusBadge';
import { 
  CheckCircle2, 
  RotateCcw, 
  XCircle, 
  Save, 
  ArrowLeft, 
  AlertTriangle, 
  FileCheck2, 
  ShieldCheck, 
  MessageSquare, 
  Eye, 
  Sparkles,
  GitCompare
} from 'lucide-react';

export default function VerificationWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    getRecord, 
    updateRecordField, 
    approveRecord, 
    rejectRecord, 
    sendBackRecord,
    activeEvidenceField,
    setActiveEvidenceField
  } = useRecords();

  const recordId = id || "LR-2026-001284";
  const record = getRecord(recordId);

  const [officerNotes, setOfficerNotes] = useState("");
  const [selectedFieldKey, setSelectedFieldKey] = useState(activeEvidenceField || "surveyNumber");

  if (!record) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-sm font-bold text-slate-700">Record not found</h3>
        <Link to="/app/verification" className="text-xs text-brand-600 underline mt-2 inline-block">
          Return to queue
        </Link>
      </div>
    );
  }

  const fields = record.fields || {};

  const handleFieldSave = (fieldKey, newValue) => {
    updateRecordField(record.id, fieldKey, newValue);
  };

  const handleApprove = () => {
    approveRecord(record.id, officerNotes);
    navigate('/app/verification');
  };

  const handleReject = () => {
    rejectRecord(record.id, officerNotes || "Physical document unreadable / tampered");
    navigate('/app/verification');
  };

  const handleSendBack = () => {
    sendBackRecord(record.id, officerNotes || "High-resolution re-scan requested from Tehsil office");
    navigate('/app/verification');
  };

  return (
    <div className="space-y-4">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            to="/app/verification"
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            title="Back to queue"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                Verification Workspace: {record.id}
              </h1>
              <StatusBadge status={record.status} size="sm" />
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
              <span>{record.documentName}</span>
              <span>•</span>
              <span>Assigned Officer: <strong>Officer A. Pradhan</strong></span>
            </div>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSendBack}
            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-amber-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
            <span>Send Back</span>
          </button>

          <button
            onClick={handleReject}
            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-rose-200 transition-colors"
          >
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Reject</span>
          </button>

          <button
            onClick={handleApprove}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-[1.02]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve Record</span>
          </button>
        </div>
      </div>

      {/* 3-COLUMN WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* COLUMN 1: Original High-Res Document Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Original Scanned Archive
            </h3>
            <span className="text-[10.5px] text-slate-400 font-mono">Page 1 of {record.pages}</span>
          </div>

          <div className="h-[620px]">
            <DocumentCanvas
              record={record}
              activeFieldKey={selectedFieldKey}
              onFieldClick={(key) => {
                setSelectedFieldKey(key);
                setActiveEvidenceField(key);
              }}
            />
          </div>
        </div>

        {/* COLUMN 2: Extracted Structured Data (Editable) (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Extracted Structured Fields
            </h3>
            <span className="text-[10.5px] font-mono text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
              Inline Edit & Confirm
            </span>
          </div>

          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {Object.entries(fields).map(([key, field]) => (
              <EditableField
                key={key}
                fieldKey={key}
                field={field}
                isSelected={selectedFieldKey === key}
                onClick={() => {
                  setSelectedFieldKey(key);
                  setActiveEvidenceField(key);
                }}
                onSave={handleFieldSave}
              />
            ))}
          </div>
        </div>

        {/* COLUMN 3: Validation Issues & Officer Decision (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Validation Summary
              </h4>
              <span className="text-xs font-mono font-bold text-emerald-600">
                {record.validationScore}/100
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10.5px] font-bold text-slate-400 uppercase block">Cadastral Cross-Check</span>
                <span className="text-xs font-semibold text-slate-800 mt-0.5 block">
                  Parcel {record.parcelId || "PCL-10284"}
                </span>
                <span className="text-[12px] text-emerald-600 block mt-0.5">
                  ✓ Boundary acreage aligns
                </span>
              </div>

              {/* Active warnings */}
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[12px]">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Low Stamp Confidence</span>
                </div>
                <p className="text-[12px] text-amber-800 leading-relaxed">
                  Mutation case number seal has 61% OCR score. Please verify manually.
                </p>
              </div>
            </div>

            {/* Officer Notes Input */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="text-[12px] font-bold text-slate-700 block">
                Official Verification Notes
              </label>
              <textarea
                value={officerNotes}
                onChange={(e) => setOfficerNotes(e.target.value)}
                placeholder="Add verification remarks, gazette reference, or reason for modifications..."
                rows={3}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-800"
              />
            </div>

            <button
              onClick={handleApprove}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Save & Register Record</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
