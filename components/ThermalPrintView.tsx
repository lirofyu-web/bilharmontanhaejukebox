import React, { useRef, useCallback } from 'react';
import { Customer, Equipment } from '../types'; // Importa os tipos corretos
import { formatDate } from '../utils/formatDate';

interface ThermalPrintViewProps {
  customer: Customer;
  onClose: () => void;
}

// Função para formatar o tipo de equipamento para algo mais legível
const formatEquipmentType = (type: 'mesa' | 'jukebox' | 'grua') => {
  switch (type) {
    case 'mesa': return 'Mesa de Sinuca';
    case 'jukebox': return 'Jukebox';
    case 'grua': return 'Máquina de Grua';
    default: return 'Equipamento';
  }
};

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
          <title>Ficha Cadastral</title>
          <style>
            @page { size: 50mm auto; margin: 2mm; }
            /* Aplica negrito em todo o corpo do documento */
            body { 
                font-family: 'Courier New', Courier, monospace; 
                color: #000; 
                line-height: 1.3; 
                font-weight: bold;
            }
            p { margin: 0; padding: 0; font-size: 16px; }
            .terms { font-size: 14px; white-space: pre-wrap; word-wrap: break-word; }
            .signature { margin-top: 40px; text-align: center; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      try {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      } catch (e) { console.error("Falha ao imprimir:", e); }
    }, 250);
  }, []);

  const separator = <p>----------------------</p>;

  return (
    <div className="fixed inset-0 bg-slate-900/80 z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-auto flex flex-col max-h-[90vh]">
        <header className="flex-shrink-0 flex justify-between items-center p-3 border-b border-slate-200">
          <h3 className="font-bold text-slate-800">Ficha de Cadastro</h3>
          <button onClick={onClose} className="p-2 rounded-full text-slate-800 hover:bg-slate-200">&times;</button>
        </header>

        {/* Adicionado font-bold para a visualização em tela ser consistente com a impressão */}
        <div ref={printAreaRef} className="overflow-y-auto p-4 bg-white text-black font-bold">
          {/* Cabeçalho da Empresa */}
          <div style={{ textAlign: 'center' }}>
            <p>MONTANHA BILHAR E JUKEBOX</p>
            <p>CNPJ: 76.089.440/0001-29</p>
            <p>Jaguapitã - PR | (43) 99958-1993</p>
            <p style={{ margin: '8px 0' }}>DIVERSÃO LEVADA A SÉRIO</p>
            <p>Ficha Cadastral | {formatDate(new Date())}</p>
            {separator}
          </div>

          {/* Dados do Cliente */}
          <div style={{ marginTop: '16px' }}>
            <p>DADOS DO CLIENTE</p>
            <p>Nome/Razão Social:</p>
            <p style={{ marginBottom: '8px' }}>{customer.name || 'N/A'}</p>
            <p>CPF/CNPJ:</p>
            <p style={{ marginBottom: '8px' }}>{customer.cpfRg || 'N/A'}</p>
            <p>Endereço:</p>
            <p style={{ marginBottom: '8px' }}>{customer.endereco || 'N/A'}</p>
            <p>Cidade:</p>
            <p style={{ marginBottom: '8px' }}>{customer.cidade || 'N/A'}</p>
            <p>Telefone:</p>
            <p style={{ marginBottom: '8px' }}>{customer.telefone || 'N/A'}</p>
            <p>Data do Contrato:</p>
            <p>{formatDate(customer.createdAt)}</p>
          </div>

          {separator}

          {/* Equipamentos do Cliente */}
          <div style={{ marginTop: '8px' }}>
            <p>EQUIPAMENTOS ({customer.equipment?.length || 0})</p>
            {customer.equipment && customer.equipment.length > 0 ? (
              customer.equipment.map((eq, index) => (
                <div key={eq.id || index} style={{ marginTop: '8px' }}>
                  <p>{formatEquipmentType(eq.type)} - Nº {eq.numero || 'S/N'}</p>
                  <p>Leitura Anterior: {eq.relogioAnterior ?? 'N/A'}</p>
                  {eq.monthlyFeeValue != null && (
                    <p>Mensalidade Fixa: R$ {eq.monthlyFeeValue.toFixed(2).replace('.', ',')}</p>
                  )}
                </div>
              ))
            ) : (
              <p style={{ marginTop: '8px' }}>Nenhum equipamento locado.</p>
            )}
          </div>

          {separator}

          {/* Termos e Assinaturas */}
          <div style={{ marginTop: '8px' }}>
            <p>TERMOS DE LOCAÇÃO</p>
            <p style={{ fontSize: '14px', whiteSpace: 'pre-wrap', wordWrap: 'break-word', lineHeight: 1.2 }}>
              O LOCATÁRIO RECEBE NESTA DATA O EQUIPAMENTO ACIMA IDENTIFICADO COM TODOS OS EQUIPAMENTOS INTERNOS E EXTERNOS EM PERFEITO ESTADO DE USO E CONSERVAÇÃO. O VALOR DA LOCAÇÃO SERÁ APURADO MEDIANTE O USO DO RESPECTIVO EQUIPAMENTO, SENDO QUE O PAGAMENTO OCORRERÁ NO PRAZO E NOS PERCENTUAIS ACIMA MENCIONADOS.
            </p>
          </div>

          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <p>______________________</p>
            <p>{customer.name || 'Assinatura Cliente'}</p>
            <p>(Assinatura Cliente)</p>
          </div>

          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <p>______________________</p>
            <p>Montanha Bilhar & Jukebox</p>
            <p>(Assinatura Firma)</p>
          </div>
        </div>

        <footer className="flex-shrink-0 p-3 text-center bg-white border-t border-slate-200">
          <button 
            onClick={handlePrint} 
            className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-700"
          >
            Exportar para Impressora Térmica
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ThermalPrintView;
