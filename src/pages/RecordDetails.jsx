import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useRecords } from '../context/RecordsContext';
import DocumentCanvas from '../components/document/DocumentCanvas';
import EvidenceCard from '../components/document/EvidenceCard';
import StatusBadge from '../components/Common/StatusBadge';
import ConfidenceMeter from '../components/Common/ConfidenceMeter';
import { 
  FileText, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  GitCompare, 
  CheckCircle2, 
  Edit3, 
  Download, 
  ArrowLeft, 
  History,
  Layers,
  Sparkles
} from 'lucide-react';

export default function RecordDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    records, 
    getRecord, 
    activeEvidenceField, 
    setActiveEvidenceField, 
    setSelectedRecordId 
  } = useRecords();

  const recordId = id || "LR-2026-001284";
  const record = getRecord(recordId);

  const [activeTab, setActiveTab] = useState("fields"); // "fields" | "evidence" | "checks"

  if (!record) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-sm font-bold text-slate-700">Record not found</h3>
        <Link to="/app/documents" className="text-xs text-brand-600 underline mt-2 inline-block">
          Return to repository
        </Link>
      </div>
    );
  }

  const fields = record.fields || {};
  const currentEvidenceField = fields[activeEvidenceField] || Object.values(fields)[0];

  const handleFieldSelect = (key) => {
    setActiveEvidenceField(key);
  };

  const handleReviewClick = (fieldKey) => {
    setSelectedRecordId(record.id);
    navigate(`/app/verification/${record.id}?focusField=${fieldKey}`);
  };

  return (
    <div className="space-y-4">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            to="/app/documents"
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            title="Back to All Documents"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                Record {record.id}
              </h1>
              <StatusBadge status={record.status} size="sm" />
              <span className="text-[12px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                Plot {fields.surveyNumber?.value || "N/A"}
              </span>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
              <span>{record.documentName}</span>
              <span>•</span>
              <span>{record.documentType}</span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold">{record.confidence}% Overall Accuracy</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/app/verification/${record.id}`)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Verify Record</span>
          </button>

          <button
            onClick={() => navigate(`/app/gis/cross-check?recordId=${record.id}`)}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <GitCompare className="w-3.5 h-3.5 text-brand-600" />
            <span>GIS Cross-check</span>
          </button>
        </div>
      </div>

      {/* Split-Screen Evidence-Linked Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Document Preview & Interactive Bounding Boxes (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <DocumentCanvas
            record={record}
            activeFieldKey={activeEvidenceField}
            onFieldClick={handleFieldSelect}
          />
        </div>

        {/* RIGHT COLUMN: Extracted Structured Data & Evidence Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Source Evidence Panel (Direct UVP from prompt) */}
          <EvidenceCard
            field={currentEvidenceField}
            fieldKey={activeEvidenceField}
          />

          {/* Structured Land Record Fields Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Extracted Land Record
                </h3>
                <p className="text-[12px] text-slate-500">
                  Click any field to synchronize bounding box on the original deed
                </p>
              </div>

              <span className="text-[10.5px] font-mono bg-brand-50 text-brand-700 px-2 py-0.5 rounded border border-brand-200">
                11 Fields
              </span>
            </div>

            {/* List of Structured Fields */}
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {Object.entries(fields).map(([key, field]) => {
                const isActive = activeEvidenceField === key;
                return (
                  <div
                    key={key}
                    onClick={() => handleFieldSelect(key)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? "bg-brand-50/60 border-brand-400 ring-2 ring-brand-400/20 shadow-xs"
                        : "bg-slate-50/50 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
                          {field.label}
                        </span>
                        <div className="text-xs font-bold text-slate-900 truncate mt-0.5">
                          {field.value}
                        </div>
                        {field.bengali && (
                          <div className="text-[10.5px] font-serif text-slate-500 truncate">
                            {field.bengali}
                          </div>
                        )}
                      </div>

                      <div className="shrink-0 text-right">
                        <ConfidenceMeter
                          value={field.confidence}
                          size="compact"
                          showBar={false}
                          onReview={() => handleReviewClick(key)}
                        />
                        <span className="text-[10.5px] font-mono text-slate-400 mt-1 block">
                          Pg {field.page || 1}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Validation Checks Footer summary */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Validation Score: <strong>{record.validationScore}/100</strong></span>
              </div>

              <Link
                to="/app/validation"
                className="text-xs font-semibold text-brand-600 hover:underline"
              >
                Inspect Rules Engine →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
