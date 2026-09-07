import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookCheck,
  Clock,
  Users,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle,
  XCircle,
  Eye,
  CheckCircle2,
  Building2,
  Database,
  ShoppingBag,
  Archive,
  Inbox,
  Percent,
  MessageSquare,
  ShieldCheck,
  Activity,
  Layers,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminNavbar } from '../../components/admin/AdminNavbar';
import { BookApprovalModal } from '../../components/admin/BookApprovalModal';
import { Book } from '../../types';
import { api } from '../../services/api';
import { StorageStats } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    books,
    users,
    reports,
    colleges,
    otherCollegeRequests,
    demoStats,
    approveBook,
    rejectBook,
    markBookSold,
    archiveBook,
  } = useMarketplace();

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'reject'>('view');
  const [storageStats, setStorageStats] = useState<StorageStats | null>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [conversationCount, setConversationCount] = useState(0);

  useEffect(() => {
    const loadAdminStats = async () => {
      const [storage, conversations] = await Promise.all([api.getStorageStats(), api.getConversations()]);
      setStorageStats(storage);
      setConversationCount(conversations.length);
      setUnreadMessages(conversations.reduce((count, conversation) => count + (conversation.unreadCount || 0), 0));
    };
    loadAdminStats();
  }, [books.length, users.length]);

  // Dynamic Statistics
  const statsCounts = useMemo(() => {
    const totalBooks = books.length;
    const pendingBooks = books.filter((b) => b.status === 'pending').length;
    const approvedBooks = books.filter((b) => b.status === 'approved').length;
    const rejectedBooks = books.filter((b) => b.status === 'rejected').length;
    const soldBooks = books.filter((b) => b.status === 'sold').length;
    const archivedBooks = books.filter((b) => b.status === 'archived').length;
    const totalUsers = users.length;
    const activeColleges = colleges.filter((c) => c.status !== 'inactive').length;
    const pendingOtherCollegeReqs = otherCollegeRequests.filter((r) => r.status === 'pending').length;
    const demoRecords = demoStats.demoBooks || books.filter((b) => b.is_demo).length;

    return {
      totalBooks,
      pendingBooks,
      approvedBooks,
      rejectedBooks,
      soldBooks,
      archivedBooks,
      totalUsers,
      activeColleges,
      pendingOtherCollegeReqs,
      demoRecords,
      totalConversations: conversationCount,
      unreadMessages,
    };
  }, [books, users, colleges, otherCollegeRequests, demoStats, conversationCount, unreadMessages]);

  const collegeBookStats = useMemo(() => colleges.map((college) => ({
    ...college,
    count: books.filter((book) => book.college === college.name && book.status !== 'archived').length,
  })), [books, colleges]);
  const otherCollegeBookCount = books.filter((book) => (book.isOtherCollege || book.college === 'Other College') && book.status !== 'archived').length;
  const storagePercent = storageStats?.storageLimitBytes ? (storageStats.storageBytes / storageStats.storageLimitBytes) * 100 : null;

  const pendingBooksList = useMemo(() => {
    return books.filter((b) => b.status === 'pending');
  }, [books]);

  const approvedBooksList = useMemo(() => {
    return books.filter((b) => b.status === 'approved');
  }, [books]);

  const handleOpenView = (book: Book) => {
    setSelectedBook(book);
    setModalMode('view');
  };

  const handleOpenReject = (book: Book) => {
    setSelectedBook(book);
    setModalMode('reject');
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar
          title="Campus Moderation Dashboard"
          subtitle="Real-time oversight of book listings, SBTE college network, student verifications, and platform stats"
        />

        <main className="p-6 sm:p-8 space-y-8 flex-1 overflow-y-auto">
          {/* Top Primary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Books */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Books Listed
                </span>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                  <BookCheck className="w-5 h-5" />
                </div>
              </div>
              <div>
                <span className="font-display font-extrabold text-3xl text-slate-900">
                  {statsCounts.totalBooks}
                </span>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {statsCounts.approvedBooks} Approved • {statsCounts.soldBooks} Sold
                </p>
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Pending Approvals
                </span>
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                    statsCounts.pendingBooks > 0
                      ? 'bg-amber-50 text-amber-600 border-amber-200'
                      : 'bg-slate-50 text-slate-500 border-slate-100'
                  }`}
                >
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-extrabold text-3xl text-slate-900">
                    {statsCounts.pendingBooks}
                  </span>
                  {statsCounts.pendingBooks > 0 && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 animate-pulse">
                      Action Required
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Requires admin syllabus review
                </p>
              </div>
            </div>

            {/* Active College Network */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Active Colleges
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-extrabold text-3xl text-slate-900">
                    {statsCounts.activeColleges}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Official
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {statsCounts.activeColleges} active polytechnic campuses
                </p>
              </div>
            </div>

            {/* Other College Requests */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Other College Requests
                </span>
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
                  <Inbox className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-extrabold text-3xl text-slate-900">
                    {statsCounts.pendingOtherCollegeReqs}
                  </span>
                  {statsCounts.pendingOtherCollegeReqs > 0 && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-800">
                      Pending
                    </span>
                  )}
                </div>
                <Link
                  to="/admin/colleges"
                  className="text-xs text-indigo-600 hover:underline mt-1 font-semibold flex items-center gap-1"
                >
                  Review Requests →
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs"><span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Users</span><p className="font-display font-extrabold text-3xl text-slate-900 mt-3">{statsCounts.totalUsers}</p></div>
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs"><span className="text-xs font-bold uppercase tracking-wider text-slate-500">Conversations</span><p className="font-display font-extrabold text-3xl text-slate-900 mt-3">{statsCounts.totalConversations}</p></div>
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs"><span className="text-xs font-bold uppercase tracking-wider text-slate-500">Unread Messages</span><p className="font-display font-extrabold text-3xl text-amber-600 mt-3">{statsCounts.unreadMessages}</p></div>
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs"><span className="text-xs font-bold uppercase tracking-wider text-slate-500">Storage Used</span><p className="font-display font-extrabold text-3xl text-slate-900 mt-3">{storageStats ? `${(storageStats.databaseBytes / 1024 / 1024).toFixed(2)} MB` : '...'}</p><p className="text-xs text-slate-500 mt-1">{storageStats?.storageLimitBytes ? `${storagePercent?.toFixed(1)}% of configured limit` : 'Provider limit unavailable'}</p></div>
          </div>

          {/* Secondary Status Breakdown Bar */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-indigo-600" />
              Detailed Inventory & System Breakdown
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium block">Approved</span>
                <span className="text-lg font-bold text-emerald-600">{statsCounts.approvedBooks}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium block">Rejected</span>
                <span className="text-lg font-bold text-rose-600">{statsCounts.rejectedBooks}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium block">Sold</span>
                <span className="text-lg font-bold text-purple-600">{statsCounts.soldBooks}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium block">Archived</span>
                <span className="text-lg font-bold text-slate-700">{statsCounts.archivedBooks}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium block">Total Users</span>
                <span className="text-lg font-bold text-slate-900">{statsCounts.totalUsers}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium block">Demo Records</span>
                <span className="text-lg font-bold text-amber-600">{statsCounts.demoRecords}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100"><h3 className="font-display font-bold text-base text-slate-900">College Book Statistics</h3><p className="text-xs text-slate-500 mt-1">Live listing counts from the current catalog</p></div>
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {collegeBookStats.map((college) => <div key={college.id} className="px-5 py-3 flex items-center justify-between text-xs"><span className="text-slate-700 truncate pr-4">{college.name}</span><span className="font-bold text-indigo-600">{college.count} books</span></div>)}
                <div className="px-5 py-3 flex items-center justify-between text-xs"><span className="text-slate-700">Other College</span><span className="font-bold text-indigo-600">{otherCollegeBookCount} books</span></div>
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5">
              <h3 className="font-display font-bold text-base text-slate-900">Storage Health</h3>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100"><span className="text-slate-500 block">Database / metadata</span><strong className="text-slate-900">{storageStats ? `${(storageStats.databaseBytes / 1024 / 1024).toFixed(2)} MB` : '...'}</strong></div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100"><span className="text-slate-500 block">Uploaded files</span><strong className="text-slate-900">{storageStats?.uploadedFiles ?? '...'}</strong></div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100"><span className="text-slate-500 block">Messages</span><strong className="text-slate-900">{storageStats?.messages ?? '...'}</strong></div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100"><span className="text-slate-500 block">Source</span><strong className="text-slate-900 capitalize">{storageStats?.source ?? '...'}</strong></div>
              </div>
              <p className="text-xs text-slate-500 mt-4">Storage limits and file bytes are shown only when supplied by the configured backend provider. No exact free-tier limit is assumed.</p>
            </div>
          </div>

          {/* Pending Approval Queue Section */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-bold text-xl text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  Pending Approval Queue ({pendingBooksList.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review student book submissions before they appear in public marketplace searches
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/admin/books?tab=pending"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                >
                  View All in Inventory →
                </Link>
              </div>
            </div>

            {pendingBooksList.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                    <tr>
                      <th className="py-3.5 px-6">Book Title & Author</th>
                      <th className="py-3.5 px-4">Stream & Branch</th>
                      <th className="py-3.5 px-4">Semester</th>
                      <th className="py-3.5 px-4">College</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Condition</th>
                      <th className="py-3.5 px-6 text-right">Moderator Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pendingBooksList.slice(0, 5).map((book) => (
                      <tr key={book.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                              <img
                                src={
                                  book.images?.[0] ||
                                  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80'
                                }
                                alt="cover"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{book.title}</p>
                              <p className="text-slate-500 text-xs">By {book.author}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-medium text-slate-700">
                          <span className="inline-block px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-[11px] mr-1">
                            {book.course}
                          </span>
                          <span>{book.branch}</span>
                        </td>
                        <td className="py-4 px-4 font-semibold text-slate-700">
                          Sem {book.semester}
                        </td>
                        <td className="py-4 px-4 text-slate-600 max-w-xs truncate">
                          {book.college}
                        </td>
                        <td className="py-4 px-4 font-extrabold text-slate-900 text-sm">
                          ₹{book.price}
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 rounded-md bg-amber-50 text-amber-800 text-[11px] font-bold">
                            {book.condition}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenView(book)}
                              className="p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                              title="Inspect Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => approveBook(book.id)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenReject(book)}
                              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-base text-slate-800">
                  Queue is Completely Clear!
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  All submitted textbook listings have been reviewed and processed.
                </p>
              </div>
            )}
          </div>

          {/* Quick Shortcuts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Approved Listings */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-base text-slate-900">
                  Live Approved Listings ({approvedBooksList.length})
                </h3>
                <Link to="/admin/books" className="text-xs font-bold text-indigo-600 hover:underline">
                  Manage All Books →
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {approvedBooksList.slice(0, 4).map((book) => (
                  <div key={book.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        <img
                          src={
                            book.images?.[0] ||
                            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80'
                          }
                          alt="cover"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{book.title}</p>
                        <p className="text-[11px] text-slate-500">
                          {book.college} • ₹{book.price}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Live
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Navigation Panels */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900 mb-2">
                  Campus Management Shortcuts
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Quick access to the 11 polytechnic colleges network, chat moderation, and data controls.
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-100">
                <Link
                  to="/admin/colleges"
                  className="flex items-center justify-between p-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-xs font-semibold text-indigo-900 border border-indigo-200/60 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <span>Manage 11 Colleges ({colleges.length})</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-indigo-600" />
                </Link>

                <Link
                  to="/admin/storage-cleanup"
                  className="flex items-center justify-between p-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-xs font-semibold text-purple-900 border border-purple-200/60 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-purple-600" />
                    <span>Storage & Cleanup</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-purple-600" />
                </Link>

                <Link
                  to="/admin/data-management"
                  className="flex items-center justify-between p-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-xs font-semibold text-amber-900 border border-amber-200/60 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-amber-600" />
                    <span>Demo Data Isolation</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-amber-600" />
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal for inspection or rejection */}
      <BookApprovalModal
        book={selectedBook}
        mode={modalMode}
        onClose={() => setSelectedBook(null)}
        onApprove={(id) => approveBook(id)}
        onReject={(id, reason) => rejectBook(id, reason)}
        onMarkSold={(id) => markBookSold(id)}
        onArchive={(id) => archiveBook(id)}
      />
    </div>
  );
};
