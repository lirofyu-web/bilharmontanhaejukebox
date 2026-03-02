import React from 'react';
import { Customer } from '../types';
import CustomerSheet from './CustomerSheet';
import { XIcon } from './icons/XIcon';

interface PrintableCustomerSheetViewProps {
  customer: Customer | null;
  onClose: () => void;
}

const PrintableCustomerSheetView: React.FC<PrintableCustomerSheetViewProps> = ({ customer, onClose }) => {
  if (!customer) return null;

  return (
    <div 
      className="fixed inset-0 bg-slate-100 z-[100] p-0 m-0 overflow-y-auto print:bg-white"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full min-h-full">
        {/* Close Button for non-print */}
        <button
          onClick={onClose}
          className="fixed top-2 right-2 text-slate-600 bg-white/70 backdrop-blur-sm rounded-full p-2 z-50 print:hidden"
          aria-label="Fechar"
        >
          <XIcon className="w-6 h-6" />
        </button>

        {/* A4-like container for desktop, full-width for mobile */}
        <div className="mx-auto my-0 bg-white print:shadow-none print:my-0 sm:my-4 sm:shadow-lg md:w-[210mm] md:min-h-[297mm]">
           <CustomerSheet customer={customer} />
        </div>

      </div>
    </div>
  );
};

export default PrintableCustomerSheetView;
