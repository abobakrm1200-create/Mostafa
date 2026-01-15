
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import DashboardHeader from './components/DashboardHeader';
import KpiCard from './components/KpiCard';
import CompSetTable from './components/CompSetTable';
import PrintableReport from './components/PrintableReport';
import { COMP_SET_INITIAL, FINANCIALS_CONST, ACTUAL_PERFORMANCE_MOCK, HISTORICAL_STR_MOCK } from './constants';
import { CompetitorData, AppTab, ActualPerformance, ActualPerformanceRecord, HistoricalSTRData } from './types';
import { getDynamicPricingAdvice } from './services/geminiService';

const STORAGE_KEYS = {
  ACTUALS: 'awfad_v2_actuals',
  HISTORY: 'awfad_v2_history',
  COMPETITORS: 'awfad_v3_competitors',
  STR_DATA: 'awfad_v3_str'
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [pricingAdvice, setPricingAdvice] = useState<any>(null);
  const [loadingPricing, setLoadingPricing] = useState(false);

  // Range States
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(1); // Start of month
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Persistence States
  const [competitors, setCompetitors] = useState<CompetitorData[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPETITORS);
    return saved ? JSON.parse(saved) : COMP_SET_INITIAL;
  });

  const [strData, setStrData] = useState<HistoricalSTRData[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STR_DATA);
    return saved ? JSON.parse(saved) : HISTORICAL_STR_MOCK;
  });

  const [actualPerformance, setActualPerformance] = useState<ActualPerformance>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTUALS);
    const initial = saved ? JSON.parse(saved) : ACTUAL_PERFORMANCE_MOCK;
    return { ...initial, startDate, endDate };
  });

  const [history, setHistory] = useState<ActualPerformanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return saved ? JSON.parse(saved) : [];
  });

  // Debounced LocalStorage sync
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEYS.ACTUALS, JSON.stringify(actualPerformance));
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
      localStorage.setItem(STORAGE_KEYS.COMPETITORS, JSON.stringify(competitors));
      localStorage.setItem(STORAGE_KEYS.STR_DATA, JSON.stringify(strData));
    }, 500);
    return () => clearTimeout(timer);
  }, [actualPerformance, history, competitors, strData]);

  const totalRooms = FINANCIALS_CONST.totalRooms;
  const currentADR = useMemo(() => actualPerformance.totalOccupancy > 0 ? actualPerformance.roomRevenue / actualPerformance.totalOccupancy : 0, [actualPerformance]);
  const currentOcc = useMemo(() => (actualPerformance.totalOccupancy / totalRooms) * 100, [actualPerformance, totalRooms]);

  const generateAdvice = useCallback(async () => {
    setLoadingPricing(true);
    try {
      const advice = await getDynamicPricingAdvice(actualPerformance, competitors, strData, totalRooms);
      setPricingAdvice(advice);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPricing(false);
    }
  }, [actualPerformance, competitors, strData, totalRooms]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const updateActuals = useCallback((seg: 'ota' | 'corporate' | 'individual', field: 'rooms' | 'adr', value: number) => {
    setActualPerformance(prev => {
      const newSegs = { ...prev.segments, [seg]: { ...prev.segments[seg], [field]: value } };
      const totalOcc = newSegs.ota.rooms + newSegs.corporate.rooms + newSegs.individual.rooms;
      const totalRev = (newSegs.ota.rooms * newSegs.ota.adr) + (newSegs.corporate.rooms * newSegs.corporate.adr) + (newSegs.individual.rooms * newSegs.individual.adr);
      return { ...prev, segments: newSegs, totalOccupancy: totalOcc, roomRevenue: totalRev };
    });
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <KpiCard title="الإشغال" value={currentOcc.toFixed(1)} suffix="%" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} />
                <KpiCard title="متوسط السعر (ADR)" value={Math.round(currentADR)} suffix="SAR" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1" /></svg>} />
                <KpiCard title="RevPAR" value={Math.round((currentADR * currentOcc) / 100)} suffix="SAR" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z" /></svg>} />
                <KpiCard title="إجمالي الإيراد" value={actualPerformance.roomRevenue.toLocaleString()} suffix="SAR" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>} />
             </div>
             <CompSetTable competitors={[{ id: 'ovad', name: 'أوفاد (أنت)', adr: currentADR, occupancy: currentOcc, revpar: (currentADR * currentOcc) / 100, rating: 8.8, bookingPrice: currentADR }, ...competitors]} />
          </div>
        );

      case 'actuals':
        return (
          <div className="space-y-8 animate-in fade-in duration-500 text-right">
             <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-2xl font-black text-slate-800">الأداء الفعلي للفترة الزمنية</h3>
                   <div className="flex gap-4 items-center bg-slate-50 p-4 rounded-3xl border border-slate-100">
                      <div className="flex flex-col">
                         <label className="text-[10px] font-black text-slate-400 mb-1 mr-1 uppercase">من تاريخ</label>
                         <input type="date" value={startDate} onChange={(e) => {
                             setStartDate(e.target.value);
                             setActualPerformance(p => ({...p, startDate: e.target.value}));
                         }} className="bg-white border-none rounded-xl font-bold px-3 py-1 outline-none shadow-sm" />
                      </div>
                      <div className="w-4 h-px bg-slate-300"></div>
                      <div className="flex flex-col">
                         <label className="text-[10px] font-black text-slate-400 mb-1 mr-1 uppercase">إلى تاريخ</label>
                         <input type="date" value={endDate} onChange={(e) => {
                             setEndDate(e.target.value);
                             setActualPerformance(p => ({...p, endDate: e.target.value}));
                         }} className="bg-white border-none rounded-xl font-bold px-3 py-1 outline-none shadow-sm" />
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                   {(['ota', 'corporate', 'individual'] as const).map(seg => (
                      <div key={seg} className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 space-y-8 group hover:bg-white hover:border-indigo-200 transition-all">
                         <div className="flex justify-between items-center">
                            <span className="font-black text-indigo-600 uppercase tracking-widest text-xs">{seg === 'ota' ? 'وكالات بوكينج' : seg === 'corporate' ? 'عقود الشركات' : 'أفراد ومباشر'}</span>
                            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                            </div>
                         </div>
                         <div className="space-y-6">
                            <div>
                               <label className="text-[10px] text-slate-400 font-black block mb-2">إجمالي الغرف المباعة</label>
                               <input type="number" className="w-full bg-white px-6 py-4 rounded-2xl font-black text-2xl border-2 border-transparent focus:border-indigo-500 outline-none transition-all shadow-sm" value={actualPerformance.segments[seg].rooms} onChange={(e) => updateActuals(seg, 'rooms', Number(e.target.value))} />
                            </div>
                            <div>
                               <label className="text-[10px] text-slate-400 font-black block mb-2">متوسط السعر المحقق (ADR)</label>
                               <input type="number" className="w-full bg-white px-6 py-4 rounded-2xl font-black text-2xl border-2 border-transparent focus:border-indigo-500 outline-none transition-all shadow-sm" value={actualPerformance.segments[seg].adr} onChange={(e) => updateActuals(seg, 'adr', Number(e.target.value))} />
                            </div>
                         </div>
                         <div className="pt-6 border-t border-slate-100 flex justify-between">
                            <span className="text-xs font-bold text-slate-400">إيراد الشريحة</span>
                            <span className="font-black text-indigo-900">{(actualPerformance.segments[seg].rooms * actualPerformance.segments[seg].adr).toLocaleString()} SAR</span>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        );

      case 'segmentation':
        const segs = actualPerformance.segments;
        return (
          <div className="space-y-8 animate-in fade-in duration-500 text-right">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(['ota', 'corporate', 'individual'] as const).map(key => (
                  <div key={key} className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[5rem] -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                     <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-6 relative z-10">{key === 'ota' ? 'وكالات بوكينج' : key === 'corporate' ? 'عقود الشركات' : 'أفراد ومباشر'}</h4>
                     <div className="flex justify-between items-end relative z-10">
                        <div>
                           <span className="block text-4xl font-black text-slate-800">{segs[key].rooms}</span>
                           <span className="text-[10px] text-slate-400 font-bold">غرفة مباعة</span>
                        </div>
                        <div className="text-right">
                           <span className="block text-2xl font-black text-indigo-600">{segs[key].adr}</span>
                           <span className="text-[10px] text-slate-400 font-bold">متوسط السعر</span>
                        </div>
                     </div>
                     <div className="mt-8 pt-6 border-t border-slate-50 relative z-10 flex justify-between">
                        <span className="text-xs font-black text-slate-900">إجمالي الإيراد</span>
                        <span className="text-sm font-black text-indigo-900">{(segs[key].rooms * segs[key].adr).toLocaleString()} SAR</span>
                     </div>
                  </div>
                ))}
             </div>
             <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100">
                <h3 className="text-2xl font-black text-slate-800 mb-8">توزيع الحجوزات للفترة</h3>
                <div className="h-64 flex items-end gap-10 px-10">
                   {(['ota', 'corporate', 'individual'] as const).map(key => {
                      const height = (segs[key].rooms / (actualPerformance.totalOccupancy || 1)) * 100;
                      return (
                         <div key={key} className="flex-1 flex flex-col items-center gap-4">
                            <div className="w-full bg-slate-50 rounded-2xl relative overflow-hidden" style={{ height: '200px' }}>
                               <div className="absolute bottom-0 left-0 right-0 bg-indigo-600 rounded-t-xl transition-all duration-1000" style={{ height: `${height}%` }}></div>
                            </div>
                            <span className="text-xs font-black text-slate-500 uppercase">{key}</span>
                         </div>
                      )
                   })}
                </div>
             </div>
          </div>
        );

      case 'str':
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
              <h3 className="text-2xl font-black text-slate-800 mb-8">تعديل مؤشرات أداء السوق (STR Index)</h3>
              <div className="grid grid-cols-1 gap-6">
                {strData.map((row) => (
                  <div key={row.id} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 grid grid-cols-2 md:grid-cols-6 gap-6 items-end group hover:bg-white hover:border-indigo-200 transition-all">
                    <div className="col-span-2 md:col-span-1">
                      <label className="text-[10px] text-slate-400 font-black block mb-2 uppercase tracking-tighter">الفترة</label>
                      <input className="w-full bg-transparent font-bold border-b-2 border-slate-200 outline-none focus:border-indigo-500 py-1" value={row.period} onChange={(e) => setStrData(strData.map(s => s.id === row.id ? {...s, period: e.target.value} : s))} />
                    </div>
                    <div>
                      <label className="text-[10px] text-indigo-400 font-black block mb-2">MPI (الإشغال)</label>
                      <input type="number" step="0.1" className="w-full bg-transparent font-black text-indigo-600 text-lg outline-none" value={row.mpi} onChange={(e) => setStrData(strData.map(s => s.id === row.id ? {...s, mpi: Number(e.target.value)} : s))} />
                    </div>
                    <div>
                      <label className="text-[10px] text-indigo-400 font-black block mb-2">ARI (السعر)</label>
                      <input type="number" step="0.1" className="w-full bg-transparent font-black text-indigo-600 text-lg outline-none" value={row.ari} onChange={(e) => setStrData(strData.map(s => s.id === row.id ? {...s, ari: Number(e.target.value)} : s))} />
                    </div>
                    <div>
                      <label className="text-[10px] text-indigo-800 font-black block mb-2">RGI (RevPAR)</label>
                      <input type="number" step="0.1" className="w-full bg-transparent font-black text-indigo-900 text-lg outline-none" value={row.rgi} onChange={(e) => setStrData(strData.map(s => s.id === row.id ? {...s, rgi: Number(e.target.value)} : s))} />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-black block mb-2">إشغال السوق</label>
                      <input type="number" className="w-full bg-transparent font-bold text-slate-700 outline-none" value={row.occupancy} onChange={(e) => setStrData(strData.map(s => s.id === row.id ? {...s, occupancy: Number(e.target.value)} : s))} />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-black block mb-2">ADR السوق</label>
                      <input type="number" className="w-full bg-transparent font-bold text-slate-700 outline-none" value={row.adr} onChange={(e) => setStrData(strData.map(s => s.id === row.id ? {...s, adr: Number(e.target.value)} : s))} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-8 animate-in fade-in duration-500 text-right">
             <div className="bg-slate-900 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden text-white group">
                <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <div className="relative z-10 flex justify-between items-center flex-wrap gap-8">
                   <div>
                      <h2 className="text-3xl font-black">المستشار الذكي (Dynamic Pricing AI)</h2>
                      <p className="text-indigo-300 mt-2 font-bold max-w-xl">تحليل ذكاء اصطناعي فوري لبياناتك المعدلة (CompSet + STR).</p>
                   </div>
                   <button 
                    onClick={generateAdvice}
                    disabled={loadingPricing}
                    className="bg-[#c5a073] hover:bg-[#d4b58a] text-slate-900 px-12 py-5 rounded-2xl font-black shadow-2xl transition-all disabled:opacity-50 relative overflow-hidden"
                   >
                      {loadingPricing ? (
                        <span className="flex items-center gap-3">
                           <svg className="animate-spin h-5 w-5 text-slate-900" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                           جاري التحليل...
                        </span>
                      ) : 'توليد توصيات السعر'}
                   </button>
                </div>
             </div>
             {pricingAdvice && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   <div className="lg:col-span-2 space-y-6">
                      {pricingAdvice.recommendations.map((rec: any, i: number) => (
                        <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 flex justify-between items-center group hover:border-indigo-500 transition-all duration-500">
                           <div className="space-y-4">
                              <span className="bg-indigo-50 text-indigo-700 px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest">{rec.segment}</span>
                              <h4 className="text-xl font-black text-slate-800 leading-tight">{rec.reasoning}</h4>
                           </div>
                           <div className="text-center min-w-[160px] bg-slate-50 p-8 rounded-[2rem] border border-slate-100 group-hover:bg-indigo-50 transition-colors">
                              <span className="text-[10px] text-indigo-600 font-black block mb-2">السعر المقترح</span>
                              <span className="text-5xl font-black text-indigo-900 leading-none">{rec.suggestedPrice}</span>
                              <span className="block text-[10px] text-slate-400 font-bold mt-2">SAR / ليلة</span>
                           </div>
                        </div>
                      ))}
                   </div>
                   <div className="space-y-8">
                      <div className="bg-indigo-900 text-white p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-10 opacity-10"><svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg></div>
                         <h4 className="text-[#c5a073] font-black mb-6 text-xl">وضع السوق الحالي</h4>
                         <p className="text-indigo-50 leading-relaxed font-bold italic text-lg relative z-10">"{pricingAdvice.marketSentiment}"</p>
                      </div>
                      <div className="bg-[#c5a073] p-12 rounded-[3rem] shadow-xl text-slate-900">
                         <h4 className="text-lg font-black mb-4 uppercase tracking-tighter">الاستراتيجية الموصى بها</h4>
                         <p className="text-slate-800 leading-relaxed font-bold text-sm opacity-90">{pricingAdvice.strategy}</p>
                      </div>
                   </div>
                </div>
             )}
          </div>
        );

      case 'compset':
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-slate-800">إدارة مجموعة المنافسين (CompSet)</h3>
                <button 
                  onClick={() => setCompetitors([...competitors, { id: Date.now().toString(), name: 'فندق جديد', bookingPrice: 500, rating: 8.0, occupancy: 70, adr: 500, revpar: 350 }])}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg"
                >
                  + إضافة منافس جديد
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="text-slate-400 text-[10px] font-black uppercase border-b border-slate-100">
                      <th className="px-4 py-4">اسم الفندق</th>
                      <th className="px-4 py-4">السعر المعروض (ADR)</th>
                      <th className="px-4 py-4">التقييم</th>
                      <th className="px-4 py-4">الإشغال %</th>
                      <th className="px-4 py-4">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {competitors.map((comp) => (
                      <tr key={comp.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-4 font-bold text-slate-700">
                          <input className="bg-transparent outline-none focus:text-indigo-600 w-full" value={comp.name} onChange={(e) => setCompetitors(competitors.map(c => c.id === comp.id ? {...c, name: e.target.value} : c))} />
                        </td>
                        <td className="px-4 py-4">
                          <input type="number" className="bg-slate-50 px-3 py-1.5 rounded-xl font-black text-indigo-700 w-28 outline-none border border-transparent focus:border-indigo-200" value={comp.adr} onChange={(e) => setCompetitors(competitors.map(c => c.id === comp.id ? {...c, adr: Number(e.target.value), bookingPrice: Number(e.target.value)} : c))} />
                        </td>
                        <td className="px-4 py-4">
                           <input type="number" step="0.1" className="bg-slate-50 px-3 py-1.5 rounded-xl font-bold w-16 outline-none" value={comp.rating} onChange={(e) => setCompetitors(competitors.map(c => c.id === comp.id ? {...c, rating: Number(e.target.value)} : c))} />
                        </td>
                        <td className="px-4 py-4">
                           <input type="number" className="bg-slate-50 px-3 py-1.5 rounded-xl font-bold w-16 outline-none" value={comp.occupancy} onChange={(e) => setCompetitors(competitors.map(c => c.id === comp.id ? {...c, occupancy: Number(e.target.value)} : c))} />
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button onClick={() => setCompetitors(competitors.filter(c => c.id !== comp.id))} className="text-red-400 hover:text-red-600 font-black">حذف</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-['Cairo'] dir-rtl">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col max-h-screen overflow-y-auto relative bg-slate-50/50">
        <DashboardHeader />
        <main className="flex-1 p-10 pb-40 no-print">
          <div className="max-w-[1400px] mx-auto">{renderTabContent()}</div>
        </main>

        <div className="fixed bottom-0 right-72 left-0 bg-white/80 backdrop-blur-2xl border-t border-slate-200 p-8 flex justify-between items-center z-40 px-16 no-print shadow-[0_-20px_50px_-15px_rgba(0,0,0,0.05)]">
           <button 
            onClick={handlePrint}
            className="bg-slate-900 hover:bg-black text-white px-16 py-5 rounded-3xl font-black transition-all flex items-center gap-4 shadow-2xl active:scale-95 group"
           >
              <svg className="w-6 h-6 text-[#c5a073] group-hover:animate-bounce transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              تنزيل التقرير الموحد (PDF)
           </button>
           <div className="flex gap-16">
              <div className="text-right">
                 <span className="block text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">إيراد الفترة</span>
                 <span className="text-3xl font-black text-indigo-700">{actualPerformance.roomRevenue.toLocaleString()} SAR</span>
              </div>
              <div className="w-px h-12 bg-slate-200"></div>
              <div className="text-right">
                 <span className="block text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">إشغال الفترة</span>
                 <span className="text-3xl font-black text-green-600">{currentOcc.toFixed(1)}%</span>
              </div>
           </div>
        </div>

        <div className="print-only hidden print:block bg-white p-0">
           <PrintableReport type="daily" data={{
              adr: currentADR,
              occupancy: currentOcc,
              revpar: (currentADR * currentOcc) / 100,
              competitors: [{ id: 'ovad', name: 'أوفاد (أنت)', adr: currentADR, occupancy: currentOcc, revpar: (currentADR * currentOcc) / 100, rating: 8.8, bookingPrice: currentADR }, ...competitors],
              actuals: actualPerformance,
              aiInsight: pricingAdvice,
              strData: strData,
              historySummary: null,
              reportRange: { from: startDate, to: endDate }
           }} />
        </div>
      </div>

      <style>{`
        @media screen { .print-only { display: none !important; } }
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; width: 100%; height: 100%; }
          body { background: white !important; margin: 0; padding: 0; }
          @page { size: A4; margin: 1cm; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
