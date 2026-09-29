import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileUp,
  FileText,
  X,
  CheckCircle2,
  Languages,
  Layers,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Info
} from 'lucide-react';
import { useLandRecord } from '../context/LandRecordContext';
import { useToast } from '../context/ToastContext';

export const UploadDocument: React.FC = () => {
  const navigate = useNavigate();
  const { setProcessingFile, ingestNewDocument } = useLandRecord();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState<boolean>(false);
  const [actualFile, setActualFile] = useState<File | null>(null);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
    type: string;
  } | null>({
    name: 'Khatian_1456.pdf',
    size: '2.4 MB',
    type: 'application/pdf'
  });
  const [language, setLanguage] = useState<string>('Auto Detect');
  const [docType, setDocType] = useState<string>('Khatian / Land Record');
  const [district, setDistrict] = useState<string>('Darjeeling');
  const [circle, setCircle] = useState<string>('Darjeeling Sadar');
  const [village, setVillage] = useState<string>('Kanchenjunga (JL 42)');
  const [uploadProgress, setUploadProgress] = useState<number>(100);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setActualFile(file);
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    setSelectedFile({
      name: file.name,
      size: sizeInMb,
      type: file.type || 'Document'
    });
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          showToast('File Uploaded', `${file.name} ready for digitization.`, 'success');
          return 100;
        }
        return prev + 25;
      });
    }, 120);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleStartProcessing = () => {
    if (!selectedFile) {
      showToast('No Document Selected', 'Please upload or select a scanned land record file first.', 'warning');
      return;
    }

    ingestNewDocument(
      { name: selectedFile.name, size: selectedFile.size, type: selectedFile.type },
      docType,
      district
    );

    showToast('Digitization Started', `Extracting information from ${selectedFile.name}...`, 'info');
    navigate('/documents');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page Title & Subtitle */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-[var(--color-border)] shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-primary)] mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Darjeeling Sadar Land Records Office · Ingestion Desk</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
          Upload a Khatian
        </h2>
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
          Add a scanned land record for digitization and verification.
        </p>
      </div>

      {/* Main Upload Card */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-[var(--color-border)] shadow-2xs space-y-6">
        {/* Large Friendly Dropzone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-[var(--color-primary)] bg-[var(--color-success-bg)]/60 ring-4 ring-[var(--color-primary)]/10'
              : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/60 bg-[var(--color-bg)] hover:bg-[var(--color-border-subtle)]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="mx-auto w-14 h-14 rounded-full bg-[var(--color-success-bg)] text-[var(--color-primary)] flex items-center justify-center mb-3 shadow-2xs">
            <FileUp className="w-7 h-7" />
          </div>

          <h3 className="text-sm sm:text-base font-bold text-[var(--color-text-primary)]">
            Drop your scanned Khatian here
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            or <span className="text-[var(--color-primary)] font-semibold underline underline-offset-2">Choose a file</span>
          </p>

          <p className="text-[12px] text-[var(--color-text-secondary)] mt-3">
            Supported: <strong className="font-semibold text-[var(--color-text-primary)]">PDF, JPG, PNG</strong> · Maximum <strong className="font-semibold text-[var(--color-text-primary)]">10 MB</strong>
          </p>
        </div>

        {/* Selected File Card */}
        {selectedFile && (
          <div className="p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[var(--color-success-bg)] text-[var(--color-primary)] shrink-0 border border-[var(--color-primary)]/20">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--color-text-primary)]">{selectedFile.name}</h4>
                  <p className="text-[12px] text-[var(--color-text-secondary)]">
                    {selectedFile.size} · {selectedFile.type}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--color-primary)] bg-[var(--color-success-bg)] px-2.5 py-0.5 rounded-full border border-[var(--color-primary)]/25">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Ready
                </span>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white rounded transition-colors"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-[12px] font-medium text-[var(--color-text-secondary)] mb-1">
                <span>Upload Status</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-[var(--color-border)] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[var(--color-primary)] h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Metadata Controls */}
        <div className="pt-2 border-t border-[var(--color-border)] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[var(--color-text-primary)] font-semibold mb-1 flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              Language:
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
            >
              <option value="Auto Detect">Auto Detect (Bengali / English)</option>
              <option value="Bengali">Bengali (বাংলা)</option>
              <option value="English">English</option>
            </select>
          </div>

          <div>
            <label className="block text-[var(--color-text-primary)] font-semibold mb-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              Document Type:
            </label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
            >
              <option value="Khatian / Land Record">Khatian / Land Record (Form 5440)</option>
              <option value="Porcha">Porcha Extract</option>
              <option value="Cadastral Map Sheet">Cadastral Map Sheet</option>
            </select>
          </div>

          <div>
            <label className="block text-[var(--color-text-primary)] font-semibold mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              District:
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
            >
              <option value="Darjeeling">Darjeeling</option>
              <option value="Jalpaiguri">Jalpaiguri</option>
              <option value="Kalimpong">Kalimpong</option>
            </select>
          </div>

          <div>
            <label className="block text-[var(--color-text-primary)] font-semibold mb-1">
              Circle &amp; Village (Optional):
            </label>
            <input
              type="text"
              value={`${circle} · ${village}`}
              onChange={(e) => setCircle(e.target.value)}
              placeholder="e.g. Darjeeling Sadar / Mouza Kanchenjunga"
              className="w-full px-3 py-2 bg-white border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
            />
          </div>
        </div>

        {/* Prototype Disclaimer & Action Button */}
        <div className="pt-4 border-t border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
            <Info className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
            <span>Your document will be processed locally in this prototype.</span>
          </div>

          <button
            type="button"
            onClick={handleStartProcessing}
            disabled={!selectedFile}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] disabled:bg-slate-300 text-white font-semibold text-xs sm:text-sm shadow-2xs transition-colors"
          >
            <span>Start Digitization</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
