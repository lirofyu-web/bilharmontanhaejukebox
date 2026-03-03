import { Customer, Equipment } from '../types';

// Helper to format currency
const formatCurrency = (value: number | null | undefined) => {
  if (value == null) return '---';
  return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
};

// Generates a simple info row
const generateInfoRow = (label: string, value: string | number | null | undefined) => `
  <div style="margin-bottom: 8px; word-break: break-word;">
    <p style="font-size: 12px; color: #374151; text-transform: uppercase;">${label}</p>
    <p style="font-size: 16px; font-weight: 700; color: #111827;">${value || '---'}</p>
  </div>
`;

// Generates the HTML for a single piece of equipment
const generateEquipmentCard = (equip: Equipment) => {
  const typeStyles = {
    mesa: { title: 'Mesa de Sinuca', border: '#06B6D4' },
    jukebox: { title: 'Jukebox', border: '#D946EF' },
    grua: { title: 'Grua de Pelúcia', border: '#F97316' },
    default: { title: 'Equipamento', border: '#9CA3AF' },
  };
  const styles = typeStyles[equip.type] || typeStyles.default;

  let details = '';
  if (equip.type === 'mesa') {
    details = equip.billingType === 'monthly'
      ? generateInfoRow('Mensalidade Fixa', formatCurrency(equip.monthlyFeeValue))
      : `${generateInfoRow('Valor da Ficha', formatCurrency(equip.valorFicha))}${generateInfoRow('Divisão (Firma)', `${equip.parteFirma || 0}%`)}${generateInfoRow('Divisão (Cliente)', `${equip.parteCliente || 0}%`)}`;
  } else if (equip.type === 'jukebox') {
    details = `${generateInfoRow('Divisão (Firma)', `${equip.porcentagemJukeboxFirma || 0}%`)}${generateInfoRow('Divisão (Cliente)', `${equip.porcentagemJukeboxCliente || 0}%`)}`;
  } else if (equip.type === 'grua') {
    if (equip.aluguelValor && equip.aluguelValor > 0) details += generateInfoRow('Aluguel (Fixo)', formatCurrency(equip.aluguelValor));
    if (equip.aluguelPercentual && equip.aluguelPercentual > 0) details += generateInfoRow('Aluguel (%)', `${equip.aluguelPercentual}%`);
    details += generateInfoRow('Capacidade Pelúcias', equip.quantidadePelucia || 0);
  }

  return `
    <div style="padding: 12px; border: 1px solid #D1D5DB; border-radius: 8px; page-break-inside: avoid; background-color: #F9FAFB;">
      <h4 style="font-weight: 700; font-size: 18px; margin-bottom: 12px; color: #111827; border-bottom: 2px solid ${styles.border}; padding-bottom: 8px;">${styles.title} - Nº ${equip.numero}</h4>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px 16px; font-size: 14px;">
        ${equip.relogioNumero ? generateInfoRow('Nº do Relógio', equip.relogioNumero) : ''}
        ${generateInfoRow('Leitura Anterior', equip.relogioAnterior)}
        ${details}
      </div>
    </div>
  `;
};


// Main function to generate the full customer sheet HTML
export const generateCustomerSheetHtml = (customer: Customer): string => {
  const equipmentHtml = (customer.equipment && customer.equipment.length > 0)
    ? `<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">${customer.equipment.map(generateEquipmentCard).join('')}</div>`
    : '<p style="color: #6B7280; text-align: center; padding: 16px 0;">Nenhum equipamento cadastrado.</p>';

  const generatedDate = new Date().toLocaleDateString('pt-BR');

  return `
    <div style="background-color: white; padding: 40px; font-family: 'Courier New', Courier, monospace; max-width: 800px; margin: auto; color: #111827;">
      <!-- Header -->
      <header style="text-align: center; margin-bottom: 32px;">
        <h1 style="font-weight: bold; font-size: 24px; margin-bottom: 4px;">MONTANHA BILHAR E JUKEBOX</h1>
        <p style="font-size: 14px; margin-bottom: 4px;">CNPJ: 76.089.440/0001-29</p>
        <p style="font-size: 14px; margin-bottom: 8px;">Jaguapitã - PR | (43) 99958-1993</p>
        <p style="font-weight: bold; font-size: 16px; border-top: 2px dashed #9CA3AF; border-bottom: 2px dashed #9CA3AF; padding: 8px 0; margin: 16px 0;">DIVERSÃO LEVADA A SÉRIO</p>
        <p style="font-size: 12px; color: #6B7280;">Ficha Cadastral | ${generatedDate}</p>
      </header>

      <!-- Customer Data -->
      <main>
        <section style="margin-bottom: 32px;">
          <h2 style="font-size: 18px; font-weight: 700; border-bottom: 2px solid #334155; padding-bottom: 8px; margin-bottom: 16px;">DADOS DO CLIENTE</h2>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px 16px;">
            <div style="grid-column: span 2;">${generateInfoRow('Nome/Razão Social', customer.name)}</div>
            <div>${generateInfoRow('CPF/CNPJ', customer.cpfRg)}</div>
            <div style="grid-column: span 3;">${generateInfoRow('Endereço', customer.endereco)}</div>
            <div>${generateInfoRow('Cidade', customer.cidade)}</div>
            <div>${generateInfoRow('Telefone', customer.telefone)}</div>
            <div>${generateInfoRow('Data do Contrato', customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('pt-BR') : '---')}</div>
          </div>
        </section>

        <!-- Equipment -->
        <section style="margin-bottom: 32px; page-break-before: auto;">
          <h2 style="font-size: 18px; font-weight: 700; border-bottom: 2px solid #334155; padding-bottom: 8px; margin-bottom: 16px;">EQUIPAMENTOS (${(customer.equipment || []).length})</h2>
          ${equipmentHtml}
        </section>

        <!-- Terms -->
        <section style="margin-bottom: 48px; page-break-inside: avoid;">
           <h2 style="font-size: 18px; font-weight: 700; border-bottom: 2px solid #334155; padding-bottom: 8px; margin-bottom: 16px;">TERMOS DE LOCAÇÃO</h2>
            <p style="font-size: 12px; color: #4B5563; line-height: 1.6;">
                O(A) locatário(a) declara receber o(s) equipamento(s) em perfeito estado. Danos por mau uso serão de sua responsabilidade.
            </p>
        </section>
      </main>

      <!-- Footer -->
      <footer style="padding-top: 64px; text-align: center;">
        <div style="display: inline-block; width: 60%; border-top: 2px solid #6B7280; padding-top: 8px;">
            <p style="font-size: 16px; font-weight: 700;">${customer.name}</p>
            <p style="font-size: 12px; color: #6B7280;">(Assinatura do Cliente)</p>
        </div>
      </footer>

    </div>
  `;
};
