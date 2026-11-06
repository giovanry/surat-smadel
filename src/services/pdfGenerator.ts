export const pdfGenerator = {
  printA4Document(): void {
    window.print();
  },

  async downloadElementAsPdf(elementId: string, filename: string): Promise<boolean> {
    const sourceElement = document.getElementById(elementId);
    if (!sourceElement) {
      alert('Elemen dokumen tidak ditemukan.');
      return false;
    }

    try {
      // Dynamic import html2pdf.js
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = (html2pdfModule as any).default || html2pdfModule;

      // 1. Buat kontainer sandbox terisolasi murni 1:1 A4
      // Ini menyelesaikan masalah margin ganda yang disebabkan oleh CSS scale(zoom),
      // shadow-2xl, dan margin preview UI pada DOM langsung.
      const printSandbox = document.createElement('div');
      printSandbox.id = 'pdf-render-sandbox';
      printSandbox.style.position = 'fixed';
      printSandbox.style.left = '-99999px';
      printSandbox.style.top = '0';
      printSandbox.style.width = '210mm';
      printSandbox.style.margin = '0';
      printSandbox.style.padding = '0';
      printSandbox.style.background = '#ffffff';
      printSandbox.style.zIndex = '-99999';

      // 2. Ambil semua halaman A4 (.a4-page)
      const pageElements = sourceElement.querySelectorAll('.a4-page');

      if (pageElements.length === 0) {
        const clone = sourceElement.cloneNode(true) as HTMLElement;
        clone.style.transform = 'none';
        clone.style.margin = '0';
        printSandbox.appendChild(clone);
      } else {
        pageElements.forEach((page, index) => {
          const pageClone = page.cloneNode(true) as HTMLElement;

          // Hapus semua class UI preview yang mengganggu ukuran & margin
          pageClone.classList.remove('shadow-2xl', 'rounded-sm', 'mb-8', 'mt-8', 'hidden');

          // Terapkan ukuran murni A4 1:1 tanpa zoom
          pageClone.style.transform = 'none';
          pageClone.style.margin = '0';
          pageClone.style.boxShadow = 'none';
          pageClone.style.width = '210mm';
          pageClone.style.minHeight = '297mm';
          pageClone.style.height = '297mm';
          pageClone.style.maxHeight = '297mm';
          pageClone.style.padding = '25.4mm';
          pageClone.style.boxSizing = 'border-box';
          pageClone.style.overflow = 'hidden';
          pageClone.style.background = '#ffffff';

          if (index > 0) {
            pageClone.style.pageBreakBefore = 'always';
            pageClone.style.breakBefore = 'page';
          }

          printSandbox.appendChild(pageClone);
        });
      }

      document.body.appendChild(printSandbox);

      const opt = {
        margin: 0,
        filename: filename.endsWith('.pdf') ? filename : `${filename}.pdf`,
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

      await html2pdf().set(opt).from(printSandbox).save();

      // Bersihkan sandbox dari DOM
      document.body.removeChild(printSandbox);
      return true;
    } catch (err) {
      console.error('Gagal membuat PDF otomatis, beralih ke print dialog:', err);
      window.print();
      return true;
    }
  },
};
