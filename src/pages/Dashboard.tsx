import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Clock, CheckCircle2, AlertTriangle,
  Upload, ArrowRight, TrendingUp, CheckSquare,
  ChevronRight, ShieldAlert
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { processingTrendData } from '../data/mockData';
import { useLandRecord } from '../context/LandRecordContext';
import { useState, useEffect } from 'react';

// ── Tiny metric card ──────────────────────────────────────────────────────────
const Metric = ({
  label, value, sub, accent = false, icon: Icon, trend, valueColor
}: { label: string; value: string | number; sub: string; accent?: boolean; icon?: any; trend?: { value: string, up: boolean }; valueColor?: string }) => (
  <div className="bg-white p-5 rounded-[12px] border border-[var(--color-border)] shadow-sm flex flex-col gap-3 relative overflow-hidden transition-all hover:border-[var(--color-border-subtle)] hover:shadow-md">
    <div className="flex items-center justify-between">
      <p className="eyebrow" style={{ color: '#8B9591', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>
        {label}
      </p>
      {Icon && (
        <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center ${accent ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]' : 'bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)]'}`}>
          <Icon className="w-4 h-4" />
        </div>
      )}
    </div>
    <div className="flex items-center gap-3">
      <p
        className="font-bold tracking-tight font-sans"
        style={{ color: valueColor ? valueColor : (accent ? 'var(--color-primary)' : '#111827'), fontSize: '38px', lineHeight: 1 }}
      >
        {value}
      </p>
      {trend && (
        <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[12px] font-bold mt-1 ${trend.up ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]' : 'bg-[var(--color-error-bg)] text-[var(--color-error)]'}`}>
          {trend.up ? <TrendingUp className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
          {trend.value}
        </span>
      )}
    </div>
    <p style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>{sub}</p>
  </div>
);

// ── Priority dot component ────────────────────────────────────────────────────
const PriorityDot = ({ level }: { level: 'high' | 'attention' | 'info' }) => {
  const cls = level === 'high' ? 'dot-critical' : level === 'attention' ? 'dot-attention' : 'dot-success';
  return <span className={cls} style={{ display: 'inline-block', flexShrink: 0, marginTop: 6 }} />;
};

const donutData = [
  { name: 'Verified',      value: 87,  color: 'var(--color-primary)' },
  { name: 'Needs Review',  value: 18,  color: 'var(--color-warning)' },
  { name: 'Discrepancy',   value: 15,  color: 'var(--color-error)' },
];

const attentionItems = [
  {
    id: 'a1',
    level: 'high' as const,
    badge: 'High priority',
    badgeCls: 'badge-critical',
    count: 5,
    title: 'Low-confidence owner/plot fields',
    desc: 'Manuscript handwriting needs manual officer review before registry mutation.',
    route: '/review-queue',
    cta: 'Review now',
  },
  {
    id: 'a2',
    level: 'attention' as const,
    badge: 'Verification needed',
    badgeCls: 'badge-attention',
    count: 3,
    title: 'Area variance vs. cadastral reference',
    desc: 'Acreage differs ±0.05 acre against GIS parcel data for Darjeeling Sadar Mouza.',
    route: '/validation',
    cta: 'Review now',
  },
  {
    id: 'a3',
    level: 'info' as const,
    badge: 'New uploads',
    badgeCls: 'badge-info',
    count: 4,
    title: 'Scanned Khatian awaiting processing',
    desc: 'Uploaded today by District Land Survey unit — queued for OCR extraction.',
    route: '/documents',
    cta: 'Open queue',
  },
];

const recentActivity = [
  { id: 'r1', time: '12:20 PM', icon: CheckCircle2, iconCls: 'text-green-600', label: 'Record #1024 approved', sub: 'Plot 302 boundary confirmed by officer' },
  { id: 'r2', time: '10:34 AM', icon: AlertTriangle, iconCls: 'text-amber-500', label: 'Area discrepancy — KH-DS-1456', sub: '0.82 ac (doc) vs 0.75 ac (GIS)' },
  { id: 'r3', time: '10:31 AM', icon: FileText, iconCls: 'text-blue-500', label: '12 fields extracted from Khatian_1456.pdf', sub: 'Bengali manuscript — OCR complete' },
  { id: 'r4', time: '10:18 AM', icon: Upload, iconCls: 'text-[var(--color-muted)]', label: 'New Khatian uploaded', sub: 'Darjeeling Sadar Circle · Mouza Kanchenjunga' },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { reviewQueue, documents, auditLogs } = useLandRecord();
  
  const stats = { 
    processed: documents.length, 
    validated: documents.filter(d => d.status.toLowerCase() === 'validated' || d.status.toLowerCase() === 'verified').length, 
    pending: reviewQueue.filter(q => q.status === 'Pending').length 
  };
  
  const activities = auditLogs.slice(0, 4);

  const pendingCount = stats.pending || 0;
  const totalItems = attentionItems.reduce((s, i) => s + i.count, 0);

  return (
    <div className="space-y-7 animate-fade-up">

      {/* ── Welcome banner (Page Header) ──────────────── */}
      <div className="gov-card px-8 py-6 mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div>
          
          <h1 className="page-title">Good morning, Shri Animesh Roy</h1>
          <p className="mt-1" style={{ fontSize: 14, color: 'var(--color-muted)' }}>
            Today's document processing and verification workload.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 mt-2 sm:mt-0">
          <button className="gov-btn-primary" onClick={() => navigate('/upload')}>
            <Upload className="w-4 h-4" />
            Upload New Khatian
          </button>
          <button className="gov-btn-outline" onClick={() => navigate('/review-queue')}>
            Open Verification Desk
            {pendingCount > 0 && (
              <span className="badge badge-critical" style={{ marginLeft: 6 }}>{pendingCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* ── 3 Key metrics ───────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Metric label="Khatian Digitized" value={stats.processed} sub="Total documents processed" trend={{ value: '8%', up: true }} icon={FileText} accent valueColor="#111827" />
        <Metric label="Pending Verification" value={stats.pending} sub="Assigned to your queue" icon={Clock} valueColor="var(--color-error)" />
        <Metric label="Verified Records" value={stats.validated} sub="Cleared and updated in system" icon={CheckCircle2} valueColor="var(--color-primary)" />
      </div>

      {/* ── Needs attention today ────────────────────────── */}
      <div className="gov-card">
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <div>
            <p className="eyebrow mb-0.5">Your queue</p>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)' }}>
              Needs your attention today
            </h2>
          </div>
          <span className="badge badge-attention">{totalItems} items</span>
        </div>

        <ul className="flex flex-col gap-0">
          {attentionItems.map((item, i) => (
            <li
              key={item.id}
              onClick={() => navigate(item.route)}
              className="group flex items-start gap-4 px-6 py-4 cursor-pointer transition-all hover:bg-[var(--color-bg)]"
              style={{ 
                borderBottom: i < attentionItems.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                borderLeft: `4px solid ${item.level === 'high' ? 'var(--color-error)' : item.level === 'attention' ? 'var(--color-warning)' : 'var(--color-primary)'}`
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>
                    {item.count} records —
                  </span>
                  <span style={{ fontSize: 16, color: 'var(--color-text)' }}>{item.title}</span>
                  <span className={`badge ${item.badgeCls}`}>{item.badge}</span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--color-muted)', lineHeight: 1.5 }}>{item.desc}</p>
              </div>

              <button
                className="gov-link shrink-0 flex items-center gap-1 p-2 -mr-2 opacity-80 group-hover:opacity-100 transition-opacity"
                style={{ fontSize: 14, fontWeight: 600 }}
                onClick={(e) => { e.stopPropagation(); navigate(item.route); }}
              >
                {item.cta}
                <ChevronRight className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Charts + recent activity ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Processing trend — area chart */}
        <div className="lg:col-span-8 gov-card p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow mb-0.5">Record Processing</p>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>
                Scanned Khatian processed &amp; validated
              </h3>
            </div>
            <span className="badge badge-neutral">Past 7 days</span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={processingTrendData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProcessed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorValidated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--color-muted)' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--color-muted)' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--color-text)', border: 'none',
                    borderRadius: 8, color: '#fff', fontSize: 13
                  }}
                  cursor={{ stroke: 'var(--color-border)', strokeWidth: 1 }}
                />
                <Area type="monotone" dataKey="Processed" stroke="var(--color-accent)" strokeWidth={2} fill="url(#colorProcessed)" dot={false} name="Processed" />
                <Area type="monotone" dataKey="Validated" stroke="var(--color-primary)" strokeWidth={2} fill="url(#colorValidated)" dot={false} name="Validated" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Summary row */}
          <div
            className="flex items-center gap-6 pt-4 text-xs"
            style={{ borderTop: '1px solid var(--color-border)' }}
          >
            {[
              { label: 'Total Processed', value: stats.processed, dot: 'var(--color-accent)' },
              { label: 'Verified', value: stats.validated, dot: 'var(--color-primary)' },
              { label: 'Pending', value: stats.pending, dot: 'var(--color-warning)' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot, display: 'inline-block' }} />
                <span style={{ color: 'var(--color-muted)' }}>{s.label}</span>
                <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Validation donut */}
        <div className="lg:col-span-4 gov-card p-6 flex flex-col gap-3">
          <div>
            <p className="eyebrow mb-0.5">Validation Status</p>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>Automated clearance rate</h3>
          </div>

          <div className="relative flex-1 flex items-center justify-center" style={{ minHeight: 180 }}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={donutData} cx="50%" cy="50%"
                  innerRadius={58} outerRadius={80}
                  paddingAngle={3} dataKey="value"
                >
                  {donutData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="#fff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'var(--color-text)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-text)', lineHeight: 1 }}>74.8%</span>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--color-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: 3 }}>clearance</span>
            </div>
          </div>

          <div className="space-y-2" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12 }}>
            {[
              { label: 'Verified', value: stats.validated, color: 'var(--color-primary)' },
              { label: 'Needs Review', value: stats.pending, color: 'var(--color-warning)' },
              { label: 'Total', value: stats.processed, color: 'var(--color-accent)' },
            ].map(r => (
              <div key={r.label} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: r.color, display: 'inline-block' }} />
                  <span style={{ color: 'var(--color-muted)' }}>{r.label}</span>
                </div>
                <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent activity ──────────────────────────────── */}
      <div className="gov-card">
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>Recent Activity</h3>
          <button
            className="gov-btn-ghost"
            style={{ fontSize: 13, color: 'var(--color-primary)' }}
            onClick={() => navigate('/audit-logs')}
          >
            View audit trail <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <ul className="px-2 py-2">
          {activities.length > 0 ? activities.map(act => {
            const Icon = act.type === 'upload' ? Upload : FileText;
            const iconCls = act.type === 'upload' ? 'text-[var(--color-muted)]' : 'text-blue-500';
            return (
              <li
                key={act.id}
                onClick={() => navigate('/documents/' + act.recordId)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors hover:bg-[var(--color-bg)]"
              >
                <Icon className={`w-4 h-4 shrink-0 ${iconCls}`} />
                <div className="flex-1 min-w-0">
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)' }}>{act.action}</span>
                  <p style={{ fontSize: 12, color: 'var(--color-muted)' }}>{act.details}</p>
                </div>
                <span style={{ fontSize: 12, color: 'var(--color-subtle)', whiteSpace: 'nowrap' }}>
                  {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </li>
            );
          }) : recentActivity.map(act => {
            const Icon = act.icon;
            return (
              <li
                key={act.id}
                onClick={() => navigate('/documents/1024')}
                className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors hover:bg-[var(--color-bg)]"
              >
                <Icon className={`w-4 h-4 shrink-0 ${act.iconCls}`} />
                <div className="flex-1 min-w-0">
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)' }}>{act.label}</span>
                  <p style={{ fontSize: 12, color: 'var(--color-muted)' }}>{act.sub}</p>
                </div>
                <span style={{ fontSize: 12, color: 'var(--color-subtle)', whiteSpace: 'nowrap' }}>{act.time}</span>
              </li>
            );
          })}
        </ul>
      </div>

    </div>
  );
};
