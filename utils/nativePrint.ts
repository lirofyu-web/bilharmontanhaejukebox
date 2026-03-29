import { Capacitor } from '@capacitor/core';
import { Printer } from '@capgo/capacitor-printer';

/**
 * Bridges the gap between Web and Native printing.
 * On Android (Capacitor), it uses the system print manager.
 * On Web, it falls back to standard behavior.
 */
export const nativePrintPDF = async (content: string, fileName: string): Promise<void> => {
  const trimmedContent = content.trim();
  if (Capacitor.isNativePlatform()) {
    try {
      if (trimmedContent.startsWith('<html>') || trimmedContent.startsWith('<!DOCTYPE')) {
        await Printer.printHtml({ html: trimmedContent, name: fileName });
      } else if (trimmedContent.startsWith('JVBERi') || trimmedContent.match(/^[A-Za-z0-9+/=]+$/)) { // PDF base64 magic bytes
        await Printer.printBase64({ data: trimmedContent, mimeType: 'application/pdf', name: fileName });
      } else {
        await Printer.printPdf({ path: trimmedContent, name: fileName });
      }
      return;
    } catch (error) {
      console.error('Erro na impressão nativa:', error);
      throw new Error(`Falha ao abrir o Gerenciador de Impressão do Android: ${error}`);
    }
  } else {
    // Web fallback
    if (trimmedContent.startsWith('<html>') || trimmedContent.startsWith('<!DOCTYPE')) {
        const printWindow = window.open('', '', 'height=800,width=400');
        if (printWindow) {
            printWindow.document.write(trimmedContent);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => { printWindow.print(); }, 500);
        }
    } else if (trimmedContent.startsWith('JVBERi') || trimmedContent.match(/^[A-Za-z0-9+/=]+$/)) {
        // Fallback for base64 in web (create a blob)
        const byteCharacters = atob(trimmedContent);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i);
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 5000);
    } else {
        window.open(trimmedContent, '_blank');
    }
  }
};
