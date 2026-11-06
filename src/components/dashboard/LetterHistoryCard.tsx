import React from 'react';
import { LetterDocument } from '../../types/letter';
import {
  formatDateIndonesian,
  formatLetterTitle,
} from '../../services/letterTextEngine';
import {
  Calendar,
  Users,
  Eye,
  Edit,
  Download,
  Copy,
  Trash2,
} from 'lucide-react';

interface LetterHistoryCardProps {
  document: LetterDocument;
  onPreview: (doc: LetterDocument) => void;
  onEdit: (doc: LetterDocument) => void;
  onDuplicate: (doc: LetterDocument) => void;
  onDelete: (id: string) => void;
  onDownloadDocx: (doc: LetterDocument) => void;
  onDownloadPdf: (doc: LetterDocument) => void;
}

export const LetterHistoryCard: React.FC<LetterHistoryCardProps> = ({
  document: doc,
  onPreview,
  onEdit,
  onDuplicate,
  onDelete,
  onDownloadDocx,
  onDownloadPdf,
}) => {
  const isKesiswaan = doc.kategori === 'KESISWAAN';
  const title = formatLetterTitle(doc.jenisIzinTerpilih);

  return (
    <div className="group p-4 sm:p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-150 flex flex-col justify-between space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase transition-colors ${
              isKesiswaan
                ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800/60'
                : 'bg-del-50 text-del-800 dark:bg-del-950/80 dark:text-del-300 border border-del-200/70 dark:border-del-800/60'
            }`}
          >
            {isKesiswaan ? 'Kesiswaan' : 'Akademik'}
          </span>
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs font-mono">
            <Users className="w-3.5 h-3.5" />
            <span>{doc.daftarPeserta.length}</span>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-snug group-hover:text-del-700 dark:group-hover:text-del-400 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1 line-clamp-2">
            Kegiatan: {doc.detailIzin.namaKegiatan || 'Tanpa Keterangan Kegiatan'}
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 pt-0.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDateIndonesian(doc.tanggalSurat)}</span>
        </div>
      </div>

      {/* Action Buttons with tactile micro-interactions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPreview(doc)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 active:scale-[0.95] transition-all flex items-center gap-1"
            title="Lihat Pratinjau Surat"
          >
            <Eye className="w-3.5 h-3.5 text-del-700 dark:text-del-400" />
            <span className="hidden sm:inline">Preview</span>
          </button>

          <button
            type="button"
            onClick={() => onEdit(doc)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 active:scale-[0.95] transition-all flex items-center gap-1"
            title="Buka &amp; Sunting Surat"
          >
            <Edit className="w-3.5 h-3.5 text-del-700 dark:text-del-400" />
            <span className="hidden sm:inline">Edit</span>
          </button>

          <button
            type="button"
            onClick={() => onDuplicate(doc)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 active:scale-[0.95] transition-all"
            title="Duplikat Surat"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onDownloadDocx(doc)}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.95] font-semibold transition-all flex items-center gap-1"
          >
            <Download className="w-3 h-3 text-del-700 dark:text-del-400" />
            DOCX
          </button>

          <button
            type="button"
            onClick={() => onDownloadPdf(doc)}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.95] font-semibold transition-all flex items-center gap-1"
          >
            <Download className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            PDF
          </button>

          <button
            type="button"
            onClick={() => onDelete(doc.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 active:scale-[0.95] transition-all ml-0.5"
            title="Hapus Surat"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
