import { Customer, Equipment } from '../types';
import { CLAUSULAS_CONTRATUAIS, TERMOS_DE_LOCACAO } from '../data/terms';

const formatEquipment = (equip: Equipment): string => {
    const details: string[] = [];
    const equipmentTypeText = {
        'mesa': 'Mesa de Sinuca',
        'jukebox': 'Jukebox',
        'grua': 'Grua de Pelúcia'
    };

    details.push(`- *${equipmentTypeText[equip.type]} ${equip.numero}*`);
    if (equip.relogioNumero) details.push(`  Nº Relógio: ${equip.relogioNumero}`);
    
    if (equip.type === 'mesa') {
        if (equip.billingType === 'monthly') {
            details.push(`  Tipo: Mensalidade`);
            details.push(`  Valor: R$ ${(equip.monthlyFeeValue || 0).toFixed(2)}`);
        } else {
            details.push(`  Tipo: Porcentagem`);
            details.push(`  Vlr. Ficha: R$ ${(equip.valorFicha || 0).toFixed(2)}`);
            details.push(`  Parte da Firma: ${equip.parteFirma || 0}%`);
        }
    } else if (equip.type === 'jukebox') {
        details.push(`  Parte da Firma: ${equip.porcentagemJukeboxFirma || 0}%`);
    } else if (equip.type === 'grua') {
        if (equip.aluguelPercentual != null) details.push(`  Aluguel: ${equip.aluguelPercentual}%`);
        if (equip.aluguelValor != null) details.push(`  Aluguel: R$ ${(equip.aluguelValor || 0).toFixed(2)}`);
        if (equip.quantidadePelucia) details.push(`  Capacidade: ${equip.quantidadePelucia} pelúcias`);
    }

    return details.join('\n');
};

export const generateCustomerDataText = (customer: Customer): string => {
    const separator = '--------------------------------\n';

    // LOCADORA Section
    let text = `*CONTRATO DE LOCAÇÃO DE EQUIPAMENTOS*\n`;
    text += separator;
    text += `*LOCADORA:*\n`;
    text += `BILHAR MONTANHA\n`;
    text += `CNPJ: 76.089.440/0001-29\n`;
    text += `Telefone: (43) 99958-1993\n`;
    text += `Endereço: Rua Pernambuco, 260 - Centro, Jaguapitã - PR\n`;
    text += separator;

    // LOCATÁRIO Section
    text += `*LOCATÁRIO:*\n`;
    text += `*Nome:* ${customer.name}\n`;
    if (customer.telefone) text += `*Telefone:* ${customer.telefone}\n`;
    const fullAddress = [customer.endereco, customer.cidade].filter(Boolean).join(', ');
    if (fullAddress) text += `*Endereço:* ${fullAddress}\n`;
    if (customer.pontoReferencia) text += `*Ponto de Ref.:* ${customer.pontoReferencia}\n`;
    text += separator;

    // EQUIPAMENTOS Section
    if (customer.equipment && customer.equipment.length > 0) {
        text += `*EQUIPAMENTO(S) LOCADO(S):*\n`;
        text += customer.equipment.map(formatEquipment).join('\n\n') + '\n';
        text += separator;
    }

    // TERMOS DE LOCAÇÃO Section
    text += `*TERMOS DE LOCAÇÃO:*\n`;
    text += `${TERMOS_DE_LOCACAO}\n`;
    text += separator;

    // CLÁUSULAS Section
    text += `*CLÁUSULAS CONTRATUAIS:*\n`;
    text += `${CLAUSULAS_CONTRATUAIS}\n`;
    text += separator;

    // DATA Section
    const contractDate = customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '[Data não disponível]';
    text += `Jaguapitã, ${contractDate}\n`;

    return text.trim();
};
