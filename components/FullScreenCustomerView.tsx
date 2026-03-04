import React, { useMemo } from 'react';
import { Customer, Billing, DebtPayment, Equipment, Warning } from '../types';
import { XIcon } from './icons/XIcon';
import { BilliardIcon } from './icons/BilliardIcon';
import { JukeboxIcon } from './icons/JukeboxIcon';
import { CraneIcon } from './icons/CraneIcon';
import { ReceiptIcon } from './icons/ReceiptIcon';
import { CurrencyDollarIcon } from './icons/CurrencyDollarIcon';
import { PurpleBilliardBallIcon } from './icons/PurpleBilliardBallIcon';

const FullScreenCustomerView: React.FC<any> = ({ 
    customer, 
    onClose, 
    billings, 
    warnings, 
    debtPayments, 
    areValuesHidden,
    onWarningClick,
}) => {
    
    const historyItems = useMemo(() => {
        if (!customer) return [];
        const customerBillings = (billings || [])
            .filter((b: Billing) => b.customerId === customer.id)
            .map((b: Billing) => ({
                id: b.id,
                date: new Date(b.settledAt),
                type: 'billing',
                description: `Cobrança - ${b.equipmentType} ${b.equipmentNumero}`,
                amount: (b.valorPagoDinheiro || 0) + (b.valorPagoPix || 0),
                debtChange: b.valorDebitoNegativo || 0,
                paymentMethod: b.paymentMethod,
                equipmentType: b.equipmentType,
            }));

        const customerPayments = (debtPayments || [])
            .filter((p: DebtPayment) => p.customerId === customer.id)
            .map((p: DebtPayment) => ({
                id: p.id,
                date: new Date(p.paidAt),
                type: 'payment',
                description: 'Pagamento de Dívida',
                amount: p.amountPaid,
                debtChange: -p.amountPaid,
                paymentMethod: p.paymentMethod,
                paymentDetails: {
                    dinheiro: p.amountPaidDinheiro,
                    pix: p.amountPaidPix,
                },
            }));

        return [...customerBillings, ...customerPayments].sort((a, b) => b.date.getTime() - a.date.getTime());
    }, [customer, billings, debtPayments]);

    const handleWarningClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onWarningClick) {
            onWarningClick(customer);
        }
    };

    const hasActiveWarning = useMemo(() => {
        return warnings.some((w: Warning) => w.customerId === customer.id && !w.isResolved);
    }, [warnings, customer.id]);

    const EquipmentIcon: React.FC<{ type: Equipment['type'], className?: string }> = ({ type, className }) => {
        const finalClassName = className || 'w-5 h-5';
        const colorMap = {
            mesa: 'text-cyan-400',
            jukebox: 'text-fuchsia-400',
            grua: 'text-orange-400',
        };
        const colors = colorMap[type] || '';
        switch (type) {
            case 'mesa': return <BilliardIcon className={`${finalClassName} ${colors}`} />;
            case 'jukebox': return <JukeboxIcon className={`${finalClassName} ${colors}`} />;
            case 'grua': return <CraneIcon className={`${finalClassName} ${colors}`} />;
            default: return null;
        }
    };

    const equipmentTypeText = {
        'mesa': 'Mesa de Sinuca',
        'jukebox': 'Jukebox',
        'grua': 'Grua de Pelúcia'
    };
    
    const colorStyles = {
        mesa: { bg: 'bg-cyan-100 dark:bg-cyan-900/50', text: 'text-cyan-600 dark:text-cyan-400' },
        jukebox: { bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/50', text: 'text-fuchsia-600 dark:text-fuchsia-400' },
        grua: { bg: 'bg-orange-100 dark:bg-orange-900/50', text: 'text-orange-600 dark:text-orange-400' },
        payment: { bg: 'bg-emerald-100 dark:bg-emerald-900/50', text: 'text-emerald-600 dark:text-emerald-400' }
    };

    if (!customer) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/70 backdrop-blur-sm animate-fade-in">
            <div className="relative h-full bg-slate-100 dark:bg-slate-900 overflow-y-auto">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/50 text-white hover:bg-slate-700/70 transition-colors"
                    aria-label="Fechar"
                >
                    <XIcon className="w-6 h-6" />
                </button>

                <div className="p-6 pt-16">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                            {customer.name}
                            {hasActiveWarning && (
                                <button onClick={handleWarningClick} title="Aviso pendente">
                                    <PurpleBilliardBallIcon className="w-6 h-6 pulse-indicator" />
                                </button>
                            )}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400">{customer.cidade}</p>
                    </div>

                    {/* Ações principais (Faturar, Editar, etc) podem ser colocadas aqui se necessário */}

                    <section className="mb-8">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Equipamentos</h3>
                        <div className="space-y-4">
                            {(customer.equipment || []).map((equip: Equipment) => (
                                <div key={equip.id} className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center gap-3 mb-3">
                                        <EquipmentIcon type={equip.type} className="w-6 h-6" />
                                        <span className="font-bold text-lg text-slate-800 dark:text-slate-100">{equipmentTypeText[equip.type]} {equip.numero}</span>
                                    </div>
                                    {/* Detalhes do equipamento aqui */}
                                </div>
                            ))}
                             {(!customer.equipment || customer.equipment.length === 0) && (
                                <p className="text-slate-500 dark:text-slate-400 text-center py-4">Nenhum equipamento cadastrado.</p>
                            )}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Histórico de Transações</h3>
                        <div className="space-y-4">
                            {historyItems.length > 0 ? historyItems.map((item: any) => {
                                const style = item.type === 'billing' ? colorStyles[item.equipmentType || 'mesa'] : colorStyles.payment;
                                return (
                                <div key={item.id} className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 flex items-start gap-4">
                                    <div className={`mt-1 flex-shrink-0 p-2 rounded-full ${style.bg}`}>
                                        {item.type === 'billing' 
                                            ? <ReceiptIcon className={`w-5 h-5 ${style.text}`} />
                                            : <CurrencyDollarIcon className={`w-5 h-5 ${style.text}`} />
                                        }
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-slate-800 dark:text-slate-100">{item.description}</p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{item.date.toLocaleDateString('pt-BR')}</p>
                                            </div>
                                            <div className="text-right">
                                                {item.amount > 0 && (
                                                  <p className={`font-mono font-bold text-lg ${item.type === 'payment' ? 'text-emerald-500' : 'text-lime-500'}`}>
                                                     {areValuesHidden ? 'R$ •••,••' : `${item.type === 'payment' ? '+' : ''} R$ ${item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                                  </p>
                                                )}
                                                {item.debtChange > 0 && item.type === 'billing' && (
                                                    <p className="font-mono text-sm text-red-500">
                                                        (Dívida: {areValuesHidden ? 'R$ •••,••' : `R$ ${item.debtChange.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`})
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                )
                            }) : (
                                <div className="text-center py-12 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-lg shadow-inner">
                                    <p>Nenhuma transação registrada.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
            <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default FullScreenCustomerView;
