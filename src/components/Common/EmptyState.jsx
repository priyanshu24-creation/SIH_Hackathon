import React from 'react';
import { FolderSearch, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  title = "No documents found",
  description = "Upload your first land record to begin digitization.",
  actionLabel = "Upload Document",
  actionLink = "/app/upload",
  icon: Icon = FolderSearch
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-slate-200 shadow-subtle my-6">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 mb-4 ring-8 ring-slate-50">
        <Icon className="w-7 h-7 stroke-[1.5]" />
      </div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mt-1 mb-5">{description}</p>
      {actionLabel && (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
