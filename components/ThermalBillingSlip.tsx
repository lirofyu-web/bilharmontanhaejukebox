
// components/ThermalBillingSlip.tsx
import React from 'react';
import { Customer, Equipment } from '../types';

interface ThermalBillingSlipProps {
  customer: Customer;
  equipment: Equipment;
  lastBillingAmount: number | null;
}

const ThermalBillingSlip: React.FC<ThermalBillingSlipProps> = ({ customer, equipment, lastBillingAmount }) => {
    const printDate = new Date().toLocaleDateString('pt-BR');

    return (
        <div className="bg-white text-black p-4 font-mono text-base" style={{ width: '80mm' }}>
            <div className="text-center mb-2">
                <h2 className="font-bold text-lg">MONTANHA BILHAR & JUKEBOX</h2>
                <p className="text-sm">CNPJ: 76.089.440/0001-29</p>
                <p className="text-sm">Jaguapitã - PR | (43) 99958-1993</p>
                <p className="text-sm">Data: {printDate}</p>
            </div>

            <div className="border-t border-dashed border-black my-2"></div>

            <div className="text-left">
                <p><span className="font-bold">Cliente:</span> {customer.name}</p>
                <p><span className="font-bold">Endereço:</span> {customer.endereco}</p>
                <p><span className="font-bold">Cidade:</span> {customer.cidade}</p>
                <p><span className="font-bold">Telefone:</span> {customer.telefone}</p>
            </div>

            <div className="border-t border-dashed border-black my-2"></div>
            
            <div>
                <p className="font-bold text-center mb-1">EQUIPAMENTO</p>
                <p><span className="font-bold">Tipo:</span> {equipment.type === 'mesa' ? 'Mesa de Sinuca' : 'Jukebox'}</p>
                <p><span className="font-bold">Número:</span> {equipment.numero}</p>
            </div>

            <div className="border-t border-dashed border-black my-2"></div>

            <div className="text-left space-y-1">
                <p className="font-bold text-center">DETALHES DA COBRANÇA</p>
                {equipment.type === 'mesa' && equipment.billingType === 'monthly' && (
                    <p><span className="font-bold">Mensalidade:</span> R$ {(equipment.monthlyFeeValue ?? 0).toFixed(2)}</p>
                )}
                {equipment.type !== 'mesa' || equipment.billingType !== 'monthly' && (
                    <>
                        <p><span className="font-bold">Leitura Anterior:</span> {equipment.relogioAnterior ?? 'N/A'}</p>
                        <p><span className="font-bold">Leitura Atual:</span> ________________</p>
                        <p><span className="font-bold">Partidas:</span> ________________</p>
                    </>
                )}
                <div className="border-t border-dashed border-black my-2"></div>
                <p className="font-bold text-2xl text-center">TOTAL A PAGAR: R$ ____________</p>
                <div className="border-t border-dashed border-black my-2"></div>
            </div>

            <div className="text-left mt-2">
                <p className="font-bold">Última Cobrança: <span className="font-normal">{lastBillingAmount !== null ? `R$ ${lastBillingAmount.toFixed(2)}` : 'N/A'}</span></p>
                {customer.debtAmount > 0 && (
                    <p className="font-bold">Saldo Devedor: <span className="font-normal text-red-600">R$ {customer.debtAmount.toFixed(2)}</span></p>
                )}
            </div>

            <div className="mt-4 text-center">
                <p>___________________________________</p>
                <p className="text-sm">{customer.name}</p>
            </div>

            <div className="mt-2 text-center">
              <p className="text-sm">Obrigado!</p>
            </div>
        </div>
    );
};

export default ThermalBillingSlip;
