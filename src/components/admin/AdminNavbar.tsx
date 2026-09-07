import React from 'react';
import { ShieldCheck, Bell, Search, UserCheck } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

interface AdminNavbarProps {
  title: string;
  subtitle?: string;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({ title, subtitle }) => {
  const { books, adminEmail } = useMarketplace();
  const pendingCount = books.filter((b) => b.status === 'pending').length;

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
          {title}
        </h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Pending Badge alert */}
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>{pendingCount} Pending Approvals</span>
          </div>
        )}

        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center">
            {adminEmail ? adminEmail.slice(0, 2).toUpperCase() : 'AD'}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-slate-800 truncate max-w-[160px]" title={adminEmail || 'Campus Moderator'}>
              {adminEmail || 'Campus Moderator'}
            </p>
            <p className="text-[10px] text-slate-400">Supabase Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};
