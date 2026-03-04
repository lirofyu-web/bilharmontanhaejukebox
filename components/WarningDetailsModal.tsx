
import React from 'react';
import { Customer, Warning } from '../types';
import { XIcon } from './icons/XIcon';

interface WarningDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  warning: Warning | null;
}

const WarningDetailsModal: React.FC<WarningDetailsModalProps> = ({ isOpen, onClose, customer, warning }) => {
  if (!isOpen || !customer || !warning) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Detalhes do Aviso</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div>
          <p className="text-slate-600 dark:text-slate-300">
            <strong className="font-semibold text-slate-900 dark:text-white">Cliente:</strong> {customer.name}
          </p>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            <strong className="font-semibold text-slate-900 dark:text-white">Aviso:</strong> {warning.message}
          </p>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-lime-600 text-white px-4 py-2 rounded-lg hover:bg-lime-700"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningDetailsModal;
