import { LetterDocument, StudentProfile } from '../types/letter';

const STORAGE_KEYS = {
  PROFILE: 'del_letter_student_profile',
  LETTERS: 'del_letter_history_docs',
  THEME: 'del_letter_theme',
};

export const defaultStudentProfile: StudentProfile = {
  namaLengkap: '',
  kelas: 'X-1',
  asrama: 'ASPA',
  defaultGuruPendamping: '',
};

export const storageService = {
  getProfile(): StudentProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : defaultStudentProfile;
    } catch {
      return defaultStudentProfile;
    }
  },

  saveProfile(profile: StudentProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  getAllLetters(): LetterDocument[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LETTERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getLetterById(id: string): LetterDocument | undefined {
    const letters = this.getAllLetters();
    return letters.find((l) => l.id === id);
  },

  saveLetter(letter: LetterDocument): void {
    const letters = this.getAllLetters();
    const index = letters.findIndex((l) => l.id === letter.id);
    const updated = { ...letter, updatedAt: new Date().toISOString() };

    if (index >= 0) {
      letters[index] = updated;
    } else {
      letters.unshift(updated);
    }
    localStorage.setItem(STORAGE_KEYS.LETTERS, JSON.stringify(letters));
  },

  deleteLetter(id: string): void {
    const letters = this.getAllLetters().filter((l) => l.id !== id);
    localStorage.setItem(STORAGE_KEYS.LETTERS, JSON.stringify(letters));
  },

  exportBackupJson(): string {
    const data = {
      profile: this.getProfile(),
      letters: this.getAllLetters(),
      exportedAt: new Date().toISOString(),
      app: 'SMA Unggul Del Letter Generator',
    };
    return JSON.stringify(data, null, 2);
  },

  importBackupJson(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.profile) this.saveProfile(data.profile);
      if (Array.isArray(data.letters)) {
        localStorage.setItem(STORAGE_KEYS.LETTERS, JSON.stringify(data.letters));
      }
      return true;
    } catch {
      return false;
    }
  },

  getInitialLetter(profile?: StudentProfile): LetterDocument {
    const user = profile || this.getProfile();
    const today = new Date().toISOString().split('T')[0];

    return {
      id: crypto.randomUUID ? crypto.randomUUID() : `doc_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tanggalSurat: today,
      kategori: 'KESISWAAN',
      jenisIzinTerpilih: ['IZIN_HP'],
      modePeserta: 'INLINE_LTE_10',
      gunakanTabelRuntutanWaktu: false,
      daftarPeserta: [
        {
          id: 'p_1',
          namaLengkap: user.namaLengkap || 'Nama Pemohon',
          kelas: user.kelas || 'X-1',
          asrama: user.asrama || 'ASPA',
        },
      ],
      daftarJadwal: [],
      detailIzin: {
        namaKegiatan: '',
        hariTanggalKegiatan: '',
        hpWaktuMulai: '19.00 WIB',
        hpWaktuSelesai: '21.00 WIB',
        hpKeperluan: '',
      },
      tandaTangan: {
        namaPemohon: user.namaLengkap || '',
        namaGuruPendamping: user.defaultGuruPendamping || '',
        namaPembinaAsrama: 'Pembina Asrama',
        namaWakasekAkademik: 'Ari Raharja S.Pd., Gr.',
        butuhTtdLaboran: false,
        jenisLab: '',
        namaLaboran: '',
      },
    };
  },
};

