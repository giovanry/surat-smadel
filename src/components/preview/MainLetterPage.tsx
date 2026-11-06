import React from 'react';
import { LetterDocument } from '../../types/letter';
import {
  formatDateIndonesian,
  formatLetterTitle,
  generateOpeningSentence,
  generateClosingSentence,
  formatTimeSlotsToSummary,
} from '../../services/letterTextEngine';

interface MainLetterPageProps {
  document: LetterDocument;
}

export const MainLetterPage: React.FC<MainLetterPageProps> = ({ document: doc }) => {
  const isKesiswaan = doc.kategori === 'KESISWAAN';
  const title = formatLetterTitle(doc.jenisIzinTerpilih);

  // Baris Titi Mangsa (Bisa diedit oleh pengguna, default: Laguboti, [Tanggal Surat])
  const tanggalSuratTeks =
    doc.customLokasiTanggalSurat && doc.customLokasiTanggalSurat.trim() !== ''
      ? doc.customLokasiTanggalSurat
      : `Laguboti, ${formatDateIndonesian(doc.tanggalSurat)}`;

  const openingText = generateOpeningSentence(doc);
  const closingText = generateClosingSentence(doc);

  const namaPemohon = doc.tandaTangan.namaPemohon || doc.daftarPeserta[0]?.namaLengkap || 'Nama Pemohon';
  const namaGuru = doc.tandaTangan.namaGuruPendamping || '............................';

  const slotsSummary = formatTimeSlotsToSummary(doc.detailIzin.daftarWaktuIzin);

  return (
    <div
      className="a4-page relative text-black bg-white select-text"
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
      {/* 1. Judul Surat */}
      <h1 className="text-center font-bold text-[14pt] leading-tight uppercase mb-6 tracking-wide">
        {title}
      </h1>

      {/* 2. Tanggal Surat (Rata Kanan - Laguboti, XX XXXX XXXX) */}
      <div className="text-right mb-6 text-[12pt]">{tanggalSuratTeks}</div>

      {/* 3. Penerima Surat (Yth. dipisah baris dengan jabatan) */}
      <div className="mb-6 leading-tight text-[12pt]">
        <p>Yth.</p>
        <p>
          {isKesiswaan
            ? 'Pembina Asrama SMA Unggul Del'
            : 'Wakil Kepala Sekolah Bidang Akademik'}
        </p>
        <p>Di Tempat</p>
      </div>

      {/* 4. Salam Pembuka */}
      <div className="mb-3 text-[12pt]">Dengan hormat,</div>

      {/* 5. Paragraf Pembuka */}
      <p className="text-justify mb-4 text-[12pt] leading-relaxed indent-0">
        {openingText}
      </p>

      {/* 6. Rincian Kegiatan */}
      <div className="mb-4 text-[12pt]">
        <table className="w-full border-collapse">
          <tbody>
            {doc.gunakanTabelRuntutanWaktu ? (
              <>
                <tr>
                  <td className="w-[180px] align-top py-0.5">Hari, Tanggal</td>
                  <td className="w-[15px] align-top py-0.5 text-center">:</td>
                  <td className="align-top py-0.5 font-normal italic">Terlampir</td>
                </tr>
                <tr>
                  <td className="w-[180px] align-top py-0.5">Waktu &amp; Tempat</td>
                  <td className="w-[15px] align-top py-0.5 text-center">:</td>
                  <td className="align-top py-0.5 font-normal italic">
                    Terlampir pada halaman lampiran
                  </td>
                </tr>
              </>
            ) : (
              <>
                {/* Baris Hari & Tanggal */}
                <tr>
                  <td className="w-[180px] align-top py-0.5">Hari, Tanggal</td>
                  <td className="w-[15px] align-top py-0.5 text-center">:</td>
                  <td className="align-top py-0.5">
                    {slotsSummary.dateText ||
                      doc.detailIzin.hariTanggalKegiatan ||
                      formatDateIndonesian(doc.tanggalSurat)}
                  </td>
                </tr>

                {/* Baris Waktu */}
                {(() => {
                  if (slotsSummary.timeText) {
                    return (
                      <tr>
                        <td className="w-[180px] align-top py-0.5">Waktu</td>
                        <td className="w-[15px] align-top py-0.5 text-center">:</td>
                        <td className="align-top py-0.5">{slotsSummary.timeText}</td>
                      </tr>
                    );
                  }

                  const times: string[] = [];
                  if (doc.detailIzin.hpWaktuMulai || doc.detailIzin.hpWaktuSelesai) {
                    times.push(
                      `Penggunaan HP (${doc.detailIzin.hpWaktuMulai || ''} - ${doc.detailIzin.hpWaktuSelesai || ''})`
                    );
                  }
                  if (doc.detailIzin.briefingWaktu) {
                    times.push(`Briefing (${doc.detailIzin.briefingWaktu})`);
                  }
                  if (doc.detailIzin.terlambatJamMasuk) {
                    times.push(`Jam Masuk Asrama (${doc.detailIzin.terlambatJamMasuk})`);
                  }
                  if (doc.detailIzin.kurveSesiWaktu) {
                    times.push(`Kurve (${doc.detailIzin.kurveSesiWaktu})`);
                  }
                  if (doc.detailIzin.malamWaktuMulai || doc.detailIzin.malamWaktuSelesai) {
                    times.push(
                      `Aktivitas Malam (${doc.detailIzin.malamWaktuMulai || ''} - ${doc.detailIzin.malamWaktuSelesai || ''})`
                    );
                  }
                  if (doc.detailIzin.silentWaktuMulai || doc.detailIzin.silentWaktuSelesai) {
                    times.push(
                      `Lewat Jam Silent (${doc.detailIzin.silentWaktuMulai || ''} - ${doc.detailIzin.silentWaktuSelesai || ''})`
                    );
                  }
                  if (doc.detailIzin.laptopWaktuMulai || doc.detailIzin.laptopWaktuSelesai) {
                    times.push(
                      `Penggunaan Laptop (${doc.detailIzin.laptopWaktuMulai || ''} - ${doc.detailIzin.laptopWaktuSelesai || ''})`
                    );
                  }
                  if (doc.detailIzin.ruanganWaktuMulai || doc.detailIzin.ruanganWaktuSelesai) {
                    times.push(
                      `Penggunaan Ruangan (${doc.detailIzin.ruanganWaktuMulai || ''} - ${doc.detailIzin.ruanganWaktuSelesai || ''})`
                    );
                  }

                  if (times.length === 0) return null;
                  return (
                    <tr>
                      <td className="w-[180px] align-top py-0.5">Waktu</td>
                      <td className="w-[15px] align-top py-0.5 text-center">:</td>
                      <td className="align-top py-0.5">{times.join('; ')}</td>
                    </tr>
                  );
                })()}

                {/* Baris Tempat / Ruangan */}
                {(() => {
                  const rooms = [...(doc.detailIzin.ruanganPilihan || [])];
                  if (doc.detailIzin.ruanganCustom) rooms.push(doc.detailIzin.ruanganCustom as any);
                  if (doc.detailIzin.malamTempat) rooms.push(doc.detailIzin.malamTempat as any);
                  if (doc.detailIzin.silentTempat) rooms.push(doc.detailIzin.silentTempat as any);
                  if (doc.detailIzin.tempatKegiatanUmum) rooms.push(doc.detailIzin.tempatKegiatanUmum as any);

                  if (rooms.length === 0) return null;
                  return (
                    <tr>
                      <td className="w-[180px] align-top py-0.5">Tempat / Ruangan</td>
                      <td className="w-[15px] align-top py-0.5 text-center">:</td>
                      <td className="align-top py-0.5">{rooms.join(', ')}</td>
                    </tr>
                  );
                })()}

                {/* Baris Sesi Makan */}
                {doc.detailIzin.bungkusSesiMakan && doc.detailIzin.bungkusSesiMakan.length > 0 && (
                  <tr>
                    <td className="w-[180px] align-top py-0.5">Sesi Makan</td>
                    <td className="w-[15px] align-top py-0.5 text-center">:</td>
                    <td className="align-top py-0.5">
                      {doc.detailIzin.bungkusSesiMakan.join(', ')}
                      {doc.detailIzin.bungkusNamaPembungkus && (
                        <span> (Dibungkuskan oleh: {doc.detailIzin.bungkusNamaPembungkus})</span>
                      )}
                    </td>
                  </tr>
                )}
              </>
            )}

            {/* Representasi Peserta */}
            {doc.modePeserta === 'ATTACHMENT_GT_10' ? (
              <tr>
                <td className="w-[180px] align-top py-0.5">Peserta / Pemohon</td>
                <td className="w-[15px] align-top py-0.5 text-center">:</td>
                <td className="align-top py-0.5 italic">
                  Terlampir (sebanyak {doc.daftarPeserta.length} orang siswa)
                </td>
              </tr>
            ) : doc.daftarPeserta.length === 1 ? (
              <>
                <tr>
                  <td className="w-[180px] align-top py-0.5">Nama</td>
                  <td className="w-[15px] align-top py-0.5 text-center">:</td>
                  <td className="align-top py-0.5">{doc.daftarPeserta[0].namaLengkap}</td>
                </tr>
                {isKesiswaan ? (
                  <tr>
                    <td className="w-[180px] align-top py-0.5">Asrama</td>
                    <td className="w-[15px] align-top py-0.5 text-center">:</td>
                    <td className="align-top py-0.5">{doc.daftarPeserta[0].asrama}</td>
                  </tr>
                ) : (
                  <tr>
                    <td className="w-[180px] align-top py-0.5">Kelas</td>
                    <td className="w-[15px] align-top py-0.5 text-center">:</td>
                    <td className="align-top py-0.5">{doc.daftarPeserta[0].kelas}</td>
                  </tr>
                )}
              </>
            ) : null}
          </tbody>
        </table>

        {/* Daftar 2-10 Peserta Berpoin */}
        {doc.modePeserta === 'INLINE_LTE_10' && doc.daftarPeserta.length > 1 && (
          <div className="mt-2">
            <p className="mb-1">Adapun daftar siswa yang memohon izin tersebut adalah:</p>
            <ol className="list-decimal list-inside pl-2 space-y-0.5">
              {doc.daftarPeserta.map((p, idx) => (
                <li key={p.id || idx}>
                  {p.namaLengkap} {isKesiswaan ? `(${p.asrama})` : `(Kelas ${p.kelas})`}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* 7. Paragraf Penutup */}
      <p className="text-justify mb-8 text-[12pt] leading-relaxed indent-0">
        {closingText}
      </p>

      {/* 8. Matriks Tanda Tangan */}
      <div className="mt-8 text-[12pt]">
        {/* Baris 1: Mengetahui (Kiri) & Pemohon (Kanan) */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p>Mengetahui,</p>
            <p>Guru Pendamping</p>
            <div className="h-16" />
            <p>( {namaGuru} )</p>
          </div>
          <div className="text-right">
            <p>Pemohon,</p>
            <p className="invisible">Perwakilan</p>
            <div className="h-16" />
            <p>( {namaPemohon} )</p>
          </div>
        </div>

        {/* Baris 2: Penyetuju */}
        {doc.tandaTangan.butuhTtdLaboran ? (
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p>Menyetujui,</p>
              <p>
                {doc.tandaTangan.jenisLab
                  ? `Laboran ${doc.tandaTangan.jenisLab}`
                  : 'Laboran'}
              </p>
              <div className="h-16" />
              <p>( {doc.tandaTangan.namaLaboran || '............................'} )</p>
            </div>
            <div className="text-right">
              <p>Menyetujui,</p>
              <p>Wakil Kepala Sekolah Bidang Akademik</p>
              <div className="h-16" />
              <p>( {doc.tandaTangan.namaWakasekAkademik || 'Ari Raharja S.Pd., Gr.'} )</p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p>Menyetujui,</p>
            <p>
              {isKesiswaan
                ? 'Pembina Asrama'
                : 'Wakil Kepala Sekolah Bidang Akademik'}
            </p>
            <div className="h-16" />
            <p>
              ( {isKesiswaan
                ? doc.tandaTangan.namaPembinaAsrama || 'Pembina Asrama'
                : doc.tandaTangan.namaWakasekAkademik || 'Ari Raharja S.Pd., Gr.'} )
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
