
import React from 'react';
import { AppTab } from '../types';

interface SidebarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const Sidebar: React.FC<SidebarProps> = React.memo(({ activeTab, setActiveTab }) => {
  const menuItems: { id: AppTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'لوحة التحكم المركزية', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'pricing', label: 'التسعير الديناميكي (AI)', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'actuals', label: 'الأداء الفعلي والأرشيف', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'str', label: 'تحليل STR التنافسي', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'compset', label: 'مجموعة المنافسين', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'segmentation', label: 'تحليل الشرائح', icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z' },
  ];

  return (
    <aside className="w-72 bg-slate-900 h-screen flex flex-col sticky top-0 shadow-2xl z-50 no-print">
      <div className="p-10 flex flex-col items-center gap-6">
        <div className="w-full bg-[#c5a073] p-5 rounded-3xl flex flex-col items-center justify-center shadow-2xl shadow-[#c5a073]/20 group hover:scale-105 transition-all duration-500 cursor-pointer">
           <div className="text-slate-900 text-4xl font-black mb-1 leading-none tracking-tighter">أوفاد</div>
           <div className="text-slate-900 text-[10px] font-black tracking-[0.3em] uppercase opacity-80">Awfad Riyadh</div>
        </div>
      </div>
      <nav className="flex-1 px-4 py-4 overflow-y-auto custom-scrollbar">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative ${
                  activeTab === item.id 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40' 
                    : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <svg className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-slate-600 group-hover:text-indigo-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} />
                </svg>
                <span className="text-sm font-black tracking-tight">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
});

export default Sidebar;
