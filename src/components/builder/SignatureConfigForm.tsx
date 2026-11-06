import React, { useEffect } from 'react';
import {
  LetterCategory,
  PredefinedRoom,
  SignatureConfig,
} from '../../types/letter';
import { storageService } from '../../services/storageService';
import {
  isLabRoomSelected,
  getSelectedLabType,
} from '../../services/letterTextEngine';
import { PenTool, AlertCircle } from 'lucide-react';

interface SignatureConfigFormProps {
  kategori: LetterCategory;
  ruanganPilihan?: PredefinedRoom[];
  config: SignatureConfig;
  onChange: (config: SignatureConfig) => void;
}

export const SignatureConfigForm: React.FC<SignatureConfigFormProps> = ({
  kategori,
  ruanganPilihan,
  config,
  onChange,
}) => {
  const isKesiswaan = kategori === 'KESISWAAN';
  const hasLab = !isKesiswaan && isLabRoomSelected(ruanganPilihan);
  const labType = hasLab ? getSelectedLabType(ruanganPilihan) : '';

  useEffect(() => {
    if (hasLab !== config.butuhTtdLaboran || (hasLab && labType !== config.jenisLab)) {
      onChange({
        ...config,
        butuhTtdLaboran: hasLab,
        jenisLab: labType,
      });
    }
  }, [hasLab, labType]);

  const updateField = (key: keyof SignatureConfig, val: any) => {
    onChange({ ...config, [key]: val });
  };

  const handleAutofillApplicant = () => {
    const profile = storageService.getProfile();
    if (profile.namaLengkap) {
      updateField('namaPemohon', profile.namaLengkap);
    }
    if (profile.defaultGuruPendamping && !config.namaGuruPendamping) {
      updateField('namaGuruPendamping', profile.defaultGuruPendamping);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <PenTool className="w-4 h-4 text-del-700 dark:text-del-400" />
          Konfigurasi Pihak Penanda Tangan
        </h3>
        <button
          type="button"
          onClick={handleAutofillApplicant}
          className="text-xs text-del-700 dark:text-del-400 font-semibold hover:underline active:scale-[0.96] transition-all"
        >
          Autofill dari Profil
        </button>
      </div>

      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        {/* 1. Pemohon (Perwakilan) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Nama Pemohon (Perwakilan 1 Orang Siswa)
          </label>
          <input
            type="text"
            required
            value={config.namaPemohon}
            onChange={(e) => updateField('namaPemohon', e.target.value)}
            placeholder="Contoh: Johannes Sinaga"
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-del-700 transition-colors"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Meskipun pemohon lebih dari 1 orang, tanda tangan pemohon hanya diwakili 1 nama di lembar surat.
          </p>
        </div>

        {/* 2. Guru Pendamping */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Nama Guru Pendamping (Mengetahui)
          </label>
          <input
            type="text"
            value={config.namaGuruPendamping}
            onChange={(e) => updateField('namaGuruPendamping', e.target.value)}
            placeholder="Contoh: Drs. Parlindungan Hutapea, M.Pd."
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-del-700 transition-colors"
          />
        </div>

        {/* 3. TTD Laboran (Jika Lab Kimia/Fisika/Biologi Dipilih) */}
        {config.butuhTtdLaboran && (
          <div className="p-3.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/40 space-y-2 animate-view-enter">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 dark:text-amber-200">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Matriks 4 Pihak: Diperlukan Tanda Tangan Laboran {config.jenisLab}</span>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nama Laboran
              </label>
              <input
                type="text"
                required
                value={config.namaLaboran || ''}
                onChange={(e) => updateField('namaLaboran', e.target.value)}
                placeholder="Ketik Nama Terang Laboran"
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-del-700 transition-colors"
              />
            </div>
          </div>
        )}

        {/* 4. Pihak Penyetuju (Locked / Terisi Default) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Pihak Menyetujui
          </label>
          {isKesiswaan ? (
            <input
              type="text"
              value={config.namaPembinaAsrama || 'Pembina Asrama'}
              onChange={(e) => updateField('namaPembinaAsrama', e.target.value)}
              placeholder="Pembina Asrama"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus-visible:outline-none transition-colors"
            />
          ) : (
            <div>
              <input
                type="text"
                value={config.namaWakasekAkademik || 'Ari Raharja S.Pd., Gr.'}
                onChange={(e) => updateField('namaWakasekAkademik', e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus-visible:outline-none font-semibold transition-colors"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Jabatan: Wakil Kepala Sekolah Bidang Akademik SMA Unggul Del.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
