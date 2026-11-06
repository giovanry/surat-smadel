import React from 'react';
import {
  PermitType,
  PermitSpecificDetails,
  MealSession,
  PredefinedRoom,
  TimeSlotItem,
} from '../../types/letter';
import {
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Plus,
  Trash2,
  CalendarRange,
  MapPin,
} from 'lucide-react';
import { DatePickerInput } from '../ui/DatePickerInput';

interface DynamicFieldsFormProps {
  jenisIzinTerpilih: PermitType[];
  details: PermitSpecificDetails;
  tanggalSurat: string;
  customLokasiTanggalSurat?: string;
  onChange: (details: PermitSpecificDetails) => void;
  onChangeTanggalSurat: (dateStr: string) => void;
  onChangeCustomLokasiTanggal: (customStr: string) => void;
}

const PREDEFINED_ROOMS: PredefinedRoom[] = [
  'X-1', 'X-2', 'X-3', 'X-4', 'X-5', 'X-6',
  'Lab Kimia', 'Lab Fisika', 'Lab Biologi',
];

const MEAL_SESSIONS: { id: MealSession; label: string }[] = [
  { id: 'PAGI', label: 'Makan Pagi' },
  { id: 'SIANG', label: 'Makan Siang' },
  { id: 'MALAM', label: 'Makan Malam' },
];

export const DynamicFieldsForm: React.FC<DynamicFieldsFormProps> = ({
  jenisIzinTerpilih,
  details,
  tanggalSurat,
  customLokasiTanggalSurat,
  onChange,
  onChangeTanggalSurat,
  onChangeCustomLokasiTanggal,
}) => {
  const updateField = (key: keyof PermitSpecificDetails, value: any) => {
    onChange({ ...details, [key]: value });
  };

  const timeSlots = details.daftarWaktuIzin || [];

  const handleAddTimeSlot = () => {
    const today = new Date().toISOString().split('T')[0];
    const newSlot: TimeSlotItem = {
      id: `slot_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      tanggalMulai: today,
      tanggalSelesai: today,
      jamMulai: '19:00',
      jamSelesai: '21:30',
      labelKeperluan: '',
    };
    updateField('daftarWaktuIzin', [...timeSlots, newSlot]);
  };

  const handleUpdateTimeSlot = (
    index: number,
    field: keyof TimeSlotItem,
    value: string
  ) => {
    const updated = [...timeSlots];
    updated[index] = { ...updated[index], [field]: value };
    updateField('daftarWaktuIzin', updated);
  };

  const handleRemoveTimeSlot = (index: number) => {
    const updated = timeSlots.filter((_, i) => i !== index);
    updateField('daftarWaktuIzin', updated);
  };

  const toggleRoom = (room: PredefinedRoom) => {
    const current = details.ruanganPilihan || [];
    const next = current.includes(room)
      ? current.filter((r) => r !== room)
      : [...current, room];
    updateField('ruanganPilihan', next);
  };

  const toggleMeal = (meal: MealSession) => {
    const current = details.bungkusSesiMakan || [];
    const next = current.includes(meal)
      ? current.filter((m) => m !== meal)
      : [...current, meal];
    updateField('bungkusSesiMakan', next);
  };

  return (
    <div className="space-y-6">
      {/* 1. Baris Titi Mangsa (Laguboti, XX XXXX XXXX) - Bisa diedit */}
      <div className="bg-slate-50/70 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-del-700 dark:text-del-400" />
            <span>Titi Mangsa Surat (Header Kanan Atas)</span>
          </label>
          <span className="text-[11px] text-slate-400">Laguboti, [Tanggal]</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-5">
              <CalendarIcon className="w-3.5 h-3.5 text-del-700 dark:text-del-400 shrink-0" />
              <span className="truncate">Tanggal Surat</span>
            </label>
            <DatePickerInput
              value={tanggalSurat}
              onChange={onChangeTanggalSurat}
              placeholder="DD/MM/YYYY"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-5">
              <MapPin className="w-3.5 h-3.5 text-del-700 dark:text-del-400 shrink-0" />
              <span className="truncate">Header Titi Mangsa Manual</span>
            </label>
            <input
              type="text"
              value={customLokasiTanggalSurat || ''}
              onChange={(e) => onChangeCustomLokasiTanggal(e.target.value)}
              placeholder="Contoh: Laguboti, 06/11/2026"
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-del-700 transition-colors"
            />
          </div>
        </div>
        <p className="text-[11px] text-slate-500">
          Jika kolom kanan dikosongkan, tanggal akan terformat otomatis: "Laguboti, [Tanggal yang dipilih]".
        </p>
      </div>

      {/* 2. Informasi Kegiatan Pokok */}
      <div className="bg-slate-50/70 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
          <span>Kegiatan Pokok</span>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Wajib
          </span>
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Nama Kegiatan
          </label>
          <input
            type="text"
            required
            value={details.namaKegiatan}
            onChange={(e) => updateField('namaKegiatan', e.target.value)}
            placeholder="Contoh: Persiapan Olimpiade Sains Nasional (OSN) Kebumian"
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-del-700 transition-colors"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Mengisi otomatis kalimat pembuka surat permohonan izin.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Tempat / Lokasi Kegiatan (Opsional/Umum)
          </label>
          <input
            type="text"
            value={details.tempatKegiatanUmum || ''}
            onChange={(e) => updateField('tempatKegiatanUmum', e.target.value)}
            placeholder="Contoh: Ruang Musik / Gedung Auditorium"
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-del-700 transition-colors"
          />
        </div>
      </div>

      {/* 3. Jadwal & Rentang Waktu Fleksibel (Calendar & Clock Inputs) */}
      <div className="bg-slate-50/70 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <CalendarRange className="w-4 h-4 text-del-700 dark:text-del-400" />
              <span>Waktu &amp; Tanggal Izin</span>
            </h3>
            <p className="text-xs text-slate-500">
              Bisa berupa satu waktu, rentang beberapa hari, atau potongan-potongan sesi.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddTimeSlot}
            className="px-3 py-1.5 rounded-xl bg-del-700 text-white font-semibold text-xs hover:bg-del-800 active:scale-[0.96] transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Waktu
          </button>
        </div>

        {timeSlots.length === 0 ? (
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Waktu Pelaksanaan Tunggal
              </span>
              <button
                type="button"
                onClick={handleAddTimeSlot}
                className="text-xs text-del-700 dark:text-del-400 font-semibold hover:underline"
              >
                + Gunakan Kolom Kalender &amp; Jam
              </button>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                Hari &amp; Tanggal Pelaksanaan
              </label>
              <input
                type="text"
                value={details.hariTanggalKegiatan}
                onChange={(e) => updateField('hariTanggalKegiatan', e.target.value)}
                placeholder="Contoh: Jumat, 06/11/2026"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {timeSlots.map((slot, index) => (
              <div
                key={slot.id || index}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 animate-view-enter shadow-2xs"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-del-50 dark:bg-del-950 text-del-700 dark:text-del-300 text-[11px] font-mono flex items-center justify-center">
                      {index + 1}
                    </span>
                    Sesi Waktu #{index + 1}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleRemoveTimeSlot(index)}
                    className="p-1 rounded-md text-slate-400 hover:text-rose-600 active:scale-[0.95] transition-all"
                    title="Hapus sesi waktu"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Kolom Tanggal (Calendar Picker: Mulai - Selesai) - Strictly Sejajar */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-5">
                      <CalendarIcon className="w-3.5 h-3.5 text-del-700 dark:text-del-400 shrink-0" />
                      <span className="truncate">Tanggal Mulai</span>
                    </label>
                    <DatePickerInput
                      value={slot.tanggalMulai}
                      onChange={(val) => handleUpdateTimeSlot(index, 'tanggalMulai', val)}
                      placeholder="DD/MM/YYYY"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-5">
                      <CalendarIcon className="w-3.5 h-3.5 text-del-700 dark:text-del-400 shrink-0" />
                      <span className="truncate">Tanggal Selesai</span>
                    </label>
                    <DatePickerInput
                      value={slot.tanggalSelesai || slot.tanggalMulai}
                      onChange={(val) => handleUpdateTimeSlot(index, 'tanggalSelesai', val)}
                      placeholder="DD/MM/YYYY"
                    />
                  </div>
                </div>

                {/* Kolom Waktu (Clock Picker: Jam Mulai - Jam Selesai) - Strictly Sejajar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-5">
                      <ClockIcon className="w-3.5 h-3.5 text-del-700 dark:text-del-400 shrink-0" />
                      <span className="truncate">Jam Mulai</span>
                    </label>
                    <input
                      type="time"
                      value={slot.jamMulai || ''}
                      onChange={(e) =>
                        handleUpdateTimeSlot(index, 'jamMulai', e.target.value)
                      }
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-del-700 transition-colors font-mono"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-5">
                      <ClockIcon className="w-3.5 h-3.5 text-del-700 dark:text-del-400 shrink-0" />
                      <span className="truncate">Jam Selesai</span>
                    </label>
                    <input
                      type="time"
                      value={slot.jamSelesai || ''}
                      onChange={(e) =>
                        handleUpdateTimeSlot(index, 'jamSelesai', e.target.value)
                      }
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-del-700 transition-colors font-mono"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 h-5">
                      <span className="truncate">Keterangan (Opsional)</span>
                    </label>
                    <input
                      type="text"
                      value={slot.labelKeperluan || ''}
                      onChange={(e) =>
                        handleUpdateTimeSlot(index, 'labelKeperluan', e.target.value)
                      }
                      placeholder="e.g. Sesi 1 / Latihan"
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-del-700 transition-colors"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Form Rincian Spesifik Sesuai Izin yang Dicentang */}
      <div className="space-y-4">
        {/* A. Izin Bungkus Makan */}
        {jenisIzinTerpilih.includes('IZIN_BUNGKUS_MAKAN') && (
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 animate-view-enter">
            <h4 className="text-xs font-bold uppercase tracking-wider text-del-700 dark:text-del-400">
              Rincian Izin Pembungkusan Makan
            </h4>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Pilih Sesi Makan
              </label>
              <div className="flex flex-wrap gap-2">
                {MEAL_SESSIONS.map((m) => {
                  const checked = (details.bungkusSesiMakan || []).includes(m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggleMeal(m.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-[0.98] ${
                        checked
                          ? 'bg-del-700 text-white border-del-700'
                          : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Nama Teman yang Membungkuskan (Opsional)
              </label>
              <input
                type="text"
                value={details.bungkusNamaPembungkus || ''}
                onChange={(e) => updateField('bungkusNamaPembungkus', e.target.value)}
                placeholder="Contoh: Samuel Siregar"
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus-visible:ring-2 focus-visible:ring-del-700 transition-colors"
              />
            </div>
          </div>
        )}

        {/* B. Izin Ruangan & Laboratorium */}
        {jenisIzinTerpilih.includes('IZIN_RUANGAN') && (
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 animate-view-enter">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-del-700 dark:text-del-400">
                Pilihan Ruangan / Laboratorium
              </h4>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                Pilih Lab otomatis memicu TTD Laboran
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {PREDEFINED_ROOMS.map((room) => {
                const isSelected = (details.ruanganPilihan || []).includes(room);
                const isLab = room.startsWith('Lab ');
                return (
                  <button
                    key={room}
                    type="button"
                    onClick={() => toggleRoom(room)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border text-center transition-all active:scale-[0.98] ${
                      isSelected
                        ? isLab
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-del-700 text-white border-del-700'
                        : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {room}
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Ruangan Lainnya (Ketik Manual jika tidak ada di atas)
              </label>
              <input
                type="text"
                value={details.ruanganCustom || ''}
                onChange={(e) => updateField('ruanganCustom', e.target.value)}
                placeholder="Contoh: XI-3, Lab Komputer 1, Gedung Serbaguna"
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus-visible:ring-2 focus-visible:ring-del-700 transition-colors"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
