
import React from 'react';
import { XIcon } from './icons/XIcon';
import { LocationMarkerIcon } from './icons/LocationMarkerIcon';

interface CityListModalProps {
  isOpen: boolean;
  onClose: () => void;
  cities: string[];
  onSelectCity: (city: string) => void;
}

const CityListModal: React.FC<CityListModalProps> = ({ isOpen, onClose, cities, onSelectCity }) => {
  if (!isOpen) {
    return null;
  }

  const handleCityClick = (city: string) => {
    onSelectCity(city);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl flex flex-col w-full max-w-md max-h-[80vh]">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Selecione uma Cidade</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-2 overflow-y-auto">
          <ul className="space-y-1">
            {cities.map((city) => (
              <li key={city}>
                <button
                  onClick={() => handleCityClick(city)}
                  className="w-full text-left flex items-center gap-3 p-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <LocationMarkerIcon className="w-5 h-5 text-slate-400" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">{city}</span>
                </button>
              </li>
            ))}
            {cities.length === 0 && (
                <p className="text-center text-slate-500 dark:text-slate-400 py-10">Nenhuma cidade encontrada.</p>
            )}
          </ul>
        </div>

        <div className="p-4 mt-auto border-t border-slate-200 dark:border-slate-700 flex justify-end bg-slate-50 dark:bg-slate-800/50 rounded-b-lg">
            <button
                onClick={onClose}
                className="bg-slate-600 hover:bg-slate-700 dark:bg-slate-500 dark:hover:bg-slate-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
                Fechar
            </button>
        </div>
      </div>
       <style>{`
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default CityListModal;
