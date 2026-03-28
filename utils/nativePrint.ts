import { Capacitor } from '@capacitor/core';
import { Printer } from '@capgo/capacitor-printer';

/**
 * Bridges the gap between Web and Native printing.
 * On Android (Capacitor), it uses the system print manager.
 * On Web, it falls back to standard behavior.
 */
export const nativePrintPDF = async (content: string, fileName: string): Promise<void> => {
  if (Capacitor.isNativePlatform()) {
    try {
      // Check if it's HTML content or a PDF/URL link
      if (content.startsWith('<html>') || content.startsWith('<!DOCTYPE')) {
        await Printer.printHtml({
            html: content,
            name: fileName
        });
      } else {
        await Printer.printPdf({
            path: content,
            name: fileName
        });
      }
      return;
    } catch (error) {
      console.error('Erro na impressão nativa:', error);
      throw new Error('Falha ao abrir o Gerenciador de Impressão do Android.');
    }
  } else {
    // Web fallback: Try to open/print
    if (content.startsWith('<html>') || content.startsWith('<!DOCTYPE')) {
        const printWindow = window.open('', '', 'height=800,width=400');
        if (printWindow) {
            printWindow.document.write(content);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => { printWindow.print(); }, 500);
        }
    } else {
        window.open(content, '_blank');
    }
  }
};
