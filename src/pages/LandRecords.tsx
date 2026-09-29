import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Search,
  Filter,
  Eye,
  Edit2,
  CheckSquare,
  Map,
  Download,
  Plus,
  Building,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { StatusBadge } from '../components/Common/StatusBadge';
import { useLandRecord } from '../context/LandRecordContext';
import { useToast } from '../context/ToastContext';

export const LandRecords: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [records, setRecords] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetch('/api/records')
      .then(res => res.json())
      .then(data => setRecords(data))
      .catch(console.error);
  }, []);

  const filteredRecords = records.filter((rec) => {
    if (districtFilter !== 'all' && rec.district !== districtFilter) return false;
    if (statusFilter !== 'all' && rec.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        rec.id.toLowerCase().includes(q) ||
        rec.owner_name.toLowerCase().includes(q) ||
        rec.khatian_no.toLowerCase().includes(q) ||
        rec.plot_no.toLowerCase().includes(q) ||
        rec.village.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCsv = () => {
    showToast('Export Initiated', 'Land_Records_Master_Index.csv generated.', 'info');
  };

  const totalAcreage = records.reduce((acc, r) => acc + (parseFloat(r.area_document) || 0), 0).toFixed(2);
  const verifiedCount = records.filter((r) => r.status.toLowerCase() === 'verified').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title Card */}
      <div className="gov-card px-8 py-6 mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div>
          
          <h1 className="page-title">
            Cadastral Land Records &amp; Dag Directory
          </h1>
          <p className="mt-1" style={{ fontSize: 14, color: 'var(--color-muted)' }}>
            Search and manage Khatian records, plot ownership details, and Mouza-wise land classification for Darjeeling Sadar Circle.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 mt-2 sm:mt-0">
          <button
            type="button"
            onClick={handleExportCsv}
            className="gov-btn-outline"
          >
            <Download className="w-4 h-4 text-[var(--color-muted)]" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/upload')}
            className="gov-btn-primary"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Record</span>
          </button>
        </div>
      </div>

      {/* Cadastral Statistics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="gov-card p-5">
          <div className="flex items-center justify-between text-sm text-[var(--color-muted)] font-medium">
            <span>Registered Parcels</span>
            <Layers className="w-4 h-4 text-[var(--color-primary)]" />
          </div>
          <p className="text-3xl font-bold text-[var(--color-text-primary)] mt-2">{records.length}</p>
        </div>

        <div className="gov-card p-5">
          <div className="flex items-center justify-between text-sm text-[var(--color-muted)] font-medium">
            <span>Verified Titles</span>
            <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />
          </div>
          <p className="text-3xl font-bold text-[var(--color-success)] mt-2">{verifiedCount}</p>
        </div>

        <div className="gov-card p-5">
          <div className="flex items-center justify-between text-sm text-[var(--color-muted)] font-medium">
            <span>Total Cadastral Area</span>
            <Building className="w-4 h-4 text-[var(--color-accent)]" />
          </div>
          <p className="text-3xl font-bold text-[var(--color-text-primary)] mt-2 font-mono">
            {totalAcreage} <span className="text-sm font-normal text-[var(--color-muted)]">acres</span>
          </p>
        </div>

        <div className="gov-card p-5">
          <div className="flex items-center justify-between text-sm text-[var(--color-muted)] font-medium">
            <span>Circle Area</span>
            <Map className="w-4 h-4 text-[var(--color-warning)]" />
          </div>
          <p className="text-xl font-bold text-[var(--color-text-primary)] mt-2 truncate">
            Darjeeling Sadar
          </p>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="gov-card overflow-hidden">
        {/* Search & Filters */}
        <div className="p-4 border-b border-[var(--color-border)] flex flex-wrap items-center justify-between gap-3 bg-[var(--color-bg)]">
          <div className="relative flex-1 min-w-[260px] max-w-md">
            <input
              type="text"
              placeholder="Search by Record ID, owner name, Dag/Plot, Khatian, Mouza..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="gov-input pl-9"
            />
            <Search className="w-4 h-4 text-[var(--color-muted)] absolute left-3 top-2.5" />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="bg-white border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="all">All Administrative Districts</option>
              <option value="Darjeeling">Darjeeling</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="all">All Verification Statuses</option>
              <option value="verified">Verified &amp; Certified</option>
              <option value="needs verification">Needs Field Verification</option>
              <option value="pending">Pending Officer Review</option>
              <option value="flagged">Flagged for Boundary Discrepancy</option>
            </select>
          </div>
        </div>

        {/* Records Table */}
        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Record ID</th>
                <th>Citizen / Owner Name</th>
                <th>Khatian No.</th>
                <th>Plot (Dag) No.</th>
                <th>Recorded Area</th>
                <th>Mouza / Village</th>
                <th>District</th>
                <th>Status</th>
                <th className="col-num-th">Cadastral Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((rec) => (
                <tr key={rec.id}>
                  <td className="font-mono font-bold text-[var(--color-primary)]">
                    #{rec.id}
                  </td>
                  <td className="font-bold text-[var(--color-text-primary)]">
                    {rec.owner_name}
                  </td>
                  <td className="font-mono font-semibold text-[var(--color-text-primary)]">
                    {rec.khatian_no}
                  </td>
                  <td className="font-mono font-bold text-[var(--color-text-primary)]">
                    {rec.plot_no}
                  </td>
                  <td className="font-mono text-[var(--color-text-primary)]">
                    {rec.area_document} acre
                  </td>
                  <td className="text-[var(--color-text-primary)]">
                    {rec.village}
                  </td>
                  <td className="text-[var(--color-muted)]">
                    {rec.district}
                  </td>
                  <td>
                    <StatusBadge status={rec.status} size="sm" />
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => navigate('/structured-record')}
                        title="Inspect RoR Form 5440"
                        className="p-1.5 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-success-bg)] transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('/validation')}
                        title="Run Cadastral Validation"
                        className="p-1.5 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-success)] hover:bg-[var(--color-success-bg)] transition-colors"
                      >
                        <CheckSquare className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('/gis-map')}
                        title="View Parcel on GIS Cadastre Map"
                        className="p-1.5 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-accent)] hover:bg-[var(--color-success-bg)] transition-colors"
                      >
                        <Map className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[var(--color-border-subtle)] border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
          <span>Showing {filteredRecords.length} recorded cadastral entries</span>
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
