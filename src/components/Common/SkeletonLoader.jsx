import React from 'react';

export function CardSkeleton() {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle animate-pulse space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-slate-200 rounded w-28" />
        <div className="h-8 w-8 bg-slate-200 rounded-lg" />
      </div>
      <div className="h-7 bg-slate-200 rounded w-36" />
      <div className="h-3 bg-slate-100 rounded w-20" />
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 6 }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden animate-pulse">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="h-5 bg-slate-200 rounded w-40" />
        <div className="h-8 bg-slate-100 rounded w-60" />
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            {Array.from({ length: cols }).map((_, j) => (
              <div 
                key={j} 
                className="h-4 bg-slate-100 rounded flex-1"
                style={{ width: `${60 + (j * 15) % 40}%` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DocumentCanvasSkeleton() {
  return (
    <div className="bg-slate-100 rounded-xl border border-slate-200 h-[600px] p-8 flex flex-col justify-between animate-pulse">
      <div className="space-y-4">
        <div className="h-8 bg-slate-200 rounded w-2/3 mx-auto" />
        <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto" />
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="h-20 bg-slate-200 rounded" />
          <div className="h-20 bg-slate-200 rounded" />
          <div className="h-20 bg-slate-200 rounded" />
          <div className="h-20 bg-slate-200 rounded" />
        </div>
      </div>
      <div className="h-10 bg-slate-200 rounded w-1/3" />
    </div>
  );
}
