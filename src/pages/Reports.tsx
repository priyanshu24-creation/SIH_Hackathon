import React from 'react';
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  ShieldCheck,
  Clock,
  AlertTriangle,
  PieChart as PieIcon,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { StatCard } from '../components/Common/StatCard';
import { useToast } from '../context/ToastContext';

export const Reports: React.FC = () => {
  const { showToast } = useToast();

  const handleExportCsv = () => {
    showToast('Export Initiated', 'Digitization_Performance_Summary_Q3.csv downloaded.', 'info');
  };

  const handleExportPdf = () => {
    showToast('Report Generated', 'Official_Land_Records_Validation_Report_2026.pdf ready.', 'success');
  };

  const accuracyData = [
    { type: 'Khatian (Porcha)', accuracy: 96.2, records: 7420 },
    { type: 'Mutation Record', accuracy: 91.5, records: 2150 },
    { type: 'Registered Deed', accuracy: 88.4, records: 1840 },
    { type: 'Cadastral Survey Map', accuracy: 94.8, records: 1048 }
  ];

  const districtData = [
    { district: 'Darjeeling', count: 4820, fill: 'var(--color-primary)' },
    { district: 'Darjeeling', count: 2840, fill: 'var(--color-accent)' },
    { district: 'Darjeeling', count: 3120, fill: 'var(--color-warning-border)' },
    { district: 'Darjeeling', count: 1678, fill: 'var(--color-primary)' }
  ];

  const monthlyPerformance = [
    { month: 'Apr', throughput: 1417, accuracy: 91 },
    { month: 'May', throughput: 1800, accuracy: 93 },
    { month: 'Jun', throughput: 2200, accuracy: 94 },
    { month: 'Jul', throughput: 2600, accuracy: 95 },
    { month: 'Aug', throughput: 2900, accuracy: 96 },
    { month: 'Sep', throughput: 3100, accuracy: 97 }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Action Card */}
      <div className="gov-card px-8 py-6 mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div>
          
          <h1 className="page-title">
            Digitization &amp; Cadastre Validation Reports
          </h1>
          <p className="mt-1" style={{ fontSize: 14, color: 'var(--color-muted)' }}>
            Throughput volumes, Bengali/English OCR semantic clarity rates, and cadastral accuracy across revenue circles.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 mt-2 sm:mt-0">
          <button
            type="button"
            onClick={handleExportCsv}
            className="gov-btn-outline"
          >
            <FileSpreadsheet className="w-4 h-4 text-[var(--color-primary)]" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleExportPdf}
            className="gov-btn-primary"
          >
            <Download className="w-4 h-4" />
            <span>Download Official Report</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Records Digitzed"
          value="12,458"
          trend="+8% this month"
          isPositiveTrend={true}
          icon={FileText}
          iconColor="text-[var(--color-primary)]"
          iconBg="bg-[var(--color-success-bg)]"
        />
        <StatCard
          title="Statutory Validated"
          value="10,982"
          trend="+10% this month"
          isPositiveTrend={true}
          icon={ShieldCheck}
          iconColor="text-[var(--color-success)]"
          iconBg="bg-[var(--color-success-bg)]"
        />
        <StatCard
          title="Pending Officer Review"
          value="327"
          trend="-15% backlogged"
          isPositiveTrend={true}
          icon={Clock}
          iconColor="text-[var(--color-warning)]"
          iconBg="bg-[var(--color-warning-bg)]"
        />
        <StatCard
          title="Flagged Discrepancies"
          value="149"
          trend="-3% resolved"
          isPositiveTrend={true}
          icon={AlertTriangle}
          iconColor="text-[var(--color-error)]"
          iconBg="bg-[var(--color-error-bg)]"
        />
      </div>

      {/* Reports Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Processing Performance (8 cols) */}
        <div className="lg:col-span-8 gov-card p-6">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4 mb-4">
            <div>
              <h3 className="text-sm font-bold text-[var(--color-text-primary)] tracking-tight flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[var(--color-primary)]" />
                Processing Throughput &amp; Validation Quality (FY 2026)
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                Monthly digitized record volume with corresponding revenue officer verification rate
              </p>
            </div>
            <span className="text-[12px] font-semibold text-[var(--color-primary)] bg-[var(--color-success-bg)] border border-[var(--color-success-border)] px-2.5 py-1 rounded-md">
              Apr – Sep 2026
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyPerformance} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-text-secondary)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--color-text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-text-primary)',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '13px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="throughput"
                  stroke="var(--color-primary)"
                  strokeWidth={3}
                  dot={{ fill: 'var(--color-primary)', r: 4 }}
                  name="Monthly Volume"
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="var(--color-accent)"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ fill: 'var(--color-accent)', r: 3 }}
                  name="Accuracy %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 mt-3 text-xs text-[var(--color-text-secondary)]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-[var(--color-primary)] rounded" />
              <span>Volume (Records)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-[var(--color-accent)] rounded" />
              <span>Validation Rate (%)</span>
            </div>
          </div>
        </div>

        {/* District-wise distribution (4 cols) */}
        <div className="lg:col-span-4 gov-card p-6 flex flex-col justify-between">
          <div className="border-b border-[var(--color-border)] pb-3 mb-2">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] tracking-tight flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-[var(--color-accent)]" />
              District-wise Records
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Distribution across subdivision circles</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={districtData}
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={45}
                  dataKey="count"
                  paddingAngle={3}
                >
                  {districtData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} stroke="var(--color-surface)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-text-primary)',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '13px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-[var(--color-border)] text-xs">
            {districtData.map((d) => (
              <div key={d.district} className="flex items-center justify-between py-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
                  <span className="text-[var(--color-text-secondary)]">{d.district}</span>
                </div>
                <span className="font-mono font-bold text-[var(--color-text-primary)]">{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Validation Accuracy by Document Type */}
        <div className="lg:col-span-12 gov-card p-6">
          <div className="border-b border-[var(--color-border)] pb-4 mb-4">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] tracking-tight flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />
              Validation Accuracy by Land Document Format
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              OCR and cadastral rule match rates on historical Bengali porchas and modern English deed formats
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {accuracyData.map((item) => (
              <div key={item.type} className="p-4 rounded-xl bg-[var(--color-border-subtle)] border border-[var(--color-border)]">
                <span className="text-xs font-bold text-[var(--color-text-primary)]">{item.type}</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-2xl font-bold text-[var(--color-success)] font-mono">
                    {item.accuracy}%
                  </span>
                  <span className="text-xs text-[var(--color-text-secondary)] font-medium">
                    {item.records} records
                  </span>
                </div>
                <div className="w-full h-2 bg-[var(--color-border)] rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-success)] rounded-full"
                    style={{ width: `${item.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
