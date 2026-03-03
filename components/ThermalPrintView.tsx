import React, { useRef, useCallback } from 'react';
import { Customer, Equipment } from '../types'; 
import { formatDate } from '../utils/formatDate';
import { PrinterIcon } from './icons/PrinterIcon';

interface ThermalPrintViewProps {
  customer: Customer;
  onClose: () => void;
}

const formatEquipmentType = (type: 'mesa' | 'jukebox' | 'grua') => {
  switch (type) {
    case 'mesa': return 'Mesa de Sinuca';
    case 'jukebox': return 'Jukebox';
    case 'grua': return 'Máquina de Grua';
    default: return 'Equipamento';
  }
};

const DetailLine: React.FC<{ label: string; value: string | number | null | undefined }> = ({ label, value }) => (
  value != null ? <p>{`${label}: ${value}`}</p> : null
);

const ThermalPrintView: React.FC<ThermalPrintViewProps> = ({ customer, onClose }) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  const handlePrint = useCallback(() => {
    if (!printAreaRef.current) {
      console.error("Área de impressão não encontrada.");
      return;
    }

    const printContent = printAreaRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está desativado.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Ficha de Cadastro - ${customer.name}</title>
          <style>
            @page { size: A4; margin: 20mm; }
            body { 
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
                color: #333; 
                line-height: 1.5;
                padding: 20px;
                background-color: #f0f0f0;
            }
            .print-container { max-width: 800px; margin: auto; padding: 30px; background-color: #fff; border: 1px solid #ddd; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            .print-button { position: fixed; top: 20px; right: 20px; padding: 10px 20px; background-color: #0d6efd; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; z-index: 10001; }
            @media print {
              body { background-color: #fff; }
              .print-button { display: none; }
              .print-container { border: none; box-shadow: none; margin: 0; max-width: 100%; }
            }
            .inner-content p { font-family: 'Courier New', Courier, monospace; font-weight: bold; font-size: 15px; margin: 0 0 2px 0; padding: 0; line-height: 1.4; }
            .inner-content .section-title { margin-top: 16px; }
            .inner-content .equipment-block { margin-top: 8px; border-left: 3px solid #ccc; padding-left: 10px; }
            .inner-content .terms { font-size: 12px; white-space: pre-wrap; word-wrap: break-word; line-height: 1.2; }
            .inner-content .signature { margin-top: 40px; text-align: center; }
          </style>
        </head>
        <body>
            <button class="print-button" onclick="window.print()">Imprimir Ficha</button>
            <div class="print-container">
              <div class="inner-content">${printContent}</div>
            </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
  }, [customer.name]);

  const separator = <p>---------------------------------</p>;

  return (
    <div className="fixed inset-0 bg-slate-900/80 z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto flex flex-col max-h-[90vh]">
        <header className="flex-shrink-0 flex justify-between items-center p-3 border-b border-slate-200">
          <h3 className="font-bold text-slate-800">Ficha de Cadastro</h3>
          <button onClick={onClose} className="p-2 rounded-full text-slate-800 hover:bg-slate-200">&times;</button>
        </header>

        <div ref={printAreaRef} className="overflow-y-auto p-4 bg-white text-black font-bold">
          <div style={{ textAlign: 'center' }}>
            <p>MONTANHA BILHAR E JUKEBOX</p>
            <p>CNPJ: 76.089.440/0001-29</p>
            <p>Jaguapitã - PR | (43) 99958-1993</p>
            <p style={{ margin: '8px 0' }}>DIVERSÃO LEVADA A SÉRIO</p>
            <p>Ficha Cadastral | {formatDate(new Date())}</p>
            {separator}
          </div>

          <div className="section-title">
            <p>DADOS DO CLIENTE</p>
            <p>Nome/Razão Social: {customer.name || 'N/A'}</p>
            <p>CPF/CNPJ: {customer.cpfRg || 'N/A'}</p>
            <p>Endereço: {customer.endereco || 'N/A'}</p>
            <p>Cidade: {customer.cidade || 'N/A'}</p>
            <p>Telefone: {customer.telefone || 'N/A'}</p>
            <p>Data do Contrato: {formatDate(customer.createdAt)}</p>
          </div>

          {separator}

          <div className="section-title">
            <p>EQUIPAMENTOS ({customer.equipment?.length || 0})</p>
            {customer.equipment && customer.equipment.length > 0 ? (
              customer.equipment.map((eq, index) => (
                <div key={eq.id || index} className="equipment-block">
                  <p>{formatEquipmentType(eq.type)} - Nº {eq.numero || 'S/N'}</p>
                  <DetailLine label="Nº do Relógio" value={eq.relogioNumero} />
                  <DetailLine label="Leitura Anterior" value={eq.relogioAnterior} />
                  
                  {/* Detalhes para Mesa */}
                  {eq.type === 'mesa' && (
                    eq.billingType === 'monthly' ? (
                      <DetailLine label="Mensalidade Fixa" value={eq.monthlyFeeValue != null ? `R$ ${Number(eq.monthlyFeeValue).toFixed(2)}` : null} />
                    ) : (
                      <>
                        <DetailLine label="Valor da Ficha" value={eq.valorFicha != null ? `R$ ${Number(eq.valorFicha).toFixed(2)}` : null} />
                        <DetailLine label="Divisão (Firma)" value={eq.parteFirma != null ? `${eq.parteFirma}%` : null} />
                        <DetailLine label="Divisão (Cliente)" value={eq.parteCliente != null ? `${eq.parteCliente}%` : null} />
                      </>
                    )
                  )}

                  {/* Detalhes para Jukebox */}
                  {eq.type === 'jukebox' && (
                    <>
                      <DetailLine label="Divisão (Firma)" value={eq.porcentagemJukeboxFirma != null ? `${eq.porcentagemJukeboxFirma}%` : null} />
                      <DetailLine label="Divisão (Cliente)" value={eq.porcentagemJukeboxCliente != null ? `${eq.porcentagemJukeboxCliente}%` : null} />
                    </>
                  )}

                  {/* Detalhes para Grua */}
                  {eq.type === 'grua' && (
                     <>
                       <DetailLine label="Aluguel (Fixo)" value={eq.aluguelValor && eq.aluguelValor > 0 ? `R$ ${eq.aluguelValor.toFixed(2)}` : null} />
                       <DetailLine label="Aluguel (%)" value={eq.aluguelPercentual && eq.aluguelPercentual > 0 ? `${eq.aluguelPercentual}%` : null} />
                       <DetailLine label="Capacidade Pelúcias" value={eq.quantidadePelucia} />
                    </>
                  )}
                </div>
              ))
            ) : (
              <p style={{ marginTop: '8px' }}>Nenhum equipamento locado.</p>
            )}
          </div>

          {separator}

          <div className="section-title">
            <p>TERMOS DE LOCAÇÃO</p>
            <p className="terms">
              O LOCATÁRIO RECEBE NESTA DATA O EQUIPAMENTO ACIMA IDENTIFICADO COM TODOS OS EQUIPAMENTOS INTERNOS E EXTERNOS EM PERFEITO ESTADO DE USO E CONSERVAÇÃO. O VALOR DA LOCAÇÃO SERÁ APURADO MEDIANTE O USO DO RESPECTIVO EQUIPAMENTO, SENDO QUE O PAGAMENTO OCORRERÁ NO PRAZO E NOS PERCENTUAIS ACIMA MENCIONADOS.
            </p>
          </div>

          <div className="signature">
            <p>______________________</p>
            <p>{customer.name || 'Assinatura Cliente'}</p>
            <p>(Assinatura Cliente)</p>
          </div>

          <div className="signature">
            <p>______________________</p>
            <p>Montanha Bilhar & Jukebox</p>
            <p>(Assinatura Firma)</p>
          </div>
        </div>

        <footer className="flex-shrink-0 p-3 text-center bg-white border-t border-slate-200">
          <button 
            onClick={handlePrint} 
            className="w-full bg-sky-600 text-white font-bold py-2 px-4 rounded-md hover:bg-sky-500 flex items-center justify-center gap-2"
          >
            <PrinterIcon className="w-5 h-5" />
            Imprimir
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ThermalPrintView;
