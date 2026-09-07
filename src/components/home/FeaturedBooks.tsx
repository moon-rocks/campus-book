import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, BookCheck } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { BookCard } from '../books/BookCard';
import { animations } from '../../animations/gsapAnimations';

export const FeaturedBooks: React.FC = () => {
  const { approvedBooks } = useMarketplace();
  const featuredRef = useRef<HTMLDivElement>(null);
  const recentGridRef = useRef<HTMLDivElement>(null);

  const featuredList = approvedBooks.filter((b) => b.featured).slice(0, 4);
  const recentList = approvedBooks.slice(0, 6);

  useEffect(() => {
    if (featuredRef.current) {
      animations.revealSection(featuredRef.current);
    }
    if (recentGridRef.current) {
      animations.staggerCards(recentGridRef.current, '.book-card-item');
    }
  }, [approvedBooks]);

  return (
    <div className="py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section 1: Books Students Are Looking For (Featured) */}
        <div ref={featuredRef} className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                High Demand
              </div>
              <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-[40px] text-slate-900 font-bold tracking-tight">
                Books Students Are Looking For
              </h2>
              <p className="text-slate-500 text-sm sm:text-base mt-2">
                Handpicked textbook listings verified for current semester university curriculum.
              </p>
            </div>

            <Link
              to="/books"
              className="inline-flex items-center gap-2 font-display font-bold text-sm text-indigo-600 hover:text-indigo-800 hover:gap-3 transition-all self-start sm:self-auto"
            >
              <span>View all marketplace books</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredList.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>

        {/* Section 2: Freshly Added to Campus (Prompt Section 18) */}
        <div ref={recentGridRef}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 mb-2">
                <BookCheck className="w-3.5 h-3.5 text-emerald-600" />
                Live Submissions
              </div>
              <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-[40px] text-slate-900 font-bold tracking-tight">
                Freshly Added to Campus
              </h2>
              <p className="text-slate-500 text-sm sm:text-base mt-2">
                Recently approved second-hand textbooks uploaded by engineering peers.
              </p>
            </div>

            <Link
              to="/books"
              className="inline-flex items-center gap-2 font-display font-bold text-sm text-indigo-600 hover:text-indigo-800 hover:gap-3 transition-all self-start sm:self-auto"
            >
              <span>Browse all ({approvedBooks.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentList.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
