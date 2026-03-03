/* eslint-disable @typescript-eslint/no-explicit-any */

declare const html2canvas: any;
declare const jspdf: any;

/**
 * Converts an HTML element to a PDF and opens it in a new browser tab.
 * The PDF will be sized to fit the captured element's aspect ratio within an A4 page.
 * @param {HTMLElement} element The HTML element to capture.
 * @param {string} fileName The desired file name for the PDF.
 * @returns {Promise<void>}
 */
export const exportElementAsPDF = (element: HTMLElement, fileName: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    if (!element) {
      return reject(new Error("Elemento para renderização não encontrado."));
    }

    // Ensure jsPDF and html2canvas are loaded
    if (typeof jspdf === 'undefined' || typeof html2canvas === 'undefined') {
        return reject(new Error("As bibliotecas jsPDF ou html2canvas não foram carregadas."));
    }

    try {
      console.log("Iniciando geração de PDF...");

      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        // Improve rendering of text and borders
        onclone: (document) => {
            // You can make adjustments to the cloned document before capture if needed
            // For example, forcing a specific font rendering
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      if (!imgData || imgData === 'data:,') {
        return reject(new Error("Falha ao criar os dados da imagem a partir do canvas."));
      }

      const { jsPDF } = jspdf;
      // PDF page settings (A4 portrait)
      const pdfWidth = 210; // mm
      const pdfHeight = 297; // mm

      // Image dimensions
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;

      // Calculate the best fit for the image on the A4 page
      let finalImgWidth = pdfWidth;
      let finalImgHeight = finalImgWidth / ratio;

      if (finalImgHeight > pdfHeight) {
        finalImgHeight = pdfHeight;
        finalImgWidth = finalImgHeight * ratio;
      }

      // Center the image on the page
      const x = (pdfWidth - finalImgWidth) / 2;
      const y = 0; // Align to the top

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      doc.addImage(imgData, 'PNG', x, y, finalImgWidth, finalImgHeight);

      // Open the PDF in a new tab
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      const newWindow = window.open(pdfUrl, '_blank');
      if (newWindow) {
        console.log("PDF aberto em nova aba com sucesso.");
        URL.revokeObjectURL(pdfUrl); // Clean up the object URL
        resolve();
      } else {
        reject(new Error("Não foi possível abrir o PDF. Verifique se o seu navegador está bloqueando pop-ups."));
      }

    } catch (error) {
      console.error("Ocorreu um erro durante a geração do PDF:", error);
      const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro crítico ao gerar o PDF.";
      reject(new Error(errorMessage));
    }
  });
};
