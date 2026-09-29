import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Edit2,
  Save,
  X,
  ShieldCheck,
  User,
  MapPin,
  Landmark,
  ArrowRight,
  History,
  Printer,
  Map,
  Eye
} from 'lucide-react';
import { StatusBadge } from '../components/Common/StatusBadge';
import { DocumentViewer } from '../components/DocumentViewer/DocumentViewer';
import { useLandRecord } from '../context/LandRecordContext';
import { useToast } from '../context/ToastContext';

export const StructuredRecord: React.FC = () => {
  const navigate = useNavigate();
  const { activeRecord, updateStructuredRecord } = useLandRecord();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    ownerName: activeRecord.ownerName,
    fatherName: activeRecord.fatherName,
    address: activeRecord.address,
    khatianNo: activeRecord.khatianNo,
    plotNo: activeRecord.plotNo,
    areaAcre: activeRecord.areaAcre,
    landType: activeRecord.landType,
    village: activeRecord.village,
    tehsil: activeRecord.tehsil,
    district: activeRecord.district
  });

  const handleSave = () => {
    updateStructuredRecord('1024', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      ownerName: activeRecord.ownerName,
      fatherName: activeRecord.fatherName,
      address: activeRecord.address,
      khatianNo: activeRecord.khatianNo,
      plotNo: activeRecord.plotNo,
      areaAcre: activeRecord.areaAcre,
      landType: activeRecord.landType,
      village: activeRecord.village,
      tehsil: activeRecord.tehsil,
      district: activeRecord.district
    });
    setIsEditing(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title Header Card */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-[var(--color-border)] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-primary)] mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Record of Rights (RoR Form 5440)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] tracking-tight flex items-center gap-3">
            <span>Land Record #{activeRecord.id}</span>
            <StatusBadge status="Verified" />
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
            Department of Land &amp; Land Reforms · Government of West Bengal
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => navigate('/documents/1024')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-[var(--color-border-subtle)] text-[var(--color-text-primary)] text-xs font-semibold border border-[var(--color-border)] shadow-2xs transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span>View Source</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/gis-map')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-[var(--color-border-subtle)] text-[var(--color-text-primary)] text-xs font-semibold border border-[var(--color-border)] shadow-2xs transition-colors"
          >
            <Map className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span>View on Map</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-[var(--color-border-subtle)] text-[var(--color-text-primary)] text-xs font-semibold border border-[var(--color-border)] shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
            <span>Print</span>
          </button>

          {isEditing ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white hover:bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)] text-xs font-semibold border border-[var(--color-border)] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-semibold shadow-2xs transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-semibold shadow-2xs transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Record</span>
            </button>
          )}
        </div>
      </div>

      {/* Two-Column Record Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Digital Record Certificate (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Owner Details */}
          <div className="bg-white p-5 rounded-xl border border-[var(--color-border)] shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-[var(--color-primary)]" />
              Owner Details (মালিকানার বিবরণ)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[var(--color-text-secondary)] font-semibold mb-1">Rayat / Owner Name:</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                ) : (
                  <p className="font-bold text-[var(--color-text-primary)] text-sm">{formData.ownerName}</p>
                )}
              </div>

              <div>
                <label className="block text-[var(--color-text-secondary)] font-semibold mb-1">Father / Husband Name:</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                ) : (
                  <p className="font-semibold text-[var(--color-text-primary)] text-sm">{formData.fatherName}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[var(--color-text-secondary)] font-semibold mb-1">Residential Address:</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                ) : (
                  <p className="text-[var(--color-text-primary)] font-medium">{formData.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Land Details */}
          <div className="bg-white p-5 rounded-xl border border-[var(--color-border)] shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-3 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-[var(--color-primary)]" />
              Land Details (জমির খতিয়ান ও দাগ)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[var(--color-text-secondary)] font-semibold mb-1">Khatian No. (খতিয়ান):</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.khatianNo}
                    onChange={(e) => setFormData({ ...formData, khatianNo: e.target.value })}
                    className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] font-mono font-bold focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                ) : (
                  <p className="font-bold text-[var(--color-text-primary)] text-base font-mono">{formData.khatianNo}</p>
                )}
              </div>

              <div>
                <label className="block text-[var(--color-text-secondary)] font-semibold mb-1">Plot No. / Dag No. (দাগ):</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.plotNo}
                    onChange={(e) => setFormData({ ...formData, plotNo: e.target.value })}
                    className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] font-mono font-bold focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                ) : (
                  <p className="font-bold text-[var(--color-primary)] text-base font-mono bg-[var(--color-success-bg)] px-2.5 py-0.5 rounded inline-block border border-[var(--color-primary)]/25">
                    Plot #{formData.plotNo}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[var(--color-text-secondary)] font-semibold mb-1">Recorded Area (জমির পরিমাণ):</label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.01"
                    value={formData.areaAcre}
                    onChange={(e) => setFormData({ ...formData, areaAcre: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] font-mono focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                ) : (
                  <p className="font-bold text-[var(--color-text-primary)] text-sm font-mono">{formData.areaAcre} acre</p>
                )}
              </div>

              <div>
                <label className="block text-[var(--color-text-secondary)] font-semibold mb-1">Land Classification (জমির শ্রেণী):</label>
                {isEditing ? (
                  <select
                    value={formData.landType}
                    onChange={(e) => setFormData({ ...formData, landType: e.target.value })}
                    className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] bg-white focus:ring-2 focus:ring-[var(--color-primary)]"
                  >
                    <option value="Agricultural">Agricultural (আমন)</option>
                    <option value="Homestead">Homestead (বাস্তু)</option>
                    <option value="Commercial">Commercial (বাণিজ্যিক)</option>
                  </select>
                ) : (
                  <p className="font-semibold text-[var(--color-text-primary)] text-sm">{formData.landType}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Location Details */}
          <div className="bg-white p-5 rounded-xl border border-[var(--color-border)] shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
              Location Details (মৌজা ও সার্কেল)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[var(--color-text-secondary)] font-semibold mb-1">Mouza / Village:</label>
                <p className="font-semibold text-[var(--color-text-primary)]">{formData.village}</p>
              </div>

              <div>
                <label className="block text-[var(--color-text-secondary)] font-semibold mb-1">Circle / Tehsil:</label>
                <p className="font-semibold text-[var(--color-text-primary)]">{formData.tehsil}</p>
              </div>

              <div>
                <label className="block text-[var(--color-text-secondary)] font-semibold mb-1">District:</label>
                <p className="font-semibold text-[var(--color-text-primary)]">{formData.district}</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Document Preview & Audit Link (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-[var(--color-border)] shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold text-[var(--color-text-primary)] mb-3">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[var(--color-primary)]" />
                Scanned Source Document
              </span>
              <span className="text-[12px] text-[var(--color-text-secondary)] font-mono">Form 5440</span>
            </div>

            <DocumentViewer heightClass="h-[480px]" />

            <div className="mt-3 p-3 bg-[var(--color-bg)] rounded-lg border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] flex items-center justify-between">
              <span>Verified By: <strong className="text-[var(--color-text-primary)]">Shri Sujan Thapa</strong></span>
              <span className="font-semibold text-[var(--color-primary)]">12 Sep 2026, 12:20 PM</span>
            </div>
          </div>

          {/* Quick link to Audit Trail */}
          <div className="bg-white p-4 rounded-xl border border-[var(--color-border)] shadow-2xs flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <History className="w-4 h-4 text-[var(--color-primary)]" />
              <div>
                <span className="font-bold text-[var(--color-text-primary)] block">Audit Trail Logged</span>
                <span className="text-[var(--color-text-secondary)] text-[12px]">6 immutable actions recorded for Record #1024</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/audit-logs')}
              className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1"
            >
              <span>View Log</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
