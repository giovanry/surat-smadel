import React, { useRef } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

interface DatePickerInputProps {
  value?: string; // Dapat berupa YYYY-MM-DD atau DD/MM/YYYY
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

// Konversi nilai ISO YYYY-MM-DD ke format tampilan DD/MM/YYYY
function toDisplayDDMMYYYY(val?: string): string {
  if (!val) return '';
  const trimmed = val.trim();
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) return trimmed;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [y, m, d] = trimmed.split('-');
    return `${d}/${m}/${y}`;
  }
  return trimmed;
}

// Konversi nilai input DD/MM/YYYY ke ISO YYYY-MM-DD
function toIsoYYYYMMDD(val?: string): string {
  if (!val) return '';
  const trimmed = val.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
    const [d, m, y] = trimmed.split('/');
    return `${y}-${m}-${d}`;
  }
  return trimmed;
}

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  value,
  onChange,
  placeholder = 'DD/MM/YYYY',
  className = '',
  disabled = false,
}) => {
  const hiddenDateRef = useRef<HTMLInputElement>(null);
  const displayValue = toDisplayDDMMYYYY(value);

  const handleOpenPicker = () => {
    if (disabled || !hiddenDateRef.current) return;
    if ('showPicker' in HTMLInputElement.prototype) {
      try {
        hiddenDateRef.current.showPicker();
      } catch {
        hiddenDateRef.current.focus();
      }
    } else {
      hiddenDateRef.current.focus();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/[^\d/]/g, '');

    // Format otomatis saat pengguna mengetik angka tanpa slash
    if (!input.includes('/') && input.length >= 2) {
      if (input.length <= 4) {
        input = `${input.slice(0, 2)}/${input.slice(2)}`;
      } else {
        input = `${input.slice(0, 2)}/${input.slice(2, 4)}/${input.slice(4, 8)}`;
      }
    }

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(input)) {
      const [dStr, mStr, yStr] = input.split('/');
      const d = parseInt(dStr, 10);
      const m = parseInt(mStr, 10);
      const y = parseInt(yStr, 10);
      if (d >= 1 && d <= 31 && m >= 1 && m <= 12 && y >= 1900 && y <= 2100) {
        onChange(toIsoYYYYMMDD(input));
        return;
      }
    }

    // Jika belum lengkap atau format bebas, kirimkan perubahan teks
    onChange(input);
  };

  const handleNativePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pickedIso = e.target.value;
    if (pickedIso) {
      onChange(pickedIso);
    }
  };

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <input
        type="text"
        disabled={disabled}
        value={displayValue}
        onChange={handleTextChange}
        placeholder={placeholder}
        maxLength={10}
        className="w-full pl-3 pr-9 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-del-700 transition-colors font-mono tracking-tight"
      />

      <button
        type="button"
        disabled={disabled}
        onClick={handleOpenPicker}
        className="absolute right-2 p-1 text-slate-400 hover:text-del-700 dark:hover:text-del-400 active:scale-95 transition-all focus:outline-none"
        title="Pilih tanggal dari kalender"
      >
        <CalendarIcon className="w-3.5 h-3.5" />
      </button>

      {/* Hidden native date input to trigger standard calendar picker */}
      <input
        ref={hiddenDateRef}
        type="date"
        value={toIsoYYYYMMDD(value)}
        onChange={handleNativePickerChange}
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
      />
    </div>
  );
};

