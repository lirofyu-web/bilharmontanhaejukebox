// components/BillingSlipSheet.tsx
import React from 'react';
import { Customer, Equipment } from '../types';
import { UserIcon } from './icons/UserIcon';
import { LocationMarkerIcon } from './icons/LocationMarkerIcon';
import { PhoneIcon } from './icons/PhoneIcon';

const DateField: React.FC<{ label: string; className?: string }> = ({ label, className }) => (
    <div className={`flex items-baseline gap-2 text-[10px] ${className}`}>
        <label className="text-gray-500 whitespace-nowrap font-medium">{label}:</label>
        <div className="w-8 border-b border-black"></div>
        <span className="text-gray-500">/</span>
        <div className="w-8 border-b border-black"></div>
        <span className="text-gray-500">/</span>
        <div className="w-12 border-b border-black"></div>
    </div>
);

const DottedField: React.FC<{ label: string; className?: string }> = ({ label, className }) => (
    <div className={`flex items-end gap-2 text-[11px] ${className}`}>
        <label className="text-gray-500 whitespace-nowrap font-medium">{label}:</label>
        <div className="flex-grow border-b border-dotted border-gray-400 h-4"></div>
    </div>
);

const FilledField: React.FC<{ label: string; value: string | number | null; icon?: React.ReactNode; className?: string; valueClassName?: string }> = ({ label, value, icon, className, valueClassName }) => (
     <div className={`flex items-center gap-1 text-[9px] ${className}`}>
        {icon && <div className="text-gray-500">{icon}</div>}
        <div className="flex-grow flex items-baseline gap-1">
            <label className="text-gray-500 whitespace-nowrap">{label}:</label>
            <p className={`font-bold text-black truncate leading-tight ${valueClassName}`}>{value ?? '---'}</p>
        </div>
    </div>
);

const CheckboxField: React.FC<{ label: string }> = ({ label }) => (
    <div className="flex items-center gap-1">
        <div className="w-2.5 h-2.5 border border-black bg-white"></div>
        <span className="font-semibold text-gray-800 text-[9px]">{label}</span>
    </div>
);


interface BillingSlipSheetProps {
  customer: Customer;
  equipment: Equipment;
  lastBillingAmount: number | null;
}

const BillingSlipSheet: React.FC<BillingSlipSheetProps> = ({ customer, equipment, lastBillingAmount }) => {
    return (
        <div className="bg-white text-black p-2 font-sans text-xs">
            {/* Header */}
            <header className="flex flex-col border-b border-gray-800">
                <div className="flex justify-between items-baseline">
                    <h1 className="text-xs font-black tracking-tighter" style={{ fontFamily: "'Times New Roman', serif" }}>MONTANHA BILHAR & JUKEBOX</h1>
                    <p className="text-[9px] font-semibold text-gray-600 uppercase pl-2">{customer.cidade}</p>
                </div>
                <p className="text-[7px] font-sans font-semibold text-gray-600">CNPJ: 76.089.440/0001-29 | Jaguapitã - PR | (43) 99958-1993</p>
            </header>
            
            {/* Customer & Equipment Info */}
            <section className="grid grid-cols-2 gap-x-2 gap-y-0 text-[10px] my-1">
                {/* Customer Info */}
                <FilledField label="Cliente" value={customer.name} icon={<UserIcon className="w-2.5 h-2.5"/>} valueClassName="text-[11px]" className="col-span-2"/>
                <FilledField label="Endereço" value={customer.endereco} icon={<LocationMarkerIcon className="w-2.5 h-2.5"/>} />
                <FilledField label="Telefone" value={customer.telefone} icon={<PhoneIcon className="w-2.5 h-2.5"/>} />
                
                {/* Equipment Info */}
                <FilledField label="Equip." value={`${equipment.type === 'mesa' ? 'Mesa' : 'Jukebox'} Nº ${equipment.numero}`} className="col-span-2 border-t border-gray-200" />
                
                {equipment.type === 'mesa' && equipment.billingType === 'monthly' && (
                    <FilledField 
                        label="Mensalidade Fixa" 
                        value={`R$ ${(equipment.monthlyFeeValue ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        className="col-span-2"
                        valueClassName="text-xs"
                    />
                )}

                {equipment.type === 'mesa' && equipment.billingType !== 'monthly' && (
                    <>
                        <FilledField label="Vlr Ficha" value={`R$ ${(equipment.valorFicha ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
                        <div />
                        <FilledField label="Firma" value={`${equipment.parteFirma ?? 0}%`} />
                        <FilledField label="Cliente" value={`${equipment.parteCliente ?? 0}%`} />
                    </>
                )}

                {equipment.type === 'jukebox' && (
                    <>
                        <FilledField label="Firma" value={`${equipment.porcentagemJukeboxFirma ?? 0}%`} />
                        <FilledField label="Cliente" value={`${equipment.porcentagemJukeboxCliente ?? 0}%`} />
                    </>
                )}
            </section>
            
            {/* Billing Section */}
            <section className="border-t-2 border-gray-400 pt-1 space-y-1">
                <DateField label="Data da Cobrança" />
                 <div className="grid grid-cols-2 gap-x-4 items-end">
                    <FilledField label="Leit. Anterior" value={equipment.relogioAnterior} valueClassName="text-sm" />
                    <DottedField label="Leit. Atual" />
                 </div>
                 <DottedField label="Partidas Jogadas" />
                 
                 <div className="border-t border-dashed border-gray-400 pt-1">
                    {equipment.type === 'mesa' && equipment.billingType === 'monthly' ? (
                        <div className="flex justify-between items-baseline text-xs font-bold">
                            <label className="text-gray-500 whitespace-nowrap font-semibold">R$ TOTAL A PAGAR:</label>
                            <p className="font-bold text-black text-sm">{`R$ ${(equipment.monthlyFeeValue ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</p>
                        </div>
                    ) : (
                        <DottedField label="R$ TOTAL A PAGAR" className="text-sm font-bold" />
                    )}
                 </div>
            </section>
            
            {/* Payment & Footer */}
            <footer className="border-t-2 border-double border-gray-800 pt-1 mt-1 space-y-0.5">
                <div className="flex justify-around items-center text-[10px]">
                    <span className="font-bold text-gray-600">Forma de Pgto:</span>
                    <CheckboxField label="Dinheiro" />
                    <CheckboxField label="PIX" />
                    <CheckboxField label="Negativo" />
                </div>
                <div className="grid grid-cols-2 gap-x-2 border-t border-gray-200">
                    <FilledField label="Última Cobrança" value={lastBillingAmount !== null ? `R$ ${lastBillingAmount.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : 'N/A'} />
                    {customer.debtAmount > 0 && (
                        <FilledField label="Saldo Devedor" value={`R$ ${customer.debtAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} valueClassName="text-red-600" />
                    )}
                </div>
            </footer>
        </div>
    );
};

export default BillingSlipSheet;