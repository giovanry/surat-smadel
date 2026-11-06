import React, { useState, useRef } from 'react';
import { StudentProfile } from '../../types/letter';
import { storageService } from '../../services/storageService';
import {
  User,
  Save,
  Download,
  Upload,
  Trash2,
  CheckCircle,
  Database,
  Building,
} from 'lucide-react';
import { useAlert } from '../../context/AlertContext';

interface SettingsViewProps {
  profile: StudentProfile;
  onUpdateProfile: (profile: StudentProfile) => void;
  onRefreshLetters: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onUpdateProfile,
  onRefreshLetters,
}) => {
  const { toast, showConfirm } = useAlert();
  const [formData, setFormData] = useState<StudentProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveProfile(formData);
    onUpdateProfile(formData);
    setSavedSuccess(true);
    toast.success('Profil siswa berhasil diperbarui.');
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportBackup = () => {
    const jsonStr = storageService.exportBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_surat_del_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('File cadangan JSON berhasil diunduh.');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = storageService.importBackupJson(content);
        if (success) {
          const updatedProfile = storageService.getProfile();
          setFormData(updatedProfile);
          onUpdateProfile(updatedProfile);
          onRefreshLetters();
          toast.success('Data riwayat surat dan profil berhasil dipulihkan.');
        } else {
          toast.error('Format berkas cadangan JSON tidak valid.', 'Gagal Memulihkan');
        }
      }
    };
    reader.readAsText(file);
    if (jsonInputRef.current) jsonInputRef.current.value = '';
  };

  const handleClearAllHistory = () => {
    showConfirm({
      title: 'Hapus Semua Riwayat',
      message: 'PERINGATAN: Seluruh riwayat surat di peramban ini akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan. Lanjutkan?',
      confirmLabel: 'Ya, Bersihkan Semua',
      cancelLabel: 'Batal',
      isDestructive: true,
      onConfirm: () => {
        localStorage.removeItem('del_letter_history_docs');
        onRefreshLetters();
        toast.success('Semua riwayat surat telah berhasil dibersihkan.');
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-view-enter">
      {/* 1. Header Pengaturan (Clean Flat) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <User className="w-5 h-5 text-del-700 dark:text-del-400" />
          Profil Siswa &amp; Manajemen Data Lokal
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Data ini digunakan untuk mengisi otomatis nama Anda pada surat permohonan baru.
        </p>
      </div>

      {/* 2. Form Profil Siswa (Autofill) */}
      <form
        onSubmit={handleSaveProfile}
        className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4"
      >
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
          <span>Identitas Siswa Default</span>
          {savedSuccess && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 animate-view-enter">
              <CheckCircle className="w-4 h-4" /> Profil Tersimpan!
            </span>
          )}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nama Lengkap Siswa
            </label>
            <input
              type="text"
              required
              value={formData.namaLengkap}
              onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
              placeholder="Contoh: Johannes Sinaga"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-del-700 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Kelas Siswa
            </label>
            <input
              type="text"
              required
              value={formData.kelas}
              onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
              placeholder="Contoh: X-1, XI-3, XII-2"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-del-700 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Gedung Asrama
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, asrama: 'ASPA' })}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all active:scale-[0.96] ${
                  formData.asrama === 'ASPA'
                    ? 'bg-del-700 text-white border-del-700 shadow-sm'
                    : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                ASPA (Putra)
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, asrama: 'ASPI' })}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all active:scale-[0.96] ${
                  formData.asrama === 'ASPI'
                    ? 'bg-del-700 text-white border-del-700 shadow-sm'
                    : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                ASPI (Putri)
              </button>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Guru Pendamping Default (Opsional)
            </label>
            <input
              type="text"
              value={formData.defaultGuruPendamping}
              onChange={(e) =>
                setFormData({ ...formData, defaultGuruPendamping: e.target.value })
              }
              placeholder="Contoh: Drs. Parlindungan Hutapea, M.Pd."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-del-700 transition-colors"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-del-700 text-white font-semibold text-xs hover:bg-del-800 active:scale-[0.96] transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4" />
            Simpan Perubahan Profil
          </button>
        </div>
      </form>

      {/* 3. Manajemen Penyimpanan Browser */}
      <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Database className="w-4 h-4 text-del-700 dark:text-del-400" />
          Penyimpanan &amp; Cadangan Data
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Seluruh data disimpan di perangkat ini. Anda dapat mengekspor atau memulihkan cadangan data kapan saja.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportBackup}
            className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.96] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Download className="w-4 h-4 text-del-700 dark:text-del-400" />
            Export Backup (.json)
          </button>

          <button
            type="button"
            onClick={() => jsonInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.96] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Import Backup (.json)
          </button>
          <input
            ref={jsonInputRef}
            type="file"
            accept=".json"
            onChange={handleImportBackup}
            className="hidden"
          />

          <button
            type="button"
            onClick={handleClearAllHistory}
            className="px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold ml-auto flex items-center gap-1.5 active:scale-[0.96] transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Hapus Semua Riwayat Surat
          </button>
        </div>
      </div>
    </div>
  );
};
