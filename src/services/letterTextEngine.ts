import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import {
  LetterCategory,
  LetterDocument,
  PermitType,
  PredefinedRoom,
  TimeSlotItem,
} from '../types/letter';

export const PERMIT_METADATA: Record<
  PermitType,
  { category: LetterCategory; phrase: string; titleLabel: string }
> = {
  IZIN_HP: {
    category: 'KESISWAAN',
    phrase: 'izin penggunaan handphone',
    titleLabel: 'PENGGUNAAN HANDPHONE',
  },
  IZIN_BUNGKUS_MAKAN: {
    category: 'KESISWAAN',
    phrase: 'izin pembungkusan makan',
    titleLabel: 'PEMBUNGKUSAN MAKAN',
  },
  IZIN_TIDAK_BRIEFING: {
    category: 'KESISWAAN',
    phrase: 'izin tidak mengikuti briefing',
    titleLabel: 'TIDAK MENGIKUTI BRIEFING',
  },
  IZIN_TERLAMBAT_ASRAMA: {
    category: 'KESISWAAN',
    phrase: 'izin terlambat masuk asrama',
    titleLabel: 'TERLAMBAT MASUK ASRAMA',
  },
  IZIN_TIDAK_KURVE: {
    category: 'KESISWAAN',
    phrase: 'izin tidak mengikuti kurve',
    titleLabel: 'TIDAK MENGIKUTI KURVE',
  },
  IZIN_AKTIVITAS_MALAM: {
    category: 'KESISWAAN',
    phrase: 'izin mengikuti aktivitas malam',
    titleLabel: 'MENGIKUTI AKTIVITAS MALAM',
  },
  IZIN_LEWAT_JAM_SILENT: {
    category: 'KESISWAAN',
    phrase: 'izin beraktivitas melewati jam silent',
    titleLabel: 'BERAKTIVITAS MELEWATI JAM SILENT',
  },
  IZIN_LAPTOP: {
    category: 'AKADEMIK',
    phrase: 'izin penggunaan laptop',
    titleLabel: 'PENGGUNAAN LAPTOP',
  },
  IZIN_RUANGAN: {
    category: 'AKADEMIK',
    phrase: 'izin penggunaan ruangan',
    titleLabel: 'PENGGUNAAN RUANGAN',
  },
};

function parseAnyDate(dateString: string): Date | null {
  if (!dateString) return null;
  const trimmed = dateString.trim();
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
    const [d, m, y] = trimmed.split('/').map(Number);
    const parsed = new Date(y, m - 1, d);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  try {
    const parsed = parseISO(trimmed);
    return isNaN(parsed.getTime()) ? null : parsed;
  } catch {
    return null;
  }
}

export function formatDateIndonesian(dateString?: string): string {
  if (!dateString) return '';
  const parsed = parseAnyDate(dateString);
  if (!parsed) return dateString;
  try {
    return format(parsed, 'd MMMM yyyy', { locale: id });
  } catch {
    return dateString;
  }
}

export function formatDayDateIndonesian(dateString?: string): string {
  if (!dateString) return '';
  const parsed = parseAnyDate(dateString);
  if (!parsed) return dateString;
  try {
    const dayName = format(parsed, 'EEEE', { locale: id });
    const ddmmyyyy = format(parsed, 'dd/MM/yyyy');
    return `${dayName}, ${ddmmyyyy}`;
  } catch {
    return dateString;
  }
}

export function formatTimeSlotsToSummary(slots?: TimeSlotItem[]): { dateText: string; timeText: string } {
  if (!slots || slots.length === 0) {
    return { dateText: '', timeText: '' };
  }

  // 1. Kumpulkan daftar tanggal unik terformat
  const datesSet = new Set<string>();
  const timeDetails: string[] = [];

  slots.forEach((slot, index) => {
    let dateStr = '';
    if (slot.tanggalMulai) {
      const startFormatted = formatDayDateIndonesian(slot.tanggalMulai);
      if (slot.tanggalSelesai && slot.tanggalSelesai !== slot.tanggalMulai) {
        const endFormatted = formatDayDateIndonesian(slot.tanggalSelesai);
        dateStr = `${startFormatted} s.d. ${endFormatted}`;
      } else {
        dateStr = startFormatted;
      }
      datesSet.add(dateStr);
    }

    // Format rentang waktu
    let timeStr = '';
    if (slot.jamMulai && slot.jamSelesai) {
      timeStr = `${slot.jamMulai} - ${slot.jamSelesai} WIB`;
    } else if (slot.jamMulai) {
      timeStr = `Mulai ${slot.jamMulai} WIB`;
    } else if (slot.jamSelesai) {
      timeStr = `Sampai ${slot.jamSelesai} WIB`;
    }

    if (timeStr) {
      const label = slot.labelKeperluan ? `${slot.labelKeperluan} ` : '';
      if (slots.length > 1) {
        timeDetails.push(`Sesi ${index + 1} (${label}${timeStr})`);
      } else {
        timeDetails.push(label ? `${label}(${timeStr})` : timeStr);
      }
    }
  });

  const dateText = Array.from(datesSet).join('; ');
  const timeText = timeDetails.join('; ');

  return { dateText, timeText };
}

export function getPronoun(participantsCount: number, mode: string): 'saya' | 'kami' {
  if (participantsCount <= 1 && mode === 'INLINE_LTE_10') {
    return 'saya';
  }
  return 'kami';
}

export function formatLetterTitle(permits: PermitType[]): string {
  if (!permits || permits.length === 0) return 'SURAT PERMOHONAN IZIN';

  const labels = permits.map((p) => PERMIT_METADATA[p]?.titleLabel || p);
  if (labels.length === 1) {
    return `SURAT IZIN ${labels[0]}`;
  }
  if (labels.length === 2) {
    return `SURAT IZIN ${labels[0]} DAN ${labels[1]}`;
  }
  const last = labels[labels.length - 1];
  const rest = labels.slice(0, -1).join(', ');
  return `SURAT IZIN ${rest}, DAN ${last}`;
}

export function formatPermitPhrases(permits: PermitType[]): string {
  if (!permits || permits.length === 0) return 'izin kegiatan';

  const phrases = permits.map((p) => PERMIT_METADATA[p]?.phrase || p);
  if (phrases.length === 1) return phrases[0];
  if (phrases.length === 2) return `${phrases[0]} dan ${phrases[1]}`;
  const last = phrases[phrases.length - 1];
  const rest = phrases.slice(0, -1).join(', ');
  return `${rest}, dan ${last}`;
}

export function generateOpeningSentence(doc: LetterDocument): string {
  if (doc.customOpeningText && doc.customOpeningText.trim() !== '') {
    return doc.customOpeningText;
  }

  const pronoun = getPronoun(doc.daftarPeserta.length, doc.modePeserta);
  const kegiatan = doc.detailIzin.namaKegiatan.trim() || '[Nama Kegiatan]';
  const daftarIzin = formatPermitPhrases(doc.jenisIzinTerpilih);

  return `Sehubung dengan akan diadakannya kegiatan ${kegiatan}, ${pronoun} memohon ${daftarIzin} untuk keberlangsungan kegiatan yang akan ${pronoun} lakukan, dengan detail sebagai berikut:`;
}

export function generateClosingSentence(doc: LetterDocument): string {
  if (doc.customClosingText && doc.customClosingText.trim() !== '') {
    return doc.customClosingText;
  }

  const pronoun = getPronoun(doc.daftarPeserta.length, doc.modePeserta);
  return `Sekian surat permohonan yang ${pronoun} berikan, kiranya yang bersangkutan dapat memberikan izin demi kelancaran kegiatan, atas perhatiannya, ${pronoun} ucapkan terima kasih.`;
}

export function isLabRoomSelected(rooms?: PredefinedRoom[]): boolean {
  if (!rooms) return false;
  return rooms.some((r) => r === 'Lab Kimia' || r === 'Lab Fisika' || r === 'Lab Biologi');
}

export function getSelectedLabType(rooms?: PredefinedRoom[]): string {
  if (!rooms) return '';
  const labs = rooms.filter((r) => r.startsWith('Lab '));
  if (labs.length === 0) return '';
  if (labs.length === 1) {
    return labs[0].replace('Lab ', '');
  }
  return labs.map((l) => l.replace('Lab ', '')).join('/');
}
