import React from 'react';
import { useRecords } from '../../context/RecordsContext';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Toast() {
  const { toasts, dismissToast } = useRecords();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          let icon = <Info className="w-5 h-5 text-sky-500 shrink-0" />;
          let bg = "bg-white border-slate-200 text-slate-800";

          if (toast.type === "success") {
            icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
          } else if (toast.type === "warning") {
            icon = <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
          } else if (toast.type === "error") {
            icon = <XCircle className="w-5 h-5 text-rose-500 shrink-0" />;
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-elevated ${bg}`}
            >
              <div className="mt-0.5">{icon}</div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-slate-900 leading-snug">{toast.title}</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
