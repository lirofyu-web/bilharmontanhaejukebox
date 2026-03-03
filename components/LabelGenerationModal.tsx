// components/LabelGenerationModal.tsx
import React from 'react';
import { Customer } from '../types';

interface LabelGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  showNotification: (message: string, type?: 'success' | 'error') => void;
  onConfirm: () => void;
}

const LabelGenerationModal: React.FC<LabelGenerationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Gerar Etiquetas</h2>
        </div>
        <div className="p-6">
          <p className="text-slate-600 dark:text-slate-300">Este componente ainda não foi implementado.</p>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-b-lg text-right">
          <button
            onClick={onClose}
            className="bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold py-2 px-6 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabelGenerationModal;
