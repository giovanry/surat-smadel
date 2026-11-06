# Generator Surat Izin Siswa SMA Unggul Del

Aplikasi web pembuat surat izin siswa SMA Unggul Del berbasis React, TypeScript, dan Tailwind CSS. Aplikasi ini memfasilitasi pembuatan, penyesuaian detail kegiatan, manajemen peserta & jadwal, serta ekspor ke format Microsoft Word (`.docx`) dan PDF standar A4.

## Fitur Utama

- **Kategori Izin Fleksibel**:
  - **Kesiswaan**: Izin Penggunaan HP, Pembungkusan Makan, Tidak Mengikuti Briefing, Terlambat Masuk Asrama, Tidak Mengikuti Kurve, Aktivitas Malam, dan Melewati Jam Silent.
  - **Akademik**: Izin Penggunaan Laptop dan Penggunaan Ruangan / Laboratorium.
- **Titi Mangsa Kustom**: Format default `Laguboti, DD/MM/YYYY` yang dapat diedit manual sesuai kebutuhan.
- **Multi-Sesi & Rentang Waktu**: Tambah potongan-potongan sesi waktu dengan input kalender (`DD/MM/YYYY`) dan jam (`HH:mm`), otomatis dirangkum ke badan surat.
- **Manajemen Peserta**:
  - Format Inline (&le; 10 orang) langsung di badan surat.
  - Format Lampiran (&gt; 10 orang) dengan impor/ekspor data Excel (`.xlsx`).
- **Live Preview A4**: Pratinjau presisi standar cetak A4 dengan tipografi Times New Roman baku.
- **Ekspor Dokumen**:
  - Download dokumen Microsoft Word (`.docx`) dengan tabel dan format rapi.
  - Download berkas PDF siap cetak.
- **Dashboard Riwayat**: Penyimpanan draf surat di peramban (Local Storage).

## Teknologi

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Google Fonts (Plus Jakarta Sans)
- **Ekspor**: `docx`, `html2pdf.js`, `xlsx`, `file-saver`
- **Ikon**: Lucide React

## Panduan Menjalankan

1. **Install dependensi**:
   ```bash
   npm install
   ```

2. **Jalankan server pengembangan**:
   ```bash
   npm run dev
   ```

3. **Build untuk produksi**:
   ```bash
   npm run build
   ```
