import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecords } from '../context/RecordsContext';
import StatusBadge from '../components/Common/StatusBadge';
import ConfidenceMeter from '../components/Common/ConfidenceMeter';
import { 
  CheckSquare, 
  Filter, 
  AlertTriangle, 
  ArrowRight, 
  FileText, 
  Eye, 
  ShieldAlert, 
  User, 
  Search,
  Clock
} from 'lucide-react';

export default function VerificationQueue() {
  const { records, setSelectedRecordId } = useRecords();
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filters = [
    "All",
    "High Priority",
    "Low Confidence",
    "Area Mismatch",
    "Duplicate",
    "Missing Data"
  ];

  // Enhanced queue items with explicit issues & priorities
  const queueItems = [
    {
      recordId: "LR-2026-008421",
      owner: "Anjali Basnet",
      village: "Singamari",
      issue: "Area Mismatch (Deed 2.45 ac vs GIS 2.61 ac)",
      confidence: 76,
      priority: "High",
      assignedTo: "Officer A. Pradhan",
      status: "Needs Review",
      dueDate: "Today, 5:00 PM"
    },
    {
      recordId: "LR-2026-004319",
      owner: "Sanjay Chhetri",
      village: "Singamari",
      issue: "Low OCR Confidence & Duplicate Suspect",
      confidence: 64,
      priority: "High",
      assignedTo: "Officer K. Mangar",
      status: "Needs Review",
      dueDate: "Tomorrow, 12:00 PM"
    },
    {
      recordId: "LR-2026-001284",
      owner: "Kiran Subba",
      village: "Singamari",
      issue: "Faded Mutation Stamp OCR (61%)",
      confidence: 94,
      priority: "Normal",
      assignedTo: "Officer A. Pradhan",
      status: "Needs Review",
      dueDate: "14 Sep 2026"
    },
    {
      recordId: "LR-2026-005517",
      owner: "Sita Tamang",
      village: "Singamari",
      issue: "Physical Water Damage on Survey Boundary",
      confidence: 42,
      priority: "High",
      assignedTo: "Officer R. Tamang",
      status: "Needs Review",
      dueDate: "Overdue"
    },
    {
      recordId: "LR-2026-006281",
      owner: "Lokesh Gurung",
      village: "Singamari",
      issue: "Commercial Classification Confirmation",
      confidence: 88,
      priority: "Normal",
      assignedTo: "Officer A. Pradhan",
      status: "Needs Review",
      dueDate: "15 Sep 2026"
    }
  ];

  const filteredQueue = queueItems.filter(item => {
    const matchesSearch = !searchQuery || 
      item.recordId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.village.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === "All") return true;
    if (activeFilter === "High Priority") return item.priority === "High";
    if (activeFilter === "Low Confidence") return item.confidence < 70;
    if (activeFilter === "Area Mismatch") return item.issue.includes("Area Mismatch");
    if (activeFilter === "Duplicate") return item.issue.includes("Duplicate");
    if (activeFilter === "Missing Data") return item.issue.includes("Damage");

    return true;
  });

  const handleReviewRecord = (recId) => {
    setSelectedRecordId(recId);
    navigate(`/app/verification/${recId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Officer Verification Queue
            </h1>
            <span className="text-[10.5px] font-mono bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold animate-pulse">
              {queueItems.length} Records Pending
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manual verification workspace for revenue officers to resolve low-confidence OCR and spatial conflicts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search officer or record..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
              activeFilter === f
                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-[12px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Record ID</th>
                <th className="py-3 px-4">Owner Name</th>
                <th className="py-3 px-4">Mouza / Village</th>
                <th className="py-3 px-4">Detected Issue</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Assigned To</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredQueue.map((item) => (
                <tr key={item.recordId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {item.recordId}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {item.owner}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {item.village}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-slate-800 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{item.issue}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <ConfidenceMeter value={item.confidence} size="compact" />
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold border ${
                      item.priority === "High"
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 flex items-center gap-1.5 pt-4">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.assignedTo}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleReviewRecord(item.recordId)}
                      className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5"
                    >
                      <span>Review Record</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
