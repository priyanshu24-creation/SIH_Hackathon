import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Clock, ShieldAlert } from 'lucide-react';

export default function StatusBadge({ status, size = "md", showIcon = true }) {
  const normalized = (status || "").toLowerCase();

  let styles = "bg-slate-100 text-slate-700 border-slate-200";
  let icon = null;
  let label = status;

  if (normalized.includes("validated") || normalized.includes("approved")) {
    styles = "bg-emerald-50 text-emerald-700 border-emerald-200";
    icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
    label = "Validated";
  } else if (normalized.includes("review") || normalized.includes("warning") || normalized.includes("needs review")) {
    styles = "bg-amber-50 text-amber-700 border-amber-200";
    icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
    label = "Needs Review";
  } else if (normalized.includes("reject") || normalized.includes("issue") || normalized.includes("error")) {
    styles = "bg-rose-50 text-rose-700 border-rose-200";
    icon = <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />;
    label = "Issue Detected";
  } else if (normalized.includes("processing") || normalized.includes("pending")) {
    styles = "bg-sky-50 text-sky-700 border-sky-200";
    icon = <Clock className="w-3.5 h-3.5 text-sky-600 shrink-0 animate-spin" />;
    label = "Processing";
  }

  const sizeClasses = size === "sm" 
    ? "text-xs px-2 py-0.5 gap-1 font-medium" 
    : "text-xs px-2.5 py-1 gap-1.5 font-medium";

  return (
    <span className={`inline-flex items-center rounded-full border shadow-sm ${sizeClasses} ${styles}`}>
      {showIcon && icon}
      <span>{label}</span>
    </span>
  );
}

export { StatusBadge };
