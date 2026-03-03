// components/ReceiptModal.tsx
import React from 'react';
import { Billing } from '../types';
import { generateReceiptText } from '../utils/receiptGenerator';
import { SaveIcon } from './icons/SaveIcon';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  billing: Billing | null;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, billing }) => {
  if (!isOpen || !billing) return null;

  const receiptContent = generateReceiptText(billing);

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=800,width=1000');
    if (printWindow) {
        printWindow.document.write(`
            <html>
                <head>
                    <title>Recibo</title>
                    <style>
                        body { font-family: 'Courier New', Courier, monospace; font-size: 12px; margin: 20px; }
                        pre { white-space: pre-wrap; word-wrap: break-word; }
                        .print-button {
                            position: fixed;
                            top: 20px;
                            right: 20px;
                            padding: 10px 20px;
                            background-color: #4CAF50;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                        }
                        @media print {
                            .print-button {
                                display: none;
                            }
                        }
                    </style>
                </head>
                <body>
                    <button class="print-button" onclick="window.print()">Imprimir</button>
                    <pre>${receiptContent}</pre>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 no-print">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recibo de Cobrança</h2>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <pre className="bg-slate-100 dark:bg-slate-900 p-4 rounded-md text-slate-800 dark:text-slate-300 text-sm whitespace-pre-wrap break-words">
            {receiptContent}
          </pre>
        </div>
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-b-lg flex flex-col sm:flex-row gap-4">
          <button
            onClick={handlePrint}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-sky-600 text-white font-bold py-3 px-6 rounded-md hover:bg-sky-500"
          >
            <SaveIcon className="w-5 h-5" />
            <span>Salvar / Imprimir</span>
          </button>
        </div>
        <div className="p-4 text-center">
            <button
                onClick={onClose}
                className="w-full sm:w-auto bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold py-2 px-6 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500"
            >
                Fechar
            </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
