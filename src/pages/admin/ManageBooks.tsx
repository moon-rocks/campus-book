import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Star,
  BookOpen,
  Building2,
  AlertTriangle,
  Archive,
  ShoppingBag,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminNavbar } from '../../components/admin/AdminNavbar';
import { BookApprovalModal } from '../../components/admin/BookApprovalModal';
import { Book, BookStatus } from '../../types';

export const ManageBooks: React.FC = () => {
  const {
    books,
    approveBook,
    rejectBook,
    deleteBook,
    deleteBookPermanently,
    markBookSold,
    archiveBook,
    toggleFeaturedBook,
    colleges,
  } = useMarketplace();

  const [searchParams] = useSearchParams();
  const initialCollege = searchParams.get('college') || '';

  const [activeTab, setActiveTab] = useState<'all' | BookStatus | 'other_college'>('all');
  const [search, setSearch] = useState('');
  const [selectedCollege, setSelectedCollege] = useState(initialCollege);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'reject'>('view');

  // Permanent Delete Modal state
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState('');

  // Update selectedCollege if URL searchParams changes
  useEffect(() => {
    if (initialCollege) {
      setSelectedCollege(initialCollege);
    }
  }, [initialCollege]);

  // Counts by status
  const counts = useMemo(() => {
    return {
      all: books.length,
      pending: books.filter((b) => b.status === 'pending').length,
      approved: books.filter((b) => b.status === 'approved').length,
      rejected: books.filter((b) => b.status === 'rejected').length,
      sold: books.filter((b) => b.status === 'sold').length,
      archived: books.filter((b) => b.status === 'archived').length,
      other_college: books.filter((b) => b.isOtherCollege || b.college === 'Other College').length,
    };
  }, [books]);

  // Filtered books
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // Tab filter
      if (activeTab === 'other_college') {
        if (!book.isOtherCollege && book.college !== 'Other College') return false;
      } else if (activeTab !== 'all') {
        if (book.status !== activeTab) return false;
      }

      // College filter
      if (selectedCollege) {
        const matchCol =
          book.college.toLowerCase().includes(selectedCollege.toLowerCase()) ||
          (book.otherCollegeName && book.otherCollegeName.toLowerCase().includes(selectedCollege.toLowerCase()));
        if (!matchCol) return false;
      }

      // Search query
      if (search) {
        const q = search.toLowerCase();
        const match =
          book.title.toLowerCase().includes(q) ||
          book.author.toLowerCase().includes(q) ||
          book.sellerName.toLowerCase().includes(q) ||
          book.college.toLowerCase().includes(q) ||
          book.branch.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [books, activeTab, selectedCollege, search]);

  const handleOpenView = (book: Book) => {
    setSelectedBook(book);
    setModalMode('view');
  };

  const handleOpenReject = (book: Book) => {
    setSelectedBook(book);
    setModalMode('reject');
  };

  const handlePermanentDelete = async () => {
    if (!bookToDelete) return;
    await deleteBookPermanently(bookToDelete.id);
    setBookToDelete(null);
    setDeleteConfirmInput('');
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar
          title="Books Directory & Inventory Control"
          subtitle="Review technical diploma textbook submissions, inspect seller contacts, approve listings, or delete records"
        />

        <main className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto">
          {/* Status Tabs Bar */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                id="filter-all"
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'all'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                All Books ({counts.all})
              </button>

              <button
                id="filter-pending"
                type="button"
                onClick={() => setActiveTab('pending')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all relative ${
                  activeTab === 'pending'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                }`}
              >
                Pending ({counts.pending})
                {counts.pending > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-white text-amber-800 text-[10px] font-extrabold">
                    Action
                  </span>
                )}
              </button>

              <button
                id="filter-approved"
                type="button"
                onClick={() => setActiveTab('approved')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'approved'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                Approved Live ({counts.approved})
              </button>

              <button
                id="filter-rejected"
                type="button"
                onClick={() => setActiveTab('rejected')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'rejected'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                }`}
              >
                Rejected ({counts.rejected})
              </button>

              <button
                id="filter-sold"
                type="button"
                onClick={() => setActiveTab('sold')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'sold'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                }`}
              >
                Sold ({counts.sold})
              </button>

              <button
                id="filter-archived"
                type="button"
                onClick={() => setActiveTab('archived')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'archived'
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Archived ({counts.archived})
              </button>

              <button
                id="filter-other-college"
                type="button"
                onClick={() => setActiveTab('other_college')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  activeTab === 'other_college'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Other College ({counts.other_college})</span>
              </button>
            </div>

            {/* Search and Filters row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="input-books-search"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by book title, author, subject, or seller name..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  id="select-books-college-filter"
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="">All Colleges ({colleges.length} official + Other)</option>
                  {colleges.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                  <option value="Other College">Other College (Outside Network)</option>
                </select>

                {selectedCollege && (
                  <button
                    onClick={() => setSelectedCollege('')}
                    className="text-xs text-slate-500 hover:text-slate-900 underline font-semibold shrink-0"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Books Table */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            {filteredBooks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                    <tr>
                      <th className="py-3.5 px-6">Book Title & Syllabus Details</th>
                      <th className="py-3.5 px-4">Course & Branch</th>
                      <th className="py-3.5 px-4">College Network</th>
                      <th className="py-3.5 px-4">Pricing & MRP</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-6 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBooks.map((book) => {
                      const isOther = book.isOtherCollege || book.college === 'Other College';

                      return (
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
                              <div className="max-w-xs">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <p className="font-bold text-slate-900 text-sm truncate">{book.title}</p>
                                  {book.is_demo && (
                                    <span className="shrink-0 px-1.5 py-0.2 text-[9px] font-bold rounded bg-amber-100 text-amber-900 border border-amber-300">
                                      DEMO
                                    </span>
                                  )}
                                  {book.featured && (
                                    <span className="shrink-0 px-1.5 py-0.2 text-[9px] font-bold rounded bg-indigo-100 text-indigo-800">
                                      FEATURED
                                    </span>
                                  )}
                                </div>
                                <p className="text-slate-500 text-xs">By {book.author}</p>
                                <p className="text-[11px] text-slate-400">
                                  Seller: <span className="text-slate-700 font-medium">{book.sellerName}</span>
                                  {book.sellerPhone && ` (${book.sellerPhone})`}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 font-medium text-slate-700">
                            <span className="inline-block px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-[11px] mr-1">
                              {book.course}
                            </span>
                            <span className="block mt-0.5 text-slate-600">
                              {book.branch} (Sem {book.semester})
                            </span>
                          </td>

                          <td className="py-4 px-4 max-w-xs truncate">
                            {isOther ? (
                              <div>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 mb-0.5">
                                  <Building2 className="w-3 h-3" />
                                  OTHER CAMPUS
                                </span>
                                <p className="font-semibold text-slate-800 text-xs">
                                  {book.otherCollegeName || book.college}
                                </p>
                                <p className="text-[11px] text-slate-400">
                                  {book.otherCollegeCity || book.city}, {book.otherCollegeState || book.state}
                                </p>
                              </div>
                            ) : (
                              <div>
                                <p className="font-semibold text-slate-800">{book.college}</p>
                                <p className="text-[11px] text-slate-400">
                                  {book.city}, {book.state}
                                </p>
                              </div>
                            )}
                          </td>

                          <td className="py-4 px-4">
                            <span className="font-extrabold text-slate-900 text-sm">₹{book.price}</span>
                            {book.originalPrice && (
                              <span className="block text-[11px] text-slate-400 line-through">
                                MRP ₹{book.originalPrice}
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                book.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : book.status === 'pending'
                                  ? 'bg-amber-100 text-amber-800'
                                  : book.status === 'sold'
                                  ? 'bg-purple-100 text-purple-800'
                                  : book.status === 'archived'
                                  ? 'bg-slate-200 text-slate-700'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {book.status}
                            </span>
                          </td>

                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenView(book)}
                                className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                title="Inspect Full Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {book.status !== 'approved' && (
                                <button
                                  type="button"
                                  onClick={() => approveBook(book.id)}
                                  className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                                  title="Approve Book"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}

                              {book.status !== 'rejected' && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenReject(book)}
                                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                                  title="Reject Book"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              )}

                              {book.status !== 'sold' && (
                                <button
                                  type="button"
                                  onClick={() => markBookSold(book.id)}
                                  className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors"
                                  title="Mark as Sold"
                                >
                                  <ShoppingBag className="w-4 h-4" />
                                </button>
                              )}

                              {book.status !== 'archived' && (
                                <button
                                  type="button"
                                  onClick={() => archiveBook(book.id)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                                  title="Archive Book"
                                >
                                  <Archive className="w-4 h-4" />
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => toggleFeaturedBook(book.id)}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  book.featured
                                    ? 'text-amber-500 hover:bg-amber-50'
                                    : 'text-slate-300 hover:text-amber-500'
                                }`}
                                title={book.featured ? 'Unfeature' : 'Feature'}
                              >
                                <Star className="w-4 h-4 fill-current" />
                              </button>

                              {/* Delete Permanently (Admin Only, with strong confirmation) */}
                              <button
                                type="button"
                                onClick={() => setBookToDelete(book)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Delete Permanently (Admin Only)"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 font-semibold text-sm">No books found matching this view</p>
                <p className="text-xs text-slate-400 mt-1">Try resetting the filter or search term</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Book Inspection & Approval Modal */}
      <BookApprovalModal
        book={selectedBook}
        mode={modalMode}
        onClose={() => setSelectedBook(null)}
        onApprove={(id) => approveBook(id)}
        onReject={(id, reason) => rejectBook(id, reason)}
        onMarkSold={(id) => markBookSold(id)}
        onArchive={(id) => archiveBook(id)}
      />

      {/* MODAL: CONFIRM PERMANENT DELETION */}
      {bookToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-rose-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">
                  Delete Permanently?
                </h3>
                <p className="text-xs text-rose-600 font-semibold">
                  Admin Action: Irreversible Database Removal
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs mb-4 space-y-1.5">
              <p className="font-bold text-slate-900 text-sm">{bookToDelete.title}</p>
              <p className="text-slate-600">Author: {bookToDelete.author}</p>
              <p className="text-slate-600">Seller: {bookToDelete.sellerName}</p>
              <p className="text-slate-600">College: {bookToDelete.college}</p>
              <div className="pt-1">
                {bookToDelete.is_demo ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                    Safe to delete: Demo/Test Listing
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900">
                    Caution: Real Student Listing
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              To prevent accidental loss, please type <strong className="text-slate-800 font-mono">DELETE</strong> below to confirm permanent removal.
            </p>

            <input
              type="text"
              value={deleteConfirmInput}
              onChange={(e) => setDeleteConfirmInput(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono mb-5 focus:outline-none focus:border-rose-500"
            />

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setBookToDelete(null);
                  setDeleteConfirmInput('');
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmInput.trim() !== 'DELETE'}
                onClick={handlePermanentDelete}
                className={`px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all ${
                  deleteConfirmInput.trim() === 'DELETE'
                    ? 'bg-rose-600 hover:bg-rose-700 cursor-pointer'
                    : 'bg-slate-300 cursor-not-allowed opacity-60'
                }`}
              >
                Permanently Delete Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
