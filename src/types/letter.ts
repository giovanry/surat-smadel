export type LetterCategory = 'KESISWAAN' | 'AKADEMIK';

export type KesiswaanPermitType =
  | 'IZIN_HP'
  | 'IZIN_BUNGKUS_MAKAN'
  | 'IZIN_TIDAK_BRIEFING'
  | 'IZIN_TERLAMBAT_ASRAMA'
  | 'IZIN_TIDAK_KURVE'
  | 'IZIN_AKTIVITAS_MALAM'
  | 'IZIN_LEWAT_JAM_SILENT';

export type AkademikPermitType =
  | 'IZIN_LAPTOP'
  | 'IZIN_RUANGAN';

export type PermitType = KesiswaanPermitType | AkademikPermitType;

export type ParticipantMode = 'INLINE_LTE_10' | 'ATTACHMENT_GT_10';

export type MealSession = 'PAGI' | 'SIANG' | 'MALAM';

export type PredefinedRoom =
  | 'X-1' | 'X-2' | 'X-3' | 'X-4' | 'X-5' | 'X-6'
  | 'Lab Kimia' | 'Lab Fisika' | 'Lab Biologi';

export interface StudentProfile {
  namaLengkap: string;
  kelas: string;
  asrama: 'ASPA' | 'ASPI';
  defaultGuruPendamping: string;
}

export interface ParticipantItem {
  id: string;
  namaLengkap: string;
  kelas: string;
  asrama: 'ASPA' | 'ASPI';
}

export interface ScheduleItem {
  id: string;
  hariTanggal: string;
  waktuMulaiSelesai: string;
  tempatRuangan: string;
  keteranganKegiatan: string;
}

export interface TimeSlotItem {
  id: string;
  tanggalMulai?: string;
  tanggalSelesai?: string;
  jamMulai?: string;
  jamSelesai?: string;
  labelKeperluan?: string;
}

export interface PermitSpecificDetails {
  namaKegiatan: string;
  hariTanggalKegiatan: string;
  tempatKegiatanUmum?: string;

  daftarWaktuIzin?: TimeSlotItem[];

  // 1. Izin Penggunaan Handphone
  hpWaktuMulai?: string;
  hpWaktuSelesai?: string;
  hpKeperluan?: string;

  // 2. Izin Pembungkusan Makan
  bungkusSesiMakan?: MealSession[];
  bungkusNamaPembungkus?: string;
  bungkusAlasan?: string;

  // 3. Izin Tidak Mengikuti Briefing
  briefingWaktu?: string;
  briefingAlasan?: string;

  // 4. Izin Terlambat Masuk Asrama
  terlambatJamMasuk?: string;
  terlambatAlasan?: string;

  // 5. Izin Tidak Mengikuti Kurve
  kurveSesiWaktu?: string;
  kurveAlasan?: string;

  // 6. Izin Mengikuti Aktivitas Malam
  malamWaktuMulai?: string;
  malamWaktuSelesai?: string;
  malamTempat?: string;

  // 7. Izin Beraktivitas Melewati Jam Silent
  silentWaktuMulai?: string;
  silentWaktuSelesai?: string;
  silentTempat?: string;

  // 8. Izin Penggunaan Laptop
  laptopWaktuMulai?: string;
  laptopWaktuSelesai?: string;
  laptopTempat?: string;

  // 9. Izin Penggunaan Ruangan
  ruanganPilihan?: PredefinedRoom[];
  ruanganCustom?: string;
  ruanganWaktuMulai?: string;
  ruanganWaktuSelesai?: string;
}

export interface SignatureConfig {
  namaPemohon: string;
  namaGuruPendamping: string;
  namaPembinaAsrama: string;
  namaWakasekAkademik: string;
  butuhTtdLaboran: boolean;
  jenisLab?: string;
  namaLaboran?: string;
}

export interface LetterDocument {
  id: string;
  createdAt: string;
  updatedAt: string;
  tanggalSurat: string; // Nilai tanggal (YYYY-MM-DD)
  customLokasiTanggalSurat?: string; // Teks kustom untuk baris "Laguboti, XX XXXX XXXX"
  kategori: LetterCategory;
  jenisIzinTerpilih: PermitType[];
  modePeserta: ParticipantMode;
  gunakanTabelRuntutanWaktu: boolean;
  daftarPeserta: ParticipantItem[];
  daftarJadwal: ScheduleItem[];
  detailIzin: PermitSpecificDetails;
  tandaTangan: SignatureConfig;
  customOpeningText?: string;
  customClosingText?: string;
}
