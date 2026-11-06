import React, { useState } from 'react';
import { LetterDocument } from '../../types/letter';
import { MainLetterPage } from './MainLetterPage';
import { AttachmentPage } from './AttachmentPage';
import { ZoomIn, ZoomOut, RotateCcw, FileText, Layers } from 'lucide-react';

interface A4PreviewContainerProps {
  document: LetterDocument;
}

export const A4PreviewContainer: React.FC<A4PreviewContainerProps> = ({ document: doc }) => {
  const [zoom, setZoom] = useState<number>(0.85);
  const [activeTab, setActiveTab] = useState<'all' | 'page1' | 'page2'>('all');

  const hasAttachment = doc.modePeserta === 'ATTACHMENT_GT_10' || doc.gunakanTabelRuntutanWaktu;

  const handleZoomIn = () => setZoom((prev) => Math.min(1.2, +(prev + 0.1).toFixed(2)));
  const handleZoomOut = () => setZoom((prev) => Math.max(0.4, +(prev - 0.1).toFixed(2)));
  const handleResetZoom = () => setZoom(0.85);

  return (
    <div className="flex flex-col h-full bg-slate-200/70 dark:bg-slate-950 rounded-2xl border border-slate-300/80 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* Toolbar Kontrol Live Preview (Flat Solid) */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-sm no-print">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 text-xs sm:text-sm">
            <FileText className="w-4 h-4 text-del-700 dark:text-del-400" />
            Live Preview A4
          </span>
          <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
            {Math.round(zoom * 100)}%
          </span>
        </div>

        {/* Tab Navigasi Halaman */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-lg transition-all active:scale-[0.96] ${
              activeTab === 'all'
                ? 'bg-white dark:bg-slate-700 text-del-700 dark:text-del-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Semua
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('page1')}
            className={`px-3 py-1 rounded-lg transition-all active:scale-[0.96] ${
              activeTab === 'page1'
                ? 'bg-white dark:bg-slate-700 text-del-700 dark:text-del-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Hal. 1
          </button>
          {hasAttachment && (
            <button
              type="button"
              onClick={() => setActiveTab('page2')}
              className={`px-3 py-1 rounded-lg transition-all active:scale-[0.96] ${
                activeTab === 'page2'
                  ? 'bg-white dark:bg-slate-700 text-del-700 dark:text-del-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-1">
                <Layers className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                Hal. 2
              </span>
            </button>
          )}
        </div>

        {/* Kontrol Zoom */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleZoomOut}
            aria-label="Perkecil pratinjau"
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 active:scale-[0.95] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-del-700"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            aria-label="Reset ukuran pratinjau"
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 active:scale-[0.95] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-del-700"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomIn}
            aria-label="Perbesar pratinjau"
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 active:scale-[0.95] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-del-700"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Area Kanvas Kertas A4 */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 flex justify-center items-start print:p-0 print:overflow-visible">
        <div
          id="a4-document-preview"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="print:transform-none"
        >
          {/* Halaman 1: Surat Utama */}
          {(activeTab === 'all' || activeTab === 'page1') && (
            <div className="shadow-2xl rounded-sm print:shadow-none mb-8 print:mb-0 transition-transform">
              <MainLetterPage document={doc} />
            </div>
          )}

          {/* Halaman 2: Lampiran */}
          {hasAttachment && (activeTab === 'all' || activeTab === 'page2') && (
            <div className="shadow-2xl rounded-sm print:shadow-none mb-8 print:mb-0 transition-transform">
              <AttachmentPage document={doc} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
