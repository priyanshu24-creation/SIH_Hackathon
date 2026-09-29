import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Clock } from 'lucide-react';
import { RecordStatus } from '../../types';

interface StatusBadgeProps {
  status: RecordStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const isSmall = size === 'sm';
  const padding = isSmall ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  switch (status) {
    case 'Verified':
    case 'Validated':
    case 'Match':
    case 'Passed':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-[var(--color-success-bg)] text-[var(--color-primary)] border border-[var(--color-primary)]/25 ${padding}`}>
          <CheckCircle2 className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>{status}</span>
        </span>
      );
    case 'Needs Verification':
    case 'Mismatch':
    case 'Warning':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-[var(--color-warning-bg)] text-[var(--color-warning)] border border-[var(--color-warning-border)]/30 ${padding}`}>
          <AlertTriangle className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>{status}</span>
        </span>
      );
    case 'Flagged':
    case 'Rejected':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-[var(--color-error-bg)] text-[var(--color-error)] border border-[var(--color-error)]/25 ${padding}`}>
          <AlertCircle className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>{status}</span>
        </span>
      );
    case 'Pending':
    case 'Processing':
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-[#EAF2FA] text-[var(--color-primary)] border border-[var(--color-primary)]/25 ${padding}`}>
          <Clock className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>{status}</span>
        </span>
      );
  }
};

export default StatusBadge;
