import React, { useState } from 'react';
import {
  Database,
  Eye,
  EyeOff,
  Trash2,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Users,
  Building2,
  FileCheck,
  Search,
  ExternalLink,
  Layers,
  Server,
  Terminal,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminNavbar } from '../../components/admin/AdminNavbar';
import { isDemoRecord } from '../../services/api';
import { Book } from '../../types';
import { SUPABASE_SETUP_SQL } from '../../lib/supabase';

export const DataManagement: React.FC = () => {
  const {
    demoStats,
    isDemoHidden,
    toggleHideDemoData,
    deleteDemoData,
    reseedDemoData,
    isAdminLoggedIn,
    books,
    users,
    showToast,
    testSupabaseConnection,
  } = useMarketplace();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'demo-books' | 'demo-users' | 'real-data'>('overview');
  const [searchFilter, setSearchFilter] = useState('');
  const [testingSupabase, setTestingSupabase] = useState(false);
  const [supabaseTestResult, setSupabaseTestResult] = useState<{ connected: boolean; message: string; booksCount?: number } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  const demoBooksList = books.filter((b) => isDemoRecord(b));
  const realBooksList = books.filter((b) => !isDemoRecord(b));
  const demoUsersList = users.filter((u) => isDemoRecord(u));
  const realUsersList = users.filter((u) => !isDemoRecord(u));

  const handleTestSupabase = async () => {
    setTestingSupabase(true);
    try {
      const res = await testSupabaseConnection();
      setSupabaseTestResult(res);
      if (res.connected) {
        showToast('Supabase connection verified!', 'success');
      } else {
        showToast('Supabase check: ' + res.message, 'info');
      }
    } catch (e: any) {
      setSupabaseTestResult({
        connected: false,
        message: e?.message || 'Connection failed',
      });
      showToast('Supabase test failed', 'error');
    } finally {
      setTestingSupabase(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    showToast('SQL migration schema copied to clipboard!', 'success');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleDeleteConfirm = async () => {
    if (!isAdminLoggedIn) {
      showToast('Action forbidden: Admin authentication required.', 'error');
      return;
    }

    setIsDeleting(true);
    try {
      await deleteDemoData();
      setIsDeleteModalOpen(false);
    } catch (e: any) {
      showToast(e?.message || 'Failed to delete demo data', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReseed = async () => {
    if (!isAdminLoggedIn) {
      showToast('Admin authentication required.', 'error');
      return;
    }
    if (window.confirm('Re-seed the initial 24 demo books, 8 demo colleges, and 15 demo users?')) {
      await reseedDemoData();
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar
          title="Data Management"
          subtitle="Admin control center for demo seed records, real user data isolation, and database deletion rules"
        />

        <main className="p-6 sm:p-8 space-y-8 flex-1 overflow-y-auto">
          {/* Top Admin Security Notice */}
          <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 flex items-start gap-3.5">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-950 leading-relaxed">
              <span className="font-bold">Dual Data Architecture Active: </span>
              All records are tagged with <code className="bg-indigo-100/80 px-1.5 py-0.5 rounded font-mono text-[11px] text-indigo-800">is_demo = true</code> for seed data and <code className="bg-indigo-100/80 px-1.5 py-0.5 rounded font-mono text-[11px] text-indigo-800">is_demo = false</code> for real user listings. Demo data operations are isolated and will never affect live production submissions.
            </div>
          </div>

          {/* Supabase Connection Status Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center shrink-0">
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300/60">
                      Supabase Cloud Database
                    </span>
                    {demoStats.supabaseConfigured ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        CONNECTED & ACTIVE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900">
                        <AlertTriangle className="w-3 h-3" />
                        AWAITING API CREDENTIALS
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-extrabold text-xl text-slate-900 mt-1">
                    Supabase PostgreSQL Connection
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {demoStats.supabaseConfigured
                      ? `Target Endpoint: ${demoStats.supabaseUrl}`
                      : 'Define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to link your cloud project'}
                  </p>
                  {demoStats.hasPathInRawUrl && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 text-[11px] font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>URL Auto-Sanitized: Trailing slashes or subpaths (/rest/v1) stripped to project origin to prevent "Invalid path" errors.</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleTestSupabase}
                  disabled={testingSupabase}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer disabled:opacity-60"
                >
                  <Zap className={`w-3.5 h-3.5 ${testingSupabase ? 'animate-spin' : ''}`} />
                  <span>{testingSupabase ? 'Testing Ping...' : 'Test Supabase Live Ping'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Schema Copied!' : 'Copy SQL Migration Schema'}</span>
                </button>
              </div>
            </div>

            {/* Test result feedback banner */}
            {supabaseTestResult && (
              <div
                className={`mt-4 p-4 rounded-2xl border text-xs flex items-start gap-3 ${
                  supabaseTestResult.connected
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50/80 border-amber-200 text-amber-900'
                }`}
              >
                {supabaseTestResult.connected ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-bold">{supabaseTestResult.connected ? 'Connection Successful' : 'Configuration Notice'}</p>
                  <p className="mt-0.5 opacity-90">{supabaseTestResult.message}</p>
                  {supabaseTestResult.booksCount !== undefined && (
                    <p className="mt-1 font-semibold text-emerald-800">
                      Live Cloud Records: {supabaseTestResult.booksCount} books found in Supabase.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Primary Demo Data Control Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300/60">
                      [ Demo Data ]
                    </span>
                    {demoStats.isDemoDeleted ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800">
                        DELETED
                      </span>
                    ) : isDemoHidden ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                        HIDDEN FROM PUBLIC
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        LIVE ON MARKETPLACE
                      </span>
                    )}
                  </div>
                  <h2 className="font-display font-extrabold text-xl text-slate-900 mt-1">
                    Demo Seed Data Management
                  </h2>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* [ View Demo Data ] */}
                <button
                  type="button"
                  onClick={() => setActiveTab('demo-books')}
                  disabled={demoStats.isDemoDeleted}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    activeTab === 'demo-books'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Eye className="w-4 h-4 text-indigo-600" />
                  <span>View Demo Data</span>
                </button>

                {/* [ Hide Demo Data ] / [ Show Demo Data ] */}
                <button
                  type="button"
                  onClick={toggleHideDemoData}
                  disabled={demoStats.isDemoDeleted}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    isDemoHidden
                      ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isDemoHidden ? (
                    <>
                      <Eye className="w-4 h-4 text-amber-600" />
                      <span>Show Demo Data</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4 text-slate-500" />
                      <span>Hide Demo Data</span>
                    </>
                  )}
                </button>

                {/* [ Delete Demo Data ] */}
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  disabled={demoStats.isDemoDeleted || demoStats.demoBooks === 0}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Demo Data</span>
                </button>
              </div>
            </div>

            {/* Demo Stats Breakdown Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              {/* Demo Books */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-1">
                    Demo Books
                  </span>
                  <span className="font-display font-black text-3xl text-slate-900">
                    {demoStats.demoBooks}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Condition: <code className="text-indigo-600 font-mono">is_demo = true</code>
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>

              {/* Demo Colleges */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-1">
                    Demo Colleges
                  </span>
                  <span className="font-display font-black text-3xl text-slate-900">
                    {demoStats.demoColleges}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Bihar & Delhi campuses
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
              </div>

              {/* Demo Users */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-1">
                    Demo Users
                  </span>
                  <span className="font-display font-black text-3xl text-slate-900">
                    {demoStats.demoUsers}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Mock student profiles
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Re-seed notice if deleted */}
            {demoStats.isDemoDeleted && (
              <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                  <p className="text-xs text-rose-900">
                    <strong>Demo Data Has Been Permanently Removed.</strong> The system is currently running purely on real student records. As mandated, demo data will never be automatically restored.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleReseed}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-rose-300 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-seed Demo Data (Testing)</span>
                </button>
              </div>
            )}
          </div>

          {/* Real vs Demo Isolation & Safeguard Rules */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Real Data Status */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900">
                    Protected Real Data (Production)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live peer student listings and authentic registrations
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 text-center">
                  <span className="text-[11px] font-semibold text-emerald-800 uppercase block">Real Books</span>
                  <span className="font-display font-extrabold text-2xl text-emerald-950">{demoStats.realBooks}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 text-center">
                  <span className="text-[11px] font-semibold text-emerald-800 uppercase block">Real Users</span>
                  <span className="font-display font-extrabold text-2xl text-emerald-950">{demoStats.realUsers}</span>
                </div>
              </div>

              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Marked strictly as <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">is_demo = false</code> upon submission.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Will NOT be touched or deleted during demo purge.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Receive authentic <span className="font-semibold text-emerald-700">VERIFIED</span> badges on public catalog.</span>
                </li>
              </ul>
            </div>

            {/* Deletion Integrity Rules */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900">
                    Deletion Integrity & Safety Constraints
                  </h3>
                  <p className="text-xs text-slate-500">
                    Server-side and function level safety locks
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Condition Guarantee:</span>
                    <span>Admin delete executes strictly with <code className="font-mono text-indigo-700 font-semibold">WHERE is_demo = true</code> condition. Blanket table drops are explicitly forbidden.</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Admin Authorization Check:</span>
                    <span>Only validated administrator sessions can trigger the demo purge endpoint.</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">No Auto-Recreation Policy:</span>
                    <span>Once deleted, system flags prevent automatic seed re-generation on reload.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs for Data Inspection */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'overview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Overview & SQL Schema
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('demo-books')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'demo-books' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Demo Books ({demoBooksList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('demo-users')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'demo-users' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Demo Users ({demoUsersList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('real-data')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'real-data' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Real Data Submissions ({realBooksList.length})
                </button>
              </div>

              {activeTab !== 'overview' && (
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Filter records..."
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              )}
            </div>

            {/* Tab: Overview / SQL Schema Reference */}
            {activeTab === 'overview' && (
              <div className="p-6 sm:p-8 space-y-6">
                {/* Step by Step Supabase Connection Guide */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mb-3 font-mono">
                      1
                    </div>
                    <h5 className="font-bold text-slate-900 text-sm">Create Supabase Project</h5>
                    <p className="text-xs text-slate-500 mt-1">
                      Sign in to <span className="font-semibold text-indigo-600">supabase.com</span>, create a new project, and navigate to the <b>SQL Editor</b>.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mb-3 font-mono">
                      2
                    </div>
                    <h5 className="font-bold text-slate-900 text-sm">Run Schema Migration</h5>
                    <p className="text-xs text-slate-500 mt-1">
                      Paste the SQL schema below and hit <b>Run</b>. It creates tables, RLS security policies, and the protected demo deletion function.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mb-3 font-mono">
                      3
                    </div>
                    <h5 className="font-bold text-slate-900 text-sm">Configure Environment</h5>
                    <p className="text-xs text-slate-500 mt-1">
                      Copy your Project URL (e.g. <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">https://your-id.supabase.co</code>, strictly the origin without <code className="text-rose-600 font-mono">/rest/v1</code>) and Anon Key into <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">VITE_SUPABASE_URL</code> and <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">VITE_SUPABASE_ANON_KEY</code>.
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <h4 className="font-display font-bold text-slate-900 text-sm">
                      Complete Supabase PostgreSQL Migration Script
                    </h4>
                    <button
                      type="button"
                      onClick={handleCopySql}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 transition-colors cursor-pointer"
                    >
                      {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSql ? 'Copied' : 'Copy Script'}</span>
                    </button>
                  </div>
                  <div className="bg-slate-950 text-slate-200 rounded-2xl p-5 font-mono text-xs overflow-x-auto leading-relaxed max-h-96">
                    <pre>{SUPABASE_SETUP_SQL}</pre>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Demo Books List */}
            {activeTab === 'demo-books' && (
              <div className="overflow-x-auto">
                {demoBooksList.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 text-xs">
                    No demo books currently in database. (Demo data has been deleted).
                  </div>
                ) : (
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                      <tr>
                        <th className="px-6 py-3.5">Book & Author</th>
                        <th className="px-6 py-3.5">Course / Branch</th>
                        <th className="px-6 py-3.5">College</th>
                        <th className="px-6 py-3.5">Price</th>
                        <th className="px-6 py-3.5">Flag</th>
                        <th className="px-6 py-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {demoBooksList
                        .filter(
                          (b) =>
                            !searchFilter ||
                            b.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
                            b.author.toLowerCase().includes(searchFilter.toLowerCase()) ||
                            b.college.toLowerCase().includes(searchFilter.toLowerCase())
                        )
                        .map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-900">{b.title}</div>
                              <div className="text-[11px] text-slate-500">By {b.author}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-semibold text-slate-800">{b.course}</span> • Sem {b.semester}
                              <div className="text-[11px] text-slate-500">{b.branch}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="line-clamp-1 max-w-xs">{b.college}</div>
                              <div className="text-[11px] text-slate-400">{b.city}, {b.state}</div>
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-900">
                              ₹{b.price}
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                is_demo = true
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                                  b.status === 'approved'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : b.status === 'pending'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Tab: Demo Users List */}
            {activeTab === 'demo-users' && (
              <div className="overflow-x-auto">
                {demoUsersList.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 text-xs">
                    No demo student profiles currently in database.
                  </div>
                ) : (
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                      <tr>
                        <th className="px-6 py-3.5">Student Name</th>
                        <th className="px-6 py-3.5">Email</th>
                        <th className="px-6 py-3.5">Campus</th>
                        <th className="px-6 py-3.5">Branch</th>
                        <th className="px-6 py-3.5">Flag</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {demoUsersList
                        .filter(
                          (u) =>
                            !searchFilter ||
                            u.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                            u.email.toLowerCase().includes(searchFilter.toLowerCase()) ||
                            u.college.toLowerCase().includes(searchFilter.toLowerCase())
                        )
                        .map((u) => (
                          <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-900">{u.name}</td>
                            <td className="px-6 py-4 text-slate-600">{u.email}</td>
                            <td className="px-6 py-4">{u.college}</td>
                            <td className="px-6 py-4">{u.branch}</td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                is_demo = true
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Tab: Real Data Submissions */}
            {activeTab === 'real-data' && (
              <div className="overflow-x-auto">
                {realBooksList.length === 0 ? (
                  <div className="p-12 text-center max-w-md mx-auto">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h5 className="font-bold text-slate-800 text-sm mb-1">No Real Student Books Yet</h5>
                    <p className="text-xs text-slate-500 mb-4">
                      When students use "Sell a Book" on the public site, their listings will appear here tagged as <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono">is_demo = false</code>.
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                      <tr>
                        <th className="px-6 py-3.5">Book Title</th>
                        <th className="px-6 py-3.5">Seller Name</th>
                        <th className="px-6 py-3.5">Seller Phone</th>
                        <th className="px-6 py-3.5">College</th>
                        <th className="px-6 py-3.5">Price</th>
                        <th className="px-6 py-3.5">Flag</th>
                        <th className="px-6 py-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {realBooksList.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900">{b.title}</td>
                          <td className="px-6 py-4">{b.sellerName}</td>
                          <td className="px-6 py-4">{b.sellerPhone}</td>
                          <td className="px-6 py-4">{b.college}</td>
                          <td className="px-6 py-4 font-bold text-slate-900">₹{b.price}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                              is_demo = false (Real)
                            </span>
                          </td>
                          <td className="px-6 py-4 capitalize font-semibold">{b.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ========================================== */}
      {/* DELETE DEMO DATA CONFIRMATION MODAL        */}
      {/* ========================================== */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            {/* Modal Warning Icon */}
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-7 h-7" />
            </div>

            {/* Modal Title & Text Exactly as Requested */}
            <div className="text-center mb-6">
              <h3 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
                Delete Demo Data?
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Are you sure you want to permanently remove all demo/test data? This action cannot be undone.
              </p>
            </div>

            {/* Protection Guarantee Notice inside Modal */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 mb-6 text-xs text-emerald-900">
              <div className="flex items-center gap-2 font-bold mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Real Data Protection Active</span>
              </div>
              <p className="text-[11px] leading-snug">
                Only records marked with <code className="font-mono bg-emerald-100/80 px-1 py-0.2 rounded font-bold">is_demo = true</code> will be removed. All real student listings, accounts, and submissions remain untouched.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <span>Deleting...</span>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Demo Data</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
