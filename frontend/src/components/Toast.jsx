import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const ToastContext = createContext(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const show = (message, variant = 'info', duration = 3000) => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, message, variant }]);
    if (duration > 0) {
      setTimeout(() => dismiss(id), duration);
    }
    return id;
  };

  const success = (msg, duration) => show(msg, 'success', duration);
  const error = (msg, duration) => show(msg, 'error', duration);
  const info = (msg, duration) => show(msg, 'info', duration);

  const dismiss = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  return (
    <ToastContext.Provider value={{ show, success, error, info, dismiss }}>
      {children}
      <div className="fixed z-[1000] top-4 right-4 space-y-2">
        {toasts.map((t) => (
          <div key={t.id} className={`min-w-[240px] max-w-sm px-4 py-3 rounded-xl shadow-lg border text-sm transition ${
            t.variant === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/40 dark:border-emerald-800 dark:text-emerald-100' :
            t.variant === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-900/40 dark:border-rose-800 dark:text-rose-100' :
            'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-900/60 dark:border-gray-700 dark:text-gray-100'
          }`}>
            <div className="flex items-start gap-3">
              <div className="pt-0.5">{t.variant === 'success' ? '✅' : t.variant === 'error' ? '⚠️' : 'ℹ️'}</div>
              <div className="flex-1">{t.message}</div>
              <button onClick={() => dismiss(t.id)} className="opacity-70 hover:opacity-100">✖</button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};



