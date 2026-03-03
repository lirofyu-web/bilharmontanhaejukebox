// components/CustomerSheet.tsx
import React from 'react';
import { Customer, Equipment } from '../types';

interface CustomerSheetProps {
  customer: Customer;
}

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-base font-bold border-b-2 border-dashed border-black pb-1 my-4">
        {children}
    </h2>
);

const InfoLine: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => (
    <p><span className="font-bold">{label}:</span> {value || '---'}</p>
);

const EquipmentSheetCard: React.FC<{ equip: Equipment }> = ({ equip }) => {
    const typeName = {
        mesa: 'MESA',
        jukebox: 'JUKEBOX',
        grua: 'GRUA',
    }[equip.type] || 'EQUIPAMENTO';

    return (
        <div className="mt-2 pt-2 border-t border-dashed border-black">
            <p className="font-bold">{typeName} Nº {equip.numero}</p>
            {equip.relogioNumero && <p>Nº Relógio: {equip.relogioNumero}</p>}
            <p>Leitura Ant.: {equip.relogioAnterior || '---'}</p>
            
            {equip.type === 'mesa' && (
                equip.billingType === 'monthly' ? (
                    <p>Mensalidade: R$ {Number(equip.monthlyFeeValue || 0).toFixed(2)}</p>
                ) : (
                    <>
                        <p>Vlr. Ficha: R$ {Number(equip.valorFicha || 0).toFixed(2)}</p>
                        <p>% Firma: {equip.parteFirma || 0}%</p>
                        <p>% Cliente: {equip.parteCliente || 0}%</p>
                    </>
                )
            )}
            {equip.type === 'jukebox' && (
                 <>
                    <p>% Firma: {equip.porcentagemJukeboxFirma || 0}%</p>
                    <p>% Cliente: {equip.porcentagemJukeboxCliente || 0}%</p>
                </>
            )}
            {equip.type === 'grua' && (
                <>
                    {equip.aluguelValor && <p>Aluguel: R$ {Number(equip.aluguelValor).toFixed(2)}</p>}
                    {equip.aluguelPercentual && <p>Aluguel: {equip.aluguelPercentual}%</p>}
                    <p>Capacidade Pelúcias: {equip.quantidadePelucia || 0}</p>
                </>
            )}
        </div>
    );
};

const CustomerSheet: React.FC<CustomerSheetProps> = ({ customer }) => {
  return (
    <div className="bg-white p-6 font-mono text-black text-sm max-w-4xl mx-auto">
      <header className="text-center space-y-1 mb-4">
          <h1 className="font-bold text-lg">MONTANHA BILHAR E JUKEBOX</h1>
          <p>CNPJ: 76.089.440/0001-29</p>
          <p>Jaguapitã - PR | (43) 99958-1993</p>
          <p className="font-bold border-y-2 border-dashed border-black my-2 py-1">DIVERSÃO LEVADA A SÉRIO</p>
          <p className="text-xs">Ficha Cadastral | {new Date().toLocaleDateString('pt-BR')}</p>
      </header>

      <main>
        <SectionTitle>DADOS DO CLIENTE</SectionTitle>
        <div className="space-y-1">
            <InfoLine label="Nome/Razão Social" value={customer.name} />
            <InfoLine label="CPF/CNPJ" value={customer.cpfRg} />
            <InfoLine label="Endereço" value={customer.endereco} />
            <InfoLine label="Cidade" value={customer.cidade} />
            <InfoLine label="Telefone" value={customer.telefone} />
            <InfoLine label="Data do Contrato" value={customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('pt-BR') : '---'} />
        </div>

        <SectionTitle>EQUIPAMENTOS ({(customer.equipment || []).length})</SectionTitle>
        {(customer.equipment || []).length > 0 ? (
            <div className="space-y-2">
                {(customer.equipment || []).map(equip => <EquipmentSheetCard key={equip.id} equip={equip} />)}
            </div>
        ) : (
            <p className="text-center py-4">Nenhum equipamento cadastrado.</p>
        )}

        <SectionTitle>TERMOS DE LOCAÇÃO</SectionTitle>
        <p className="text-xs leading-relaxed">
            O(A) locatário(a) declara receber o(s) equipamento(s) em perfeito estado. Danos por mau uso serão de sua responsabilidade.
        </p>
      </main>

      <footer className="pt-24 text-center">
          <div className="inline-block w-4/5 border-t border-black pt-2">
              <p className="font-bold break-words">{customer.name}</p>
          </div>
          <div className="mt-12 inline-block w-4/5 border-t border-black pt-2">
              <p className="font-bold break-words">MONTANHA BILHAR</p>
          </div>
      </footer>
    </div>
  );
};

export default CustomerSheet;
