export const pdfGenerator = {
  printA4Document(): void {
    window.print();
  },

  async downloadElementAsPdf(elementId: string, filename: string): Promise<boolean> {
    const element = document.getElementById(elementId);
    if (!element) {
      alert('Elemen dokumen tidak ditemukan.');
      return false;
    }

    try {
      // Dynamic import html2pdf.js
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = (html2pdfModule as any).default || html2pdfModule;

      const opt = {
        margin: 0,
        filename: filename.endsWith('.pdf') ? filename : `${filename}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false,
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
        },
        pagebreak: { mode: ['css', 'legacy'] },
      };

      await html2pdf().set(opt).from(element).save();
      return true;
    } catch {
      window.print();
      return true;
    }
  },
};
