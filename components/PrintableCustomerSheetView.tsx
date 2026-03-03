// components/PrintableCustomerSheetView.tsx
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Customer } from '../types';
import { exportElementAsPDF } from '../utils/pdfGenerator';
import { generateCustomerSheetHtml } from '../utils/staticSheetGenerator';
import { DownloadIcon } from './icons/DownloadIcon';
import { XIcon } from './icons/XIcon';
import { PrinterIcon } from './icons/PrinterIcon';

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
                        body { 
                            margin: 0; 
                            padding: 0; 
                            background-color: #f4f4f4; 
                            display: flex; 
                            justify-content: center;
                        }
                        .print-button {
                            position: fixed;
                            top: 20px;
                            right: 20px;
                            padding: 10px 20px;
                            background-color: #0d6efd;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            font-family: sans-serif;
                            font-size: 16px;
                            z-index: 10000;
                        }
                        @media print {
                            body { background-color: white; }
                            .print-button { display: none; }
                            @page { margin: 0; size: A4; }
                        }
                    </style>
                </head>
                <body>
                    <button class="print-button" onclick="window.print()">Imprimir</button>
                    ${sheetHtml}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
    }
  }, [sheetHtml, customer.name, showNotification]);


  const handleOpenPdf = useCallback(async () => {
    if (!printContentRef.current) {
      showNotification('Erro: A referência do conteúdo não foi encontrada.', 'error');
      return;
    }
    if (isGenerating) return;

    setIsGenerating(true);
    showNotification('Gerando PDF, por favor aguarde...', 'success');

    try {
      const fileName = `ficha-${customer.name.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      await exportElementAsPDF(printContentRef.current, fileName);
    } catch (error) {
      console.error("PDF generation failed:", error);
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido ao gerar o PDF.';
      showNotification(errorMessage, 'error');
    } finally {
      setIsGenerating(false);
    }
  }, [customer.name, showNotification, isGenerating]);

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/80 z-[100] flex flex-col items-center justify-start p-4 no-print overflow-y-auto" role="dialog" aria-modal="true">
        
        <header className="w-full max-w-5xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-3 shadow-md rounded-t-lg flex justify-between items-center mb-4 print:hidden">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 ml-3">Visualizar Ficha</h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              className="bg-sky-600 text-white font-bold py-2 px-4 rounded-md hover:bg-sky-500 flex items-center gap-2 transition-colors"
            >
              <PrinterIcon className="w-5 h-5" />
              Imprimir
            </button>

            <button 
              onClick={handleOpenPdf}
              disabled={isGenerating} 
              className="bg-[var(--color-primary)] text-[var(--color-primary-text)] font-bold py-2 px-4 rounded-md hover:bg-[var(--color-primary-hover)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-wait transition-colors"
            >
              <DownloadIcon className="w-5 h-5" />
              {isGenerating ? 'Gerando PDF...' : 'Abrir PDF'}
            </button>

            <button 
              onClick={onCancel} 
              disabled={isGenerating} 
              className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 transition-colors"
              aria-label="Fechar"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>
        </header>
        
        <div 
          ref={printContentRef}
          className="a4-container-for-capture bg-white shadow-lg"
          dangerouslySetInnerHTML={{ __html: sheetHtml }}
        >
        </div>

        <style>{`
          .a4-container-for-capture {
            width: 210mm;
            min-height: 297mm;
            padding: 15mm;
            margin: 0 auto;
            background: white;
            box-sizing: border-box;
          }
          @media (max-width: 768px) {
            .a4-container-for-capture {
              width: 90%;
              min-height: 0;
              height: auto; 
              padding: 5%;
              margin-bottom: 2vh;
            }
            .fixed.inset-0 {
              align-items: flex-start;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default PrintableCustomerSheetView;
