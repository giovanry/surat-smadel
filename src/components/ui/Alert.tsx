import React, { ReactNode } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type InlineAlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type?: InlineAlertType;
  title?: string;
  message?: string;
  children?: ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  children,
  onClose,
  className = '',
}) => {
  const config = {
    success: {
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      icon: CheckCircle2,
    },
    error: {
      iconColor: 'text-rose-600 dark:text-rose-400',
      icon: AlertCircle,
    },
    warning: {
      iconColor: 'text-amber-600 dark:text-amber-400',
      icon: AlertTriangle,
    },
    info: {
      iconColor: 'text-del-700 dark:text-del-400',
      icon: Info,
    },
  }[type];

  const IconComponent = config.icon;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs ${className} animate-view-enter`}
    >
      <IconComponent className={`w-4 h-4 shrink-0 mt-0.5 ${config.iconColor}`} />

      <div className="flex-1 min-w-0 text-xs text-slate-800 dark:text-slate-200">
        {title && <div className="font-bold mb-0.5">{title}</div>}
        {message && <div className="leading-relaxed opacity-90">{message}</div>}
        {children}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-md transition-colors shrink-0"
          aria-label="Tutup pesan"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

