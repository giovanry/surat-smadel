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
      border: 'border-emerald-200 dark:border-emerald-900',
      bg: 'bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      icon: CheckCircle2,
    },
    error: {
      border: 'border-rose-200 dark:border-rose-900',
      bg: 'bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100',
      iconColor: 'text-rose-600 dark:text-rose-400',
      icon: AlertCircle,
    },
    warning: {
      border: 'border-amber-200 dark:border-amber-900',
      bg: 'bg-amber-50/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-100',
      iconColor: 'text-amber-600 dark:text-amber-400',
      icon: AlertTriangle,
    },
    info: {
      border: 'border-del-200 dark:border-del-900',
      bg: 'bg-del-50/70 dark:bg-del-950/40 text-del-900 dark:text-del-100',
      iconColor: 'text-del-700 dark:text-del-400',
      icon: Info,
    },
  }[type];

  const IconComponent = config.icon;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-3.5 rounded-2xl border ${config.border} ${config.bg} ${className} animate-view-enter`}
    >
      <IconComponent className={`w-4 h-4 shrink-0 mt-0.5 ${config.iconColor}`} />

      <div className="flex-1 min-w-0 text-xs">
        {title && <div className="font-bold mb-0.5">{title}</div>}
        {message && <div className="leading-relaxed opacity-90">{message}</div>}
        {children}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-md transition-colors shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
