
// components/DebtStatementSheet.tsx
import React from 'react';
import { Customer } from '../types';

interface DebtStatementSheetProps {
  customer: Customer;
  qrCodeDataUrl: string;
  pixKeyName?: string;
}

const DebtStatementSheet: React.FC<DebtStatementSheetProps> = ({ customer, qrCodeDataUrl, pixKeyName }) => {

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div style={{ fontFamily: '\'Courier New\', Courier, monospace' }} className="text-base">
            <div className="header text-center mb-4">
                <h3 className="font-black text-xl">MONTANHA BILHAR & JUKEBOX</h3>
                <p className="font-bold text-base">DEMONSTRATIVO DE DÍVIDA</p>
                <p>--------------------------------</p>
            </div>
            
            <div className="space-y-1">
                <p>CLIENTE: {customer.name}</p>
                <p>DATA: {new Date().toLocaleString('pt-BR')}</p>
                <hr className="border-dashed border-black my-2" />
                
                <div className="flex justify-between font-bold text-xl pt-2 mt-2 border-t border-b border-dashed border-black py-2">
                    <span>SALDO DEVEDOR:</span>
                    <span>R$ {formatCurrency(customer.debtAmount)}</span>
                </div>
            </div>

            <div className="text-center mt-4">
                <p className="font-bold text-sm">Para pagar sua dívida, utilize o QR Code abaixo ou a chave PIX.</p>
            </div>

            {qrCodeDataUrl && (
                <div className="text-center mt-4">
                    <p className="font-bold">Pague com PIX</p>
                    <img src={qrCodeDataUrl} alt="PIX QR Code" style={{ width: '150px', height: '150px', margin: '8px auto', border: '4px solid black' }} />
                    <p className="text-xs">Chave: {pixKeyName || 'BILHAR MONTANHA'}</p>
                </div>
            )}

            <hr className="border-dashed border-black my-2" />

            <div className="text-sm text-center mt-2">
                <p className="font-bold">BILHAR MONTANHA</p>
                <p>CNPJ: 76.089.440/0001-29</p>
                <p>Jaguapitã - PR</p>
                <p>Contato: (43) 99958-1993</p>
            </div>

            <hr className="border-dashed border-black my-2" />

            <div className="text-sm text-center mt-4">
                <p className="font-bold">MONTANHA BILHAR E JUKEBOX</p>
                <p>DIVERSÃO LEVADO A SÉRIO</p>
            </div>
        </div>
    );
};

export default DebtStatementSheet;
