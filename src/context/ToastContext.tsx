import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

interface ToastContextType {
  showToast: (title: string, message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (title: string, message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border text-sm transition-all duration-300 transform translate-y-0 ${
              toast.type === 'success'
                ? 'bg-white border-[var(--color-success-border)] text-[var(--color-text-primary)]'
                : toast.type === 'warning'
                ? 'bg-white border-[#F8DDA4] text-[var(--color-text-primary)]'
                : toast.type === 'error'
                ? 'bg-white border-[#F8B4B4] text-[var(--color-text-primary)]'
                : 'bg-white border-[#BDD9F0] text-[var(--color-text-primary)]'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[var(--color-success)]" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-[var(--color-warning)]" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-[var(--color-error)]" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-[var(--color-primary)]" />}
            </div>
            <div className="flex-1 pr-1">
              <h4 className="font-bold text-xs tracking-tight text-[var(--color-text-primary)]">{toast.title}</h4>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors p-0.5 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
