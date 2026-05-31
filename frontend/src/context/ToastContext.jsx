import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-emerald-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-rose-400" />;
      default:
        return <Info className="h-5 w-5 text-cyan-400" />;
    }
  };

  const getColors = (type) => {
    switch (type) {
      case 'success':
        return 'from-emerald-950/40 to-emerald-900/10 border-emerald-500/30 text-emerald-200';
      case 'error':
        return 'from-rose-950/40 to-rose-900/10 border-rose-500/30 text-rose-200';
      default:
        return 'from-cyan-950/40 to-cyan-900/10 border-cyan-500/30 text-cyan-200';
    }
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {/* Toast Portal Container */}
      <div className="fixed bottom-6 right-6 z-55 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              className={`pointer-events-auto flex items-start space-x-3 p-4 rounded-xl border bg-gradient-to-r shadow-xl backdrop-blur-md ${getColors(
                t.type
              )}`}
            >
              <div className="flex-shrink-0 mt-0.5">{getIcon(t.type)}</div>
              <div className="flex-1 text-sm font-medium pr-2">{t.message}</div>
              <button
                onClick={() => removeToast(t.id)}
                className="flex-shrink-0 text-white/40 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
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
