import React from 'react';
import { Check, AlertCircle, AlertTriangle } from 'lucide-react';

export default function ConfidenceMeter({ 
  value = 0, 
  size = "md", 
  showLabel = true, 
  showBar = true,
  onReview = null 
}) {
  const score = Math.round(value);

  let category = "high";
  let color = "text-emerald-700 bg-emerald-50 border-emerald-200";
  let barColor = "bg-emerald-500";
  let text = "High Confidence";
  let icon = <Check className="w-3.5 h-3.5 text-emerald-600" />;

  if (score < 70) {
    category = "low";
    color = "text-rose-700 bg-rose-50 border-rose-200";
    barColor = "bg-rose-500";
    text = "Verification Required";
    icon = <AlertCircle className="w-3.5 h-3.5 text-rose-600" />;
  } else if (score < 90) {
    category = "medium";
    color = "text-amber-700 bg-amber-50 border-amber-200";
    barColor = "bg-amber-500";
    text = "Medium Confidence";
    icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />;
  }

  if (size === "compact") {
    return (
      <div className="flex items-center gap-1.5">
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-semibold border ${color}`}>
          {score}%
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold border ${color}`}>
            {icon}
            <span>{score}%</span>
          </span>
          {showLabel && (
            <span className="text-slate-600 font-medium">{text}</span>
          )}
        </div>
        {category === "low" && onReview && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReview();
            }}
            className="text-[12px] text-brand-600 font-semibold hover:underline flex items-center gap-0.5"
          >
            Review Field →
          </button>
        )}
      </div>
      {showBar && (
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${barColor}`} 
            style={{ width: `${Math.min(score, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
