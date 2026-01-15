
import React from 'react';
import { CompetitorData, ActualPerformance, HistoricalSTRData } from '../types';

interface PrintableReportProps {
  type: 'daily' | 'monthly';
  data: {
    adr: number;
    occupancy: number;
    revpar: number;
    competitors: CompetitorData[];
    actuals: ActualPerformance;
    aiInsight: any;
    strData: HistoricalSTRData[];
    historySummary: any;
    reportRange?: { from: string; to: string };
  };
}

const PrintableReport: React.FC<PrintableReportProps> = ({ type, data }) => {
  const dateStr = new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const rangeStr = data.reportRange 
    ? `الفترة من: ${data.reportRange.from} إلى: ${data.reportRange.to}`
    : `تاريخ التقرير: ${dateStr}`;
  
  return (
    <div className="bg-white text-slate-900 text-right dir-rtl w-full p-[1.5cm] font-['Cairo']">
      {/* Executive Header */}
      <div className="flex justify-between items-start border-b-[6px] border-[#c5a073] pb-10 mb-10">
        <div style={{ flex: 1 }}>
          <h1 className="text-4xl font-black text-slate-900">تقرير تحليل الإيرادات والأداء</h1>
          <p className="text-[#c5a073] text-2xl font-black mt-1 tracking-tight">فندق أوفاد الرياض - Awfad Hotel Riyadh</p>
          <div className="mt-4 flex gap-8 text-slate-400 font-bold text-xs uppercase">
             <span style={{ marginLeft: '30px' }} className="text-slate-900 font-black">{rangeStr}</span>
             <span className="text-indigo-600 font-black">نسخة المدير العام - سري للغاية</span>
          </div>
        </div>
        <div className="bg-slate-900 p-8 rounded-[2rem] flex flex-col items-center justify-center shadow-xl">
           <div className="text-[#c5a073] text-4xl font-black leading-none mb-1">أوفاد</div>
           <div className="text-white text-[9px] font-black tracking-[0.4em] uppercase opacity-60">Riyadh</div>
        </div>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-4 gap-8 mb-12">
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
          <span className="block text-slate-400 text-[10px] font-black uppercase mb-2">متوسط السعر (ADR)</span>
          <span className="text-3xl font-black text-slate-900">{Math.round(data.adr)} SAR</span>
        </div>
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
          <span className="block text-slate-400 text-[10px] font-black uppercase mb-2">نسبة الإشغال الكلية</span>
          <span className="text-3xl font-black text-slate-900">{data.occupancy.toFixed(1)}%</span>
        </div>
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
          <span className="block text-slate-400 text-[10px] font-black uppercase mb-2">RevPAR المحقق</span>
          <span className="text-3xl font-black text-slate-900">{Math.round(data.revpar)} SAR</span>
        </div>
        <div className="bg-indigo-900 text-white p-6 rounded-3xl text-center shadow-xl">
          <span className="block text-[#c5a073] text-[10px] font-black uppercase mb-2">إجمالي إيراد الفترة</span>
          <span className="text-2xl font-black">{data.actuals.roomRevenue.toLocaleString()} SAR</span>
        </div>
      </div>

      {/* AI Intelligence Section */}
      <div className="mb-12 bg-[#c5a073]/5 p-12 rounded-[3rem] border-r-[12px] border-[#c5a073]">
         <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <span className="text-3xl">💡</span> توصيات المستشار الذكي ووضع السوق
         </h3>
         <p className="text-xl font-bold text-slate-700 leading-relaxed italic mb-8 border-b border-[#c5a073]/20 pb-6">
            "{data.aiInsight?.marketSentiment || "يتم رصد السوق حالياً بناءً على بيانات المنافسين المحدثة يدوياً."}"
         </p>
         <div className="grid grid-cols-2 gap-10">
            <div className="bg-white p-8 rounded-3xl shadow-sm">
               <h4 className="text-indigo-700 font-black mb-4 uppercase text-xs tracking-widest">توصيات السعر المقترحة:</h4>
               <div className="space-y-3">
                  {data.aiInsight?.recommendations?.map((r: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-sm border-b border-slate-50 pb-3">
                       <span className="font-bold text-slate-500">{r.segment}</span>
                       <span className="font-black text-slate-900 text-lg">{r.suggestedPrice} SAR</span>
                    </div>
                  ))}
               </div>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm">
               <h4 className="text-indigo-700 font-black mb-4 uppercase text-xs tracking-widest">الخطة الاستراتيجية:</h4>
               <p className="text-xs font-bold text-slate-500 leading-relaxed italic">{data.aiInsight?.strategy || "الحفاظ على الميزة التنافسية السعرية مع مراقبة الإشغال المستمرة."}</p>
            </div>
         </div>
      </div>

      {/* Competitor Benchmarking */}
      <div className="mb-12">
         <h3 className="text-xl font-black text-slate-900 mb-6 border-r-8 border-slate-900 pr-4">تحليل مجموعة المنافسين (CompSet Comparison)</h3>
         <table className="w-full text-right text-xs border-collapse">
            <thead className="bg-slate-900 text-white font-black uppercase">
               <tr>
                  <th className="p-5 border border-slate-800">الفندق / المنافس</th>
                  <th className="p-5 border border-slate-800 text-center">السعر المعروض</th>
                  <th className="p-4 border border-slate-800 text-center">التقييم</th>
                  <th className="p-4 border border-slate-800 text-center">الإشغال %</th>
                  <th className="p-5 border border-slate-800 text-center">RevPAR</th>
               </tr>
            </thead>
            <tbody className="text-sm">
               {data.competitors.map((comp) => {
                 const isOvad = comp.id === 'ovad';
                 return (
                   <tr key={comp.id} className={isOvad ? 'bg-[#c5a073]/10 font-black' : ''}>
                      <td className="p-5 border border-slate-100 font-bold">{comp.name} {isOvad && '(فندقك)'}</td>
                      <td className="p-5 border border-slate-100 text-center font-black">{comp.adr} SAR</td>
                      <td className="p-4 border border-slate-100 text-center font-bold text-green-700">{comp.rating}</td>
                      <td className="p-4 border border-slate-100 text-center">{comp.occupancy}%</td>
                      <td className="p-5 border border-slate-100 text-center font-black">{Math.round(comp.revpar)} SAR</td>
                   </tr>
                 );
               })}
            </tbody>
         </table>
      </div>

      {/* Market Indices (STR) */}
      <div className="mb-20">
         <h3 className="text-xl font-black text-slate-900 mb-6 border-r-8 border-[#c5a073] pr-4">مؤشرات الأداء السوقية (STR Performance)</h3>
         <table className="w-full text-right text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-500 font-black uppercase">
               <tr>
                  <th className="p-5 border border-slate-200">الفترة</th>
                  <th className="p-5 border border-slate-200 text-center text-indigo-700 font-black">MPI (إشغال)</th>
                  <th className="p-5 border border-slate-200 text-center text-indigo-700 font-black">ARI (سعر)</th>
                  <th className="p-5 border border-slate-200 text-center text-indigo-900 font-black">RGI (عائد)</th>
                  <th className="p-5 border border-slate-200 text-center">إشغال السوق</th>
               </tr>
            </thead>
            <tbody className="text-sm">
               {data.strData.map((row, i) => (
                 <tr key={i}>
                    <td className="p-5 border border-slate-100 font-bold">{row.period}</td>
                    <td className="p-5 border border-slate-100 text-center font-black">{row.mpi}</td>
                    <td className="p-5 border border-slate-100 text-center font-black">{row.ari}</td>
                    <td className="p-5 border border-slate-100 text-center font-black text-indigo-900">{row.rgi}</td>
                    <td className="p-5 border border-slate-100 text-center">{row.occupancy}%</td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>

      {/* Official Footnote */}
      <div className="mt-auto pt-16 border-t-2 border-slate-200 flex justify-between items-end opacity-40">
         <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Awfad Revenue Intelligence System v3.0</p>
            <p className="text-[9px] font-bold">وثيقة داخلية سرية خاصة بإدارة فندق أوفاد الرياض - يحظر التداول.</p>
         </div>
         <div className="text-center w-72 border-t-4 border-slate-900 pt-4">
            <span className="text-sm font-black text-slate-900 uppercase">توقيع مدير الإيرادات</span>
         </div>
      </div>
    </div>
  );
};

export default PrintableReport;
