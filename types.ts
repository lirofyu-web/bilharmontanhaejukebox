
import { Timestamp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

export interface Customer {
    id: string;
    name: string;
    cidade: string;
    bairro: string;
    endereco: string;
    numero: string;
    telefone: string;
    linhaNumero: string;
    latitude?: number;
    longitude?: number;
    createdAt: Date;
    equipment: Equipment[];
    debtAmount: number;
    lastVisitedAt: Date | null;
    pendingPayment?: boolean;
}

export interface Equipment {
    id: string;
    type: 'mesa' | 'jukebox' | 'grua';
    numero: string;
    relogioAnterior: number;
    valorFicha: number;
}

export interface Billing {
    id: string;
    customerId: string;
    customerName: string;
    equipmentId: string;
    equipmentType: 'mesa' | 'jukebox' | 'grua';
    relogioAnterior: number;
    relogioAtual: number;
    totalFichas: number;
    valorFicha: number;
    totalBruto: number;
    comissaoPercentual: number;
    valorComissao: number;
    totalLiquido: number;
    valorRecebido: number;
    valorDebitoAdicionado: number;
    valorDebitoNegativo: number;
    paymentMethod: 'dinheiro' | 'pix' | 'cartao' | 'misto' | 'pending_payment';
    amountPaidDinheiro?: number;
    amountPaidPix?: number;
    amountPaidCartao?: number;
    settledAt: Date;
    observacao?: string;
}

export interface Expense {
    id: string;
    description: string;
    amount: number;
    category: 'abastecimento' | 'manutencao' | 'alimentacao' | 'pecas' | 'outros';
    date: Date;
}

export interface DebtPayment {
    id: string;
    customerId: string;
    customerName: string;
    amountPaid: number;
    paidAt: Date;
    paymentMethod: 'dinheiro' | 'pix' | 'cartao' | 'misto';
    amountPaidDinheiro?: number;
    amountPaidPix?: number;
    amountPaidCartao?: number;
}

export interface Warning {
    id: string;
    customerId: string;
    customerName: string;
    message: string;
    createdAt: Date;
    isResolved: boolean;
}

export interface Route {
    id: string;
    name: string;
    customerIds: string[];
    createdAt: Date;
}

export type View = 'DASHBOARD' | 'CLIENTES' | 'COBRANCAS' | 'DESPESAS' | 'ROTAS' | 'RELATORIOS' | 'CONFIGURACOES';

export type Theme = 'light' | 'dark';

export interface SavedUser {
    email: string;
    pass?: string; 
}

export interface PixKey {
    id: string;
    name: string;
    key: string;
    isDefault: boolean;
}

export interface UserProfile {
    id: string;
    email: string;
    createdAt: Date;
    privacyPinHash: string;
    pixKeys?: PixKey[];
}
