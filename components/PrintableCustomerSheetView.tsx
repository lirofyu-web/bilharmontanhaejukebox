// components/PrintableCustomerSheetView.tsx
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Customer } from '../types';
import { generateCustomerSheetHtml } from '../utils/staticSheetGenerator';
import { DownloadIcon } from './icons/DownloadIcon';
import { XIcon } from './icons/XIcon';
import { DocumentDuplicateIcon } from './icons/DocumentDuplicateIcon';
import { exportElementAsPDF } from '../utils/pdfGenerator';

interface PrintableCustomerSheetViewProps {
  customer: Customer;
  onCancel: () => void;
  showNotification: (message: string, type?: 'success' | 'error') => void;
}

const PrintableCustomerSheetView: React.FC<PrintableCustomerSheetViewProps> = ({ customer, onCancel, showNotification }) => {
  const printContentRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sheetHtml, setSheetHtml] = useState('');

  useEffect(() => {
    if (customer) {
      const html = generateCustomerSheetHtml(customer);
      setSheetHtml(html);
    }
  }, [customer]);

  const handlePrint = useCallback(() => {
    if (!sheetHtml) {
      showNotification('Conteúdo não encontrado para impressão.', 'error');
      return;
    }

    const printWindow = window.open('', '', 'height=800,width=1000');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Ficha de Cadastro - ${customer.name}</title>
            <style>
              body { font-family: 'Courier New', Courier, monospace; }
              @media print {
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                .no-print { display: none; }
                @page { margin: 0; size: A4; }
              }
            </style>
          </head>
          <body>
            ${sheetHtml}
            <script>
              setTimeout(() => { window.print(); }, 500);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
    } else {
      showNotification('Por favor, habilite pop-ups para imprimir.', 'error');
    }
  }, [sheetHtml, customer.name, showNotification]);

  const handleOpenPdf = useCallback(async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    showNotification('Gerando PDF, por favor aguarde...', 'success');
    
    // Use o HTML já gerado, que será renderizado no DOM oculto para captura
    const container = document.createElement('div');
    container.innerHTML = sheetHtml;
    document.body.appendChild(container);

    try {
      const fileName = `ficha-${customer.name.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      // O elemento a ser capturado é o primeiro filho do container
      await exportElementAsPDF(container.firstChild as HTMLElement, fileName);
    } catch (error) {
      console.error("PDF generation failed:", error);
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
      showNotification(`Falha ao gerar PDF: ${errorMessage}`, 'error');
    } finally {
      document.body.removeChild(container);
      setIsGenerating(false);
    }
  }, [customer.name, sheetHtml, showNotification, isGenerating]);

  return (
    <div className="fixed inset-0 bg-slate-900/80 z-[100] flex flex-col items-center justify-start p-4 no-print overflow-y-auto" role="dialog">
      <header className="w-full max-w-5xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-3 shadow-md rounded-t-lg flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 ml-3">Visualizar Ficha</h3>
        <div className="flex items-center gap-2">
          <button onClick={handlePrint} className="bg-sky-600 text-white font-bold py-2 px-4 rounded-md hover:bg-sky-500 flex items-center gap-2 transition-colors">
            <DocumentDuplicateIcon className="w-5 h-5" />
            Imprimir
          </button>
          <button onClick={handleOpenPdf} disabled={isGenerating} className="bg-primary text-primary-text font-bold py-2 px-4 rounded-md hover:bg-primary-hover flex items-center gap-2 disabled:opacity-50 transition-colors">
            <DownloadIcon className="w-5 h-5" />
            {isGenerating ? 'Gerando PDF...' : 'Baixar PDF'}
          </button>
          <button onClick={onCancel} disabled={isGenerating} className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 transition-colors" aria-label="Fechar">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
      </header>
      
      <div ref={printContentRef} className="a4-container-for-capture bg-white shadow-lg" dangerouslySetInnerHTML={{ __html: sheetHtml }} />
      
      <style>{`
        .a4-container-for-capture {
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          background: white;
          box-sizing: border-box;
        }
        @media (max-width: 768px) {
            .a4-container-for-capture {
              width: 95%;
              min-height: 0;
              height: auto; 
              margin-bottom: 2vh;
            }
        }
      `}</style>
    </div>
  );
};

export default PrintableCustomerSheetView;
