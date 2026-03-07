
// components/CraneReportModal.tsx
import React, { useState, useEffect } from 'react';
import { safeParseFloat } from '../utils';
import { DocumentDuplicateIcon, PrinterIcon } from './icons';

interface CraneReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (startDate: string, endDate: string, moneyDeposit: number) => void;
  onConfirmThermal: (startDate: string, endDate: string, moneyDeposit: number) => void;
  isThermalSupported: boolean;
}

const CraneReportModal: React.FC<CraneReportModalProps> = ({ isOpen, onClose, onConfirm, onConfirmThermal, isThermalSupported }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [moneyDeposit, setMoneyDeposit] = useState('');

  // Set default dates to current month
  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      setStartDate(firstDay.toISOString().split('T')[0]);
      setEndDate(lastDay.toISOString().split('T')[0]);
      setMoneyDeposit('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent, isThermal: boolean) => {
    e.preventDefault();
    const depositNum = safeParseFloat(moneyDeposit);
    if (isThermal) {
      onConfirmThermal(startDate, endDate, depositNum);
    } else {
      onConfirm(startDate, endDate, depositNum);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-start sm:items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-md border border-slate-700 animate-fade-in-up my-auto">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Configurar Relatório de Gruas
          </h2>
        </div>
        
        <form className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Data Inicial</label>
              <input 
                type="date" 
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Data Final</label>
              <input 
                type="date" 
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Depósito de Dinheiro (R$)</label>
            <input 
              type="text" 
              inputMode="decimal"
              placeholder="0,00"
              value={moneyDeposit}
              onChange={(e) => setMoneyDeposit(e.target.value.replace(/[^0-9,.]/g, ''))}
              className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-emerald-500 focus:outline-none"
            />
             <p className="text-xs text-slate-400 mt-1">Este valor é apenas informativo e não afeta o cálculo do lucro.</p>
          </div>

          <div className="pt-4 flex flex-wrap justify-end gap-4">
            <button 
              type="button" 
              onClick={onClose}
              className="bg-slate-600 text-white font-bold py-2 px-4 rounded-md hover:bg-slate-500"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              onClick={(e) => handleSubmit(e, false)}
              className="bg-orange-600 text-white font-bold py-2 px-4 rounded-md hover:bg-orange-500 flex items-center gap-2"
            >
              <PrinterIcon className="w-5 h-5" />
              Gerar A4
            </button>
            {isThermalSupported && (
                <button 
                  type="submit"
                  onClick={(e) => handleSubmit(e, true)}
                  className="bg-teal-600 text-white font-bold py-2 px-4 rounded-md hover:bg-teal-500 flex items-center gap-2"
                >
                    <DocumentDuplicateIcon className="w-5 h-5" />
                    Gerar Térmico
                </button>
            )}
          </div>
        </form>
      </div>
      <style>{`
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default CraneReportModal;
