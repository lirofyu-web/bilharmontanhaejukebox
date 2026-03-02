// components/ShareCustomerModal.tsx
import React from 'react';
import { Customer } from '../types';
import { PrinterIcon } from './icons/PrinterIcon';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { generateCustomerShareText } from '../utils/receiptGenerator';


interface ShareCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
  showNotification: (message: string, type?: 'success' | 'error') => void;
  onPrintCustomer: (customer: Customer) => void;
}

const ShareCustomerModal: React.FC<ShareCustomerModalProps> = ({ isOpen, onClose, customer, showNotification, onPrintCustomer }) => {
  
  const handlePrint = () => {
    onPrintCustomer(customer);
    onClose();
  };

  const handleShareWhatsApp = async () => {
    const shareText = generateCustomerShareText(customer);
    const shareData = {
        title: `Dados do Cliente - ${customer.name}`,
        text: shareText,
    };
    
    try {
        if (navigator.share && navigator.canShare(shareData)) {
            await navigator.share(shareData);
        } else {
            // Fallback for browsers that don't support navigator.share or can't share the data
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
            window.open(whatsappUrl, '_blank');
        }
    } catch (error) {
        if ((error as DOMException).name !== 'AbortError') {
            console.error('Share API error:', error);
            showNotification(`Falha ao compartilhar: ${(error as Error).message}`, 'error');
        }
    } finally {
        onClose();
    }
  };
  
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 no-print"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-md border border-slate-700 animate-fade-in-up">
        <div className="p-6">
          <h2 id="share-modal-title" className="text-2xl font-bold text-white">Exportar Cliente</h2>
          <p className="text-slate-400 mt-2">Como você deseja exportar os dados de {customer.name}?</p>
        </div>
        <div className="p-6 space-y-4">
            <button
                onClick={handlePrint}
                className="w-full flex items-center gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700 text-left hover:bg-slate-700/50 hover:border-cyan-500 transition-colors"
            >
                <PrinterIcon className="w-8 h-8 text-cyan-400 flex-shrink-0" />
                <div>
                    <h3 className="font-bold text-white">Gerar Ficha (PDF/Impressão)</h3>
                    <p className="text-sm text-slate-400">Abre a opção de impressão para salvar como PDF ou imprimir em A4.</p>
                </div>
            </button>
            <button
                onClick={handleShareWhatsApp}
                className="w-full flex items-center gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700 text-left hover:bg-slate-700/50 hover:border-green-500 transition-colors"
            >
                <WhatsAppIcon className="w-8 h-8 text-green-400 flex-shrink-0" />
                <div>
                    <h3 className="font-bold text-white">WhatsApp (Texto)</h3>
                    <p className="text-sm text-slate-400">Compartilha um resumo em texto simples via WhatsApp ou outro app.</p>
                </div>
            </button>
        </div>
        <div className="p-4 bg-slate-800/50 rounded-b-lg flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-600 text-white font-bold py-2 px-6 rounded-md hover:bg-slate-500 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
       <style>{`
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ShareCustomerModal;