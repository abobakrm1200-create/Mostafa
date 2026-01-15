
import React from 'react';
import { CompetitorData } from '../types';

interface CompSetTableProps {
  competitors: CompetitorData[];
}

const CompSetTable: React.FC<CompSetTableProps> = ({ competitors }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
        <h3 className="font-bold text-slate-800">تحليل فندق أوفاد ومجموعة المنافسين (Comp Set)</h3>
        <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded">مصدر البيانات: Booking + STR</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="text-xs text-slate-400 uppercase bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-medium">الفندق</th>
              <th className="px-6 py-4 font-medium">سعر بوكينج (SAR)</th>
              <th className="px-6 py-4 font-medium">التقييم</th>
              <th className="px-6 py-4 font-medium">نسبة الإشغال (STR)</th>
              <th className="px-6 py-4 font-medium">ADR</th>
              <th className="px-6 py-4 font-medium">RevPAR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {competitors.map((comp) => {
              const isOvad = comp.id === 'ovad';
              return (
                <tr 
                  key={comp.id} 
                  className={`transition-colors ${isOvad ? 'bg-indigo-50 hover:bg-indigo-100/80 font-bold' : 'hover:bg-slate-50'}`}
                >
                  <td className="px-6 py-4 flex items-center gap-2">
                    {isOvad && <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>}
                    <span className={`text-slate-700 ${isOvad ? 'text-indigo-900 font-bold' : 'font-semibold'}`}>
                      {comp.name}
                    </span>
                  </td>
                  <td className={`px-6 py-4 font-bold ${isOvad ? 'text-indigo-800' : 'text-indigo-600'}`}>{comp.bookingPrice}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${isOvad ? 'bg-indigo-200 text-indigo-800' : 'bg-green-50 text-green-700'}`}>
                      {comp.rating}
                    </span>
                  </td>
                  <td className="px-6 py-4">{comp.occupancy}%</td>
                  <td className="px-6 py-4">{comp.adr}</td>
                  <td className="px-6 py-4 font-medium">{comp.revpar}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompSetTable;
