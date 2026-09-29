import React from 'react';
import { ConfidenceLevel } from '../../types';

interface ConfidenceBadgeProps {
  confidence: number;
  level?: ConfidenceLevel;
  showLevel?: boolean;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  confidence,
  level,
  showLevel = true
}) => {
  let determinedLevel: ConfidenceLevel = level || 'High';
  if (!level) {
    if (confidence >= 90) determinedLevel = 'High';
    else if (confidence >= 75) determinedLevel = 'Medium';
    else determinedLevel = 'Low';
  }

  const styles = {
    High: 'bg-[var(--color-success-bg)] text-[var(--color-primary)] border-[var(--color-primary)]/25',
    Medium: 'bg-[var(--color-warning-bg)] text-[var(--color-warning)] border-[var(--color-warning-border)]/30',
    Low: 'bg-[var(--color-error-bg)] text-[var(--color-error)] border-[var(--color-error)]/25'
  };

  const dotStyles = {
    High: 'bg-[var(--color-success)]',
    Medium: 'bg-[var(--color-warning)]',
    Low: 'bg-[var(--color-error)]'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[determinedLevel]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[determinedLevel]}`} />
      <span>{confidence}%</span>
      {showLevel && <span className="opacity-80 font-normal">({determinedLevel})</span>}
    </span>
  );
};
