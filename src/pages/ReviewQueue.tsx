import React, { useState, useEffect } from 'react';
import {
  Search, CheckCircle2, AlertTriangle, ShieldCheck,
  ThumbsUp, Flag, ChevronDown, ChevronUp
} from 'lucide-react';
import { ConfidenceBadge } from '../components/Common/ConfidenceBadge';
import { ReviewModal } from '../components/Review/ReviewModal';
import { useLandRecord } from '../context/LandRecordContext';

type Tab = 'All' | 'Assigned to me' | 'Low confidence' | 'Validation issues' | 'Duplicates';

export const ReviewQueue: React.FC = () => {
  const { reviewModalOpen, activeReviewItem, openReviewModal, closeReviewModal } = useLandRecord();
  const [reviewQueue, setReviewQueue] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({ High: true, Medium: true, Low: false });

  useEffect(() => {
    fetch('http://localhost:3001/api/records')
      .then(res => res.json())
      .then(data => {
        const pending = data.filter((r: any) => r.status === 'Needs Review').map((r: any) => ({
          id: r.id,
          recordId: r.khatian_no || r.id,
          field: 'Area',
          extractedValue: r.area_document,
          suggestedValue: r.area_gis,
          confidence: 60,
          reason: 'Area mismatch',
          priority: 'High',
          status: 'Pending',
          category: 'Validation Issues',
          assignedTo: 'Sujan Thapa'
        }));
        setReviewQueue(pending);
      })
      .catch(console.error);
  }, []);

  const filteredItems = reviewQueue.filter((item) => {
    if (activeTab === 'Assigned to me') return item.assignedTo?.toLowerCase().includes('animesh') ?? false;
    if (activeTab === 'Low confidence') return item.confidence < 75;
    if (activeTab === 'Validation issues') {
      return item.reason.toLowerCase().includes('mismatch') || item.reason.toLowerCase().includes('variance');
    }
    const q = searchQuery.toLowerCase();
    return !q || item.recordId.toLowerCase().includes(q) || item.field.toLowerCase().includes(q) || item.reason.toLowerCase().includes(q);
  }).filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return item.recordId.toLowerCase().includes(q) || item.field.toLowerCase().includes(q) || item.reason.toLowerCase().includes(q);
  });

  const grouped = {
    High:   filteredItems.filter(i => i.priority === 'High'),
    Medium: filteredItems.filter(i => i.priority === 'Medium'),
    Low:    filteredItems.filter(i => i.priority === 'Low'),
  };

  const tabs: { label: string; tab: Tab; count: number }[] = [
    { label: 'All', tab: 'All', count: reviewQueue.length },
    { label: 'Assigned to me', tab: 'Assigned to me', count: reviewQueue.filter(i => i.assignedTo?.toLowerCase().includes('animesh')).length },
    { label: 'Low confidence', tab: 'Low confidence', count: reviewQueue.filter(i => i.confidence < 75).length },
    { label: 'Validation issues', tab: 'Validation issues', count: reviewQueue.filter(i => i.reason.toLowerCase().includes('mismatch') || i.reason.toLowerCase().includes('variance')).length },
    { label: 'Duplicates', tab: 'Duplicates', count: 0 },
  ];

  const toggleGroup = (g: string) => setExpandedGroups(prev => ({ ...prev, [g]: !prev[g] }));

  const priorityMeta: Record<string, { badgeCls: string; label: string }> = {
    High:   { badgeCls: 'badge-critical',   label: 'High Priority' },
    Medium: { badgeCls: 'badge-attention',   label: 'Medium Priority' },
    Low:    { badgeCls: 'badge-success',     label: 'Low Priority' },
  };

  return (
    <div className="space-y-6 animate-fade-up">

      {/* ── Header ──────────────────────────────────────── */}
      <div className="gov-card px-8 py-6 mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div>
          
          <h1 className="page-title">Verification Queue</h1>
          <p className="mt-1" style={{ fontSize: 14, color: 'var(--color-muted)' }}>
            Records that need an officer's attention.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 mt-2 sm:mt-0">
          <span className="badge badge-neutral">
            <span className="dot-success" />
            Desk 04 · Shri Sujan Thapa
          </span>
        </div>
      </div>

      {/* ── Table card ──────────────────────────────────── */}
      <div className="gov-card overflow-hidden">

        {/* Tabs */}
        <div
          className="flex flex-wrap gap-1 px-5 pt-3.5"
          style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg)' }}
        >
          {tabs.map(({ label, tab, count }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="pb-3 px-1 text-xs font-semibold transition-colors relative"
              style={{
                color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-muted)',
                borderBottom: activeTab === tab ? '2px solid var(--color-primary)' : '2px solid transparent',
                marginBottom: -1,
              }}
            >
              {label}
              <span
                className="ml-1.5 badge"
                style={{
                  fontSize: 10.5,
                  ...(activeTab === tab
                    ? { background: 'var(--color-primary-light)', color: 'var(--color-primary)', borderColor: 'var(--color-success-border)' }
                    : { background: 'var(--color-bg)', color: 'var(--color-muted)', borderColor: 'var(--color-border)' })
                }}
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5" style={{ color: 'var(--color-muted)' }} />
            <input
              type="text"
              placeholder="Search Khatian, owner, plot, village…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="gov-input"
              style={{ paddingLeft: 36 }}
            />
          </div>
        </div>

        {/* Grouped rows */}
        {Object.entries(grouped).map(([priority, items]) => {
          if (items.length === 0) return null;
          const meta = priorityMeta[priority];
          const open = expandedGroups[priority] ?? true;

          return (
            <div key={priority}>
              {/* Group header */}
              <button
                className="w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors hover:bg-[var(--color-bg)]"
                style={{ borderBottom: '1px solid var(--color-border-subtle)', background: 'var(--color-bg)' }}
                onClick={() => toggleGroup(priority)}
              >
                <span className={`badge ${meta.badgeCls}`}>{meta.label}</span>
                <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>{items.length} record{items.length !== 1 ? 's' : ''}</span>
                <span className="ml-auto" style={{ color: 'var(--color-muted)' }}>
                  {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              {/* Rows */}
              {open && (
                <table className="gov-table w-full">
                  <thead>
                    <tr>
                      <th>Record</th>
                      <th>Field / Extracted Value</th>
                      <th>Issue</th>
                      <th className="text-center">Confidence</th>
                      <th>Assigned to</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-10" style={{ color: 'var(--color-muted)' }}>
                          <CheckCircle2 className="w-7 h-7 mx-auto mb-2" style={{ color: 'var(--color-success)' }} />
                          <p style={{ fontWeight: 600 }}>All clear.</p>
                        </td>
                      </tr>
                    ) : (
                      items.map(item => (
                        <tr
                          key={item.id}
                          className="group cursor-pointer"
                          onClick={() => openReviewModal(item)}
                        >
                          <td>
                            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13 }}>{item.recordId}</span>
                          </td>

                          <td>
                            <span style={{ fontWeight: 600, display: 'block' }}>{item.field}</span>
                            <span style={{ fontSize: 12, color: 'var(--color-muted)', fontFamily: 'monospace' }}>
                              {item.extractedValue}
                            </span>
                          </td>

                          <td>
                            <div className="flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--color-warning)' }} />
                              <span style={{ fontSize: 13 }}>{item.reason}</span>
                            </div>
                          </td>

                          <td className="text-center">
                            <ConfidenceBadge confidence={item.confidence} showLevel={false} />
                          </td>

                          <td>
                            <div className="flex items-center gap-1.5">
                              <span className="dot-success" />
                              <span style={{ fontSize: 13, fontWeight: 500 }}>{item.assignedTo || 'Unassigned'}</span>
                            </div>
                          </td>

                          {/* Inline quick actions — revealed on row hover */}
                          <td className="text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                className="quick-action gov-btn-outline"
                                style={{ padding: '5px 10px', fontSize: 12, gap: 4, borderRadius: 6, color: 'var(--color-success)', borderColor: 'var(--color-success-border)' }}
                                onClick={e => { e.stopPropagation(); openReviewModal(item); }}
                                title="Approve this record"
                              >
                                <ThumbsUp className="w-3.5 h-3.5" /> Approve
                              </button>
                              <button
                                className="quick-action gov-btn-outline"
                                style={{ padding: '5px 10px', fontSize: 12, gap: 4, borderRadius: 6, color: 'var(--color-critical)', borderColor: 'var(--color-critical-border)' }}
                                onClick={e => { e.stopPropagation(); openReviewModal(item); }}
                                title="Flag for further review"
                              >
                                <Flag className="w-3.5 h-3.5" /> Flag
                              </button>
                              <button
                                className="gov-btn-primary"
                                style={{ padding: '5px 12px', fontSize: 12, borderRadius: 6 }}
                                onClick={e => { e.stopPropagation(); openReviewModal(item); }}
                              >
                                Review
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          );
        })}

        {/* Footer */}
        <div
          className="px-5 py-3 flex items-center justify-between text-xs"
          style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-bg)' }}
        >
          <span style={{ color: 'var(--color-muted)' }}>
            Showing {filteredItems.length} of {reviewQueue.length} records
          </span>
          <span style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
            Click any row to open officer verification workspace
          </span>
        </div>
      </div>

      <ReviewModal isOpen={reviewModalOpen} onClose={closeReviewModal} item={activeReviewItem} />
    </div>
  );
};
