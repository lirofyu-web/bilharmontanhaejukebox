
// components/ThermalReportSheet.tsx
import React from 'react';

export interface ReportColumn {
  header: string;
  accessor: string;
  render?: (value: any, item: any) => React.ReactNode; // Optional custom render function
  className?: string;
}

interface ThermalReportSheetProps {
  title: string;
  columns: ReportColumn[];
  data: any[];
  summary?: { label: string; value: string | number }[];
}

const ThermalReportSheet: React.FC<ThermalReportSheetProps> = ({ title, columns, data, summary }) => {
    const printDate = new Date().toLocaleDateString('pt-BR');

    return (
        <div className="bg-white text-black p-2 font-mono text-lg" style={{ width: '80mm' }}>
            <div className="text-center mb-2">
                <h2 className="font-bold text-xl uppercase">Relatório</h2>
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="text-base">Montanha Bilhar & Jukebox</p>
                <p className="text-base">Data: {printDate}</p>
            </div>

            <div className="border-t-2 border-dashed border-black my-2"></div>

            <table className="w-full text-left">
                <thead>
                    <tr>
                        {columns.map(col => (
                            <th key={col.accessor} className={`pb-1 border-b border-black text-lg font-bold ${col.className}`}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            {columns.map(col => (
                                <td key={col.accessor} className={`pt-1 align-top ${col.className}`}>
                                    {col.render ? col.render(item[col.accessor], item) : item[col.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
                     {data.length === 0 && (
                        <tr>
                            <td colSpan={columns.length} className="text-center pt-2 text-gray-500">Nenhum dado.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {summary && summary.length > 0 && (
                <>
                    <div className="border-t-2 border-dashed border-black my-2"></div>
                    <div className="space-y-0.5">
                        {summary.map(s => (
                            <div key={s.label} className="flex justify-between font-bold text-xl">
                                <span>{s.label}:</span>
                                <span>{s.value}</span>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <div className="mt-4 text-center text-lg">
                <p>-- Fim do Relatório --</p>
            </div>
        </div>
    );
};

export default ThermalReportSheet;
