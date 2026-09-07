import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, ArrowRight, BookMarked } from 'lucide-react';
import { Book } from '../../types';

interface BookCardProps {
  book: Book;
  compact?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({ book, compact = false }) => {
  const isVerified = book.status === 'approved';

  return (
    <div
      id={`book-card-${book.id}`}
      className="book-card-item group relative flex flex-col bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={book.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80'}
          alt={book.title}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-60" />

        {/* Badges Top Left & Right */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {isVerified && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-md">
              <ShieldCheck className="w-3 h-3" />
              VERIFIED
            </span>
          )}
          <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-sm text-slate-800 shadow-sm">
            {book.course}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 backdrop-blur-sm text-white">
            Sem {book.semester}
          </span>
        </div>

        {/* Condition pill bottom right */}
        <div className="absolute bottom-3 right-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-slate-700 shadow-sm border border-slate-100">
            <span className="text-emerald-600">●</span> {book.condition}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Branch & Course Tagline */}
          <div className="text-[10px] font-bold tracking-widest text-indigo-600 uppercase mb-1 line-clamp-1">
            {book.branch}
          </div>

          {/* Title */}
          <h3 className="font-display font-bold text-slate-900 text-base sm:text-lg leading-snug group-hover:text-indigo-600 transition-colors line-clamp-1">
            {book.title}
          </h3>

          {/* Author */}
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
            By {book.author}
          </p>

          {/* College-based location (No home address) */}
          <div className="mt-3 flex items-start gap-1.5 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
            <div className="line-clamp-1">
              <span className="font-medium text-slate-800">{book.college}</span>
              <span className="text-slate-400 ml-1">({book.city}, {book.state})</span>
            </div>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 font-display">
                ₹{book.price}
              </span>
              {book.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{book.originalPrice}
                </span>
              )}
            </div>
            {book.originalPrice && (
              <span className="text-[10px] font-bold text-emerald-600">
                Save {Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}%
              </span>
            )}
          </div>

          <Link
            to={`/books/${book.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-bold text-xs transition-all active:scale-95 cursor-pointer border border-indigo-100/80 hover:border-indigo-600 shadow-xs"
            data-cursor-label="View"
          >
            <span>View Book</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
