
import React from 'react';

const DashboardHeader: React.FC = () => {
  return (
    <header className="bg-white/70 backdrop-blur-md border-b border-slate-100 px-10 py-5 flex justify-between items-center sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">تحديث البيانات:</span>
        <span className="text-sm font-black text-indigo-600">الآن - 10:30 ص</span>
      </div>
      <div className="flex gap-6 items-center">
        <div className="flex -space-x-2">
          {[1,2,3].map(i => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
            </div>
          ))}
        </div>
        <div className="h-6 w-px bg-slate-200"></div>
        <button className="text-slate-500 hover:text-indigo-600 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
