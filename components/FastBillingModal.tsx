// components/FastBillingModal.tsx
import React, { useState } from 'react';
import { BilliardIcon } from './icons/BilliardIcon';

interface FastBillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (equipmentNumber: string) => void;
}

const FastBillingModal: React.FC<FastBillingModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [equipmentNumber, setEquipmentNumber] = useState('');

  const handleConfirm = () => {
    if (equipmentNumber.trim()) {
      onConfirm(equipmentNumber.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-6 w-full max-w-sm m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BilliardIcon className="w-6 h-6 text-emerald-500" />
            Faturamento Rápido
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">&times;</button>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Digite o número do equipamento para iniciar o faturamento imediatamente.
        </p>
        <div>
          <label htmlFor="equipmentNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Número do Equipamento
          </label>
          <input
            type="text"
            id="equipmentNumber"
            value={equipmentNumber}
            onChange={(e) => setEquipmentNumber(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleConfirm()}
            autoFocus
            className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Ex: 123"
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold py-2 px-4 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500">
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="bg-emerald-600 text-white font-bold py-2 px-4 rounded-md hover:bg-emerald-500"
          >
            Faturar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FastBillingModal;
