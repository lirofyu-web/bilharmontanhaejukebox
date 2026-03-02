
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportElementAsPDF = async (element: HTMLElement, fileName: string): Promise<void> => {
    try {
        const canvas = await html2canvas(element, {
            scale: 2, 
            useCORS: true,
            logging: false,
            backgroundColor: window.getComputedStyle(document.documentElement).getPropertyValue('--color-bg-base') || '#1a202c',
        });

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.9);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        let position = 0;
        let heightLeft = pdfHeight;
        const pageHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
            position = heightLeft - pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= pageHeight;
        }
        
        pdf.save(fileName);

    } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        throw new Error("Falha ao gerar o arquivo PDF. Verifique o console para mais detalhes.");
    }
};

