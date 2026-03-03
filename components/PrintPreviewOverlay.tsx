// components/PrintPreviewOverlay.tsx
import React, { useRef, useState } from 'react';
import { Customer } from '../types';
import { exportElementAsPDF } from '../utils/pdfGenerator';
import { DownloadIcon } from './icons/DownloadIcon';
import CustomerSheet from './CustomerSheet';

interface PrintPreviewOverlayProps {
  customer: Customer;
  onCancel: () => void;
  showNotification: (message: string, type?: 'success' | 'error') => void;
}

const PrintPreviewOverlay: React.FC<PrintPreviewOverlayProps> = ({ customer, onCancel, showNotification }) => {
  const printContentRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPdf = async () => {
    if (!printContentRef.current || isGenerating) return;
    
    setIsGenerating(true);
    showNotification('Gerando PDF, por favor aguarde...', 'success');

    try {
      // Temporarily adjust styles for PDF generation for better quality
      const element = printContentRef.current;
      element.style.width = '210mm'; // A4 width
      element.style.height = '297mm'; // A4 height

      const fileName = `ficha-${customer.name.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      await exportElementAsPDF(element, fileName);
      
      // Revert styles
      element.style.width = '';
      element.style.height = '';

      showNotification('PDF gerado e download iniciado!', 'success');
    } catch (error) {
      console.error("PDF generation error:", error);
      showNotification(error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.', 'error');
    } finally {
      setIsGenerating(false);
      onCancel(); 
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-200 dark:bg-slate-900 z-[100] flex flex-col no-print p-4 sm:p-6 md:p-8">
      <header className="sticky top-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl shadow-lg flex justify-center items-center gap-4 flex-shrink-0 mb-4">
        <button 
          onClick={onCancel} 
          disabled={isGenerating}
          className="bg-slate-500 text-white font-bold py-2 px-6 rounded-md hover:bg-slate-400 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
        >
          Cancelar
        </button>
        <button 
          onClick={handleDownloadPdf} 
          disabled={isGenerating} 
          className="bg-[var(--color-primary)] text-[var(--color-primary-text)] font-bold py-2 px-6 rounded-md hover:bg-[var(--color-primary-hover)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-wait transition-colors"
        >
          <DownloadIcon className="w-5 h-5" />
          {isGenerating ? 'Gerando...' : 'Baixar PDF'}
        </button>
      </header>
      
      {/* This container centers the sheet and controls its responsive size */}
      <div className="flex-grow flex items-center justify-center overflow-auto">
        <div 
          ref={printContentRef} 
          className="w-full max-w-4xl bg-white shadow-2xl overflow-auto aspect-[1/1.414]" // A4 aspect ratio
        >
          <CustomerSheet customer={customer} />
        </div>
      </div>
    </div>
  );
};

export default PrintPreviewOverlay;
