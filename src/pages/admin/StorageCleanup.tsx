import React, { useEffect, useState } from 'react';
import { Database, ShieldCheck, MessageSquare, FileImage } from 'lucide-react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminNavbar } from '../../components/admin/AdminNavbar';
import { api } from '../../services/api';
import { StorageStats } from '../../types';

export const StorageCleanup: React.FC = () => {
  const [stats, setStats] = useState<StorageStats | null>(null);

  const loadStats = async () => setStats(await api.getStorageStats());
  useEffect(() => { loadStats(); }, []);

  return (
    <div className="min-h-screen flex bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar title="Storage Cleanup" subtitle="Review removable data before taking an admin cleanup action" />
        <main className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0"><ShieldCheck className="w-5 h-5" /></div>
            <div><h2 className="font-display font-bold text-lg text-slate-900">Protected cleanup</h2><p className="text-xs text-slate-500 mt-1">No cleanup action targets genuine user content. File deletion is available only when the configured storage provider exposes verified file metadata.</p></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5"><Database className="w-5 h-5 text-indigo-600" /><p className="text-xs text-slate-500 mt-3">Database / metadata</p><p className="text-2xl font-display font-extrabold text-slate-900">{stats ? `${(stats.databaseBytes / 1024 / 1024).toFixed(2)} MB` : '...'}</p></div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5"><MessageSquare className="w-5 h-5 text-emerald-600" /><p className="text-xs text-slate-500 mt-3">Chat messages</p><p className="text-2xl font-display font-extrabold text-slate-900">{stats?.messages ?? '...'}</p></div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5"><FileImage className="w-5 h-5 text-amber-600" /><p className="text-xs text-slate-500 mt-3">Uploaded files</p><p className="text-2xl font-display font-extrabold text-slate-900">{stats?.uploadedFiles ?? '...'}</p></div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5"><Database className="w-5 h-5 text-slate-600" /><p className="text-xs text-slate-500 mt-3">Storage source</p><p className="text-2xl font-display font-extrabold text-slate-900 capitalize">{stats?.source ?? '...'}</p></div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100"><h2 className="font-display font-bold text-lg text-slate-900">Cleanup categories</h2><p className="text-xs text-slate-500 mt-1">Each action shows its safety rule before deletion.</p></div>
            <div className="divide-y divide-slate-100">
              <div className="p-5"><h3 className="text-sm font-bold text-slate-900">Old chat data</h3><p className="text-xs text-slate-500 mt-1">No automatic retention rule is applied. Use Chat Management to review and permanently delete individual conversations with confirmation.</p></div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
