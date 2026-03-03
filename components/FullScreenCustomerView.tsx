import React, { useRef } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Customer, Equipment } from '../types';
import { formatDate } from '../utils/formatDate';

// --- Componente para o Recibo Térmico ---
const ThermalReceipt = ({ customer }: { customer: Customer }) => (
  <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#000', width: '300px', padding: '10px' }}>
    <h2 style={{ textAlign: 'center', margin: '0 0 10px 0', fontSize: '16px' }}>MONTANHA BILHAR</h2>
    <p style={{ textAlign: 'center', margin: '0' }}>CNPJ: 76.089.440/0001-29</p>
    <p style={{ textAlign: 'center', margin: '0 0 15px 0' }}>Tel: (43) 99958-1993</p>
    
    <p><strong>CLIENTE:</strong> {customer.name}</p>
    <p><strong>CIDADE:</strong> {customer.cidade}</p>
    <p><strong>ENDEREÇO:</strong> {customer.endereco}</p>
    <p><strong>DATA:</strong> {formatDate(new Date())}</p>
    
    <hr style={{ border: 'none', borderTop: '1px dashed #000', margin: '15px 0' }} />

    {customer.equipment?.map(equip => (
      <div key={equip.id} style={{ marginBottom: '15px' }}>
        <p style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{equip.type} Nº {equip.numero}</p>
        <p>Nº Relógio: {equip.relogioNumero || '-'}</p>
        <p>Leitura Ant.: {equip.relogioAnterior || '-'}</p>
        {equip.type === 'mesa' && (
          equip.billingType === 'monthly' ? (
            <p>Mensal: R$ {equip.monthlyFeeValue?.toFixed(2)}</p>
          ) : (
            <>
              <p>Vlr. Ficha: R$ {equip.valorFicha?.toFixed(2)}</p>
              <p>% Firma: {equip.parteFirma}%</p>
              <p>% Cliente: {100 - (equip.parteFirma || 0)}%</p>
            </>
          )
        )}
        {equip.type === 'jukebox' && (
           <>
            <p>% Firma: {equip.porcentagemJukeboxFirma}%</p>
            <p>% Cliente: {100 - (equip.porcentagemJukeboxFirma || 0)}%</p>
          </>
        )}
         {equip.type === 'grua' && (
          <>
            {equip.aluguelValor && <p>Aluguel: R$ {equip.aluguelValor.toFixed(2)}</p>}
            {equip.aluguelPercentual && <p>Aluguel: {equip.aluguelPercentual}%</p>}
            <p>Capacidade: {equip.quantidadePelucia} unid.</p>
          </>
        )}
      </div>
    ))}

    <hr style={{ border: 'none', borderTop: '1px dashed #000', margin: '15px 0' }} />
    <p style={{ textAlign: 'justify', fontSize: '10px' }}>O(A) locatário(a) declara receber o(s) equipamento(s) em perfeito estado. Danos por mau uso serão de sua responsabilidade.</p>
    <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <p>_________________________</p>
        <p>{customer.name.toUpperCase()}</p>
    </div>
     <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <p>_________________________</p>
        <p>MONTANHA BILHAR</p>
    </div>
  </div>
);


interface FullScreenCustomerViewProps {
  customer: Customer;
  onClose: () => void;
}

const FullScreenCustomerView: React.FC<FullScreenCustomerViewProps> = ({ customer, onClose }) => {
  const contractRef = useRef<HTMLDivElement>(null);

  const handleA4Print = () => {
    if (!contractRef.current) return;
    const printContent = contractRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Não foi possível abrir a janela de impressão. Verifique o bloqueio de pop-ups.');
      return;
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>Ficha de Cliente - ${customer.name}</title>
          <style>
            @media print {
              @page { size: A4; margin: 0; }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .no-print { display: none !important; }
            }
            body { font-family: 'Inter', 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; background-color: #f9fafb; }
            h2, h3, h4 { margin: 0; padding: 0; font-weight: 600; }
            p { margin: 0; }
            .contract-container { max-width: 800px; margin: 2rem auto; background-color: white; border-radius: 8px; box-shadow: 0 0 20px rgba(0,0,0,0.05); }
            .contract-header { background-color: #2c3e50; color: white; padding: 1.5rem; text-align: center; border-radius: 8px 8px 0 0; }
            .contract-header h2 { font-size: 1.8em; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
            .contract-body { padding: 1rem; md:padding: 2rem; }
            .section-title { font-size: 1.25rem; color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 0.5rem; margin-bottom: 1.5rem; }
            .party-section { display: grid; grid-template-columns: 1fr; md:grid-template-columns: 1fr 1fr; gap: 1rem; }
            .party-block { margin-bottom: 1.5rem; }
            .party-block p { font-size: 1rem; line-height: 1.5; }
            .party-block strong { font-weight: 600; color: #2c3e50; }
            .equipment-block { border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 1.5rem; page-break-inside: avoid; overflow: hidden; }
            .equipment-header { padding: 0.75rem 1rem; border-bottom: 1px solid #e5e7eb; }
            .equipment-header h4 { font-size: 1.15rem; color: #1f2937; font-weight: 700; }
            .mesa-header { background-color: #e0f2fe; border-left: 5px solid #3b82f6; }
            .jukebox-header { background-color: #f3e8ff; border-left: 5px solid #a855f7; }
            .grua-header { background-color: #fed7aa; border-left: 5px solid #f97316; }
            .equipment-details { padding: 1rem; background-color: #fdfdfe; display: grid; grid-template-columns: 1fr; sm:grid-template-columns: 1fr 1fr; gap: 0.75rem 1.5rem; }
            .detail-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.95rem; padding: 0.25rem; }
            .detail-item-label { font-weight: 500; color: #6b7280; }
            .detail-item-value { font-weight: 600; color: #1f2937; }
            .clause-block p { text-align: justify; font-size: 1rem; }
            .date-stamp { text-align: center; margin-top: 2.5rem; font-size: 1rem; color: #6b7280; }
            .signature-section { display: flex; flex-direction: column; md:flex-row; justify-content: space-around; margin-top: 3rem; page-break-inside: avoid; gap: 2rem; }
            .signature-group { text-align: center; width: 100%; md:width: 45%; }
            .signature-image { max-width: 100%; height: 80px; object-fit: contain; margin: 0 auto; }
            .signature-placeholder { width: 100%; height: 80px; margin: 0 auto; border-bottom: 1px solid #d1d5db; }
            .signature-line { border-top: 1px solid #4b5563; margin-top: 4rem; }
            .signature-group p { margin: 0.5rem 0 0; font-size: 0.9rem; }
          </style>
        </head>
        <body><div class="contract-container">${printContent}</div></body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.focus(); printWindow.print(); printWindow.close(); }, 300);
  };

  const handleThermalPrint = () => {
    const receiptHtml = ReactDOMServer.renderToStaticMarkup(<ThermalReceipt customer={customer} />);
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Não foi possível abrir a janela de impressão. Verifique o bloqueio de pop-ups.');
      return;
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>Recibo - ${customer.name}</title>
          <style>
            @media print {
              @page { margin: 0; }
              body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>${receiptHtml}</body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.focus(); printWindow.print(); printWindow.close(); }, 300);
  };

  const renderEquipmentDetails = (equip: Equipment) => {
    let details: { [key: string]: string | number | null } = {};
    if (equip.type === 'mesa') {
      details = equip.billingType === 'monthly' ?
        { 'Modalidade': 'Mensal', 'Valor': `R$ ${equip.monthlyFeeValue?.toFixed(2)}` } :
        { 'Modalidade': 'Comissão', 'Ficha': `R$ ${equip.valorFicha?.toFixed(2)}`, '% Firma': `${equip.parteFirma}%`, '% Cliente': `${100 - (equip.parteFirma || 0)}%` };
    } else if (equip.type === 'jukebox') {
        details = { 'Modalidade': 'Comissão', '% Firma': `${equip.porcentagemJukeboxFirma}%`, '% Cliente': `${100 - (equip.porcentagemJukeboxFirma || 0)}%` };
    } else if (equip.type === 'grua') {
        details = { 'Capacidade': `${equip.quantidadePelucia} unid.` };
        if(equip.aluguelValor) details['Aluguel'] = `R$ ${equip.aluguelValor.toFixed(2)}`;
        if(equip.aluguelPercentual) details['Aluguel (%)'] = `${equip.aluguelPercentual}%`;
    }
    
    const allDetails = [
        { label: 'Nº Relógio', value: equip.relogioNumero },
        { label: 'Leitura Ant.', value: equip.relogioAnterior },
        ...Object.entries(details).map(([label, value]) => ({ label, value }))
    ];

    return allDetails.map(({ label, value }, index) => (
      value ? (
        <div key={index} className="detail-item">
          <span className="detail-item-label">{label}:</span> <span className="detail-item-value">{String(value)}</span>
        </div>
      ) : null
    ));
  };

  return (
    <div className="fixed inset-0 z-[300] bg-slate-900/80 flex items-center justify-center p-2 sm:p-4 no-print">
      <div className="w-full max-w-5xl h-full sm:h-[95vh] bg-gray-100 rounded-lg shadow-xl flex flex-col overflow-hidden">
        <header className="flex-shrink-0 flex flex-wrap justify-between items-center p-3 border-b bg-white">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Ficha Profissional do Cliente</h2>
          <div className='flex items-center'>
            <button onClick={handleA4Print} className="bg-blue-600 text-white font-bold py-2 px-3 sm:px-4 rounded-lg hover:bg-blue-700 active:scale-95 transition-all text-xs sm:text-sm mr-2">Imprimir A4</button>
            <button onClick={handleThermalPrint} className="bg-gray-700 text-white font-bold py-2 px-3 sm:px-4 rounded-lg hover:bg-gray-800 active:scale-95 transition-all text-xs sm:text-sm mr-2">Impressora Térmica</button>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-900 font-bold py-2 px-3 sm:px-4 text-xl sm:text-2xl">&times;</button>
          </div>
        </header>
        <div ref={contractRef} className="overflow-y-auto printable-area bg-white">
          <div className="contract-body">
            <div className="contract-header"><h2>Montanha Bilhar e Jukebox</h2></div>
            <div className='my-8 px-4 md:px-0'>
              <h3 className="section-title">Partes Envolvidas</h3>
              <div className="party-section">
                <div className="party-block">
                    <p><strong>LOCADORA:</strong> MONTANHA BILHAR E JUKEBOX</p>
                    <p><strong>CNPJ:</strong> 76.089.440/0001-29</p>
                    <p><strong>Telefone:</strong> (43) 99958-1993</p>
                    <p><strong>Localidade:</strong> Jaguapitã, PR</p>
                </div>
                <div className="party-block">
                    <p><strong>LOCATÁRIO(A):</strong> ${customer.name}</p>
                    <p><strong>CPF/RG:</strong> ${customer.cpfRg || 'N/A'}</p>
                    <p><strong>Endereço:</strong> ${customer.endereco || 'N/A'}, ${customer.cidade || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className='px-4 md:px-0'>
              <h3 className="section-title">Equipamentos e Condições</h3>
              {customer.equipment?.map((equip) => {
                  const equipmentClasses = { mesa: 'mesa-header', jukebox: 'jukebox-header', grua: 'grua-header' };
                  return (
                      <div key={equip.id} className="equipment-block">
                          <div className={`equipment-header ${equipmentClasses[equip.type]}`}>
                              <h4>{equip.type.charAt(0).toUpperCase() + equip.type.slice(1)} Nº ${equip.numero}</h4>
                          </div>
                          <div className="equipment-details">{renderEquipmentDetails(equip)}</div>
                      </div>
                  );
              })}
            </div>

            <div className="clause-block mt-8 px-4 md:px-0">
              <h3 className="section-title">Cláusula Contratual</h3>
              <p>O(A) LOCATÁRIO(A) recebe o(s) equipamento(s) descrito(s) em perfeito estado, responsabilizando-se pela sua guarda. As condições financeiras da locação estão detalhadas por equipamento. Danos por mau uso, negligência ou vandalismo serão de responsabilidade do(a) LOCATÁRIO(A).</p>
            </div>

            <p className="date-stamp">Firmado em Jaguapitã, ${formatDate(new Date())}.</p>

            <div className="signature-section px-4 md:px-0">
                <div className="signature-group">
                    {customer.companySignatureUrl ? <img src={customer.companySignatureUrl} alt="Assinatura da Empresa" className="signature-image" /> : <div className="signature-placeholder"></div>}
                    <div className="signature-line"></div>
                    <p><strong>MONTANHA BILHAR E JUKEBOX</strong></p><p>(LOCADORA)</p>
                </div>
                <div className="signature-group">
                    {customer.signatureUrl ? <img src={customer.signatureUrl} alt="Assinatura do Cliente" className="signature-image" /> : <div className="signature-placeholder"></div>}
                    <div className="signature-line"></div>
                    <p><strong>{customer.name.toUpperCase()}</strong></p><p>(LOCATÁRIO(A))</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenCustomerView;
