import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: AlertType;
  title?: string;
  message: string;
}

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  type?: AlertType;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export interface AlertDialogOptions {
  title: string;
  message: string;
  type?: AlertType;
  confirmLabel?: string;
  onConfirm?: () => void;
}

interface AlertContextValue {
  toast: {
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    warning: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
  };
  showAlert: (options: AlertDialogOptions) => void;
  showConfirm: (options: ConfirmDialogOptions) => void;
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogOptions | null>(null);
  const [alertDialog, setAlertDialog] = useState<AlertDialogOptions | null>(null);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: AlertType, message: string, title?: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastItem = { id, type, message, title };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 3500);
  }, [removeToast]);

  const toast = {
    success: useCallback((msg: string, title?: string) => addToast('success', msg, title), [addToast]),
    error: useCallback((msg: string, title?: string) => addToast('error', msg, title), [addToast]),
    warning: useCallback((msg: string, title?: string) => addToast('warning', msg, title), [addToast]),
    info: useCallback((msg: string, title?: string) => addToast('info', msg, title), [addToast]),
  };

  const showAlert = useCallback((options: AlertDialogOptions) => {
    setAlertDialog(options);
  }, []);

  const showConfirm = useCallback((options: ConfirmDialogOptions) => {
    setConfirmDialog(options);
  }, []);

  const handleCloseAlert = () => {
    if (alertDialog?.onConfirm) {
      alertDialog.onConfirm();
    }
    setAlertDialog(null);
  };

  const handleConfirmAction = async () => {
    if (confirmDialog) {
      await confirmDialog.onConfirm();
      setConfirmDialog(null);
    }
  };

  const handleCancelAction = () => {
    if (confirmDialog?.onCancel) {
      confirmDialog.onCancel();
    }
    setConfirmDialog(null);
  };

  return (
    <AlertContext.Provider value={{ toast, showAlert, showConfirm }}>
      {children}

      {/* 1. Toast Notification Container (Bottom-Right, tidak menutupi tombol header) */}
      <div
        className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
        aria-live="polite"
      >
        {toasts.map((item) => {
          const typeConfig = {
            success: {
              border: 'border-slate-200 dark:border-slate-800',
              bg: 'bg-white dark:bg-slate-900',
              iconBg: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400',
              icon: CheckCircle2,
              title: item.title || 'Berhasil',
            },
            error: {
              border: 'border-slate-200 dark:border-slate-800',
              bg: 'bg-white dark:bg-slate-900',
              iconBg: 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400',
              icon: AlertCircle,
              title: item.title || 'Terjadi Kendala',
            },
            warning: {
              border: 'border-slate-200 dark:border-slate-800',
              bg: 'bg-white dark:bg-slate-900',
              iconBg: 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400',
              icon: AlertTriangle,
              title: item.title || 'Perhatian',
            },
            info: {
              border: 'border-slate-200 dark:border-slate-800',
              bg: 'bg-white dark:bg-slate-900',
              iconBg: 'bg-del-50 dark:bg-del-950 text-del-700 dark:text-del-400',
              icon: Info,
              title: item.title || 'Informasi',
            },
          }[item.type];

          const IconComponent = typeConfig.icon;

          return (
            <div
              key={item.id}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border ${typeConfig.border} ${typeConfig.bg} shadow-md shadow-slate-900/5 dark:shadow-black/30 animate-view-enter relative overflow-hidden transition-all`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${typeConfig.iconBg}`}
              >
                <IconComponent className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0 pr-1">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {typeConfig.title}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed break-words">
                  {item.message}
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeToast(item.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                aria-label="Tutup notifikasi"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* 2. Modal Dialog Alert (Matte, Solid, Anti-Slop) */}
      {alertDialog && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/50 animate-modal-backdrop">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-lg animate-modal-content space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-del-50 dark:bg-del-950 text-del-700 dark:text-del-400 flex items-center justify-center shrink-0">
                <Info className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {alertDialog.title}
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {alertDialog.message}
            </p>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleCloseAlert}
                className="px-4 py-2 rounded-xl bg-del-700 hover:bg-del-800 text-white text-xs font-semibold active:scale-[0.97] transition-all shadow-xs"
              >
                {alertDialog.confirmLabel || 'Mengerti'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal Dialog Confirmation (Solid, Anti-Slop) */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/50 animate-modal-backdrop">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-lg animate-modal-content space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  confirmDialog.isDestructive
                    ? 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                    : 'bg-del-50 dark:bg-del-950 text-del-700 dark:text-del-400'
                }`}
              >
                {confirmDialog.isDestructive ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {confirmDialog.title}
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {confirmDialog.message}
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3">
              <button
                type="button"
                onClick={handleCancelAction}
                className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold active:scale-[0.97] transition-all"
              >
                {confirmDialog.cancelLabel || 'Batal'}
              </button>

              <button
                type="button"
                onClick={handleConfirmAction}
                className={`px-4 py-2 rounded-xl text-white text-xs font-semibold active:scale-[0.97] transition-all shadow-xs ${
                  confirmDialog.isDestructive
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-del-700 hover:bg-del-800'
                }`}
              >
                {confirmDialog.confirmLabel || 'Konfirmasi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextValue => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert harus digunakan di dalam AlertProvider');
  }
  return context;
};
