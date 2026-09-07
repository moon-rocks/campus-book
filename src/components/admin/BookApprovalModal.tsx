import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  User,
  Calendar,
  ExternalLink,
  Phone,
  Mail,
  Building2,
  Archive,
  ShoppingBag,
  Clock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Book, BookStatus } from '../../types';

interface BookApprovalModalProps {
  book: Book | null;
  mode: 'view' | 'reject';
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onMarkSold?: (id: string) => void;
  onArchive?: (id: string) => void;
}

export const BookApprovalModal: React.FC<BookApprovalModalProps> = ({
  book,
  mode,
  onClose,
  onApprove,
  onReject,
  onMarkSold,
  onArchive,
}) => {
  const [rejectReason, setRejectReason] = useState('');
  const [error, setError] = useState('');

  if (!book) return null;

  const handleApprove = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
    onApprove(book.id);
    onClose();
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      setError('Please provide a reason for rejecting this listing.');
      return;
    }
    onReject(book.id, rejectReason.trim());
    onClose();
  };

  // Quick reject reasons
  const presetRejectReasons = [
    'Book edition does not match current SBTE polytechnic syllabus.',
    'Listing photos are unclear or cover image is missing.',
    'Book condition is poorer than marked or missing critical pages.',
    'Incorrect college or branch selected for this diploma textbook.',
    'Suspected duplicate listing or spam submission.',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {mode === 'reject' ? (
          /* Reject Listing Form */
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900">
                  Reject Listing
                </h3>
                <p className="text-xs text-slate-500">
                  Provide constructive feedback to the student seller
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 mb-5 border border-slate-100 text-xs">
              <p className="font-bold text-slate-800 text-sm">{book.title}</p>
              <p className="text-slate-500 mt-0.5">
                Seller: {book.sellerName} • {book.college}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Quick Reason Presets:
              </label>
              <div className="space-y-1.5">
                {presetRejectReasons.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setRejectReason(preset);
                      setError('');
                    }}
                    className="w-full text-left text-xs p-2 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-900 transition-all"
                  >
                    • {preset}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Feedback Note for Student Seller *
                </label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => {
                    setRejectReason(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Type specific instructions on what the student should fix..."
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
                {error && <p className="text-xs text-rose-600 mt-1.5">{error}</p>}
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-md transition-all"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* View Listing Details Inspection */
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                      book.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : book.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : book.status === 'sold'
                        ? 'bg-purple-100 text-purple-800'
                        : book.status === 'archived'
                        ? 'bg-slate-200 text-slate-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    Status: {book.status}
                  </span>

                  {(book.isOtherCollege || book.college === 'Other College') && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 border border-amber-300 flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      OTHER COLLEGE
                    </span>
                  )}

                  {book.is_demo && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-300">
                      DEMO RECORD
                    </span>
                  )}
                </div>

                <h3 className="font-display font-bold text-2xl text-slate-900 leading-tight">
                  {book.title}
                </h3>
                <p className="text-sm text-slate-500 mt-0.5">By {book.author}</p>
              </div>
            </div>

            {/* Other College Notice if Applicable */}
            {(book.isOtherCollege || book.college === 'Other College') && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <span className="font-bold">Outside Official 11 Polytechnic Network:</span>
                  <p className="mt-0.5">
                    Student entered requested campus: <strong>{book.otherCollegeName || book.college}</strong>
                    {book.otherCollegeCity && ` (${book.otherCollegeCity}, ${book.otherCollegeState || 'Bihar'})`}.
                    You can manage this campus request in the <strong className="text-indigo-700">College Network</strong> tab.
                  </p>
                </div>
              </div>
            )}

            {/* Images Gallery */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Submitted Photos</p>
              <div className="grid grid-cols-3 gap-3">
                {(book.images && book.images.length > 0 ? book.images : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80']).map((img, i) => (
                  <div key={i} className="aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group relative">
                    <img src={img} alt={`preview-${i}`} className="w-full h-full object-cover" />
                    <a
                      href={img}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" /> View Full
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl text-xs border border-slate-100">
              <div>
                <span className="text-slate-400 block font-medium">Student Asking Price</span>
                <span className="font-bold text-slate-900 text-base">₹{book.price}</span>
                {book.originalPrice && (
                  <span className="text-[11px] text-slate-400 line-through ml-1">MRP ₹{book.originalPrice}</span>
                )}
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Condition</span>
                <span className="font-bold text-slate-900 text-sm">{book.condition}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Course & Branch</span>
                <span className="font-bold text-slate-900">{book.course} • {book.branch}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Semester</span>
                <span className="font-bold text-slate-900">Semester {book.semester}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Publisher / Edition</span>
                <span className="font-bold text-slate-900">{book.publisher || 'N/A'} ({book.edition || 'Standard'})</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Campus</span>
                <span className="font-bold text-slate-900">{book.college}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase mb-1">Seller Description</h4>
              <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                {book.description || 'No additional comments provided by seller.'}
              </p>
            </div>

            {/* Seller Contact Info (Protected for Admin) */}
            <div className="bg-indigo-50/80 p-4 rounded-2xl border border-indigo-100 text-xs">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  Seller Private Verification Details:
                </h4>
                <span className="text-[10px] text-indigo-700 font-semibold uppercase bg-indigo-200/60 px-2 py-0.5 rounded-md">
                  Admin Only
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-700">
                <div>
                  <span className="text-slate-400 block text-[10px]">Full Name</span>
                  <strong className="text-slate-900">{book.sellerName}</strong>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px]">Email Address</span>
                  <a
                    href={`mailto:${book.sellerEmail}`}
                    className="text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <Mail className="w-3 h-3" />
                    <span>{book.sellerEmail || 'N/A'}</span>
                  </a>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px]">Mobile / WhatsApp</span>
                  {book.sellerPhone ? (
                    <a
                      href={`tel:${book.sellerPhone}`}
                      className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{book.sellerPhone}</span>
                    </a>
                  ) : (
                    <span>N/A</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
              >
                Close
              </button>

              <div className="flex flex-wrap items-center gap-2">
                {onMarkSold && book.status !== 'sold' && (
                  <button
                    onClick={() => {
                      onMarkSold(book.id);
                      onClose();
                    }}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold text-xs transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Mark Sold</span>
                  </button>
                )}

                {onArchive && book.status !== 'archived' && (
                  <button
                    onClick={() => {
                      onArchive(book.id);
                      onClose();
                    }}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-xs transition-colors"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    <span>Archive</span>
                  </button>
                )}

                {book.status !== 'rejected' && (
                  <button
                    onClick={() => onReject(book.id, 'Does not meet technical diploma curriculum standards')}
                    className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold text-xs transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                )}

                {book.status !== 'approved' && (
                  <button
                    onClick={handleApprove}
                    className="flex items-center gap-1 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Approve Listing</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
