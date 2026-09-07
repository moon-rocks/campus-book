import React, { useEffect, useState } from 'react';
import { Database, Trash2, ShieldCheck, MessageSquare, FileImage } from 'lucide-react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminNavbar } from '../../components/admin/AdminNavbar';
import { api } from '../../services/api';
import { StorageStats } from '../../types';

export const StorageCleanup: React.FC = () => {
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadStats = async () => setStats(await api.getStorageStats());
  useEffect(() => { loadStats(); }, []);

  const deleteDemoChats = async () => {
    if (!window.confirm('This action will delete only explicitly marked demo/test conversations. Genuine user conversations will be kept. Continue?')) return;
    setIsDeleting(true);
    try {
      await api.deleteDemoChats();
      await loadStats();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar title="Storage Cleanup" subtitle="Review removable data before taking an admin cleanup action" />
        <main className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0"><ShieldCheck className="w-5 h-5" /></div>
            <div><h2 className="font-display font-bold text-lg text-slate-900">Protected cleanup</h2><p className="text-xs text-slate-500 mt-1">No cleanup action targets genuine user content. File deletion is available only when the configured storage provider exposes a verified demo/test marker.</p></div>
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
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h3 className="text-sm font-bold text-slate-900">Demo conversations</h3><p className="text-xs text-slate-500 mt-1">Deletes only chats marked <code>is_demo = true</code> or <code>data_type = demo</code>.</p></div><button type="button" disabled={isDeleting} onClick={deleteDemoChats} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold"><Trash2 className="w-4 h-4" />{isDeleting ? 'Deleting...' : 'Clear Demo Chats'}</button></div>
              <div className="p-5"><h3 className="text-sm font-bold text-slate-900">Demo files, unused images, deleted book files, temporary files</h3><p className="text-xs text-slate-500 mt-1">Unavailable until a Supabase Storage bucket and verified file metadata are configured. No files are guessed or removed.</p></div>
              <div className="p-5"><h3 className="text-sm font-bold text-slate-900">Old chat data</h3><p className="text-xs text-slate-500 mt-1">No automatic retention rule is applied. Use Chat Management to review and permanently delete individual conversations with confirmation.</p></div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
