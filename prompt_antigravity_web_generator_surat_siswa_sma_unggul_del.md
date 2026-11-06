# MASTER ARCHITECTURAL PROMPT: Sistem Pembuatan Surat Izin Siswa SMA Unggul Del (100% Client-Side Web Application)

---

## 1. Peran, Visi Proyek & Batasan Utama (Core Constraints)

Kamu adalah **Principal Frontend Architect, Lead TypeScript Engineer, dan Document Layout Specialist**. Tugasmu adalah merancang dan membangun aplikasi web **Generator Surat Izin Siswa SMA Unggul Del** yang siap pakai (*production-ready*), responsif, dan memiliki presisi tipografi tingkat tinggi untuk pencetakan dokumen resmi.

### Prinsip Mutlak Sistem (Non-Negotiable Constraints):
1. **100% Client-Side (Full In-Browser Execution)**:
   * **TIDAK ADA Backend Server**, tidak ada database cloud eksternal, tidak ada autentikasi login/register, dan tidak ada pengunggahan file ke server mana pun.
   * Seluruh pemrosesan form, pembacaan file CSV, pembuatan dokumen **PDF**, pembuatan dokumen **Microsoft Word (`.docx`)**, serta penyimpanan riwayat surat maupun profil siswa dilakukan sepenuhnya di dalam browser pengguna menggunakan `localStorage`.
2. **Tanpa Sistem Role (Single Unified Workspace)**:
   * Semua fitur langsung dapat diakses oleh siswa begitu membuka website.
   * Tanda tangan pada surat **hanya menyediakan ruang kosong (*blank signature spot*)** beserta nama terang dan jabatan di bawahnya untuk ditandatangani secara basah setelah surat dicetak.
3. **Presisi Dokumen Standar A4**:
   * Setiap surat yang dihasilkan (baik pada *Live Preview* di layar, hasil unduhan `.pdf`, maupun hasil unduhan `.docx`) wajib mematuhi aturan tata letak surat SMA Unggul Del: kertas A4, **tanpa kop surat**, judul besar rata tengah (`14pt`, **Bold**, Kapital), isi surat `Times New Roman` (`12pt`, spasi `1.5`), tanggal rata kanan (`Laguboti, ...`), serta tata letak tanda tangan dinamis (3 pihak atau 4 pihak tergantung jenis izin).

---

## 2. Tech Stack, Library & Struktur Direktori

Gunakan arsitektur modern berbasis **React (Vite) atau Next.js (App Router - Client Components)** dengan **TypeScript**:

### Daftar Dependencies Utama:
* **Core UI**: `React 18+`, `TypeScript`, `Tailwind CSS v3.4+`
* **Ikonografi**: `lucide-react`
* **Generator DOCX (Word)**: `docx` (v8.5+) dan `file-saver` (`@types/file-saver`) untuk menyusun file `.docx` asli secara programatik di browser.
* **Generator PDF**: Kombinasi native `@media print` CSS berpresisi tinggi dan `html2pdf.js` (atau `jspdf` + `html2canvas`) untuk tombol unduh `.pdf` instan.
* **CSV Parser & Generator**: `papaparse` (`@types/papaparse`) atau utilitas CSV parser mandiri untuk memproses unggahan daftar nama/jadwal dari Excel serta mengunduh file template `.csv`.
* **Utilitas Tanggal**: `date-fns` (dengan locale Bahasa Indonesia `id`) atau `Intl.DateTimeFormat('id-ID')` untuk memformat tanggal surat secara baku (contoh: `Laguboti, 6 November 2026` atau `Jumat, 6 November 2026`).

### Struktur Direktori yang Direkomendasikan:
```text
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx              # Navigasi samping (Dashboard, Buat Surat, Settings + Theme Toggle)
│   │   └── HeaderMobile.tsx         # Navigasi responsif untuk layar HP/Tablet
│   ├── dashboard/
│   │   ├── DashboardView.tsx        # Statistik & daftar riwayat surat dari localStorage
│   │   └── LetterHistoryCard.tsx    # Kartu item surat (View, Edit, Download PDF, Download DOCX, Hapus)
│   ├── builder/
│   │   ├── LetterBuilderView.tsx    # Workspace split-screen (Form di kiri, Live Preview A4 di kanan)
│   │   ├── CategorySelector.tsx     # Pemilihan Kategori (Kesiswaan vs Akademik) & Multi-Select Jenis Izin
│   │   ├── DynamicFieldsForm.tsx    # Input dinamis berdasarkan jenis surat yang dicentang
│   │   ├── ParticipantManager.tsx   # Opsi <=10 orang vs >10 orang / Runtutan Waktu + CSV Upload/Template
│   │   └── SignatureConfigForm.tsx  # Input nama Pemohon (Autofill), Guru Pendamping, Laboran, & Penyetuju
│   ├── preview/
│   │   ├── A4PreviewContainer.tsx   # Wrapper kertas A4 (Halaman 1: Surat Utama, Halaman 2: Lampiran)
│   │   ├── MainLetterPage.tsx       # Render HTML/CSS presisi A4 untuk halaman utama surat
│   │   └── AttachmentPage.tsx       # Render HTML/CSS presisi A4 untuk halaman lampiran (>10 orang / jadwal)
│   └── settings/
│       └── SettingsView.tsx         # Profil default siswa (Autofill) & Backup/Restore JSON
├── services/
│   ├── storageService.ts            # CRUD localStorage untuk profil siswa & riwayat surat
│   ├── letterTextEngine.ts          # Generator kalimat baku, penggabungan judul, & logika "saya" vs "kami"
│   ├── docxGenerator.ts             # Engine pembuat file .docx (A4, Times New Roman, Tabel TTD Tanpa Border)
│   ├── pdfGenerator.ts              # Engine ekspor PDF & pemicu window.print()
│   └── csvService.ts                # Generator template CSV & parser file CSV lampiran
├── types/
│   └── letter.ts                    # Seluruh interface TypeScript aplikasi
├── App.tsx
└── main.tsx
```

---

## 3. Skema Data & TypeScript Interfaces (`types/letter.ts`)

Implementasikan struktur tipe data berikut secara ketat agar seluruh fitur berjalan konsisten:

```typescript
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
  kelas: string;          // Digunakan pada Surat Akademik
  asrama: 'ASPA' | 'ASPI'; // Digunakan pada Surat Kesiswaan
}

export interface ScheduleItem {
  id: string;
  hariTanggal: string;
  waktuMulaiSelesai: string;
  tempatRuangan: string;
  keteranganKegiatan: string;
}

export interface PermitSpecificDetails {
  // Umum / Kegiatan Utama
  namaKegiatan: string;         // Mengisi [INPUT KEGIATAN DARI SISWA] di paragraf pembuka
  hariTanggalKegiatan: string;  // Contoh: "Jumat, 6 November 2026"
  tempatKegiatanUmum?: string;

  // 1. Izin Penggunaan Handphone (Kesiswaan)
  hpWaktuMulai?: string;        // Dari jam berapa
  hpWaktuSelesai?: string;      // Sampai jam berapa
  hpKeperluan?: string;

  // 2. Izin Pembungkusan Makan (Kesiswaan)
  bungkusSesiMakan?: MealSession[]; // Checkbox: PAGI, SIANG, MALAM
  bungkusNamaPembungkus?: string;   // Opsional: Nama teman yang membungkuskan
  bungkusAlasan?: string;

  // 3. Izin Tidak Mengikuti Briefing (Kesiswaan)
  briefingWaktu?: string;
  briefingAlasan?: string;

  // 4. Izin Terlambat Masuk Asrama (Kesiswaan)
  terlambatJamMasuk?: string;
  terlambatAlasan?: string;

  // 5. Izin Tidak Mengikuti Kurve (Kesiswaan)
  kurveSesiWaktu?: string;
  kurveAlasan?: string;

  // 6. Izin Mengikuti Aktivitas Malam (Kesiswaan)
  malamWaktuMulai?: string;
  malamWaktuSelesai?: string;
  malamTempat?: string;

  // 7. Izin Beraktivitas Melewati Jam Silent (Kesiswaan)
  silentWaktuMulai?: string;
  silentWaktuSelesai?: string;
  silentTempat?: string;

  // 8. Izin Penggunaan Laptop (Akademik)
  laptopWaktuMulai?: string;
  laptopWaktuSelesai?: string;
  laptopTempat?: string;

  // 9. Izin Penggunaan Ruangan (Akademik)
  ruanganPilihan?: PredefinedRoom[]; // Checkbox kelas X-1..X-6 & Lab Kimia/Fisika/Biologi
  ruanganCustom?: string[];          // Input ketik sendiri (misal: XI-1, Auditorium, dll.)
  ruanganWaktuMulai?: string;
  ruanganWaktuSelesai?: strinc
export interface SignatureConfig {
  namaPemohon: string;          // Perwakilan 1 orang (bisa di-autofill dari profil)
  namaGuruPendamping: string;   // Diisi sendiri oleh siswa (Mengetahui)
  namaPembinaAsrama: string;    // Default: "Pembina Asrama" (Menyetujui - Kesiswaan)
  namaWakasekAkademik: string;  // Default terkunci/terisi: "Ari Raharja S.Pd., Gr." (Menyetujui - Akademik)
  butuhTtdLaboran: boolean;     // Otomatis TRUE jika Lab Kimia / Fisika / Biologi dipilih
  jenisLab?: string;            // Contoh: "Kimia" / "Fisika" / "Biologi"
  namaLaboran?: string;         // Diketik manual oleh siswa jika butuhTtdLaboran === true
}

export interface LetterDocument {
  id: string;
  createdAt: string;
  updatedAt: string;
  tanggalSurat: string;         // Tanggal pembuatan surat untuk "Laguboti, [Tanggal]"
  kategori: LetterCategory;
  jenisIzinTerpilih: PermitType[]; // Bisa 1 atau lebih dalam kategori yang sama
  modePeserta: ParticipantMode;
  gunakanTabelRuntutanWaktu: boolean;
  daftarPeserta: ParticipantItem[];
  daftarJadwal: ScheduleItem[];
  detailIzin: PermitSpecificDetails;
  tandaTangan: SignatureConfig;
  customOpeningText?: string;   // Opsional jika siswa ingin menyunting teks pembuka secara manual
  customClosingText?: string;   // Opsional jika siswa ingin menyunting teks penutup secara manual
}
```

---

## 4. Logika Bisnis: Kategori & Penggabungan Surat (Combinability Rules)

### 4.1. Aturan Eksklusivitas Kategori
1. Terdapat **2 Kategori Utama**:
   * **Surat Kesiswaan** (Ditujukan kepada: `Pembina Asrama SMA Unggul Del`)
   * **Surat Akademik** (Ditujukan kepada: `Wakil Kepala Sekolah Bidang Akademik SMA Unggul Del`)
2. **Penggabungan Dalam Satu Kategori (ALLOWED)**:
   * Siswa dapat mencentang **lebih dari satu** jenis izin selama masih berada di kategori yang sama.
   * *Contoh Kesiswaan*: Siswa mencentang `Izin Penggunaan Handphone` + `Izin Mengikuti Aktivitas Malam` + `Izin Beraktivitas Melewati Jam Silent` sekaligus dalam satu surat karena kegiatannya berkaitan.
   * *Contoh Akademik*: Siswa mencentang `Izin Penggunaan Laptop` + `Izin Penggunaan Ruangan` sekaligus dalam satu surat.
3. **Penggabungan Lintas Kategori (STRICTLY FORBIDDEN)**:
   * Surat Kesiswaan **tidak boleh** digabung dengan Surat Akademik.
   * Pada UI pembuatan surat, begitu pengguna memilih tab/radio `Surat Kesiswaan`, hanya tampilkan 7 checkbox izin Kesiswaan. Jika pengguna berpindah ke `Surat Akademik`, beri peringatan singkat atau reset pilihan izin ke daftar izin Akademik.

### 4.2. Pemetaan Judul & Nama Izin
Gunakan kamus pemetaan berikut untuk menyusun **Judul Besar Surat** dan **Frasa Daftar Izin di Paragraf Pembuka**:

| Kode Izin | Kategori | Label Frasa Izin (Huruf Kecil untuk Paragraf) | Label Judul Surat (KAPITAL) |
| :--- | :--- | :--- | :--- |
| `IZIN_HP` | Kesiswaan | izin penggunaan handphone | PENGGUNAAN HANDPHONE |
| `IZIN_BUNGKUS_MAKAN` | Kesiswaan | izin pembungkusan makan | PEMBUNGKUSAN MAKAN |
| `IZIN_TIDAK_BRIEFING` | Kesiswaan | izin tidak mengikuti briefing | TIDAK MENGIKUTI BRIEFING |
| `IZIN_TERLAMBAT_ASRAMA` | Kesiswaan | izin terlambat masuk asrama | TERLAMBAT MASUK ASRAMA |
| `IZIN_TIDAK_KURVE` | Kesiswaan | izin tidak mengikuti kurve | TIDAK MENGIKUTI KURVE |
| `IZIN_AKTIVITAS_MALAM` | Kesiswaan | izin mengikuti aktivitas malam | MENGIKUTI AKTIVITAS MALAM |
| `IZIN_LEWAT_JAM_SILENT` | Kesiswaan | izin beraktivitas melewati jam silent | BERAKTIVITAS MELEWATI JAM SILENT |
| `IZIN_LAPTOP` | Akademik | izin penggunaan laptop | PENGGUNAAN LAPTOP |
| `IZIN_RUANGAN` | Akademik | izin penggunaan ruangan | PENGGUNAAN RUANGAN |

#### Logika Penggabungan Judul Surat:
* Jika 1 izin dipilih: `SURAT IZIN [LABEL JUDUL]`
  * Contoh: `SURAT IZIN PENGGUNAAN HANDPHONE`
* Jika 2 izin dipilih: `SURAT IZIN [LABEL 1] DAN [LABEL 2]`
  * Contoh: `SURAT IZIN PENGGUNAAN LAPTOP DAN PENGGUNAAN RUANGAN`
* Jika $\ge 3$ izin dipilih: `SURAT IZIN [LABEL 1], [LABEL 2], DAN [LABEL N]`
  * Contoh: `SURAT IZIN PENGGUNAAN HANDPHONE, MENGIKUTI AKTIVITAS MALAM, DAN BERAKTIVITAS MELEWATI JAM SILENT`

---

## 5. Engine Kalimat Baku Surat (Verbatim Boilerplate & Dynamic Pronoun)

Bagian ini sangat krusial. Susunan kalimat pembuka dan penutup surat **WAJIB** mengikuti struktur kalimat di bawah ini secara presisi:

### 5.1. Logika Kata Ganti Otomatis (`saya` vs `kami`)
Hitung jumlah total peserta (`totalPeserta = daftarPeserta.length`):
* Jika `totalPeserta === 1` dan `modePeserta === 'INLINE_LTE_10'`, maka kata ganti subjek (`PRONOUN`) adalah **`saya`**.
* Jika `totalPeserta > 1` atau `modePeserta === 'ATTACHMENT_GT_10'`, maka kata ganti subjek (`PRONOUN`) adalah **`kami`**.

### 5.2. Struktur Kalimat Pembuka Surat (WAJIB)
Setelah baris `Dengan hormat,`, paragraf pertama **wajib** berbunyi:

> **"Sehubung dengan akan diadakannya kegiatan `[INPUT KEGIATAN DARI SISWA]`, `[saya/kami]` memohon `[daftar-daftar izinnya]` untuk keberlangsungan kegiatan yang akan `[saya/kami]` lakukan, dengan detail sebagai berikut:"**

#### Contoh Hasil Render Kalimat Pembuka:
* **Kondisi 1 Orang (Sendiri) - Izin Laptop**:
  > *"Sehubung dengan akan diadakannya kegiatan Penyusunan Karya Tulis Ilmiah Nasional, saya memohon izin penggunaan laptop untuk keberlangsungan kegiatan yang akan saya lakukan, dengan detail sebagai berikut:"*
* **Kondisi $> 1$ Orang (Barengan) - Gabungan Izin Kesiswaan**:
  > *"Sehubung dengan akan diadakannya kegiatan Persiapan Olimpiade Sains Nasional (OSN), kami memohon izin penggunaan handphone, izin mengikuti aktivitas malam, dan izin beraktivitas melewati jam silent untuk keberlangsungan kegiatan yang akan kami lakukan, dengan detail sebagai berikut:"*

*(Catatan UI: Sediakan juga toggle kecil "Edit teks pembuka/penutup manual" di form jika sewaktu-waktu siswa ingin memodifikasi kalimat secara khusus, namun secara default hasilkan kalimat di atas secara otomatis).*

### 5.3. Struktur Detail Kegiatan & Daftar Nama di Badan Surat

Tepat di bawah paragraf pembuka di atas, tampilkan blok rincian kegiatan dan daftar pemohon sesuai kondisi berikut:

#### A. Rincian Waktu, Tempat & Spesifikasi Izin:
Render dalam format tabel rapi tanpa border (titik dua sejajar) di badan surat:
* **Jika waktu tunggal (Tidak menggunakan lampiran runtutan waktu)**:
  * `Hari, Tanggal` : `[hariTanggalKegiatan]`
  * `Waktu` : `[Rentang waktu izin; jika gabungan beberapa izin dengan waktu berbeda, rincikan per izin, misal: Penggunaan HP (19.00 - 22.00 WIB), Lewat Jam Silent (22.00 - 23.30 WIB)]`
  * `Tempat / Ruangan` : `[Daftar ruangan yang dipilih dari checkbox + input custom, atau lokasi kegiatan]`
  * *(Khusus Izin Pembungkusan Makan)* `Sesi Makan` : `[Pagi / Siang / Malam]` (dan `Dibungkuskan oleh: [Nama]` jika diisi)
  * `Keperluan / Keterangan` : `[Detail alasan tambahan jika ada]`
* **Jika menggunakan halaman Lampiran Runtutan Waktu (`gunakanTabelRuntutanWaktu === true`)**:
  * `Hari, Tanggal` : *Terlampir*
  * `Waktu & Tempat` : *Terlampir pada halaman lampiran*

#### B. Daftar Nama Siswa di Badan Surat:
1. **Jika Mode $\le 10$ Orang (`INLINE_LTE_10`)**:
   * Jika hanya **1 orang**:
     * Untuk **Surat Kesiswaan**:
       * `Nama` : `[Nama Lengkap]`
       * `Asrama` : `[ASPA / ASPI]`
     * Untuk **Surat Akademik**:
       * `Nama` : `[Nama Lengkap]`
       * `Kelas` : `[Kelas]`
   * Jika **2 s.d. 10 orang**:
     * Tampilkan kalimat pengantar singkat: `Adapun daftar siswa yang memohon izin tersebut adalah:`
     * Diikuti **poin bernomor (`1.`, `2.`, `3.`, dst.)**:
       * **Format Kesiswaan**: `1. [Nama Lengkap] ([ASPA / ASPI])` — *Contoh: `1. Budi Santoso (ASPA)`*
       * **Format Akademik**: `1. [Nama Lengkap] (Kelas [Kelas])` — *Contoh: `1. Siti Aminah (Kelas XI-2)`*
2. **Jika Mode $> 10$ Orang (`ATTACHMENT_GT_10`)**:
   * Jangan tampilkan daftar nama di halaman pertama.
   * Tampilkan baris keterangan: `Peserta / Pemohon : Terlampir (sebanyak [N] orang siswa)`

### 5.4. Struktur Kalimat Penutup Surat (WAJIB)
Paragraf penutup sebelum blok tanda tangan **wajib** berbunyi:

> **"Sekian surat permohonan yang `[saya/kami]` berikan, kiranya yang bersangkutan dapat memberikan izin demi kelancaran kegiatan, atas perhatiannya, `[saya/kami]` ucapkan terima kasih."**

---

## 6. Spesifikasi Mode Peserta, Halaman Lampiran & Sistem CSV

Sebelum siswa mengisi daftar peserta di wizard pembuatan surat, berikan **2 Pilihan Mode yang Jelas (Radio Card Selection)**:

### Mode 1: $\le 10$ Orang (Tampil Langsung di Badan Surat)
* Maksimal 10 baris siswa.
* Memiliki tombol **"+ Autofill Nama Saya"** (mengambil data dari Settings) dan **"+ Tambah Anggota"**.
* Kolom input menyesuaikan kategori surat:
  * **Kesiswaan**: `Nama Lengkap` + Dropdown `ASPA / ASPI`.
  * **Akademik**: `Nama Lengkap` + Input/Dropdown `Kelas`.
* Tidak menghasilkan halaman lampiran daftar nama.

### Mode 2: $> 10$ Orang dan/atau Runtutan Waktu Kegiatan (Menggunakan Halaman Lampiran)
* Aktif ketika jumlah peserta banyak ($> 10$ orang) atau kegiatan berlangsung dalam beberapa sesi/hari yang memerlukan tabel jadwal tersendiri.
* Menghasilkan **Halaman ke-2 (Halaman Lampiran)** secara otomatis pada Preview, PDF, dan DOCX.
* Siswa dapat memilih untuk menyertakan:
  1. **Tabel Lampiran Daftar Nama Peserta**
  2. **Tabel Lampiran Runtutan Waktu Kegiatan** (melalui *checkbox* `"Sertakan Lampiran Runtutan Waktu / Jadwal Kegiatan"`).

#### Fitur CSV Import & Download Template CSV:
Sediakan tombol **"Download Template CSV"** dan **"Upload File CSV (Excel)"** untuk mempermudah pengisian data massal:

1. **Template CSV Daftar Peserta Kesiswaan (`template_peserta_kesiswaan.csv`)**:
   * Header wajib: `No,Nama Lengkap,ASPA / ASPI`
   * Contoh isi:
     ```csv
     No,Nama Lengkap,ASPA / ASPI
     1,Johannes Sinaga,ASPA
     2,Maria Simanjuntak,ASPI
     ```
2. **Template CSV Daftar Peserta Akademik (`template_peserta_akademik.csv`)**:
   * Header wajib: `No,Nama Lengkap,Kelas`
   * Contoh isi:
     ```csv
     No,Nama Lengkap,Kelas
     1,Johannes Sinaga,XI-1
     2,Maria Simanjuntak,XI-2
     ```
3. **Template CSV Runtutan Waktu (`template_runtutan_waktu.csv`)**:
   * Header wajib: `No,Hari/Tanggal,Waktu (Mulai - Selesai),Tempat/Ruangan,Keterangan Kegiatan`
   * Contoh isi:
     ```csv
     No,Hari/Tanggal,Waktu (Mulai - Selesai),Tempat/Ruangan,Keterangan Kegiatan
     1,"Jumat, 6 November 2026",19.00 - 21.30 WIB,Lab Kimia,Eksperimen Titrimetri Tahap 1
     2,"Sabtu, 7 November 2026",14.00 - 17.00 WIB,X-2,Diskusi Analisis Data & Penyusunan Laporan
     ```

*(Catatan UX: Setelah CSV di-upload, tampilkan datanya di dalam tabel interaktif pada form sehingga siswa tetap bisa mengedit/menambah/menghapus baris secara langsung di web tanpa harus upload ulang CSV).*

---

## 7. Spesifikasi Tipografi, Tata Letak Kertas A4 & Matriks Tanda Tangan

### 7.1. Aturan Kertas & Tipografi Baku
* **Ukuran Kertas**: A4 (`210mm x 297mm`).
* **Margin Kertas**: Atas `2.54cm`, Bawah `2.54cm`, Kiri `2.54cm`, Kanan `2.54cm` (Standar 1 Inci).
* **Tanpa Kop Surat**: Tidak ada logo atau header yayasan/sekolah.
* **Judul Surat**:
  * Font: `Times New Roman`, **14pt**, **Bold**, **HURUF KAPITAL SEMUA**.
  * Alignment: **Center (Rata Tengah)**.
* **Tanggal Surat (Titi Mangsa)**:
  * Posisi: Di bawah judul surat (jarak 1 baris kosong), **Right-Aligned (Rata Kanan)**.
  * Format teks: `Laguboti, [Tanggal] [Bulan] [Tahun]` (Contoh: `Laguboti, 6 November 2026`).
* **Tujuan Surat (Penerima)**:
  * Posisi: **Left-Aligned (Rata Kiri)** di bawah baris tanggal.
  * **Jika Surat Kesiswaan**:
    ```text
    Yth. Pembina Asrama SMA Unggul Del
    Di Tempat
    ```
  * **Jika Surat Akademik**:
    ```text
    Yth. Wakil Kepala Sekolah Bidang Akademik
    Di Tempat
    ```
* **Isi Surat**:
  * Font: `Times New Roman`, **12pt**, warna hitam pekat (`#000000`).
  * Line Spacing: **1.5** (`line-height: 1.5`).
  * Paragraf Pembuka & Penutup: **Justify (Rata Kiri-Kanan)**.

### 7.2. Tiga Variasi Matriks Tanda Tangan (Signature Grid)
Di bagian bawah surat (setelah kalimat penutup), buat struktur tanda tangan dengan **spot kosong** setinggi 3–4 baris untuk tanda tangan basah. Pada bagian `Pemohon`, **hanya 1 nama perwakilan** yang dicantumkan meskipun surat diajukan oleh banyak orang.

#### Matriks 1: Surat Kesiswaan (3 Pihak)
Digunakan untuk seluruh Surat Kesiswaan:
```text
Mengetahui,                                               Pemohon,
Guru Pendamping



( [Nama Guru Pendamping] )                                ( [Nama Perwakilan Pemohon] )

                              Menyetujui,
                            Pembina Asrama



                        ( Pembina Asrama )
```
* **Default Penyetuju**: Tertulis `Pembina Asrama` pada jabatan maupun di dalam tanda kurung `( Pembina Asrama )` (sediakan opsi edit jika siswa ingin mengisi nama spesifik pembina).

#### Matriks 2: Surat Akademik — Non-Laboratorium (3 Pihak)
Digunakan untuk Surat Akademik (`Izin Penggunaan Laptop` dan/atau `Izin Penggunaan Ruangan` yang **hanya** memilih ruang kelas biasa `X-1` s.d. `X-6` atau ruangan non-lab):
```text
Mengetahui,                                               Pemohon,
Guru Pendamping



( [Nama Guru Pendamping] )                                ( [Nama Perwakilan Pemohon] )

                              Menyetujui,
                Wakil Kepala Sekolah Bidang Akademik



                        ( Ari Raharja S.Pd., Gr. )
```
* **Default Wakasek Akademik**: Otomatis terisi **`Ari Raharja S.Pd., Gr.`** secara default.

#### Matriks 3: Surat Akademik — Menggunakan Laboratorium (4 Pihak)
Aktif **secara otomatis** apabila pada `Izin Penggunaan Ruangan`, siswa mencentang salah satu atau lebih dari **`Lab Kimia`**, **`Lab Fisika`**, atau **`Lab Biologi`**:
```text
Mengetahui,                                               Pemohon,
Guru Pendamping



( [Nama Guru Pendamping] )                                ( [Nama Perwakilan Pemohon] )

Menyetujui,                                               Menyetujui,
Laboran [Kimia/Fisika/Biologi]                            Wakil Kepala Sekolah Bidang Akademik



( [Nama Laboran - Input Siswa] )                          ( Ari Raharja S.Pd., Gr. )
```
* **Logika Dinamis Laboran**:
  * Begitu checkbox `Lab Kimia`, `Lab Fisika`, atau `Lab Biologi` dicentang, munculkan input teks wajib `"Nama Laboran"` di dalam form.
  * Label jabatan menyesuaikan lab yang dipilih (misal: `Laboran Kimia`, `Laboran Fisika`, `Laboran Biologi`, atau `Laboran` jika lebih dari satu lab).

### 7.3. Tata Letak Halaman Lampiran (Halaman ke-2)
Jika `modePeserta === 'ATTACHMENT_GT_10'` atau `gunakanTabelRuntutanWaktu === true`, buat halaman kedua (dengan `page-break-before: always` di CSS & `PageBreak` di DOCX):
* Header Lampiran (Rata Kanan Atas, `12pt`):
  ```text
  Lampiran Surat Izin
  Tanggal : [Tanggal Surat]
  Kegiatan : [Nama Kegiatan]
  ```
* Judul Tabel 1 (Jika $>10$ orang): **`DAFTAR NAMA SISWA PEMOHON IZIN`** (`12pt`, **Bold**, Center).
  * Tabel ber-border hitam `1px solid black`, header tabel di-bold:
    * Kesiswaan: `No` | `Nama Lengkap` | `ASPA / ASPI`
    * Akademik: `No` | `Nama Lengkap` | `Kelas`
* Judul Tabel 2 (Jika ada runtutan waktu): **`RUNTUTAN WAKTU DAN JADWAL KEGIATAN`** (`12pt`, **Bold**, Center).
  * Tabel ber-border hitam `1px solid black`, header tabel di-bold:
    * Kolom: `No` | `Hari/Tanggal` | `Waktu` | `Tempat/Ruangan` | `Keterangan Kegiatan`

---

## 8. Panduan Teknis Implementasi Ekspor DOCX & PDF

### 8.1. Implementasi Generator `.docx` (`services/docxGenerator.ts`)
Gunakan package `docx` dan `file-saver`. Pastikan konfigurasi berikut diterapkan secara eksak:
1. **Ukuran Halaman & Margin (dalam Twips, $1\text{ mm} \approx 56.7\text{ twips}$)**:
   * Lebar A4: `11906` twips ($210\text{ mm}$), Tinggi A4: `16838` twips ($297\text{ mm}$).
   * Margin (`top`, `bottom`, `left`, `right`): `1440` twips ($1\text{ inch} = 2.54\text{ cm}$).
2. **Konfigurasi Font & Spasi**:
   * Semua `TextRun` wajib memiliki `font: "Times New Roman"`.
   * Judul Surat: `size: 28` ($14\text{pt}$), `bold: true`, `alignment: AlignmentType.CENTER`, `spacing: { after: 240, line: 360 }`.
   * Isi Surat: `size: 24` ($12\text{pt}$), `spacing: { line: 360 }` (spasi 1.5).
3. **Tabel Rincian Kegiatan & Tabel Tanda Tangan Tanpa Border**:
   * Gunakan `Table` dengan border `BorderStyle.NONE` pada seluruh sisi (`top`, `bottom`, `left`, `right`, `insideHorizontal`, `insideVertical`) agar posisi titik dua (`:`) pada detail kegiatan serta posisi kolom Kiri-Kanan pada blok tanda tangan sejajar sempurna di Microsoft Word maupun Google Docs.
   * Untuk tanda tangan 3 pihak: Buat tabel 2 kolom; baris pertama berisi `Mengetahui, Guru Pendamping` (Kiri) dan `Pemohon` (Kanan); baris kedua gunakan `columnSpan: 2` dengan `AlignmentType.CENTER` untuk `Menyetujui, Pembina Asrama` atau `Wakil Kepala Sekolah Bidang Akademik`.
   * Untuk tanda tangan 4 pihak (Lab): Gunakan 2 kolom pada baris pertama dan 2 kolom pada baris kedua.
4. **Tabel Lampiran (Dengan Border)**:
   * Jika halaman lampiran aktif, tambahkan `new PageBreak()` lalu render `Table` dengan `BorderStyle.SINGLE`, `size: 4`, `color: "000000"`.

### 8.2. Implementasi Generator `.pdf` & Print (`services/pdfGenerator.ts`)
1. **Live Preview A4 Canvas**:
   * Buat kontainer kertas `#a4-document-preview` dengan dimensi CSS eksplisit: `width: 210mm; min-height: 297mm; padding: 25.4mm; background: white; color: black; font-family: 'Times New Roman', Times, serif;`.
   * Meskipun tema aplikasi sedang berada di **Dark Mode**, lembar kertas A4 di dalam *preview* **harus tetap berwarna dasar putih dengan teks hitam** agar merepresentasikan hasil cetak nyata.
2. **Dual PDF Export Mechanism**:
   * **Direct Download PDF**: Gunakan `html2pdf().set({ margin: 0, filename: '...', image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } }).from(element).save()`.
   * **Cetak / Save as PDF Native**: Sediakan juga tombol `"Cetak / Print A4"` yang memanggil `window.print()` dengan aturan `@media print` yang menyembunyikan seluruh sidebar/form dan hanya merender `#a4-document-preview`.

---

## 9. Spesifikasi UI/UX, Tema Visual & Alur Halaman

### 9.1. Desain Visual (Light / Dark Mode + Aksen Del Blue)
* Gunakan palet warna elegan dengan aksen utama **Del Blue** (`#00529B` / `bg-blue-700`, `text-blue-600`, `dark:bg-blue-600`, `dark:text-blue-400`).
* **Light Mode**: Background utama `bg-slate-50`, kartu & panel `bg-white`, border `border-slate-200`, teks `text-slate-900`.
* **Dark Mode**: Background utama `bg-slate-950`, kartu & panel `bg-slate-900`, border `border-slate-800`, teks `text-slate-100`.
* Simpan preferensi tema (`light` / `dark`) di `localStorage`.

### 9.2. Rincian Tiga Menu di Sidebar Samping

#### 1. Menu: Dashboard (Riwayat Surat)
* **Statistik Ringkas (4 Kartu Atas)**:
  * Total Surat Tersimpan
  * Total Surat Kesiswaan
  * Total Surat Akademik
  * Status Profil Siswa (Sudah Lengkap / Belum Diatur + tombol pintas ke Settings)
* **Filter & Pencarian**:
  * Tab filter: `Semua`, `Surat Kesiswaan`, `Surat Akademik`.
  * Search bar berdasarkan nama kegiatan, jenis izin, atau tanggal surat.
* **Daftar Kartu Riwayat Surat**:
  * Menampilkan badge kategori (Biru untuk Akademik, Emerald/Indigo untuk Kesiswaan), judul gabungan surat, nama kegiatan, tanggal pembuatan, jumlah peserta, serta tombol aksi cepat:
    * **Lihat / Preview Modal**
    * **Edit Surat** (membuka kembali data surat di halaman *Buat Surat Baru*)
    * **Download DOCX**
    * **Download PDF**
    * **Duplikat Surat** (memudahkan siswa membuat surat serupa untuk hari berikutnya)
    * **Hapus**

#### 2. Menu: Buat Surat Baru (Split-Screen Builder)
* **Bagian Kiri (Form Terstruktur / Accordion atau Stepper)**:
  * **Bagian 1: Kategori & Jenis Izin**: Pilih `Surat Kesiswaan` atau `Surat Akademik`, lalu centang 1 atau beberapa jenis izin yang diinginkan.
  * **Bagian 2: Informasi Kegiatan & Detail Izin**:
    * Input `Tanggal Surat` (default hari ini).
    * Input `Nama Kegiatan` (mengisi `[INPUT KEGIATAN DARI SISWA]` pada kalimat pembuka).
    * Input spesifik untuk setiap jenis izin yang dicentang (Contoh: jika centang *Izin Bungkus Makan*, muncul checkbox `Pagi`, `Siang`, `Malam`; jika centang *Izin HP*, muncul `Dari Jam` & `Sampai Jam`; jika centang *Izin Ruangan*, muncul checkbox `X-1` s.d. `X-6`, `Lab Kimia`, `Lab Fisika`, `Lab Biologi`, serta opsi ketik ruangan sendiri).
  * **Bagian 3: Data Peserta & Runtutan Waktu**:
    * Radio pilihan: `<= 10 Orang (Di Badan Surat)` vs `> 10 Orang / Banyak Waktu (Halaman Lampiran)`.
    * Tombol **"Autofill berdasarkan Nama Sendiri"** (mengambil Nama, Kelas, dan ASPA/ASPI dari Settings).
    * Jika mode Lampiran aktif: munculkan tombol **Download Template CSV** & **Upload CSV** beserta tabel editor interaktif untuk Daftar Nama dan Runtutan Waktu.
  * **Bagian 4: Pihak Penanda Tangan**:
    * `Nama Pemohon (Perwakilan)` + tombol Autofill dari Settings.
    * `Nama Guru Pendamping (Mengetahui)` (diketik manual, atau terisi otomatis dari default Settings).
    * Jika `Lab Kimia/Fisika/Biologi` dicentang: munculkan input wajib `Nama Laboran`.
    * `Pihak Menyetujui`: Otomatis terisi `Pembina Asrama` (untuk Kesiswaan) atau `Ari Raharja S.Pd., Gr.` (untuk Akademik).
* **Bagian Kanan (Sticky Live Preview A4)**:
  * Menampilkan pratinjau kertas A4 secara *real-time* setiap kali siswa mengetik di form.
  * Dilengkapi kontrol Zoom (`50%`, `75%`, `100%`), navigasi tab `Halaman 1 (Surat Utama)` & `Halaman 2 (Lampiran)`, serta bar tombol utama di bagian atas: **Simpan ke Dashboard**, **Download DOCX**, **Download PDF**, dan **Print**.

#### 3. Menu: Settings (Profil Siswa & Manajemen Data Lokal)
* **Form Profil Siswa (Untuk Fitur Autofill)**:
  * `Nama Lengkap Siswa`
  * `Kelas` (Contoh: `X-1`, `XI-3`, `XII-2`)
  * `Asrama` (Radio/Select: `ASPA` / `ASPI`)
  * `Nama Guru Pendamping Default` (Opsional)
  * Tombol **Simpan Profil**.
* **Manajemen Penyimpanan Browser**:
  * **Export Backup Data (`.json`)**: Mengunduh seluruh profil dan riwayat surat dari `localStorage`.
  * **Import Backup Data (`.json`)**: Memulihkan data dari file JSON.
  * **Hapus Semua Riwayat**: Membersihkan penyimpanan lokal dengan dialog konfirmasi.

---

## 10. Daftar Periksa Eksekusi (Quality Assurance Checklist untuk Agent)

Pastikan sebelum menyelesaikan kode, seluruh poin berikut telah terimplementasi tanpa *placeholder* atau fungsi kosong (`TODO`):
1. [ ] Kalimat pembuka otomatis menggunakan format: *"Sehubung dengan akan diadakannya kegiatan [Kegiatan], saya/kami memohon [daftar izin] untuk keberlangsungan kegiatan yang akan saya/kami lakukan, dengan detail sebagai berikut:"*.
2. [ ] Kalimat penutup otomatis menggunakan format: *"Sekian surat permohonan yang saya/kami berikan, kiranya yang bersangkutan dapat memberikan izin demi kelancaran kegiatan, atas perhatiannya, saya/kami ucapkan terima kasih."*.
3. [ ] Kata ganti `saya` dan `kami` berubah otomatis berdasarkan jumlah peserta ($1$ orang vs $>1$ orang).
4. [ ] Penggabungan surat berfungsi mulus di dalam kategori yang sama (Kesiswaan dengan Kesiswaan, Akademik dengan Akademik) dan memblokir penggabungan lintas kategori.
5. [ ] Posisi tanda tangan otomatis berubah menjadi 4 pihak (menambahkan `Laboran` di kiri bawah berdampingan dengan `Ari Raharja S.Pd., Gr.` di kanan bawah) ketika `Lab Kimia`, `Lab Fisika`, atau `Lab Biologi` dipilih.
6. [ ] Fitur Download Template CSV dan Upload CSV berfungsi 100% di browser untuk daftar nama Akademik (`No, Nama Lengkap, Kelas`), daftar nama Kesiswaan (`No, Nama Lengkap, ASPA / ASPI`), dan tabel Runtutan Waktu.
7. [ ] Ekspor `.docx` dan `.pdf` menghasilkan dokumen A4 tanpa kop surat, judul 14pt Bold Center, isi Times New Roman 12pt spasi 1.5, dan siap cetak.