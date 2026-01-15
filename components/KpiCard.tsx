
import React from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon?: React.ReactNode;
  suffix?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, trend, icon, suffix }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-50 rounded-lg text-indigo-600">
          {icon}
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-bold ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <h3 className="text-slate-500 text-sm mb-1">{title}</h3>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-slate-800">{value}</span>
        {suffix && <span className="text-sm text-slate-400 font-normal">{suffix}</span>}
      </div>
    </div>
  );
};

export default KpiCard;
