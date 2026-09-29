import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  context?: string;
  isPositiveTrend?: boolean;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  context,
  isPositiveTrend = true,
  icon: Icon,
  iconColor,
  iconBg,
}) => {
  return (
    <div className="gov-card gov-card-hover px-6 py-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow mb-2">{title}</p>
          <p style={{ fontSize: 31.5, fontWeight: 800, color: 'var(--color-text)', lineHeight: 1, letterSpacing: '-0.5px' }}>
            {value}
          </p>
        </div>
        {Icon && (
          <div
            className="p-2 rounded-lg shrink-0"
            style={{
              background: iconBg ?? 'var(--color-primary-light)',
              color: iconColor ?? 'var(--color-primary)',
            }}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(trend || context) && (
        <div
          className="mt-4 pt-3 flex flex-wrap items-center gap-1.5 text-xs"
          style={{ borderTop: '1px solid var(--color-border-subtle)' }}
        >
          {trend && (
            <span
              className="inline-flex items-center gap-1 font-semibold"
              style={{ color: isPositiveTrend ? 'var(--color-success)' : 'var(--color-attention)' }}
            >
              {isPositiveTrend ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {trend}
            </span>
          )}
          {context && (
            <span style={{ color: 'var(--color-muted)', fontSize: 12 }}>{context}</span>
          )}
        </div>
      )}
    </div>
  );
};
