import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ParticipantItem, ScheduleItem } from '../types/letter';

export const excelService = {
  downloadParticipantKesiswaanTemplate(): void {
    const data = [
      ['No', 'Nama Lengkap', 'ASPA / ASPI'],
      [1, 'Johannes Sinaga', 'ASPA'],
      [2, 'Maria Simanjuntak', 'ASPI'],
      [3, 'Samuel Siregar', 'ASPA'],
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    ws['!cols'] = [{ wch: 6 }, { wch: 30 }, { wch: 15 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Peserta Kesiswaan');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, 'template_peserta_kesiswaan.xlsx');
  },

  downloadParticipantAkademikTemplate(): void {
    const data = [
      ['No', 'Nama Lengkap', 'Kelas'],
      [1, 'Johannes Sinaga', 'XI-1'],
      [2, 'Maria Simanjuntak', 'XI-2'],
      [3, 'Samuel Siregar', 'X-3'],
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    ws['!cols'] = [{ wch: 6 }, { wch: 30 }, { wch: 15 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Peserta Akademik');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, 'template_peserta_akademik.xlsx');
  },

  downloadScheduleTemplate(): void {
    const data = [
      ['No', 'Hari/Tanggal', 'Waktu (Mulai - Selesai)', 'Tempat/Ruangan', 'Keterangan Kegiatan'],
      [1, 'Jumat, 6 November 2026', '19.00 - 21.30 WIB', 'Lab Kimia', 'Eksperimen Titrimetri Tahap 1'],
      [2, 'Sabtu, 7 November 2026', '14.00 - 17.00 WIB', 'X-2', 'Diskusi Analisis Data & Penyusunan Laporan'],
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    ws['!cols'] = [{ wch: 6 }, { wch: 25 }, { wch: 25 }, { wch: 20 }, { wch: 40 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Runtutan Waktu');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, 'template_runtutan_waktu.xlsx');
  },

  async parseParticipantFile(file: File): Promise<ParticipantItem[]> {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' });

    const participants: ParticipantItem[] = [];

    rows.forEach((row, index) => {
      let nama = '';
      let kelas = 'X-1';
      let asrama: 'ASPA' | 'ASPI' = 'ASPA';

      Object.entries(row).forEach(([key, val]) => {
        const cleanKey = key.trim().toLowerCase();
        const strVal = String(val).trim();
        if (cleanKey.includes('nama')) {
          nama = strVal;
        } else if (cleanKey.includes('kelas')) {
          kelas = strVal || 'X-1';
        } else if (cleanKey.includes('aspa') || cleanKey.includes('asrama') || cleanKey.includes('aspi')) {
          if (strVal.toUpperCase().includes('ASPI')) {
            asrama = 'ASPI';
          } else {
            asrama = 'ASPA';
          }
        }
      });

      if (nama) {
        participants.push({
          id: `p_excel_${Date.now()}_${index}`,
          namaLengkap: nama,
          kelas: kelas || 'X-1',
          asrama,
        });
      }
    });

    return participants;
  },

  async parseScheduleFile(file: File): Promise<ScheduleItem[]> {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' });

    const scheduleList: ScheduleItem[] = [];

    rows.forEach((row, index) => {
      let hariTanggal = '';
      let waktu = '';
      let tempat = '';
      let keterangan = '';

      Object.entries(row).forEach(([key, val]) => {
        const cleanKey = key.trim().toLowerCase();
        const strVal = String(val).trim();
        if (cleanKey.includes('hari') || cleanKey.includes('tanggal')) {
          hariTanggal = strVal;
        } else if (cleanKey.includes('waktu') || cleanKey.includes('jam')) {
          waktu = strVal;
        } else if (cleanKey.includes('tempat') || cleanKey.includes('ruangan')) {
          tempat = strVal;
        } else if (cleanKey.includes('keterangan') || cleanKey.includes('kegiatan')) {
          keterangan = strVal;
        }
      });

      if (hariTanggal || waktu || keterangan) {
        scheduleList.push({
          id: `sch_excel_${Date.now()}_${index}`,
          hariTanggal,
          waktuMulaiSelesai: waktu,
          tempatRuangan: tempat,
          keteranganKegiatan: keterangan,
        });
      }
    });

    return scheduleList;
  },
};

