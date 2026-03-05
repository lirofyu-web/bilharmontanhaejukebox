
import { Customer, Equipment } from '../types';

const formatCurrency = (value: number | null | undefined) => {
  if (value == null || isNaN(Number(value))) return '---';
  return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
};

const generateInfoRow = (label: string, value: string | number | null | undefined, icon: string) => {
  return `
    <div style="display: flex; align-items: center; margin-bottom: 10px; font-size: 14px;">
      <span style="font-size: 18px; margin-right: 12px; width: 22px; text-align: center;">${icon}</span>
      <div>
        <p style="font-size: 10px; color: #E2E8F0; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">${label}</p>
        <p style="font-weight: 600; color: #FFFFFF; margin: 2px 0 0 0; font-size: 13px;">${value || '---'}</p>
      </div>
    </div>
  `;
};

const generateEquipmentCard = (equip: Equipment) => {
  const typeDetails = {
    mesa: { title: 'Mesa de Sinuca', icon: '🎱', color: '#2C5282' },
    jukebox: { title: 'Jukebox', icon: '🎵', color: '#276749' },
    grua: { title: 'Grua de Pelúcia', icon: '🏗️', color: '#B83280' },
    default: { title: 'Equipamento', icon: '🎲', color: '#718096' },
  };
  const details = typeDetails[equip.type] || typeDetails.default;

  let financialDetails = '';
  if (equip.type === 'mesa') {
    const parteFirma = equip.parteFirma || 0;
    const parteCliente = 100 - parteFirma;
    financialDetails = equip.billingType === 'monthly'
      ? `<div style="background: ${details.color}; padding: 6px; border-radius: 4px;"><p style="font-size: 11px; color: white; margin: 0;">Mensalidade Fixa: <strong>${formatCurrency(equip.monthlyFeeValue)}</strong></p></div>`
      : `<div style="background: ${details.color}; padding: 6px; border-radius: 4px;"><p style="font-size: 11px; color: white; margin: 0;">Ficha: <strong>${formatCurrency(equip.valorFicha)}</strong> / Divisão: <strong>${parteFirma}% (Firma) / ${parteCliente}% (Cliente)</strong></p></div>`;
  } else if (equip.type === 'jukebox') {
    const parteFirma = equip.porcentagemJukeboxFirma || 0;
    const parteCliente = 100 - parteFirma;
    financialDetails = `<div style="background: ${details.color}; padding: 6px; border-radius: 4px;"><p style="font-size: 11px; color: white; margin: 0;">Divisão: <strong>${parteFirma}% (Firma) / ${parteCliente}% (Cliente)</strong></p></div>`;
  } else if (equip.type === 'grua') {
    let gruaInfo = [];
    if (equip.aluguelValor && equip.aluguelValor > 0) gruaInfo.push(`Aluguel Fixo: <strong>${formatCurrency(equip.aluguelValor)}</strong>`);
    if (equip.aluguelPercentual && equip.aluguelPercentual > 0) {
        const parteCliente = 100 - (equip.aluguelPercentual || 0);
        gruaInfo.push(`Aluguel: <strong>${equip.aluguelPercentual}% (Firma) / ${parteCliente}% (Cliente)</strong>`);
    }
    financialDetails = `<div style="background: ${details.color}; padding: 6px; border-radius: 4px;"><p style="font-size: 11px; color: white; margin: 0;">${gruaInfo.join(' / ')}</p></div>`;
  }

  return `
    <div style="background-color: #FFFFFF; border-radius: 8px; padding: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); page-break-inside: avoid; border-left: 5px solid ${details.color};">
      <h4 style="font-weight: 700; font-size: 16px; margin: 0 0 10px 0; color: #1A202C; display: flex; align-items: center; flex-wrap: wrap;">
        <span style="font-size: 22px; margin-right: 10px;">${details.icon}</span>
        ${details.title} - Nº <span style="background-color: ${details.color}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 15px; margin-left: 8px;">${equip.numero}</span>
      </h4>
      <div style="border-top: 1px solid #E2E8F0; padding-top: 10px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <p style="font-size: 11px; color: #4A5568; margin:0;">Nº do Relógio: <strong style="color: #1A202C;">${equip.relogioNumero || '---'}</strong></p>
            <p style="font-size: 11px; color: #4A5568; margin:0;">Leitura Anterior: <strong style="color: #1A202C;">${equip.relogioAnterior || '---'}</strong></p>
        </div>
        ${financialDetails ? `<div style="margin-top: 10px;">${financialDetails}</div>` : ''}
      </div>
    </div>
  `;
};

export const generateCustomerSheetHtml = (customer: Customer): string => {
  const equipmentHtml = (customer.equipment && customer.equipment.length > 0)
    ? `<div style="display: grid; grid-template-columns: 1fr; gap: 12px;">${customer.equipment.map(generateEquipmentCard).join('')}</div>`
    : '<p style="color: #A0AEC0; text-align: center; padding: 20px 0; background-color: rgba(0,0,0,0.1); border-radius: 6px;">Nenhum equipamento cadastrado.</p>';

  const generatedDate = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return `
    <div class="sheet-container" style="background-color: #1A365D; background-image: linear-gradient(to bottom right, #1A365D, #152A47); padding: 15mm; font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; width: 210mm; min-height: 297mm; margin: auto; box-shadow: 0 10px 25px rgba(0,0,0,0.2); box-sizing: border-box; color: #FFFFFF; display: flex; flex-direction: column;">
      
      <header class="header-flex" style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 15px; margin-bottom: 20px; border-bottom: 1px solid #2A4365; flex-shrink: 0;">
        <div style="display: flex; align-items: center;">
          <img src="/logo-escuro.png" alt="Logo" style="height: 50px; margin-right: 15px; border-radius: 8px;">
          <div>
            <h1 style="font-size: 26px; font-weight: 800; margin: 0; color: #FFFFFF; text-shadow: 1px 1px 3px rgba(0,0,0,0.2);">
              <span style="color: #63B3ED;">MONTANHA</span>
              <span style="color: #4FD1C5;">BILHAR</span>
              <span style="color: #F6AD55;">&</span>
              <span style="color: #9F7AEA;">JUKEBOX</span>
            </h1>
            <p style="font-size: 11px; margin: 4px 0 0 0; color: #A0AEC0;">CNPJ: 76.089.440/0001-29 | (43) 99958-1993</p>
          </div>
        </div>
        <div style="text-align: right;" class="header-info">
          <h2 style="font-size: 16px; font-weight: 700; margin: 0; color: #FFFFFF;">Ficha Cadastral do Cliente</h2>
          <p style="font-size: 11px; margin: 4px 0 0 0; color: #A0AEC0;">Gerado em: ${generatedDate}</p>
        </div>
      </header>

      <main style="flex-grow: 1;">
        <div class="customer-info-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
            <div style="background-color: rgba(42, 67, 101, 0.7); padding: 15px; border-radius: 10px;">
                <h3 style="font-size: 16px; font-weight: 700; color: #63B3ED; margin: 0 0 12px 0; border-bottom: 1px solid #2A4365; padding-bottom: 6px;">Dados Pessoais</h3>
                ${generateInfoRow('Nome / Razão Social', customer.name, '👤')}
                ${generateInfoRow('CPF / CNPJ', customer.cpfRg, '💳')}
                ${generateInfoRow('Telefone', customer.telefone, '📞')}
                ${generateInfoRow('Data do Contrato', customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('pt-BR') : '---', '📅')}
            </div>

            <div style="background-color: rgba(42, 67, 101, 0.7); padding: 15px; border-radius: 10px;">
                <h3 style="font-size: 16px; font-weight: 700; color: #4FD1C5; margin: 0 0 12px 0; border-bottom: 1px solid #2A4365; padding-bottom: 6px;">Localização</h3>
                ${generateInfoRow('Endereço', customer.endereco, '📍')}
                ${generateInfoRow('Cidade', customer.cidade, '🏙️')}
            </div>
        </div>

        <section>
          <h3 style="font-size: 18px; font-weight: 700; color: #FFFFFF; margin-bottom: 12px; display: flex; align-items: center;">
            <span style="font-size: 22px; margin-right: 12px;">🛠️</span>
            Equipamentos Contratados (${(customer.equipment || []).length})
          </h3>
          ${equipmentHtml}
        </section>
      </main>

      <footer style="text-align: center; margin-top: 20px; padding-top: 10px; border-top: 1px solid #2A4365; font-size: 10px; color: #A0AEC0; flex-shrink: 0;">
        <p style="margin: 0;">Montanha Bilhar & Jukebox - Inovação e diversão para seu estabelecimento.</p>
        <p style="margin: 4px 0 0 0;">Jaguapitã - PR</p>
      </footer>
      
      <style>
        @media (max-width: 768px) {
          .sheet-container {
            width: 100% !important;
            height: auto !important;
            min-height: auto !important;
            padding: 10px !important;
          }
          .header-flex {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 15px;
          }
          .header-info {
            text-align: left !important;
          }
          h1 {
            font-size: 20px !important;
          }
          .customer-info-grid {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
        }
      </style>
    </div>
  `;
};
