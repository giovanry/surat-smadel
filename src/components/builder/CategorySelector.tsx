import React from 'react';
import {
  LetterCategory,
  PermitType,
  KesiswaanPermitType,
  AkademikPermitType,
} from '../../types/letter';
import { ShieldCheck, BookOpen, Check } from 'lucide-react';

interface CategorySelectorProps {
  kategori: LetterCategory;
  jenisIzinTerpilih: PermitType[];
  onChangeKategori: (kategori: LetterCategory) => void;
  onToggleIzin: (izin: PermitType) => void;
}

const KESISWAAN_LIST: { id: KesiswaanPermitType; label: string; desc: string }[] = [
  { id: 'IZIN_HP', label: 'Izin Penggunaan Handphone', desc: 'Pemakaian gadget/ponsel untuk keperluan tertentu.' },
  { id: 'IZIN_BUNGKUS_MAKAN', label: 'Izin Pembungkusan Makan', desc: 'Membungkus jatah makan pagi, siang, atau malam di kantin.' },
  { id: 'IZIN_TIDAK_BRIEFING', label: 'Izin Tidak Mengikuti Briefing', desc: 'Dispensasi tidak hadir pada sesi briefing asrama.' },
  { id: 'IZIN_TERLAMBAT_ASRAMA', label: 'Izin Terlambat Masuk Asrama', desc: 'Izin kembali ke asrama melewati jam malam reguler.' },
  { id: 'IZIN_TIDAK_KURVE', label: 'Izin Tidak Mengikuti Kurve', desc: 'Dispensasi berhalangan pada jadwal kerja bakti/kurve.' },
  { id: 'IZIN_AKTIVITAS_MALAM', label: 'Izin Mengikuti Aktivitas Malam', desc: 'Kegiatan luar asrama pada malam hari untuk kepanitiaan/latihan.' },
  { id: 'IZIN_LEWAT_JAM_SILENT', label: 'Izin Beraktivitas Melewati Jam Silent', desc: 'Belajar atau berkegiatan melewati batas jam tenang asrama.' },
];

const AKADEMIK_LIST: { id: AkademikPermitType; label: string; desc: string }[] = [
  { id: 'IZIN_LAPTOP', label: 'Izin Penggunaan Laptop', desc: 'Penggunaan laptop di luar jam terjadwal untuk tugas atau kompetisi.' },
  { id: 'IZIN_RUANGAN', label: 'Izin Penggunaan Ruangan / Laboratorium', desc: 'Peminjaman ruang kelas atau Lab Kimia/Fisika/Biologi.' },
];

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  kategori,
  jenisIzinTerpilih,
  onChangeKategori,
  onToggleIzin,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Pemilihan Kategori Utama (Eksklusif & Flat Solid) */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
          Kategori Surat
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Card Kesiswaan */}
          <button
            type="button"
            onClick={() => onChangeKategori('KESISWAAN')}
            className={`p-4 rounded-xl border text-left transition-all active:scale-[0.98] flex items-start gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-del-700 ${
              kategori === 'KESISWAAN'
                ? 'border-del-700 bg-del-50/70 dark:bg-del-950/60 dark:border-del-500 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
            }`}
          >
            <div
              className={`p-2.5 rounded-lg transition-colors ${
                kategori === 'KESISWAAN'
                  ? 'bg-del-700 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                Surat Kesiswaan
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ditujukan kepada Pembina Asrama SMA Unggul Del
              </div>
            </div>
          </button>

          {/* Card Akademik */}
          <button
            type="button"
            onClick={() => onChangeKategori('AKADEMIK')}
            className={`p-4 rounded-xl border text-left transition-all active:scale-[0.98] flex items-start gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-del-700 ${
              kategori === 'AKADEMIK'
                ? 'border-del-700 bg-del-50/70 dark:bg-del-950/60 dark:border-del-500 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
            }`}
          >
            <div
              className={`p-2.5 rounded-lg transition-colors ${
                kategori === 'AKADEMIK'
                  ? 'bg-del-700 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                Surat Akademik
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ditujukan kepada Wakil Kepala Sekolah Bidang Akademik
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Pemilihan Jenis Izin (Multi-select) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Pilih Jenis Izin (Bisa Lebih Dari Satu)
          </label>
          <span className="text-xs text-del-700 dark:text-del-400 font-semibold px-2 py-0.5 rounded-full bg-del-50 dark:bg-del-950">
            {jenisIzinTerpilih.length} dipilih
          </span>
        </div>

        <div className="space-y-2">
          {(kategori === 'KESISWAAN' ? KESISWAAN_LIST : AKADEMIK_LIST).map((item) => {
            const isChecked = jenisIzinTerpilih.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => onToggleIzin(item.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all active:scale-[0.99] flex items-start gap-3 select-none ${
                  isChecked
                    ? 'border-del-700 bg-del-50/50 dark:bg-del-950/40 dark:border-del-500'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div
                  className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                    isChecked
                      ? 'bg-del-700 border-del-700 text-white'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[2.5] animate-pop" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {item.label}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {jenisIzinTerpilih.length === 0 && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 font-medium">
            Pilih minimal 1 jenis izin untuk melanjutkan pembuatan surat.
          </p>
        )}
      </div>
    </div>
  );
};
