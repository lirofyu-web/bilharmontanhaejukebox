import React from 'react';
import { Customer } from '../types';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { ShareIcon } from './icons/ShareIcon';

interface WhatsAppActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
  onShare: (text: string, title: string) => void;
}

const WhatsAppActionsModal: React.FC<WhatsAppActionsModalProps> = ({ isOpen, onClose, customer, onShare }) => {
  if (!isOpen) return null;

  const handleStartConversation = () => {
    const phone = customer.telefone?.replace(/\D/g, '');
    if (phone) {
      const text = encodeURIComponent(`Olá ${customer.name}, tudo bem?`);
      window.open(`https://wa.me/55${phone}?text=${text}`, '_blank');
    }
    onClose();
  };

  const handleShareContact = () => {
    const contactText = `Contato: ${customer.name}\nTelefone: ${customer.telefone}`;
    onShare(contactText, `Contato de ${customer.name}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-sm border border-slate-700 animate-fade-in-up">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">WhatsApp: {customer.name}</h2>
          <p className="text-slate-400 mt-1">{customer.telefone}</p>
        </div>
        <div className="p-6 space-y-4">
          <button
            onClick={handleStartConversation}
            className="w-full flex items-center justify-center gap-3 bg-green-600 text-white font-bold py-3 px-4 rounded-md hover:bg-green-500 transition-colors"
          >
            <WhatsAppIcon className="w-6 h-6" />
            Iniciar Conversa
          </button>
          <button
            onClick={handleShareContact}
            className="w-full flex items-center justify-center gap-3 bg-sky-600 text-white font-bold py-3 px-4 rounded-md hover:bg-sky-500 transition-colors"
          >
            <ShareIcon className="w-6 h-6" />
            Compartilhar Contato
          </button>
        </div>
        <div className="p-4 bg-slate-800/50 border-t border-slate-700 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-600 text-white font-bold py-2 px-4 rounded-md hover:bg-slate-500"
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

export default WhatsAppActionsModal;
