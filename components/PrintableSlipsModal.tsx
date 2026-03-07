
// components/PrintableSlipsModal.tsx
import React, { useRef, useState } from 'react';
import BillingSlipSheet from './BillingSlipSheet';
import ThermalBillingSlip from './ThermalBillingSlip';
import { DocumentDuplicateIcon, PrinterIcon } from './icons';
import { Customer, Equipment } from '../types';

interface PrintableSlipsModalProps {
  slips: { customer: Customer; equipment: Equipment; lastBillingAmount: number | null; }[];
  onClose: () => void;
}

const PrintableSlipsModal: React.FC<PrintableSlipsModalProps> = ({ slips, onClose }) => {
  const printAreaRef = useRef<HTMLDivElement>(null);
  const [isThermalView, setThermalView] = useState(false);

  const handlePrint = (thermal: boolean) => {
    // Atraso para garantir que a visualização seja atualizada antes da impressão
    setTimeout(() => {
        setThermalView(thermal);
        setTimeout(() => {
            const printContent = printAreaRef.current?.innerHTML;
            if (!printContent) {
                alert("Não foi possível encontrar o conteúdo para impressão.");
                return;
            }

            const printWindow = window.open('', '_blank');
            if (printWindow) {
                const title = thermal ? 'Talão Térmico' : 'Talões de Cobrança';
                const styles = thermal ? `
                    body { margin: 0; background-color: #808080; display: flex; justify-content: center; }
                    .thermal-slip { margin: 0 auto; }
                    @page { size: 80mm auto; margin: 0; }
                    @media print {
                        body { background-color: #fff; justify-content: flex-start; }
                    }
                ` : `
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: #808080; }
                    .print-page { page-break-after: always; margin: 1rem auto; }
                    .print-page:last-child { page-break-after: auto; }
                    @page { size: A4 portrait; margin: 0; }
                    @media print {
                        body { background-color: #fff; }
                        .print-page { margin: 0; box-shadow: none; }
                    }
                `;

                printWindow.document.write(`
                    <html>
                        <head>
                            <title>${title}</title>
                            <script src="https://cdn.tailwindcss.com"></script>
                            <style>${styles}</style>
                        </head>
                        <body><div>${printContent}</div></body>
                    </html>
                `);
                printWindow.document.close();
                printWindow.focus();
                setTimeout(() => {
                    printWindow.print();
                }, 500);
            } else {
                alert("Por favor, habilite pop-ups para impressão.");
            }
        }, 100);
    }, 0);
  };
  
  const slipsPerPage = 3;
  const pages = [];
  for (let i = 0; i < slips.length; i += slipsPerPage) {
      pages.push(slips.slice(i, i + slipsPerPage));
  }

  return (
    <div 
      className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[100] flex flex-col items-center p-4"
      role="dialog"
      aria-modal="true"
    >
        {/* Header */}
        <header className="w-full max-w-[210mm] flex-shrink-0 flex flex-wrap justify-between items-center gap-4 mb-4">
            <h2 className="text-xl font-bold text-white whitespace-nowrap">Pré-visualização ({slips.length} talões)</h2>
            <div className="flex flex-wrap gap-4 justify-end">
                <button onClick={onClose} className="bg-slate-600 text-white font-bold py-2 px-6 rounded-md hover:bg-slate-500">Fechar</button>
                <button onClick={() => handlePrint(false)} className="inline-flex items-center gap-2 bg-cyan-600 text-white font-bold py-2 px-6 rounded-md hover:bg-cyan-500">
                    <DocumentDuplicateIcon className="w-5 h-5"/> <span>Imprimir A4</span>
                </button>
                <button onClick={() => handlePrint(true)} className="inline-flex items-center gap-2 bg-teal-600 text-white font-bold py-2 px-6 rounded-md hover:bg-teal-500">
                    <PrinterIcon className="w-5 h-5"/> <span>Impressora Térmica</span>
                </button>
            </div>
        </header>

        {/* Scrollable Content */}
        <div className="overflow-y-auto w-full flex-grow">
            <div ref={printAreaRef} className="space-y-4">
                {isThermalView ? (
                    slips.map(slip => (
                        <div key={`thermal-${slip.equipment.id}`} className="bg-white shadow-lg mx-auto thermal-slip" style={{ width: '80mm' }}>
                            <ThermalBillingSlip customer={slip.customer} equipment={slip.equipment} lastBillingAmount={slip.lastBillingAmount} />
                        </div>
                    ))
                ) : (
                    pages.map((pageSlips, pageIndex) => (
                        <div key={pageIndex} className="bg-white shadow-2xl print-page mx-auto" style={{ width: '210mm', height: '297mm' }}>
                            {[...pageSlips, ...Array(slipsPerPage - pageSlips.length).fill(null)].map((slip, index) => (
                                <div 
                                    key={slip ? slip.equipment.id : `placeholder-${index}`}
                                    className={`w-full ${index < slipsPerPage - 1 ? 'border-b-2 border-dashed border-gray-400' : ''}`}
                                    style={{ height: '99mm', boxSizing: 'border-box', overflow: 'hidden' }}
                                >
                                    {slip && <BillingSlipSheet customer={slip.customer} equipment={slip.equipment} lastBillingAmount={slip.lastBillingAmount} />}
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>
        </div>
    </div>
  );
};

export default PrintableSlipsModal;
