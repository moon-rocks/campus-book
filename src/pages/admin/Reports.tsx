import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  ShieldAlert,
  Search,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminNavbar } from '../../components/admin/AdminNavbar';
import { BookApprovalModal } from '../../components/admin/BookApprovalModal';
import { Book } from '../../types';

export const AdminReports: React.FC = () => {
  const { reports, books, resolveReport, dismissReport, deleteBook, approveBook, rejectBook } =
    useMarketplace();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'reject'>('view');

  const handleInspectBook = (bookId: string) => {
    const b = books.find((x) => x.id === bookId);
    if (b) {
      setSelectedBook(b);
      setModalMode('view');
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar
          title="Student Reports & Flagged Listings"
          subtitle="Review reported items, copyright claims, incorrect editions, or offensive photos"
        />

        <main className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto">
          {/* Top Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="text-xs sm:text-sm text-amber-950">
              <h3 className="font-bold text-base mb-1">Campus Trust & Safety Oversight</h3>
              <p className="leading-relaxed">
                When students report a listing (e.g. wrong syllabus year, water-damaged pages not shown in photo, or abusive contact), moderators can view the listing, delete fraudulent posts immediately, or dismiss false flags.
              </p>
            </div>
          </div>

          {/* Reports Table */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-6">Reported Book Title</th>
                    <th className="py-3.5 px-4">Reporter Student</th>
                    <th className="py-3.5 px-4">Reason / Issue</th>
                    <th className="py-3.5 px-4">Date Reported</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(reports || []).map((report) => {
                    const targetBook = books.find((b) => b.id === report.bookId);
                    const isPending = report.status === 'pending' || report.status === 'Under Review';
                    const isResolved = report.status === 'resolved' || report.status === 'Resolved';
                    return (
                      <tr key={report.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-6">
                          <p className="font-bold text-slate-900 text-sm">{report.bookTitle}</p>
                          <p className="text-[11px] text-slate-400">ID: {report.bookId}</p>
                        </td>
                        <td className="py-4 px-4 text-slate-700 font-medium">
                          {report.reporterName || report.reportedBy}
                        </td>
                        <td className="py-4 px-4 max-w-xs">
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 font-medium text-xs border border-rose-100">
                            {report.reason}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-500">
                          {report.createdAt || report.date}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              isPending
                                ? 'bg-amber-100 text-amber-800'
                                : isResolved
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {report.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {targetBook && (
                              <button
                                type="button"
                                onClick={() => handleInspectBook(report.bookId)}
                                className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                                title="Inspect Book Listing"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Inspect</span>
                              </button>
                            )}

                            {isPending && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => resolveReport(report.id)}
                                  className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                                  title="Mark as Resolved"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Resolve</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => dismissReport(report.id)}
                                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                                  title="Dismiss Flag"
                                >
                                  <span>Dismiss</span>
                                </button>
                              </>
                            )}

                            {targetBook && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Remove listing "${targetBook.title}" permanently?`)) {
                                    deleteBook(targetBook.id);
                                    resolveReport(report.id);
                                  }
                                }}
                                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Delete Listing"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <BookApprovalModal
        book={selectedBook}
        mode={modalMode}
        onClose={() => setSelectedBook(null)}
        onApprove={(id) => approveBook(id)}
        onReject={(id, reason) => rejectBook(id, reason)}
      />
    </div>
  );
};
