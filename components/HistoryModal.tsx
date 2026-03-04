
import React from 'react';
import { Customer, Billing, Equipment } from '../types';
import { XIcon } from './icons/XIcon';
import { format } from 'date-fns';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  billings: Billing[];
  equipments: Equipment[];
}

const DetailItem: React.FC<{ label: string; value: string | number | null | undefined }> = ({ label, value }) => {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="flex justify-between text-sm py-1 border-b border-slate-200 dark:border-slate-700">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="font-medium text-slate-700 dark:text-slate-300">{String(value)}</span>
    </div>
  );
};

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, customer, billings, equipments }) => {
  if (!isOpen || !customer) {
    return null;
  }

  const customerBillings = billings
    .filter((b) => b.customerId === customer.id)
    .sort((a, b) => new Date(b.settledAt).getTime() - new Date(a.settledAt).getTime());

  const renderBillingDetails = (billing: Billing) => {
    const formatCurrency = (value: number | null | undefined) => (typeof value === 'number' ? `R$ ${value.toFixed(2)}` : 'R$ 0,00');
    const equipment = equipments.find(e => e.id === billing.equipmentId);

    switch (billing.equipmentType) {
      case 'mesa': {
        const firmaPercent = equipment?.parteFirma ?? (100 - (equipment?.parteCliente ?? 0));
        const clientePercent = 100 - firmaPercent;
        return (
          <div className="space-y-1 mt-2">
            <DetailItem label="Tipo de Cobrança" value={billing.billingType === 'monthly' ? 'Mensal' : 'Por Ficha'} />
            <DetailItem label="Relógio Anterior" value={billing.relogioAnterior} />
            <DetailItem label="Relógio Atual" value={billing.relogioAtual} />
            <DetailItem label="Partidas Jogadas" value={billing.partidasJogadas} />
            {billing.billingType === 'perPlay' && (
              <>
                <DetailItem label="Desconto" value={billing.descontoPartidas || 0} />
                <DetailItem label="Partidas Cobradas" value={billing.partidasCobradas} />
                <DetailItem label="Valor da Ficha" value={formatCurrency(billing.valorFicha)} />
                <DetailItem label="Valor Bruto" value={formatCurrency(billing.valorBruto)} />
                <DetailItem label={`Parte da Firma (${firmaPercent}%)`} value={formatCurrency(billing.parteFirma)} />
                <DetailItem label={`Parte do Cliente (${clientePercent}%)`} value={formatCurrency(billing.parteCliente)} />
              </>
            )}
          </div>
        );
      }
      case 'jukebox': {
        const firmaPercent = equipment?.porcentagemJukeboxFirma ?? (100 - (equipment?.porcentagemJukeboxCliente ?? 0));
        const clientePercent = 100 - firmaPercent;
        return (
          <div className="space-y-1 mt-2">
            <DetailItem label="Relógio Anterior" value={billing.relogioAnterior} />
            <DetailItem label="Relógio Atual" value={billing.relogioAtual} />
            <DetailItem label="Partidas Jogadas" value={billing.partidasJogadas} />
            <DetailItem label="Valor Bruto" value={formatCurrency(billing.valorBruto)} />
            <DetailItem label={`Parte da Firma (${firmaPercent}%)`} value={formatCurrency(billing.parteFirma)} />
            <DetailItem label={`Parte do Cliente (${clientePercent}%)`} value={formatCurrency(billing.parteCliente)} />
          </div>
        );
      }
      case 'grua':
        return (
          <div className="space-y-1 mt-2">
            <DetailItem label="Aluguel (%)" value={billing.aluguelPercentual ? `${billing.aluguelPercentual}%` : 'N/A'} />
            <DetailItem label="Aluguel (R$)" value={billing.aluguelValor ? formatCurrency(billing.aluguelValor) : 'N/A'} />
            <DetailItem label="Saldo" value={formatCurrency(billing.saldo)} />
            <DetailItem label="Qtd. Pelúcia" value={billing.quantidadePelucia} />
            <DetailItem label="Sobra" value={billing.sobraPelucia} />
            <DetailItem label="Reposição" value={billing.reposicaoPelucia} />
            <DetailItem label="Recebido (Espécie)" value={formatCurrency(billing.recebimentoEspecie)} />
            <DetailItem label="Recebido (Pix)" value={formatCurrency(billing.recebimentoPix)} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg flex flex-col w-full max-w-2xl max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Histórico de {customer.name}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto">
          {customerBillings.length > 0 ? (
            customerBillings.map((billing) => (
              <div key={billing.id} className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/50 shadow-sm">
                <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
                    Cobrança de {billing.equipmentNumero}
                    </h3>
                    <span className='text-sm text-slate-500 dark:text-slate-400'>{format(new Date(billing.settledAt), 'dd/MM/yyyy')}</span>
                </div>
                
                {renderBillingDetails(billing)}

                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <p className='flex justify-between items-center'>
                    <span className="text-md font-semibold text-slate-600 dark:text-slate-300">Valor Total da Firma:</span>
                    <strong className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{billing.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-500 dark:text-slate-400 py-16">Nenhum histórico de cobrança encontrado.</p>
          )}
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
    </div>
  );
};

export default HistoryModal;
