import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  Filter,
  Eye,
  Upload,
  Download,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { ConfidenceBadge } from '../components/Common/ConfidenceBadge';
import { StatusBadge } from '../components/Common/StatusBadge';
import { useLandRecord } from '../context/LandRecordContext';
import { useToast } from '../context/ToastContext';

export const Documents: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { documents } = useLandRecord();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredDocs = documents.filter((doc) => {
    if (statusFilter !== 'all' && doc.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
    if (districtFilter !== 'all' && doc.district !== districtFilter) return false;
    if (typeFilter !== 'all' && doc.type !== typeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        doc.id.toLowerCase().includes(q) ||
        doc.fileName.toLowerCase().includes(q) ||
        doc.district.toLowerCase().includes(q) ||
        doc.type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const validatedCount = documents.filter((d) => d.status.toLowerCase() === 'validated').length;
  const pendingCount = documents.filter((d) => d.status.toLowerCase() === 'pending' || d.status.toLowerCase() === 'processing').length;
  const flaggedCount = documents.filter((d) => d.status.toLowerCase() === 'flagged').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Action Bar */}
      <div className="gov-card px-8 py-6 mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div>
          
          <h1 className="page-title">
            Scanned Land Documents &amp; Khatians
          </h1>
          <p className="mt-1" style={{ fontSize: 14, color: 'var(--color-muted)' }}>
            Search, inspect, and verify digitized land records, Porcha certificates, registered deeds, and Mouza survey sheets.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 mt-2 sm:mt-0">
          <button
            type="button"
            onClick={() => navigate('/upload')}
            className="gov-btn-primary"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New Document</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="gov-card p-5">
          <div className="flex items-center justify-between text-sm text-[var(--color-muted)] font-medium">
            <span>Total Ingested</span>
            <Layers className="w-4 h-4 text-[var(--color-primary)]" />
          </div>
          <p className="text-3xl font-bold text-[var(--color-text-primary)] mt-2">{documents.length}</p>
        </div>

        <div className="gov-card p-5">
          <div className="flex items-center justify-between text-sm text-[var(--color-muted)] font-medium">
            <span>Validated</span>
            <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />
          </div>
          <p className="text-3xl font-bold text-[var(--color-success)] mt-2">{validatedCount}</p>
        </div>

        <div className="gov-card p-5">
          <div className="flex items-center justify-between text-sm text-[var(--color-muted)] font-medium">
            <span>Under Review</span>
            <Clock className="w-4 h-4 text-[var(--color-warning)]" />
          </div>
          <p className="text-3xl font-bold text-[var(--color-warning)] mt-2">{pendingCount}</p>
        </div>

        <div className="gov-card p-5">
          <div className="flex items-center justify-between text-sm text-[var(--color-muted)] font-medium">
            <span>Discrepancies</span>
            <AlertTriangle className="w-4 h-4 text-[var(--color-error)]" />
          </div>
          <p className="text-3xl font-bold text-[var(--color-error)] mt-2">{flaggedCount}</p>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="gov-card overflow-hidden">
        {/* Filters and Search */}
        <div className="p-4 border-b border-[var(--color-border)] flex flex-wrap items-center justify-between gap-3 bg-[var(--color-bg)]">
          <div className="relative flex-1 min-w-[260px] max-w-md">
            <input
              type="text"
              placeholder="Search by Document ID, file name, district, type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="gov-input pl-9"
            />
            <Search className="w-4 h-4 text-[var(--color-muted)] absolute left-3 top-2.5" />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-sm">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="all">All Statuses</option>
              <option value="validated">Validated</option>
              <option value="pending">Pending</option>
              <option value="flagged">Flagged</option>
            </select>

            {/* District Filter */}
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="bg-white border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="all">All Districts</option>
              <option value="Darjeeling">Darjeeling</option>
            </select>

            {/* Document Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-white border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="all">All Document Types</option>
              <option value="Khatian">Khatian (Porcha)</option>
              <option value="Land Deed">Registered Deed</option>
              <option value="Mutation Record">Mutation Record</option>
              <option value="Plot Record">Plot Record</option>
              <option value="Survey Map">Cadastral Survey Map</option>
            </select>
          </div>
        </div>

        {/* Documents Table */}
        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Document ID</th>
                <th>File Name</th>
                <th>Type</th>
                <th>District</th>
                <th>Uploaded</th>
                <th>Status</th>
                <th>Confidence</th>
                <th className="col-num-th">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => (
                <tr key={doc.id}>
                  <td className="font-mono font-bold text-[var(--color-primary)]">
                    {doc.id}
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--color-success-bg)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-[var(--color-text-primary)]">{doc.fileName}</span>
                        <span className="text-[12px] text-[var(--color-muted)] block">{doc.fileSize}</span>
                      </div>
                    </div>
                  </td>
                  <td className="font-medium text-[var(--color-text-primary)]">
                    {doc.type}
                  </td>
                  <td className="text-[var(--color-text-primary)]">
                    {doc.district}
                  </td>
                  <td className="text-[var(--color-muted)] text-[13px]">
                    {new Date(doc.uploadedDate).toLocaleDateString()}
                  </td>
                  <td>
                    <StatusBadge status={doc.status} size="sm" />
                  </td>
                  <td>
                    <ConfidenceBadge confidence={doc.confidence || 90} showLevel={false} />
                  </td>
                  <td className="text-right">
                    <button
                      type="button"
                      onClick={() => navigate('/documents/' + doc.id)}
                      className="gov-btn-primary"
                      style={{ padding: '6px 12px', fontSize: 13 }}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 bg-[var(--color-border-subtle)] border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
          <span>Showing 1 to {filteredDocs.length} of {documents.length} recorded entries</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg bg-white border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-border-subtle)] font-medium">
              Previous
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-white font-semibold shadow-2xs">
              1
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-white border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-border-subtle)] font-medium">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
