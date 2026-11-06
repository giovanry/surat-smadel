export const pdfGenerator = {
  printA4Document(): void {
    window.print();
  },

  async downloadElementAsPdf(elementId: string, filename: string): Promise<boolean> {
    const previewElement = document.getElementById(elementId);
    if (!previewElement) {
      window.print();
      return false;
    }

    try {
      // Dynamic import html2pdf.js
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = (html2pdfModule as any).default || html2pdfModule;

      // 1. Simpan gaya asli elemen sebelum capture
      const originalTransform = previewElement.style.transform;
      const originalTransition = previewElement.style.transition;

      // 2. Tampilkan semua halaman yang sedang disembunyikan oleh tab filter (Hal 1 / Hal 2)
      const hiddenPages = Array.from(previewElement.querySelectorAll<HTMLElement>('.hidden'));
      hiddenPages.forEach((el) => el.classList.remove('hidden'));

      // 3. Matikan sementara zoom scale agar ukuran murni 1:1 (210mm x 297mm)
      // Ini menyelesaikan masalah PDF kosong (karena koordinat -99999px)
      // dan margin ganda (karena zoom scale 0.85).
      previewElement.style.transition = 'none';
      previewElement.style.transform = 'none';

      // 4. Bersihkan sementara shadow dan margin antar halaman
      const shadowElements = Array.from(previewElement.querySelectorAll<HTMLElement>('.shadow-2xl, .shadow-md'));
      const removedShadowEls: HTMLElement[] = [];
      shadowElements.forEach((el) => {
        el.classList.remove('shadow-2xl', 'shadow-md');
        removedShadowEls.push(el);
      });

      const cleanFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;

      const opt = {
        margin: 0,
        filename: cleanFilename,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false,
          scrollY: 0,
          scrollX: 0,
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
        },
        pagebreak: { mode: ['css', 'legacy'] },
      };

      try {
        await html2pdf().set(opt).from(previewElement).save();
      } finally {
        // 5. Kembalikan kondisi tampilan preview ke semula
        previewElement.style.transform = originalTransform;
        previewElement.style.transition = originalTransition;
        hiddenPages.forEach((el) => el.classList.add('hidden'));
        removedShadowEls.forEach((el) => el.classList.add('shadow-md'));
      }

      return true;
    } catch (err) {
      console.error('Gagal generate PDF via html2pdf, beralih ke print dialog:', err);
      window.print();
      return true;
    }
  },
};
