// components/CustomerSheet.tsx
import React from 'react';
import { Customer, Equipment } from '../types';
import { LogoIcon } from './icons/LogoIcon';

interface CustomerSheetProps {
  customer: Customer;
}

const InfoRow: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => (
    <div className="mb-2 break-words">
        <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value || '---'}</p>
    </div>
);

const EquipmentCard: React.FC<{ equip: Equipment }> = ({ equip }) => {
    const typeStyles = {
        mesa: {
            title: 'Mesa de Sinuca',
            border: 'border-[var(--color-accent)]',
            text: 'text-cyan-800',
            bg: 'bg-cyan-50/50'
        },
        jukebox: {
            title: 'Jukebox',
            border: 'border-fuchsia-500',
            text: 'text-fuchsia-800',
            bg: 'bg-fuchsia-50/50'
        },
        grua: {
            title: 'Grua de Pelúcia',
            border: 'border-orange-500',
            text: 'text-orange-800',
            bg: 'bg-orange-50/50'
        }
    };

    const styles = typeStyles[equip.type] || {
        title: 'Equipamento',
        border: 'border-gray-400',
        text: 'text-gray-800',
        bg: 'bg-gray-50/50'
    };

    return (
        <div className={`p-3 md:p-4 border-l-4 ${styles.border} ${styles.bg} rounded-r-lg shadow-sm break-inside-avoid`}>
            <h4 className={`font-bold text-base mb-3 ${styles.text} break-words`}>{styles.title} - Nº {equip.numero}</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                {equip.relogioNumero && <InfoRow label="Nº do Relógio" value={equip.relogioNumero} />}
                <InfoRow label="Leitura Anterior" value={equip.relogioAnterior} />

                {/* --- MESA --- */}
                {equip.type === 'mesa' && (
                    equip.billingType === 'monthly'
                    ? ( // Monthly billing
                        <InfoRow 
                            label="Mensalidade Fixa" 
                            value={equip.monthlyFeeValue != null ? `R$ ${Number(equip.monthlyFeeValue)}` : null} 
                        />
                    ) 
                    : ( // Per-play billing (default)
                        <>
                            <InfoRow 
                                label="Valor da Ficha" 
                                value={equip.valorFicha != null ? `R$ ${Number(equip.valorFicha)}` : null} 
                            />
                            <div /> 
                            <InfoRow 
                                label="Divisão (Firma)" 
                                value={equip.parteFirma != null ? `${equip.parteFirma}%` : null} 
                            />
                            <InfoRow 
                                label="Divisão (Cliente)" 
                                value={equip.parteCliente != null ? `${equip.parteCliente}%` : null} 
                            />
                        </>
                    )
                )}

                {/* --- JUKEBOX --- */}
                 {equip.type === 'jukebox' && (
                    <>
                        <InfoRow 
                            label="Divisão (Firma)" 
                            value={equip.porcentagemJukeboxFirma != null ? `${equip.porcentagemJukeboxFirma}%` : null} 
                        />
                        <InfoRow 
                            label="Divisão (Cliente)" 
                            value={equip.porcentagemJukeboxCliente != null ? `${equip.porcentagemJukeboxCliente}%` : null} 
                        />
                    </>
                )}
                
                {/* --- GRUA --- */}
                {equip.type === 'grua' && (
                    <>
                       {equip.aluguelValor && equip.aluguelValor > 0 && <InfoRow label="Aluguel (Fixo)" value={`R$ ${equip.aluguelValor}`} />}
                       {equip.aluguelPercentual && equip.aluguelPercentual > 0 && <InfoRow label="Aluguel (%)" value={`${equip.aluguelPercentual}%`} />}
                       <InfoRow label="Capacidade Pelúcias" value={equip.quantidadePelucia || 0} />
                    </>
                )}
            </div>
        </div>
    );
};

const CustomerSheet: React.FC<CustomerSheetProps> = ({ customer }) => {
  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 flex flex-col justify-between h-full font-sans max-w-4xl mx-auto">
      <div className="printable-content">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b-4 border-[var(--color-primary)]">
            <div className="w-24 h-auto mb-4 sm:mb-0">
                <LogoIcon />
            </div>
            <div className="text-left sm:text-right w-full">
                <p className="font-bold text-base md:text-lg break-words">MONTANHA BILHAR E JUKEBOX</p>
                <p className="text-xs md:text-sm break-words">CNPJ: 76.089.440/0001-29 | Jaguapitã - PR | Contato: (43) 99958-1993</p>
                <p className="font-bold mt-1 text-sm md:text-base break-words">DIVERSÃO LEVADO A SÉRIO</p>
                <p className="text-xs md:text-sm text-gray-500 mt-2">Ficha Cadastral | Gerado em: {new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </header>

          <main className="mt-6 space-y-6">
            <section>
                <h2 className="text-base md:text-lg font-bold text-white bg-[var(--color-accent)] px-3 py-2 rounded-t-lg -mb-1">DADOS DO CLIENTE</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 p-3 md:p-4 border border-gray-300 rounded-b-lg bg-white shadow-inner">
                    <div className="md:col-span-2"><InfoRow label="Nome / Razão Social" value={customer.name} /></div>
                    <div className="md:col-span-1"><InfoRow label="CPF / CNPJ" value={customer.cpfRg} /></div>
                    <div className="col-span-1 sm:col-span-2 md:col-span-3"><InfoRow label="Endereço" value={customer.endereco} /></div>
                    <div><InfoRow label="Cidade" value={customer.cidade} /></div>
                    <div><InfoRow label="Telefone" value={customer.telefone} /></div>
                    <div><InfoRow label="Cobrador" value={customer.linhaNumero} /></div>
                    <div className="col-span-1 sm:col-span-2"><InfoRow label="Data do Contrato" value={customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('pt-BR') : '---'} /></div>
                </div>
            </section>

            <section>
                <h2 className="text-base md:text-lg font-bold text-white bg-slate-700 px-3 py-2 rounded-t-lg -mb-1">EQUIPAMENTOS ({(customer.equipment || []).length})</h2>
                <div className="p-2 md:p-4 border border-gray-300 rounded-b-lg bg-slate-50 shadow-inner">
                {(customer.equipment || []).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(customer.equipment || []).map(equip => <EquipmentCard key={equip.id} equip={equip} />)}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">Nenhum equipamento cadastrado.</p>
                )}
                </div>
            </section>
            
            <section className="break-inside-avoid">
                <h2 className="text-base md:text-lg font-bold text-white bg-slate-700 px-3 py-2 rounded-t-lg -mb-1">TERMOS DE LOCAÇÃO</h2>
                <div className="p-3 md:p-4 border border-gray-300 rounded-b-lg bg-white shadow-inner">
                    <p className="text-xs text-gray-600 leading-relaxed">
                        O LOCATÁRIO RECEBE NESTA DATA O EQUIPAMENTO ACIMA IDENTIFICADO COM TODOS OS EQUIPAMENTOS INTERNOS E EXTERNOS EM PERFEITO ESTADO DE USO E CONSERVAÇÃO. O VALOR DA LOCAÇÃO SERÁ APURADO MEDIANTE O USO DO RESPECTIVO EQUIPAMENTO, SENDO QUE O PAGAMENTO OCORRERÁ NO PRAZO E NOS PERCENTUAIS ACIMA MENCIONADOS.
                    </p>
                </div>
            </section>
          </main>
      </div>

      <footer className="pt-12 md:pt-16 pb-4 break-before-page">
          <div className="flex justify-around items-end text-center">
              <div className="w-2/5">
                  <div className="border-t border-gray-400 pt-2 h-20 flex flex-col justify-between">
                       {customer.assinaturaCliente ? (
                          <img src={customer.assinaturaCliente} alt="Assinatura do Cliente" className="max-h-12 mx-auto" />
                      ) : (
                          <div className="h-12"></div> // Placeholder
                      )}
                      <p className="text-sm font-semibold text-gray-800 mt-1 break-words">{customer.name}</p>
                      <p className="text-xs text-gray-500">(Assinatura Cliente)</p>
                  </div>
              </div>
              <div className="w-2/5">
                   <div className="border-t border-gray-400 pt-2 h-20 flex flex-col justify-between">
                      {customer.assinaturaFirma ? (
                          <img src={customer.assinaturaFirma} alt="Assinatura da Firma" className="max-h-12 mx-auto" />
                      ) : (
                          <div className="h-12"></div> // Placeholder
                      )}
                      <p className="text-sm font-semibold text-gray-800 mt-1 break-words">Montanha Bilhar & Jukebox</p>
                      <p className="text-xs text-gray-500">(Assinatura Firma)</p>
                  </div>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default CustomerSheet;
