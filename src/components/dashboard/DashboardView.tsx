import React, { useState } from 'react';
import { LetterDocument, LetterCategory } from '../../types/letter';
import { LetterHistoryCard } from './LetterHistoryCard';
import { storageService } from '../../services/storageService';
import { exportLetterToDocx } from '../../services/docxGenerator';
import { pdfGenerator } from '../../services/pdfGenerator';
import { MainLetterPage } from '../preview/MainLetterPage';
import { AttachmentPage } from '../preview/AttachmentPage';
import {
  FileText,
  ShieldCheck,
  BookOpen,
  UserCheck,
  Search,
  Plus,
  X,
  Printer,
  Download,
  Inbox,
} from 'lucide-react';

interface DashboardViewProps {
  letters: LetterDocument[];
  onNavigateToBuilder: (docToEdit?: LetterDocument) => void;
  onNavigateToSettings: () => void;
  onRefreshLetters: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  letters,
  onNavigateToBuilder,
  onNavigateToSettings,
  onRefreshLetters,
}) => {
  const [filterCategory, setFilterCategory] = useState<'ALL' | LetterCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewModalDoc, setPreviewModalDoc] = useState<LetterDocument | null>(null);

  const profile = storageService.getProfile();
  const isProfileComplete = Boolean(profile.namaLengkap.trim());

  const totalLetters = letters.length;
  const totalKesiswaan = letters.filter((l) => l.kategori === 'KESISWAAN').length;
  const totalAkademik = letters.filter((l) => l.kategori === 'AKADEMIK').length;

  const filteredLetters = letters.filter((doc) => {
    if (filterCategory !== 'ALL' && doc.kategori !== filterCategory) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchKegiatan = (doc.detailIzin.namaKegiatan || '').toLowerCase().includes(q);
      const matchTanggal = (doc.tanggalSurat || '').toLowerCase().includes(q);
      const matchPemohon = (doc.tandaTangan.namaPemohon || '').toLowerCase().includes(q);
      return matchKegiatan || matchTanggal || matchPemohon;
    }
    return true;
  });

  const handleDelete = (id: string) => {
    if (confirm('Hapus surat ini dari riwayat browser Anda?')) {
      storageService.deleteLetter(id);
      onRefreshLetters();
    }
  };

  const handleDuplicate = (doc: LetterDocument) => {
    const duplicated: LetterDocument = {
      ...doc,
      id: crypto.randomUUID ? crypto.randomUUID() : `doc_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tanggalSurat: new Date().toISOString().split('T')[0],
    };
    storageService.saveLetter(duplicated);
    onRefreshLetters();
  };

  const handleDownloadDocx = async (doc: LetterDocument) => {
    await exportLetterToDocx(doc);
  };

  const handleDownloadPdf = async (doc: LetterDocument) => {
    setPreviewModalDoc(doc);
    setTimeout(async () => {
      const filename = `surat_izin_${doc.tanggalSurat}`;
      await pdfGenerator.downloadElementAsPdf('modal-a4-preview', filename);
    }, 200);
  };

  return (
    <div className="space-y-6 animate-view-enter">
      {/* 1. Header Ringkas & Buat Surat */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-all">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-del-50 dark:bg-del-950/80 text-del-700 dark:text-del-300 border border-del-200/60 dark:border-del-800 text-xs font-semibold tracking-wide">
            Generator Surat Izin
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Surat Izin Siswa SMA Unggul Del
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
            Penyusun surat izin format A4. Ekspor dokumen ke Microsoft Word (.docx) dan PDF siap cetak.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigateToBuilder()}
          className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-del-700 text-white font-semibold text-xs sm:text-sm shadow-sm hover:bg-del-800 active:scale-[0.98] transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-del-700"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Buat Surat Baru
        </button>
      </div>

      {/* 2. 4 Kartu Statistik Terstruktur (Flat & Clean) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Surat */}
        <div className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center gap-3.5">
          <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-del-700 dark:text-del-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Tersimpan</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
              {totalLetters}
            </div>
          </div>
        </div>

        {/* Surat Kesiswaan */}
        <div className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center gap-3.5">
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Kesiswaan (Asrama)</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
              {totalKesiswaan}
            </div>
          </div>
        </div>

        {/* Surat Akademik */}
        <div className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center gap-3.5">
          <div className="p-3 rounded-lg bg-del-50 dark:bg-del-950/60 text-del-700 dark:text-del-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Akademik (Sekolah)</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
              {totalAkademik}
            </div>
          </div>
        </div>

        {/* Status Profil */}
        <div className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`p-3 rounded-lg flex-shrink-0 ${
                isProfileComplete
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-slate-500 font-medium">Profil Siswa</div>
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                {isProfileComplete ? profile.namaLengkap : 'Belum Lengkap'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateToSettings}
            className="text-xs font-semibold text-del-700 dark:text-del-400 hover:underline px-2 py-1 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {isProfileComplete ? 'Ubah' : 'Atur'}
          </button>
        </div>
      </div>

      {/* 3. Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
        {/* Tabs Filter */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilterCategory('ALL')}
            className={`px-3 py-1.5 rounded-md transition-all active:scale-[0.98] ${
              filterCategory === 'ALL'
                ? 'bg-white dark:bg-slate-700 text-del-700 dark:text-del-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Semua ({totalLetters})
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('KESISWAAN')}
            className={`px-3 py-1.5 rounded-md transition-all active:scale-[0.98] ${
              filterCategory === 'KESISWAAN'
                ? 'bg-white dark:bg-slate-700 text-del-700 dark:text-del-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Kesiswaan ({totalKesiswaan})
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('AKADEMIK')}
            className={`px-3 py-1.5 rounded-md transition-all active:scale-[0.98] ${
              filterCategory === 'AKADEMIK'
                ? 'bg-white dark:bg-slate-700 text-del-700 dark:text-del-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Akademik ({totalAkademik})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kegiatan, tanggal..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-del-700 transition-colors"
          />
        </div>
      </div>

      {/* 4. Daftar Kartu Riwayat dengan Stagger Animation */}
      {filteredLetters.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Inbox className="w-6 h-6 stroke-[1.8]" />
          </div>
          <div className="text-slate-800 dark:text-slate-200 font-semibold text-sm">
            {searchQuery ? 'Tidak ada surat yang cocok' : 'Belum ada riwayat surat'}
          </div>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? 'Coba gunakan kata kunci pencarian yang berbeda.'
              : 'Mulai buat surat izin pertama Anda dengan tombol di bawah.'}
          </p>
          {!searchQuery && (
            <button
              type="button"
              onClick={() => onNavigateToBuilder()}
              className="px-4 py-2 rounded-lg bg-del-700 text-white font-semibold text-xs shadow-sm hover:bg-del-800 active:scale-[0.98] transition-all"
            >
              Mulai Buat Surat
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLetters.map((doc, index) => (
            <div
              key={doc.id}
              style={{ animationDelay: `${Math.min(index * 40, 240)}ms` }}
              className="animate-card-stagger"
            >
              <LetterHistoryCard
                document={doc}
                onPreview={(d) => setPreviewModalDoc(d)}
                onEdit={(d) => onNavigateToBuilder(d)}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                onDownloadDocx={handleDownloadDocx}
                onDownloadPdf={handleDownloadPdf}
              />
            </div>
          ))}
        </div>
      )}

      {/* 5. Modal Preview A4 (Animasi Pop Terstruktur) */}
      {previewModalDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-modal-backdrop">
          <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-modal-content">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <div className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-del-700 dark:text-del-400" />
                Pratinjau Dokumen Cetak A4
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => exportLetterToDocx(previewModalDoc)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-del-700 text-white hover:bg-del-800 active:scale-[0.98] transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  DOCX
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-100 active:scale-[0.98] transition-all flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewModalDoc(null)}
                  aria-label="Tutup pratinjau"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: A4 Paper Preview */}
            <div className="flex-1 overflow-auto p-6 flex justify-center items-start">
              <div
                id="modal-a4-preview"
                style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}
                className="space-y-6"
              >
                <div className="shadow-2xl rounded-sm">
                  <MainLetterPage document={previewModalDoc} />
                </div>
                {(previewModalDoc.modePeserta === 'ATTACHMENT_GT_10' ||
                  previewModalDoc.gunakanTabelRuntutanWaktu) && (
                  <div className="shadow-2xl rounded-sm">
                    <AttachmentPage document={previewModalDoc} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
