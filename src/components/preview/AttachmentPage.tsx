import React from 'react';
import { LetterDocument } from '../../types/letter';
import { formatDateIndonesian } from '../../services/letterTextEngine';

interface AttachmentPageProps {
  document: LetterDocument;
}

export const AttachmentPage: React.FC<AttachmentPageProps> = ({ document: doc }) => {
  const isKesiswaan = doc.kategori === 'KESISWAAN';
  const hasAttachment = doc.modePeserta === 'ATTACHMENT_GT_10' || doc.gunakanTabelRuntutanWaktu;

  if (!hasAttachment) return null;

  return (
    <div
      className="a4-page page-break relative text-black bg-white select-text mt-8 print:mt-0"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '25.4mm',
        fontFamily: '"Times New Roman", Times, serif',
        fontSize: '12pt',
        lineHeight: '1.5',
        boxSizing: 'border-box',
      }}
    >
      {/* Header Lampiran Rata Kanan Atas */}
      <div className="text-right mb-6 text-[12pt] leading-tight font-normal">
        <p className="font-bold">Lampiran Surat Izin</p>
        <p>Tanggal : {formatDateIndonesian(doc.tanggalSurat)}</p>
        <p>Kegiatan : {doc.detailIzin.namaKegiatan || '-'}</p>
      </div>

      {/* Tabel 1: Daftar Nama Siswa (> 10 orang) */}
      {doc.modePeserta === 'ATTACHMENT_GT_10' && (
        <div className="mb-8">
          <h2 className="text-center font-bold text-[12pt] uppercase mb-3">
            DAFTAR NAMA SISWA PEMOHON IZIN
          </h2>
          <table className="w-full border-collapse border border-black text-[12pt]">
            <thead>
              <tr className="border border-black bg-gray-50 print:bg-transparent">
                <th className="border border-black px-2 py-1 text-center w-12 font-bold">No</th>
                <th className="border border-black px-3 py-1 text-left font-bold">Nama Lengkap</th>
                <th className="border border-black px-3 py-1 text-center w-32 font-bold">
                  {isKesiswaan ? 'ASPA / ASPI' : 'Kelas'}
                </th>
              </tr>
            </thead>
            <tbody>
              {doc.daftarPeserta.length === 0 ? (
                <tr>
                  <td colSpan={3} className="border border-black px-3 py-2 text-center italic text-gray-500">
                    Belum ada data peserta (silakan tambah manual atau upload Excel)
                  </td>
                </tr>
              ) : (
                doc.daftarPeserta.map((p, idx) => (
                  <tr key={p.id || idx} className="border border-black">
                    <td className="border border-black px-2 py-1 text-center">{idx + 1}</td>
                    <td className="border border-black px-3 py-1">{p.namaLengkap}</td>
                    <td className="border border-black px-3 py-1 text-center">
                      {isKesiswaan ? p.asrama : p.kelas}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tabel 2: Runtutan Waktu dan Jadwal */}
      {doc.gunakanTabelRuntutanWaktu && (
        <div className="mb-6">
          <h2 className="text-center font-bold text-[12pt] uppercase mb-3">
            RUNTUTAN WAKTU DAN JADWAL KEGIATAN
          </h2>
          <table className="w-full border-collapse border border-black text-[12pt]">
            <thead>
              <tr className="border border-black bg-gray-50 print:bg-transparent">
                <th className="border border-black px-2 py-1 text-center w-10 font-bold">No</th>
                <th className="border border-black px-2 py-1 text-left w-36 font-bold">Hari/Tanggal</th>
                <th className="border border-black px-2 py-1 text-left w-36 font-bold">Waktu</th>
                <th className="border border-black px-2 py-1 text-left w-28 font-bold">Tempat</th>
                <th className="border border-black px-2 py-1 text-left font-bold">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {doc.daftarJadwal.length === 0 ? (
                <tr>
                  <td colSpan={5} className="border border-black px-3 py-2 text-center italic text-gray-500">
                    Belum ada runtutan jadwal kegiatan (silakan tambah manual atau upload Excel)
                  </td>
                </tr>
              ) : (
                doc.daftarJadwal.map((sch, idx) => (
                  <tr key={sch.id || idx} className="border border-black">
                    <td className="border border-black px-2 py-1 text-center">{idx + 1}</td>
                    <td className="border border-black px-2 py-1">{sch.hariTanggal}</td>
                    <td className="border border-black px-2 py-1">{sch.waktuMulaiSelesai}</td>
                    <td className="border border-black px-2 py-1">{sch.tempatRuangan}</td>
                    <td className="border border-black px-2 py-1">{sch.keteranganKegiatan}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

