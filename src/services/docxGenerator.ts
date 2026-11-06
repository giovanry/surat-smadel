import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  PageBreak,
  Packer,
} from 'docx';
import { saveAs } from 'file-saver';
import { LetterDocument } from '../types/letter';
import {
  formatDateIndonesian,
  formatLetterTitle,
  generateOpeningSentence,
  generateClosingSentence,
  formatTimeSlotsToSummary,
} from './letterTextEngine';

export async function exportLetterToDocx(doc: LetterDocument): Promise<void> {
  const isKesiswaan = doc.kategori === 'KESISWAAN';
  const title = formatLetterTitle(doc.jenisIzinTerpilih);

  // Baris Titi Mangsa (bisa diedit pengguna)
  const tanggalSuratFormatted =
    doc.customLokasiTanggalSurat && doc.customLokasiTanggalSurat.trim() !== ''
      ? doc.customLokasiTanggalSurat
      : `Laguboti, ${formatDateIndonesian(doc.tanggalSurat)}`;

  const openingText = generateOpeningSentence(doc);
  const closingText = generateClosingSentence(doc);
  const slotsSummary = formatTimeSlotsToSummary(doc.detailIzin.daftarWaktuIzin);

  const FONT_NAME = 'Times New Roman';

  // 1. Title Paragraph
  const titleParagraph = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 200, line: 360 },
    children: [
      new TextRun({
        text: title,
        font: FONT_NAME,
        size: 28, // 14pt
        bold: true,
      }),
    ],
  });

  // 2. Date Paragraph (Right Aligned: Laguboti, XX XXXX XXXX)
  const dateParagraph = new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { after: 200, line: 360 },
    children: [
      new TextRun({
        text: tanggalSuratFormatted,
        font: FONT_NAME,
        size: 24, // 12pt
      }),
    ],
  });

  // 3. Recipient Block (Yth. dipisah baris dengan jabatan)
  const recipientParagraphs = [
    new Paragraph({
      spacing: { line: 360 },
      children: [
        new TextRun({
          text: 'Yth.',
          font: FONT_NAME,
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      spacing: { line: 360 },
      children: [
        new TextRun({
          text: isKesiswaan
            ? 'Pembina Asrama SMA Unggul Del'
            : 'Wakil Kepala Sekolah Bidang Akademik',
          font: FONT_NAME,
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 240, line: 360 },
      children: [
        new TextRun({
          text: 'Di Tempat',
          font: FONT_NAME,
          size: 24,
        }),
      ],
    }),
  ];

  // 4. Salutation & Opening
  const salutationParagraph = new Paragraph({
    spacing: { after: 120, line: 360 },
    children: [
      new TextRun({
        text: 'Dengan hormat,',
        font: FONT_NAME,
        size: 24,
      }),
    ],
  });

  const openingParagraph = new Paragraph({
    alignment: AlignmentType.BOTH,
    spacing: { after: 200, line: 360 },
    children: [
      new TextRun({
        text: openingText,
        font: FONT_NAME,
        size: 24,
      }),
    ],
  });

  // 5. Activity Detail Rows
  const detailRows: TableRow[] = [];

  const createDetailRow = (label: string, value: string) => {
    return new TableRow({
      children: [
        new TableCell({
          width: { size: 2600, type: WidthType.DXA },
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
          },
          children: [
            new Paragraph({
              spacing: { line: 360 },
              children: [
                new TextRun({ text: label, font: FONT_NAME, size: 24 }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 400, type: WidthType.DXA },
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
          },
          children: [
            new Paragraph({
              spacing: { line: 360 },
              children: [new TextRun({ text: ':', font: FONT_NAME, size: 24 })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 6026, type: WidthType.DXA },
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
          },
          children: [
            new Paragraph({
              spacing: { line: 360 },
              children: [new TextRun({ text: value, font: FONT_NAME, size: 24 })],
            }),
          ],
        }),
      ],
    });
  };

  if (doc.gunakanTabelRuntutanWaktu) {
    detailRows.push(createDetailRow('Hari, Tanggal', 'Terlampir'));
    detailRows.push(createDetailRow('Waktu & Tempat', 'Terlampir pada halaman lampiran'));
  } else {
    // Hari Tanggal
    detailRows.push(
      createDetailRow(
        'Hari, Tanggal',
        slotsSummary.dateText ||
          doc.detailIzin.hariTanggalKegiatan ||
          formatDateIndonesian(doc.tanggalSurat)
      )
    );

    // Waktu
    if (slotsSummary.timeText) {
      detailRows.push(createDetailRow('Waktu', slotsSummary.timeText));
    } else {
      const timeDetails: string[] = [];
      if (doc.detailIzin.hpWaktuMulai || doc.detailIzin.hpWaktuSelesai) {
        timeDetails.push(
          `Penggunaan HP (${doc.detailIzin.hpWaktuMulai || ''} - ${doc.detailIzin.hpWaktuSelesai || ''})`
        );
      }
      if (doc.detailIzin.briefingWaktu) {
        timeDetails.push(`Briefing (${doc.detailIzin.briefingWaktu})`);
      }
      if (doc.detailIzin.terlambatJamMasuk) {
        timeDetails.push(`Jam Masuk Asrama (${doc.detailIzin.terlambatJamMasuk})`);
      }
      if (doc.detailIzin.kurveSesiWaktu) {
        timeDetails.push(`Kurve (${doc.detailIzin.kurveSesiWaktu})`);
      }
      if (doc.detailIzin.malamWaktuMulai || doc.detailIzin.malamWaktuSelesai) {
        timeDetails.push(
          `Aktivitas Malam (${doc.detailIzin.malamWaktuMulai || ''} - ${doc.detailIzin.malamWaktuSelesai || ''})`
        );
      }
      if (doc.detailIzin.silentWaktuMulai || doc.detailIzin.silentWaktuSelesai) {
        timeDetails.push(
          `Lewat Jam Silent (${doc.detailIzin.silentWaktuMulai || ''} - ${doc.detailIzin.silentWaktuSelesai || ''})`
        );
      }
      if (doc.detailIzin.laptopWaktuMulai || doc.detailIzin.laptopWaktuSelesai) {
        timeDetails.push(
          `Penggunaan Laptop (${doc.detailIzin.laptopWaktuMulai || ''} - ${doc.detailIzin.laptopWaktuSelesai || ''})`
        );
      }
      if (doc.detailIzin.ruanganWaktuMulai || doc.detailIzin.ruanganWaktuSelesai) {
        timeDetails.push(
          `Penggunaan Ruangan (${doc.detailIzin.ruanganWaktuMulai || ''} - ${doc.detailIzin.ruanganWaktuSelesai || ''})`
        );
      }

      if (timeDetails.length > 0) {
        detailRows.push(createDetailRow('Waktu', timeDetails.join('; ')));
      }
    }

    // Tempat / Ruangan
    const rooms = [...(doc.detailIzin.ruanganPilihan || [])];
    if (doc.detailIzin.ruanganCustom) {
      rooms.push(doc.detailIzin.ruanganCustom as any);
    }
    if (doc.detailIzin.malamTempat) rooms.push(doc.detailIzin.malamTempat as any);
    if (doc.detailIzin.silentTempat) rooms.push(doc.detailIzin.silentTempat as any);
    if (doc.detailIzin.tempatKegiatanUmum) rooms.push(doc.detailIzin.tempatKegiatanUmum as any);

    if (rooms.length > 0) {
      detailRows.push(createDetailRow('Tempat / Ruangan', rooms.join(', ')));
    }

    // Sesi Makan
    if (doc.detailIzin.bungkusSesiMakan && doc.detailIzin.bungkusSesiMakan.length > 0) {
      let makanVal = doc.detailIzin.bungkusSesiMakan.join(', ');
      if (doc.detailIzin.bungkusNamaPembungkus) {
        makanVal += ` (Dibungkuskan oleh: ${doc.detailIzin.bungkusNamaPembungkus})`;
      }
      detailRows.push(createDetailRow('Sesi Makan', makanVal));
    }
  }

  // Participants representation in body
  if (doc.modePeserta === 'ATTACHMENT_GT_10') {
    detailRows.push(
      createDetailRow(
        'Peserta / Pemohon',
        `Terlampir (sebanyak ${doc.daftarPeserta.length} orang siswa)`
      )
    );
  } else {
    if (doc.daftarPeserta.length === 1) {
      const p = doc.daftarPeserta[0];
      detailRows.push(createDetailRow('Nama', p.namaLengkap));
      if (isKesiswaan) {
        detailRows.push(createDetailRow('Asrama', p.asrama));
      } else {
        detailRows.push(createDetailRow('Kelas', p.kelas));
      }
    }
  }

  const detailTable = new Table({
    width: { size: 9026, type: WidthType.DXA },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: detailRows,
  });

  // Multiple participants list
  const participantListParagraphs: Paragraph[] = [];
  if (doc.modePeserta === 'INLINE_LTE_10' && doc.daftarPeserta.length > 1) {
    participantListParagraphs.push(
      new Paragraph({
        spacing: { before: 140, after: 100, line: 360 },
        children: [
          new TextRun({
            text: 'Adapun daftar siswa yang memohon izin tersebut adalah:',
            font: FONT_NAME,
            size: 24,
          }),
        ],
      })
    );
    doc.daftarPeserta.forEach((p, idx) => {
      const info = isKesiswaan ? `(${p.asrama})` : `(Kelas ${p.kelas})`;
      participantListParagraphs.push(
        new Paragraph({
          spacing: { line: 360 },
          indent: { left: 360 },
          children: [
            new TextRun({
              text: `${idx + 1}. ${p.namaLengkap} ${info}`,
              font: FONT_NAME,
              size: 24,
            }),
          ],
        })
      );
    });
  }

  // 6. Closing Paragraph
  const closingParagraph = new Paragraph({
    alignment: AlignmentType.BOTH,
    spacing: { before: 200, after: 280, line: 360 },
    children: [
      new TextRun({
        text: closingText,
        font: FONT_NAME,
        size: 24,
      }),
    ],
  });

  // 7. Signature Table
  const signatureRows: TableRow[] = [];
  const namaPemohon = doc.tandaTangan.namaPemohon || doc.daftarPeserta[0]?.namaLengkap || 'Pemohon';
  const namaGuru = doc.tandaTangan.namaGuruPendamping || '............................';

  // Row 1: Mengetahui & Pemohon
  signatureRows.push(
    new TableRow({
      children: [
        new TableCell({
          width: { size: 4513, type: WidthType.DXA },
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
          },
          children: [
            new Paragraph({
              spacing: { line: 360 },
              children: [new TextRun({ text: 'Mengetahui,', font: FONT_NAME, size: 24 })],
            }),
            new Paragraph({
              spacing: { line: 360 },
              children: [new TextRun({ text: 'Guru Pendamping', font: FONT_NAME, size: 24 })],
            }),
            new Paragraph({ spacing: { line: 360 }, children: [new TextRun({ text: '', font: FONT_NAME })] }),
            new Paragraph({ spacing: { line: 360 }, children: [new TextRun({ text: '', font: FONT_NAME })] }),
            new Paragraph({ spacing: { line: 360 }, children: [new TextRun({ text: '', font: FONT_NAME })] }),
            new Paragraph({
              spacing: { line: 360 },
              children: [new TextRun({ text: `( ${namaGuru} )`, font: FONT_NAME, size: 24 })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 4513, type: WidthType.DXA },
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              spacing: { line: 360 },
              children: [new TextRun({ text: 'Pemohon,', font: FONT_NAME, size: 24 })],
            }),
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              spacing: { line: 360 },
              children: [new TextRun({ text: '', font: FONT_NAME, size: 24 })],
            }),
            new Paragraph({ spacing: { line: 360 }, children: [new TextRun({ text: '', font: FONT_NAME })] }),
            new Paragraph({ spacing: { line: 360 }, children: [new TextRun({ text: '', font: FONT_NAME })] }),
            new Paragraph({ spacing: { line: 360 }, children: [new TextRun({ text: '', font: FONT_NAME })] }),
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              spacing: { line: 360 },
              children: [new TextRun({ text: `( ${namaPemohon} )`, font: FONT_NAME, size: 24 })],
            }),
          ],
        }),
      ],
    })
  );

  // Row 2: Approvers
  if (doc.tandaTangan.butuhTtdLaboran) {
    const labTitle = doc.tandaTangan.jenisLab
      ? `Laboran ${doc.tandaTangan.jenisLab}`
      : 'Laboran';
    const namaLaboran = doc.tandaTangan.namaLaboran || '............................';
    const namaWakasek = doc.tandaTangan.namaWakasekAkademik || 'Ari Raharja S.Pd., Gr.';

    signatureRows.push(
      new TableRow({
        children: [
          new TableCell({
            width: { size: 4513, type: WidthType.DXA },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                spacing: { before: 240, line: 360 },
                children: [new TextRun({ text: 'Menyetujui,', font: FONT_NAME, size: 24 })],
              }),
              new Paragraph({
                spacing: { line: 360 },
                children: [new TextRun({ text: labTitle, font: FONT_NAME, size: 24 })],
              }),
              new Paragraph({ spacing: { line: 360 }, children: [new TextRun({ text: '', font: FONT_NAME })] }),
              new Paragraph({ spacing: { line: 360 }, children: [new TextRun({ text: '', font: FONT_NAME })] }),
              new Paragraph({ spacing: { line: 360 }, children: [new TextRun({ text: '', font: FONT_NAME })] }),
              new Paragraph({
                spacing: { line: 360 },
                children: [new TextRun({ text: `( ${namaLaboran} )`, font: FONT_NAME, size: 24 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 4513, type: WidthType.DXA },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 240, line: 360 },
                children: [new TextRun({ text: 'Menyetujui,', font: FONT_NAME, size: 24 })],
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { line: 360 },
                children: [
                  new TextRun({
                    text: 'Wakil Kepala Sekolah Bidang Akademik',
                    font: FONT_NAME,
                    size: 24,
                  }),
                ],
              }),
              new Paragraph({ spacing: { line: 360 }, children: [new TextRun({ text: '', font: FONT_NAME })] }),
              new Paragraph({ spacing: { line: 360 }, children: [new TextRun({ text: '', font: FONT_NAME })] }),
              new Paragraph({ spacing: { line: 360 }, children: [new TextRun({ text: '', font: FONT_NAME })] }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { line: 360 },
                children: [new TextRun({ text: `( ${namaWakasek} )`, font: FONT_NAME, size: 24 })],
              }),
            ],
          }),
        ],
      })
    );
  } else {
    const approverRole = isKesiswaan
      ? 'Pembina Asrama'
      : 'Wakil Kepala Sekolah Bidang Akademik';
    const approverName = isKesiswaan
      ? doc.tandaTangan.namaPembinaAsrama || 'Pembina Asrama'
      : doc.tandaTangan.namaWakasekAkademik || 'Ari Raharja S.Pd., Gr.';

    signatureRows.push(
      new TableRow({
        children: [
          new TableCell({
            columnSpan: 2,
            width: { size: 9026, type: WidthType.DXA },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 240, line: 360 },
                children: [new TextRun({ text: 'Menyetujui,', font: FONT_NAME, size: 24 })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { line: 360 },
                children: [new TextRun({ text: approverRole, font: FONT_NAME, size: 24 })],
              }),
              new Paragraph({ spacing: { line: 360 }, children: [new TextRun({ text: '', font: FONT_NAME })] }),
              new Paragraph({ spacing: { line: 360 }, children: [new TextRun({ text: '', font: FONT_NAME })] }),
              new Paragraph({ spacing: { line: 360 }, children: [new TextRun({ text: '', font: FONT_NAME })] }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { line: 360 },
                children: [new TextRun({ text: `( ${approverName} )`, font: FONT_NAME, size: 24 })],
              }),
            ],
          }),
        ],
      })
    );
  }

  const signatureTable = new Table({
    width: { size: 9026, type: WidthType.DXA },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: signatureRows,
  });

  // Halaman 1 Children
  const docChildren: (Paragraph | Table)[] = [
    titleParagraph,
    dateParagraph,
    ...recipientParagraphs,
    salutationParagraph,
    openingParagraph,
    detailTable,
    ...participantListParagraphs,
    closingParagraph,
    signatureTable,
  ];

  // Halaman 2: Lampiran (Jika GT_10 atau Jadwal Aktif)
  const hasAttachment =
    doc.modePeserta === 'ATTACHMENT_GT_10' || doc.gunakanTabelRuntutanWaktu;

  if (hasAttachment) {
    docChildren.push(new Paragraph({ children: [new PageBreak()] }));

    // Header Lampiran Kanan Atas
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { line: 360 },
        children: [
          new TextRun({ text: 'Lampiran Surat Izin', font: FONT_NAME, size: 24, bold: true }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { line: 360 },
        children: [
          new TextRun({
            text: `Tanggal : ${formatDateIndonesian(doc.tanggalSurat)}`,
            font: FONT_NAME,
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 280, line: 360 },
        children: [
          new TextRun({
            text: `Kegiatan : ${doc.detailIzin.namaKegiatan || '-'}`,
            font: FONT_NAME,
            size: 24,
          }),
        ],
      })
    );

    // Lampiran 1: Daftar Nama Peserta (> 10 orang)
    if (doc.modePeserta === 'ATTACHMENT_GT_10') {
      docChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100, after: 180, line: 360 },
          children: [
            new TextRun({
              text: 'DAFTAR NAMA SISWA PEMOHON IZIN',
              font: FONT_NAME,
              size: 24,
              bold: true,
            }),
          ],
        })
      );

      const participantRows: TableRow[] = [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 1000, type: WidthType.DXA },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: 'No', font: FONT_NAME, size: 24, bold: true })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 5526, type: WidthType.DXA },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: 'Nama Lengkap', font: FONT_NAME, size: 24, bold: true })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 2500, type: WidthType.DXA },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: isKesiswaan ? 'ASPA / ASPI' : 'Kelas',
                      font: FONT_NAME,
                      size: 24,
                      bold: true,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ];

      doc.daftarPeserta.forEach((p, index) => {
        participantRows.push(
          new TableRow({
            children: [
              new TableCell({
                width: { size: 1000, type: WidthType.DXA },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: String(index + 1), font: FONT_NAME, size: 24 })],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 5526, type: WidthType.DXA },
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: p.namaLengkap, font: FONT_NAME, size: 24 })],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 2500, type: WidthType.DXA },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: isKesiswaan ? p.asrama : p.kelas,
                        font: FONT_NAME,
                        size: 24,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          })
        );
      });

      docChildren.push(
        new Table({
          width: { size: 9026, type: WidthType.DXA },
          rows: participantRows,
        })
      );
    }

    // Lampiran 2: Runtutan Waktu
    if (doc.gunakanTabelRuntutanWaktu) {
      docChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 240, after: 180, line: 360 },
          children: [
            new TextRun({
              text: 'RUNTUTAN WAKTU DAN JADWAL KEGIATAN',
              font: FONT_NAME,
              size: 24,
              bold: true,
            }),
          ],
        })
      );

      const scheduleRows: TableRow[] = [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 600, type: WidthType.DXA },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: 'No', font: FONT_NAME, size: 24, bold: true })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 2200, type: WidthType.DXA },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: 'Hari/Tanggal', font: FONT_NAME, size: 24, bold: true })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 2000, type: WidthType.DXA },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: 'Waktu', font: FONT_NAME, size: 24, bold: true })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 1826, type: WidthType.DXA },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: 'Tempat', font: FONT_NAME, size: 24, bold: true })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 2400, type: WidthType.DXA },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: 'Keterangan', font: FONT_NAME, size: 24, bold: true })],
                }),
              ],
            }),
          ],
        }),
      ];

      doc.daftarJadwal.forEach((sch, index) => {
        scheduleRows.push(
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: String(index + 1), font: FONT_NAME, size: 24 })],
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: sch.hariTanggal, font: FONT_NAME, size: 24 })],
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: sch.waktuMulaiSelesai, font: FONT_NAME, size: 24 })],
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: sch.tempatRuangan, font: FONT_NAME, size: 24 })],
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: sch.keteranganKegiatan, font: FONT_NAME, size: 24 })],
                  }),
                ],
              }),
            ],
          })
        );
      });

      docChildren.push(
        new Table({
          width: { size: 9026, type: WidthType.DXA },
          rows: scheduleRows,
        })
      );
    }
  }

  const docxFile = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 11906,
              height: 16838,
            },
            margin: {
              top: 1440,
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        children: docChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(docxFile);
  const cleanTitle = title.replace(/\s+/g, '_').toLowerCase();
  saveAs(blob, `${cleanTitle}_${doc.tanggalSurat}.docx`);
}
