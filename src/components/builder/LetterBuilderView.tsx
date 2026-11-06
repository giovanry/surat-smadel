import React, { useState } from 'react';
import { LetterDocument, LetterCategory, PermitType } from '../../types/letter';
import { CategorySelector } from './CategorySelector';
import { DynamicFieldsForm } from './DynamicFieldsForm';
import { ParticipantManager } from './ParticipantManager';
import { SignatureConfigForm } from './SignatureConfigForm';
import { A4PreviewContainer } from '../preview/A4PreviewContainer';
import { exportLetterToDocx } from '../../services/docxGenerator';
import { pdfGenerator } from '../../services/pdfGenerator';
import {
  Save,
  Download,
  Printer,
  ChevronRight,
  Eye,
  CheckCircle2,
  FileEdit,
} from 'lucide-react';
import { useAlert } from '../../context/AlertContext';

interface LetterBuilderViewProps {
  document: LetterDocument;
  onUpdateDocument: (doc: LetterDocument) => void;
  onSaveToDashboard: (doc: LetterDocument) => void;
}

export const LetterBuilderView: React.FC<LetterBuilderViewProps> = ({
  document: doc,
  onUpdateDocument,
  onSaveToDashboard,
}) => {
  const { toast } = useAlert();
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isExportingDocx, setIsExportingDocx] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  const handleChangeCategory = (nextCategory: LetterCategory) => {
    if (nextCategory === doc.kategori) return;
    const defaultPermit = nextCategory === 'KESISWAAN' ? 'IZIN_HP' : 'IZIN_LAPTOP';
    onUpdateDocument({
      ...doc,
      kategori: nextCategory,
      jenisIzinTerpilih: [defaultPermit],
      tandaTangan: {
        ...doc.tandaTangan,
        butuhTtdLaboran: false,
        jenisLab: '',
      },
    });
  };

  const handleToggleIzin = (izin: PermitType) => {
    const current = doc.jenisIzinTerpilih;
    let next: PermitType[];
    if (current.includes(izin)) {
      if (current.length === 1) return;
      next = current.filter((i) => i !== izin);
    } else {
      next = [...current, izin];
    }
    onUpdateDocument({ ...doc, jenisIzinTerpilih: next });
  };

  const handleSave = () => {
    onSaveToDashboard(doc);
    toast.success('Draf surat izin berhasil disimpan.');
  };

  const handleDownloadDocx = async () => {
    try {
      setIsExportingDocx(true);
      await exportLetterToDocx(doc);
      toast.success('Dokumen Word (.docx) berhasil diunduh.');
    } catch {
      toast.error('Gagal menyusun dokumen Word (.docx).', 'Ekspor Gagal');
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setIsExportingPdf(true);
      const filename = `surat_izin_${doc.tanggalSurat}`;
      await pdfGenerator.downloadElementAsPdf('a4-document-preview', filename);
      toast.success('Berkas PDF berhasil diekspor.');
    } catch {
      toast.error('Gagal menghasilkan file PDF.', 'Ekspor Gagal');
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4 animate-view-enter">
      {/* Top Header & Actions Bar (Clean, Flat, No Gradient) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm no-print">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileEdit className="w-5 h-5 text-del-700 dark:text-del-400" />
            Pembuat Surat Izin
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Format Standar A4 SMA Unggul Del &bull; Siap Cetak
          </p>
        </div>

        {/* Action Buttons with tactile feedback */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 active:scale-[0.96] transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4 text-del-700 dark:text-del-400" />
            Simpan Draft
          </button>

          <button
            type="button"
            disabled={isExportingDocx}
            onClick={handleDownloadDocx}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-del-700 text-white hover:bg-del-800 active:scale-[0.96] transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4" />
            {isExportingDocx ? 'Menyusun DOCX...' : 'Download DOCX'}
          </button>

          <button
            type="button"
            disabled={isExportingPdf}
            onClick={handleDownloadPdf}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.96] transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4" />
            {isExportingPdf ? 'Mengekspor PDF...' : 'Download PDF'}
          </button>

          <button
            type="button"
            onClick={() => pdfGenerator.printA4Document()}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.96] transition-all flex items-center gap-1.5"
            title="Cetak langsung atau simpan sebagai PDF"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      {/* Mobile Switcher (Form vs Preview) */}
      <div className="flex sm:hidden bg-slate-200 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
        <button
          type="button"
          onClick={() => setMobileTab('form')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            mobileTab === 'form'
              ? 'bg-white dark:bg-slate-900 text-del-700 dark:text-del-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Isi Form Surat
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'preview'
              ? 'bg-white dark:bg-slate-900 text-del-700 dark:text-del-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          Live Preview A4
        </button>
      </div>

      {/* Split-Screen Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Kolom Kiri: Form Wizard */}
        <div
          className={`lg:col-span-6 xl:col-span-5 flex flex-col space-y-4 overflow-y-auto pr-1 ${
            mobileTab === 'preview' ? 'hidden sm:flex' : 'flex'
          }`}
        >
          {/* Step Indicator */}
          <div className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 text-xs">
            {[
              { id: 1, title: 'Kategori & Izin' },
              { id: 2, title: 'Detail Kegiatan' },
              { id: 3, title: 'Data Peserta' },
              { id: 4, title: 'Tanda Tangan' },
            ].map((step) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(step.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all active:scale-[0.96] ${
                  activeStep === step.id
                    ? 'font-bold text-del-700 dark:text-del-300 bg-del-50 dark:bg-del-950/80 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] transition-colors ${
                    activeStep === step.id
                      ? 'bg-del-700 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {step.id}
                </span>
                <span className="hidden md:inline">{step.title}</span>
              </button>
            ))}
          </div>

          {/* Form Step Content (Smooth physical key-based enter animation) */}
          <div
            key={activeStep}
            className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6 animate-view-enter"
          >
            {activeStep === 1 && (
              <CategorySelector
                kategori={doc.kategori}
                jenisIzinTerpilih={doc.jenisIzinTerpilih}
                onChangeKategori={handleChangeCategory}
                onToggleIzin={handleToggleIzin}
              />
            )}

            {activeStep === 2 && (
              <DynamicFieldsForm
                jenisIzinTerpilih={doc.jenisIzinTerpilih}
                details={doc.detailIzin}
                tanggalSurat={doc.tanggalSurat}
                customLokasiTanggalSurat={doc.customLokasiTanggalSurat}
                onChange={(detailIzin) => onUpdateDocument({ ...doc, detailIzin })}
                onChangeTanggalSurat={(tanggalSurat) => onUpdateDocument({ ...doc, tanggalSurat })}
                onChangeCustomLokasiTanggal={(customLokasiTanggalSurat) =>
                  onUpdateDocument({ ...doc, customLokasiTanggalSurat })
                }
              />
            )}

            {activeStep === 3 && (
              <ParticipantManager
                kategori={doc.kategori}
                modePeserta={doc.modePeserta}
                gunakanTabelRuntutanWaktu={doc.gunakanTabelRuntutanWaktu}
                daftarPeserta={doc.daftarPeserta}
                daftarJadwal={doc.daftarJadwal}
                onChangeModePeserta={(modePeserta) =>
                  onUpdateDocument({ ...doc, modePeserta })
                }
                onChangeGunakanJadwal={(gunakanTabelRuntutanWaktu) =>
                  onUpdateDocument({ ...doc, gunakanTabelRuntutanWaktu })
                }
                onChangePeserta={(daftarPeserta) =>
                  onUpdateDocument({ ...doc, daftarPeserta })
                }
                onChangeJadwal={(daftarJadwal) =>
                  onUpdateDocument({ ...doc, daftarJadwal })
                }
              />
            )}

            {activeStep === 4 && (
              <div className="space-y-6">
                <SignatureConfigForm
                  kategori={doc.kategori}
                  ruanganPilihan={doc.detailIzin.ruanganPilihan}
                  config={doc.tandaTangan}
                  onChange={(tandaTangan) => onUpdateDocument({ ...doc, tandaTangan })}
                />

                {/* Optional Custom Text Overrides */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Kustomisasi Kalimat Surat (Opsional)
                  </h4>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      Kustomisasi Teks Pembuka (Kosongkan untuk menggunakan template baku otomatis)
                    </label>
                    <textarea
                      rows={2}
                      value={doc.customOpeningText || ''}
                      onChange={(e) =>
                        onUpdateDocument({ ...doc, customOpeningText: e.target.value })
                      }
                      placeholder="Default: Sehubung dengan akan diadakannya kegiatan..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-del-700 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      Kustomisasi Teks Penutup (Kosongkan untuk menggunakan template baku otomatis)
                    </label>
                    <textarea
                      rows={2}
                      value={doc.customClosingText || ''}
                      onChange={(e) =>
                        onUpdateDocument({ ...doc, customClosingText: e.target.value })
                      }
                      placeholder="Default: Sekian surat permohonan yang..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-del-700 transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
              <button
                type="button"
                disabled={activeStep === 1}
                onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
                className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.96] transition-all font-semibold"
              >
                Kembali
              </button>

              {activeStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => Math.min(4, prev + 1))}
                  className="px-4 py-2 rounded-xl bg-del-700 text-white font-semibold hover:bg-del-800 active:scale-[0.96] transition-all flex items-center gap-1.5 shadow-xs"
                >
                  Lanjut
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 active:scale-[0.96] transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  Simpan Surat
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Live Preview A4 */}
        <div
          className={`lg:col-span-6 xl:col-span-7 h-full min-h-[500px] ${
            mobileTab === 'form' ? 'hidden sm:flex' : 'flex'
          }`}
        >
          <A4PreviewContainer document={doc} />
        </div>
      </div>
    </div>
  );
};
