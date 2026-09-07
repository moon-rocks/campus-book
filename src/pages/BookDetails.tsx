import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  MapPin,
  MessageSquare,
  BookOpen,
  Calendar,
  Layers,
  GraduationCap,
  Building,
  CheckCircle2,
  AlertTriangle,
  Share2,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { BookGallery } from '../components/books/BookGallery';
import { BookCard } from '../components/books/BookCard';

export const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { books, setMessageModalBook, showToast } = useMarketplace();
  const navigate = useNavigate();

  const book = books.find((b) => b.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!book) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="font-display font-bold text-2xl text-slate-900 mb-2">Book Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">The requested book listing may have been sold or removed.</p>
        <Link
          to="/books"
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          Back to Marketplace
        </Link>
      </div>
    );
  }

  // Related books from same branch/course
  const relatedBooks = books
    .filter((b) => b.id !== book.id && (b.branch === book.branch || b.course === book.course) && b.status === 'approved')
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Book listing link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 bg-slate-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Back Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to listings</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:text-indigo-600 shadow-xs transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          {/* Left: Swiper Image Gallery */}
          <div className="lg:col-span-6">
            <BookGallery
              images={book.images}
              title={book.title}
              isVerified={book.status === 'approved'}
            />

            {/* Quick Safety Box */}
            <div className="mt-6 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Campus Book Buyer Guarantee</span>
              </h4>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Always meet in public campus zones: Library, Student Lounge, or College Gate.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Inspect pages and binding in-person before transferring cash/UPI.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Book Specs & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {book.status === 'approved' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    ADMIN VERIFIED
                  </span>
                )}
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                  {book.course}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                  Semester {book.semester}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {book.condition}
                </span>
              </div>

              {/* Title & Author */}
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight leading-tight">
                {book.title}
              </h1>
              <p className="text-base text-slate-500 mt-1 mb-4">
                By <strong className="text-slate-700">{book.author}</strong>
              </p>

              {/* Price Banner */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Student Price</span>
                  <div className="flex items-baseline gap-3 mt-0.5">
                    <span className="text-3xl font-extrabold text-slate-900 font-display">
                      ₹{book.price}
                    </span>
                    {book.originalPrice && (
                      <span className="text-base text-slate-400 line-through">
                        ₹{book.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                {book.originalPrice && (
                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500 text-white shadow-sm">
                      {Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}% DISCOUNT
                    </span>
                  </div>
                )}
              </div>

              {/* Location Hierarchy (State -> City -> College -> Branch -> Semester) */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 mb-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 block flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  Campus Location Hierarchy
                </span>
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-700">
                  <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200">{book.state}</span>
                  <span className="text-slate-400">→</span>
                  <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200">{book.city}</span>
                  <span className="text-slate-400">→</span>
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-800 font-bold rounded-lg border border-indigo-200/80">{book.college}</span>
                  <span className="text-slate-400">→</span>
                  <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200">{book.branch}</span>
                  <span className="text-slate-400">→</span>
                  <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200">Sem {book.semester}</span>
                </div>
              </div>

              {/* Book Metadata Specs Table */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/70">
                  <span className="text-slate-400 block font-medium">Subject</span>
                  <span className="font-bold text-slate-800 text-sm line-clamp-1">{book.subject}</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/70">
                  <span className="text-slate-400 block font-medium">Publisher</span>
                  <span className="font-bold text-slate-800 text-sm line-clamp-1">{book.publisher}</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/70">
                  <span className="text-slate-400 block font-medium">Edition</span>
                  <span className="font-bold text-slate-800 text-sm line-clamp-1">{book.edition}</span>
                </div>
              </div>

              {/* Section: About This Book */}
              <div className="mb-6">
                <h3 className="font-display font-bold text-base text-slate-900 mb-2">
                  About This Book
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed bg-white p-4 rounded-2xl border border-slate-200/80">
                  {book.description || 'No additional notes provided by the seller.'}
                </p>
              </div>

              {/* Seller Information (Public: College, City, State - No home address) */}
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200/80 mb-6">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center font-display">
                  {book.sellerName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{book.sellerName}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Verified Student
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {book.college}, {book.city}
                  </p>
                </div>
              </div>
            </div>

            {/* Primary Action CTA */}
            <div className="pt-4 border-t border-slate-200">
              <button
                id="message-seller-cta-btn"
                type="button"
                onClick={() => setMessageModalBook(book)}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-display font-bold text-base shadow-xl shadow-indigo-600/25 transition-all active:scale-[0.98] cursor-pointer"
                data-cursor-label="Chat"
              >
                <MessageSquare className="w-5 h-5" />
                <span>💬 Message Seller</span>
              </button>
              <p className="text-center text-[11px] text-slate-400 mt-2">
                Protected campus peer exchange • No home address exposed
              </p>
            </div>
          </div>
        </div>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <div className="pt-12 border-t border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-display font-extrabold text-2xl text-slate-900">
                  More Books for {book.branch}
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Other books in the same branch curriculum
                </p>
              </div>
              <Link
                to="/books"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                Browse All →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBooks.map((relBook) => (
                <BookCard key={relBook.id} book={relBook} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
