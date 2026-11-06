import React, { useRef } from 'react';
import {
  LetterCategory,
  ParticipantItem,
  ParticipantMode,
  ScheduleItem,
} from '../../types/letter';
import { excelService } from '../../services/excelService';
import { storageService } from '../../services/storageService';
import {
  Users,
  FileSpreadsheet,
  Upload,
  Download,
  Plus,
  Trash2,
  Calendar,
  UserCheck,
} from 'lucide-react';

interface ParticipantManagerProps {
  kategori: LetterCategory;
  modePeserta: ParticipantMode;
  gunakanTabelRuntutanWaktu: boolean;
  daftarPeserta: ParticipantItem[];
  daftarJadwal: ScheduleItem[];
  onChangeModePeserta: (mode: ParticipantMode) => void;
  onChangeGunakanJadwal: (useSchedule: boolean) => void;
  onChangePeserta: (peserta: ParticipantItem[]) => void;
  onChangeJadwal: (jadwal: ScheduleItem[]) => void;
}

export const ParticipantManager: React.FC<ParticipantManagerProps> = ({
  kategori,
  modePeserta,
  gunakanTabelRuntutanWaktu,
  daftarPeserta,
  daftarJadwal,
  onChangeModePeserta,
  onChangeGunakanJadwal,
  onChangePeserta,
  onChangeJadwal,
}) => {
  const isKesiswaan = kategori === 'KESISWAAN';
  const participantFileRef = useRef<HTMLInputElement>(null);
  const scheduleFileRef = useRef<HTMLInputElement>(null);

  const handleAutofillMyself = () => {
    const profile = storageService.getProfile();
    const myself: ParticipantItem = {
      id: `p_self_${Date.now()}`,
      namaLengkap: profile.namaLengkap || 'Nama Lengkap Siswa',
      kelas: profile.kelas || 'X-1',
      asrama: profile.asrama || 'ASPA',
    };

    if (daftarPeserta.length === 0) {
      onChangePeserta([myself]);
    } else {
      const updated = [...daftarPeserta];
      updated[0] = myself;
      onChangePeserta(updated);
    }
  };

  const handleAddParticipant = () => {
    if (modePeserta === 'INLINE_LTE_10' && daftarPeserta.length >= 10) {
      alert('Mode inline dibatasi maksimal 10 orang. Silakan beralih ke Mode Lampiran (>10 Orang).');
      return;
    }
    const newParticipant: ParticipantItem = {
      id: `p_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      namaLengkap: '',
      kelas: 'X-1',
      asrama: 'ASPA',
    };
    onChangePeserta([...daftarPeserta, newParticipant]);
  };

  const handleUpdateParticipant = (
    index: number,
    field: keyof ParticipantItem,
    value: string
  ) => {
    const updated = [...daftarPeserta];
    updated[index] = { ...updated[index], [field]: value };
    onChangePeserta(updated);
  };

  const handleRemoveParticipant = (index: number) => {
    const updated = daftarPeserta.filter((_, i) => i !== index);
    onChangePeserta(updated);
  };

  const handleAddSchedule = () => {
    const newItem: ScheduleItem = {
      id: `sch_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      hariTanggal: '',
      waktuMulaiSelesai: '',
      tempatRuangan: '',
      keteranganKegiatan: '',
    };
    onChangeJadwal([...daftarJadwal, newItem]);
  };

  const handleUpdateSchedule = (
    index: number,
    field: keyof ScheduleItem,
    value: string
  ) => {
    const updated = [...daftarJadwal];
    updated[index] = { ...updated[index], [field]: value };
    onChangeJadwal(updated);
  };

  const handleRemoveSchedule = (index: number) => {
    const updated = daftarJadwal.filter((_, i) => i !== index);
    onChangeJadwal(updated);
  };

  const handleUploadParticipantExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const parsed = await excelService.parseParticipantFile(file);
      if (parsed.length > 0) {
        onChangePeserta(parsed);
        if (parsed.length > 10) {
          onChangeModePeserta('ATTACHMENT_GT_10');
        }
      } else {
        alert('File Excel tidak memuat baris data peserta yang valid.');
      }
    } catch {
      alert('Gagal membaca file Excel. Pastikan format kolom sesuai template.');
    } finally {
      if (participantFileRef.current) participantFileRef.current.value = '';
    }
  };

  const handleUploadScheduleExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const parsed = await excelService.parseScheduleFile(file);
      if (parsed.length > 0) {
        onChangeJadwal(parsed);
        onChangeGunakanJadwal(true);
      } else {
        alert('File Excel tidak memuat data jadwal yang valid.');
      }
    } catch {
      alert('Gagal membaca file Excel jadwal.');
    } finally {
      if (scheduleFileRef.current) scheduleFileRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Mode Pemilihan Peserta (Flat Solid Cards) */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
          Jumlah Peserta &amp; Penempatan
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Mode 1: <= 10 Orang */}
          <div
            onClick={() => onChangeModePeserta('INLINE_LTE_10')}
            className={`p-4 rounded-xl border cursor-pointer transition-all active:scale-[0.98] ${
              modePeserta === 'INLINE_LTE_10'
                ? 'border-del-700 bg-del-50/60 dark:bg-del-950/50 dark:border-del-500 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-del-700 dark:text-del-400" />
              <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                &le; 10 Orang (Di Badan Surat)
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Nama pemohon tercantum langsung di halaman utama. Cocok untuk perorangan atau kelompok kecil.
            </p>
          </div>

          {/* Mode 2: > 10 Orang */}
          <div
            onClick={() => onChangeModePeserta('ATTACHMENT_GT_10')}
            className={`p-4 rounded-xl border cursor-pointer transition-all active:scale-[0.98] ${
              modePeserta === 'ATTACHMENT_GT_10'
                ? 'border-del-700 bg-del-50/60 dark:bg-del-950/50 dark:border-del-500 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                &gt; 10 Orang (Halaman Lampiran)
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Menghasilkan Halaman 2 khusus memuat tabel ber-border daftar seluruh siswa.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Toolbar & List Peserta */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Daftar Peserta ({daftarPeserta.length})
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
              Kata Ganti: {daftarPeserta.length <= 1 && modePeserta === 'INLINE_LTE_10' ? 'saya' : 'kami'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAutofillMyself}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-del-200 dark:border-del-800 bg-del-50 dark:bg-del-950 text-del-700 dark:text-del-300 hover:bg-del-100 active:scale-[0.96] transition-all flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-del-700"
            >
              <UserCheck className="w-3.5 h-3.5" />
              + Profil Saya
            </button>
            <button
              type="button"
              onClick={handleAddParticipant}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-del-700 text-white hover:bg-del-800 active:scale-[0.96] transition-all flex items-center gap-1.5 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-del-700"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Siswa
            </button>
          </div>
        </div>

        {/* Action Excel Peserta (Clean Solid Border) */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Kelola Massal via Excel (.xlsx)
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (isKesiswaan) {
                  excelService.downloadParticipantKesiswaanTemplate();
                } else {
                  excelService.downloadParticipantAkademikTemplate();
                }
              }}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-[0.96] transition-all flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              Download Template
            </button>

            <button
              type="button"
              onClick={() => participantFileRef.current?.click()}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.96] transition-all flex items-center gap-1"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Excel
            </button>
            <input
              ref={participantFileRef}
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleUploadParticipantExcel}
              className="hidden"
            />
          </div>
        </div>

        {/* Input List Peserta */}
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {daftarPeserta.map((p, idx) => (
            <div
              key={p.id || idx}
              className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs animate-view-enter"
            >
              <span className="w-6 text-center text-slate-400 font-mono font-medium">
                {idx + 1}.
              </span>
              <input
                type="text"
                value={p.namaLengkap}
                onChange={(e) => handleUpdateParticipant(idx, 'namaLengkap', e.target.value)}
                placeholder="Nama Lengkap Siswa"
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-del-700 transition-colors"
              />

              {isKesiswaan ? (
                <select
                  value={p.asrama}
                  onChange={(e) =>
                    handleUpdateParticipant(idx, 'asrama', e.target.value as 'ASPA' | 'ASPI')
                  }
                  className="w-24 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-del-700 transition-colors"
                >
                  <option value="ASPA">ASPA</option>
                  <option value="ASPI">ASPI</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={p.kelas}
                  onChange={(e) => handleUpdateParticipant(idx, 'kelas', e.target.value)}
                  placeholder="Kelas (X-1)"
                  className="w-24 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-del-700 transition-colors"
                />
              )}

              {daftarPeserta.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveParticipant(idx)}
                  aria-label={`Hapus siswa ${idx + 1}`}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg active:scale-[0.95] transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Opsi Tambahan: Lampiran Runtutan Waktu */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-800 dark:text-slate-100 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={gunakanTabelRuntutanWaktu}
              onChange={(e) => onChangeGunakanJadwal(e.target.checked)}
              className="w-4 h-4 rounded text-del-700 focus:ring-del-700 transition-colors"
            />
            <span>Sertakan Lampiran Runtutan Waktu / Jadwal Kegiatan</span>
          </label>
        </div>

        {gunakanTabelRuntutanWaktu && (
          <div className="space-y-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 animate-view-enter">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-del-700" />
                Daftar Sesi Jadwal ({daftarJadwal.length})
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => excelService.downloadScheduleTemplate()}
                  className="px-2 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 active:scale-[0.96] transition-all flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  Template Jadwal (.xlsx)
                </button>
                <button
                  type="button"
                  onClick={() => scheduleFileRef.current?.click()}
                  className="px-2 py-1 text-xs rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.96] transition-all flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" />
                  Upload Excel
                </button>
                <input
                  ref={scheduleFileRef}
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleUploadScheduleExcel}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={handleAddSchedule}
                  className="px-2.5 py-1 text-xs rounded-lg bg-del-700 text-white hover:bg-del-800 active:scale-[0.96] transition-all flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Tambah Sesi
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {daftarJadwal.length === 0 ? (
                <p className="text-xs text-slate-500 italic text-center py-3">
                  Belum ada sesi jadwal. Klik "Tambah Sesi" atau upload file Excel.
                </p>
              ) : (
                daftarJadwal.map((sch, idx) => (
                  <div
                    key={sch.id || idx}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-2 animate-view-enter"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Sesi #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSchedule(idx)}
                        className="text-slate-400 hover:text-rose-600 active:scale-[0.95] transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={sch.hariTanggal}
                        onChange={(e) => handleUpdateSchedule(idx, 'hariTanggal', e.target.value)}
                        placeholder="Hari, Tanggal (Jumat, 06/11/2026)"
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-del-700 transition-colors"
                      />
                      <input
                        type="text"
                        value={sch.waktuMulaiSelesai}
                        onChange={(e) => handleUpdateSchedule(idx, 'waktuMulaiSelesai', e.target.value)}
                        placeholder="Waktu (19.00 - 21.30 WIB)"
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-del-700 transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={sch.tempatRuangan}
                        onChange={(e) => handleUpdateSchedule(idx, 'tempatRuangan', e.target.value)}
                        placeholder="Tempat / Ruangan (Lab Kimia / X-2)"
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-del-700 transition-colors"
                      />
                      <input
                        type="text"
                        value={sch.keteranganKegiatan}
                        onChange={(e) => handleUpdateSchedule(idx, 'keteranganKegiatan', e.target.value)}
                        placeholder="Keterangan Kegiatan"
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-del-700 transition-colors"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
