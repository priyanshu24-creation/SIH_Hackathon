import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
  Loader2
} from 'lucide-react';
import { useLandRecord } from '../context/LandRecordContext';
import { useToast } from '../context/ToastContext';

export const ProcessingStatus: React.FC = () => {
  const navigate = useNavigate();
  const { currentProcessingFile } = useLandRecord();
  const { showToast } = useToast();

  const [progress, setProgress] = useState<number>(75);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // 7-step clear human stepper
  const steps = [
    { id: 1, title: 'Document received', threshold: 15, detail: 'Uploaded and verified' },
    { id: 2, title: 'Image quality checked', threshold: 30, detail: 'High resolution scan confirmed' },
    { id: 3, title: 'Language identified', threshold: 50, detail: `${currentProcessingFile.language || 'Bengali'} manuscript script` },
    { id: 4, title: 'Text extracted', threshold: 70, detail: 'Optical Character Recognition completed' },
    { id: 5, title: 'Land fields identified', threshold: 85, detail: 'Khatian, Dag, Owner, and Area fields mapped' },
    { id: 6, title: 'Validation checks', threshold: 95, detail: 'Cadastral GIS cross-verification' },
    { id: 7, title: 'Structured record', threshold: 100, detail: 'Record #1024 ready for officer review' }
  ];

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setIsCompleted(true);
          showToast(
            'Digitization Finished',
            'Record #1024 is ready for officer inspection.',
            'success'
          );
          return 100;
        }
        return prev + 5;
      });
    }, 1200);

    return () => clearInterval(progressTimer);
  }, [showToast]);

  const remainingSeconds = Math.max(0, Math.round((100 - progress) * 1.4));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-[var(--color-border)] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-primary)] mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Automated Document Processing Desk</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
            Digitizing your Khatian
          </h2>
          <div className="flex items-center gap-2 mt-1 text-xs text-[var(--color-text-secondary)]">
            <span className="font-semibold text-[var(--color-text-primary)] flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[var(--color-primary)]" />
              {currentProcessingFile.name || 'Khatian_1456.pdf'}
            </span>
            <span>·</span>
            <span>Darjeeling Sadar Circle</span>
          </div>
        </div>

        {/* Progress pill */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-2xl font-bold text-[var(--color-primary)]">{progress}%</span>
            <p className="text-[12px] text-[var(--color-text-secondary)]">
              {isCompleted ? 'Completed' : `Est. remaining: ${remainingSeconds}s`}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-[var(--color-border)] shadow-2xs space-y-6">
        <div>
          <div className="flex justify-between text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
            <span>Overall Progress</span>
            <span className="font-bold text-[var(--color-text-primary)]">{progress}%</span>
          </div>
          <div className="w-full bg-[var(--color-success-bg)] rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-[var(--color-primary)] h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 7 Clear Stepper Steps */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
            Processing Checklist
          </h3>

          <div className="divide-y divide-[var(--color-border)]/60 border border-[var(--color-border)] rounded-xl overflow-hidden bg-white">
            {steps.map((step) => {
              const isStepDone = progress >= step.threshold;
              const isStepCurrent = !isStepDone && progress >= step.threshold - 15;

              return (
                <div
                  key={step.id}
                  className={`p-3.5 flex items-center justify-between transition-colors ${
                    isStepDone
                      ? 'bg-white'
                      : isStepCurrent
                      ? 'bg-[var(--color-success-bg)]/40'
                      : 'bg-[var(--color-bg)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isStepDone
                          ? 'bg-[var(--color-success)] text-white'
                          : isStepCurrent
                          ? 'bg-[var(--color-success-bg)] text-[var(--color-primary)] border border-[var(--color-primary)]'
                          : 'bg-[var(--color-border)] text-[var(--color-text-secondary)]'
                      }`}
                    >
                      {isStepDone ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : isStepCurrent ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <div>
                      <h4
                        className={`text-xs font-semibold ${
                          isStepDone || isStepCurrent ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'
                        }`}
                      >
                        {step.title}
                      </h4>
                      <p className="text-[12px] text-[var(--color-text-secondary)]">{step.detail}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[12px] font-semibold px-2 py-0.5 rounded-full ${
                      isStepDone
                        ? 'bg-[var(--color-success-bg)] text-[var(--color-primary)]'
                        : isStepCurrent
                        ? 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]'
                        : 'bg-[var(--color-border)]/40 text-[var(--color-text-secondary)]'
                    }`}
                  >
                    {isStepDone ? 'Completed' : isStepCurrent ? 'Processing...' : 'Waiting'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
          <button
            onClick={() => navigate('/documents')}
            className="px-4 py-2 rounded-lg bg-white border border-[var(--color-border)] text-xs font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-border-subtle)] transition-colors"
          >
            ← Back to Documents
          </button>

          <button
            onClick={() => navigate('/documents/1024')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs sm:text-sm font-semibold shadow-2xs transition-colors"
          >
            <span>Inspect Extracted Fields</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
