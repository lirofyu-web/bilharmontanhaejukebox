
// components/FichaActionsModal.tsx
import React, { useEffect } from 'react';
import { Customer } from '../types';
import { ShareIcon, DocumentTextIcon, XIcon } from './icons';

interface FichaActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onShare: (customer: Customer) => void;
  onViewFicha: (customer: Customer) => void;
}

const FichaActionsModal: React.FC<FichaActionsModalProps> = ({ 
    isOpen, 
    onClose, 
    customer, 
    onShare, 
    onViewFicha 
}) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen || !customer) return null;

  const handleAction = (action: (customer: Customer) => void) => {
    action(customer);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-700 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 flex justify-between items-center border-b border-slate-700">
          <h2 className="text-lg font-bold text-white">Opções de Ficha</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700" aria-label="Fechar modal">
            <XIcon className="w-6 h-6 text-slate-400"/>
          </button>
        </header>

        <div className="p-4 space-y-3">
          <p className="text-sm text-slate-400 text-center mb-4">Cliente: <span className="font-bold text-white">{customer.name}</span></p>

          <button onClick={() => handleAction(onViewFicha)} className="w-full flex items-center gap-4 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-white font-semibold transition-colors">
            <DocumentTextIcon className="w-6 h-6 text-sky-400"/>
            <span>Ver Ficha Completa (A4)</span>
          </button>
          
          <button onClick={() => handleAction(onShare)} className="w-full flex items-center gap-4 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-white font-semibold transition-colors">
            <ShareIcon className="w-6 h-6 text-lime-400"/>
            <span>Compartilhar Dados</span>
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px) scale(0.95); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default FichaActionsModal;
