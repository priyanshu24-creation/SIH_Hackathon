import React from 'react';
import { 
  digitizationProgressData, 
  validationDistributionData, 
  extractionConfidenceData, 
  stateProgressData,
  errorCategoriesData,
  officerPerformanceData
} from '../data/mockAnalytics';
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar 
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Users, 
  Layers, 
  Award,
  Sparkles,
  Info
} from 'lucide-react';

export default function Analytics() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Land Record Digitization Analytics
            </h1>
            <span className="text-[10.5px] font-mono bg-brand-50 text-brand-700 px-2.5 py-0.5 rounded border border-brand-200 font-bold">
              Illustrative Demo Data
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Holistic metrics across multilingual OCR throughput, verification backlog, and cadastral spatial link rates.
          </p>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-xs text-slate-400">Reporting Cycle: Q3 2026</span>
          <div className="text-xs font-bold text-slate-800">State Land Administration Portal</div>
        </div>
      </div>

      {/* SECTION: STATE-WISE PROGRESS CARDS (Direct prompt requirement) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Regional & State-Wise Digitization Progress
            </h2>
            <span className="text-[10.5px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              Demonstration Metrics
            </span>
          </div>
          <span className="text-xs text-slate-400">Target: 100% Cadastral Parity by 2027</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {stateProgressData.slice(0, 5).map((st) => (
            <div 
              key={st.state} 
              className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-subtle hover:shadow-card transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{st.state}</span>
                <span className="text-sm font-black font-mono text-brand-600">{st.completion}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-brand-600 to-emerald-500 rounded-full" 
                  style={{ width: `${st.completion}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10.5px] font-mono text-slate-400 pt-1">
                <span>{st.parcelsMapped} Parcels</span>
                <span className="truncate max-w-[90px]">{st.leadAgency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: DIGITIZATION & OCR PERFORMANCE CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Ingestion & Validation Throughput */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Monthly Ingestion vs Validated Records
              </h3>
              <p className="text-xs text-slate-500">Cumulative archives digitized across revenue circles</p>
            </div>
            <span className="text-[10.5px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">Demo</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={digitizationProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10.5, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10.5, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '0.75rem', fontSize: '13px' }} />
                <Area type="monotone" dataKey="processed" name="Total Ingested" stroke="#0284c7" fill="#0284c7" fillOpacity={0.15} />
                <Area type="monotone" dataKey="validated" name="Validated" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* OCR Accuracy Trend Line */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                OCR Accuracy Evolution (%)
              </h3>
              <p className="text-xs text-slate-500">Character recognition precision improvements over time</p>
            </div>
            <span className="text-[10.5px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">Demo</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={digitizationProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10.5, fill: '#64748b' }} />
                <YAxis domain={[85, 100]} tick={{ fontSize: 10.5, fill: '#64748b' }} unit="%" />
                <Tooltip contentStyle={{ borderRadius: '0.75rem', fontSize: '13px' }} />
                <Line type="monotone" dataKey="accuracy" name="OCR Accuracy" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SECTION: ERROR CATEGORIES & OFFICER WORKLOAD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Error Categories Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Validation Discrepancy Categories
              </h3>
              <p className="text-xs text-slate-500">Primary failure modes identified by smart heuristic engine</p>
            </div>
            <span className="text-[10.5px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              Demo Data
            </span>
          </div>

          <div className="space-y-2.5">
            {errorCategoriesData.map((err, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2 h-2 rounded-full ${
                    err.severity === "High" ? "bg-rose-500" : err.severity === "Medium" ? "bg-amber-500" : "bg-sky-500"
                  }`} />
                  <span className="font-semibold text-slate-800">{err.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-slate-900">{err.count} cases</span>
                  <span className={`px-2 py-0.2 rounded text-[10.5px] font-bold ${
                    err.severity === "High" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {err.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Officer Workload & Productivity (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Officer Verification Workload
              </h3>
              <p className="text-xs text-slate-500">Active review performance</p>
            </div>
            <Users className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3">
            {officerPerformanceData.map((off, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{off.officer}</span>
                  <span className="text-[12px] font-mono text-emerald-600 font-semibold">
                    Avg {off.avgTime} / record
                  </span>
                </div>
                <div className="flex items-center justify-between text-[12px] text-slate-500 font-mono">
                  <span>Reviewed: {off.reviewed}</span>
                  <span>Approved: {off.approved} ({Math.round((off.approved / off.reviewed) * 100)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
