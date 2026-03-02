// components/DebtStatementSheet.tsx
import React from 'react';
import { Customer } from '../types';

interface DebtStatementSheetProps {
    customer: Customer;
    qrCodeDataUrl: string;
}

const DebtStatementSheet: React.FC<DebtStatementSheetProps> = ({ customer, qrCodeDataUrl }) => {
    const { name, debtAmount } = customer;

    return (
        <div className="bg-white p-4 text-black font-sans">
            <div className="text-center mb-4">
                <h1 className="font-black text-2xl">MONTANHA BILHAR & JUKEBOX</h1>
                <p className="text-sm">DEMONSTRATIVO DE DÍVIDA</p>
                <p className="text-xs">{new Date().toLocaleString('pt-BR')}</p>
            </div>

            <div className="text-sm space-y-1 mb-4">
                <p><span className="font-bold">CLIENTE:</span> {name}</p>
            </div>

            <hr className="border-dashed border-black my-2" />

            <div className="my-2 text-center">
                <p>Este é um demonstrativo do valor total da dívida pendente. Para quitar o valor, utilize o QR Code PIX abaixo ou entre em contato.</p>
            </div>

            <hr className="border-dashed border-black my-2" />

            <div className="flex justify-between items-center text-xl font-bold my-2 py-1 border-t border-b border-dashed border-black">
                <span>VALOR DA DÍVIDA:</span>
                <span>R$ {debtAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            
            <div className="text-center my-4">
                <p className="font-bold text-lg">PAGUE COM PIX</p>
                <p className="text-xs mb-2">Abra o app do seu banco e escaneie o código</p>
                <img src={qrCodeDataUrl} alt="QR Code PIX" className="mx-auto border-4 border-black" />
            </div>
            
            <hr className="border-dashed border-black my-2" />
            
            <div className="text-xs text-center mt-2">
                <p className="font-bold">BILHAR MONTANHA</p>
                <p>CNPJ: 76.089.440/0001-29</p>
                <p>Jaguapitã - PR</p>
                <p>Contato: (43) 99958-1993</p>
            </div>

            <hr className="border-dashed border-black my-2" />

            <div className="text-xs text-center mt-4">
                <p className="font-bold">MONTANHA BILHAR E JUKEBOX</p>
                <p>DIVERSÃO LEVADO A SÉRIO</p>
            </div>

        </div>
    );
};

export default DebtStatementSheet;
