
// components/ThermalRouteSheet.tsx
import React from 'react';
import { Customer } from '../types';

interface ThermalRouteSheetProps {
  customers: Customer[];
  isOptimized: boolean;
}

const ThermalRouteSheet: React.FC<ThermalRouteSheetProps> = ({ customers, isOptimized }) => {
    const printDate = new Date().toLocaleDateString('pt-BR');

    const customersByCity = customers.reduce((acc, customer) => {
        const city = customer.cidade.trim() || 'Sem Cidade';
        if (!acc[city]) {
            acc[city] = [];
        }
        acc[city].push(customer);
        return acc;
    }, {} as Record<string, Customer[]>);

    const sortedCities = isOptimized ? ['Rota Otimizada'] : Object.keys(customersByCity).sort();
    if(isOptimized) {
        customersByCity['Rota Otimizada'] = customers;
    }

    return (
        <div className="bg-white text-black p-2 font-mono text-base" style={{ width: '80mm' }}>
            <div className="text-center mb-2">
                <h2 className="font-bold text-lg">MONTANHA BILHAR & JUKEBOX</h2>
                <p className="text-base">Rota de Cobrança</p>
                <p className="text-base">Data: {printDate}</p>
            </div>

            {sortedCities.map(city => (
                <div key={city}>
                    {!isOptimized && (
                         <>
                            <div className="border-t-2 border-dashed border-black my-2"></div>
                            <h3 className="font-bold text-center text-lg uppercase">{city}</h3>
                            <div className="border-t border-dashed border-black my-2"></div>
                         </>
                    )}
                   
                    {customersByCity[city].map((customer, index) => {
                        const equipamentos = [];
                        if ((customer.equipment || []).some(e => e.type === 'mesa')) equipamentos.push('M');
                        if ((customer.equipment || []).some(e => e.type === 'jukebox')) equipamentos.push('J');
                        if ((customer.equipment || []).some(e => e.type === 'grua')) equipamentos.push('G');

                        return (
                            <div key={customer.id} className="py-1 border-b border-dotted border-gray-400">
                                <div className="flex items-start gap-2">
                                    <span className="font-bold pt-0.5">{isOptimized ? `${index + 1}.` : '•'}</span>
                                    <div className="flex-grow">
                                        <p className="font-bold uppercase text-lg">{customer.name}</p>
                                        <p className="text-base">{customer.endereco}</p>
                                        <div className="flex justify-between items-center mt-0.5">
                                            <p className="text-base font-semibold">
                                                Equip: {equipamentos.join(', ') || 'N/A'}
                                            </p>
                                            {customer.debtAmount > 0 && (
                                                <p className="font-bold text-lg">
                                                    Dívida: R$ {customer.debtAmount.toFixed(2)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-1 pl-4">
                                  <div className="w-3 h-3 border border-black bg-white"></div>
                                  <span className="text-base">Visitado</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
             <div className="mt-4 text-center text-base">
                <p>-- Fim da Rota --</p>
            </div>
        </div>
    );
};

export default ThermalRouteSheet;
