import { Customer, Equipment } from '../types';

// Helper to format currency
const formatCurrency = (value: number | null | undefined) => {
  if (value == null) return '---';
  return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
};

// Generates a simple info row
const generateInfoRow = (label: string, value: string | number | null | undefined) => `
  <div style="margin-bottom: 8px; word-break: break-word;">
    <p style="font-size: 10px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em;">${label}</p>
    <p style="font-size: 14px; font-weight: 600; color: #1F2937;">${value || '---'}</p>
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
    <div style="padding: 12px; border-left: 4px solid ${styles.border}; background-color: #F9FAFB; border-radius: 0 8px 8px 0; page-break-inside: avoid;">
      <h4 style="font-weight: 700; font-size: 16px; margin-bottom: 12px; color: #1F2937;">${styles.title} - Nº ${equip.numero}</h4>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px 16px; font-size: 12px;">
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
    <div style="background-color: white; padding: 40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: auto;">
      <!-- Header -->
      <header style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 16px; border-bottom: 4px solid #38bdf8;">
        <div style="width: 150px;">
            <p style="font-weight: bold; font-size: 1.1rem;">MONTANHA BILHAR E JUKEBOX</p>
        </div>
        <div style="text-align: right;">
            <p style="font-weight: 700; font-size: 14px;">CNPJ: 76.089.440/0001-29</p>
            <p style="font-size: 12px;">Jaguapitã - PR | (43) 99958-1993</p>
            <p style="font-weight: 700; font-size: 14px; margin-top: 4px;">DIVERSÃO LEVADA A SÉRIO</p>
            <p style="font-size: 12px; color: #6B7280; margin-top: 8px;">Ficha Cadastral | Gerado em: ${generatedDate}</p>
        </div>
      </header>

      <!-- Customer Data -->
      <main style="margin-top: 24px;">
        <section>
          <h2 style="font-size: 16px; font-weight: 700; color: white; background-color: #06B6D4; padding: 8px 12px; border-radius: 8px 8px 0 0; margin-bottom: -1px;">DADOS DO CLIENTE</h2>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px 16px; padding: 16px; border: 1px solid #D1D5DB; border-radius: 0 0 8px 8px;">
            <div style="grid-column: span 2;">${generateInfoRow('Nome / Razão Social', customer.name)}</div>
            <div>${generateInfoRow('CPF / CNPJ', customer.cpfRg)}</div>
            <div style="grid-column: span 3;">${generateInfoRow('Endereço', customer.endereco)}</div>
            <div>${generateInfoRow('Cidade', customer.cidade)}</div>
            <div>${generateInfoRow('Telefone', customer.telefone)}</div>
            <div>${generateInfoRow('Cobrador', customer.linhaNumero)}</div>
            <div style="grid-column: span 2;">${generateInfoRow('Data do Contrato', customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('pt-BR') : '---')}</div>
          </div>
        </section>

        <!-- Equipment -->
        <section style="margin-top: 24px;">
          <h2 style="font-size: 16px; font-weight: 700; color: white; background-color: #334155; padding: 8px 12px; border-radius: 8px 8px 0 0; margin-bottom: -1px;">EQUIPAMENTOS (${(customer.equipment || []).length})</h2>
          <div style="padding: 16px; border: 1px solid #D1D5DB; border-radius: 0 0 8px 8px; background-color: #F9FAFB;">
            ${equipmentHtml}
          </div>
        </section>

        <!-- Terms -->
        <section style="margin-top: 24px; page-break-inside: avoid;">
           <h2 style="font-size: 16px; font-weight: 700; color: white; background-color: #334155; padding: 8px 12px; border-radius: 8px 8px 0 0; margin-bottom: -1px;">TERMOS DE LOCAÇÃO</h2>
            <div style="padding: 16px; border: 1px solid #D1D5DB; border-radius: 0 0 8px 8px;">
                <p style="font-size: 10px; color: #4B5563; line-height: 1.6;">
                    O LOCATÁRIO RECEBE NESTA DATA O EQUIPAMENTO ACIMA IDENTIFICADO COM TODOS OS EQUIPAMENTOS INTERNOS E EXTERNOS EM PERFEITO ESTADO DE USO E CONSERVAÇÃO. O VALOR DA LOCAÇÃO SERÁ APURADO MEDIANTE O USO DO RESPECTIVO EQUIPAMENTO, SENDO QUE O PAGAMENTO OCORRERÁ NO PRAZO E NOS PERCENTUAIS ACIMA MENCIONADOS.
                </p>
            </div>
        </section>
      </main>

      <!-- Footer -->
      <footer style="padding-top: 64px; page-break-before: page;">
          <div style="display: flex; justify-content: space-around; align-items: flex-end; text-align: center;">
              <div style="width: 40%;">
                  <div style="border-top: 1px solid #9CA3AF; padding-top: 8px; height: 80px; display: flex; flex-direction: column; justify-content: space-between;">
                      ${customer.assinaturaCliente ? `<img src="${customer.assinaturaCliente}" alt="Assinatura Cliente" style="max-height: 48px; margin: 0 auto;" />` : '<div style="height: 48px;"></div>'}
                      <p style="font-size: 14px; font-weight: 600; color: #1F2937; margin-top: 4px;">${customer.name}</p>
                      <p style="font-size: 12px; color: #6B7280;">(Assinatura Cliente)</p>
                  </div>
              </div>
              <div style="width: 40%;">
                   <div style="border-top: 1px solid #9CA3AF; padding-top: 8px; height: 80px; display: flex; flex-direction: column; justify-content: space-between;">
                      ${customer.assinaturaFirma ? `<img src="${customer.assinaturaFirma}" alt="Assinatura Firma" style="max-height: 48px; margin: 0 auto;" />` : '<div style="height: 48px;"></div>'}
                      <p style="font-size: 14px; font-weight: 600; color: #1F2937; margin-top: 4px;">Montanha Bilhar & Jukebox</p>
                      <p style="font-size: 12px; color: #6B7280;">(Assinatura Firma)</p>
                  </div>
              </div>
          </div>
      </footer>
    </div>
  `;
};
