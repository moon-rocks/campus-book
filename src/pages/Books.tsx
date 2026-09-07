import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X, BookOpen, RotateCcw } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { BookCard } from '../components/books/BookCard';
import { BookFilter } from '../components/books/BookFilter';

export const Books: React.FC = () => {
  const { approvedBooks, filters, updateFilter, resetFilters } = useMarketplace();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter and search logic
  const filteredBooks = useMemo(() => {
    return approvedBooks.filter((book) => {
      // Search query (title, author, subject, description)
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchesQuery =
          book.title.toLowerCase().includes(q) ||
          book.author.toLowerCase().includes(q) ||
          book.subject.toLowerCase().includes(q) ||
          book.description.toLowerCase().includes(q) ||
          book.publisher.toLowerCase().includes(q);

        if (!matchesQuery) return false;
      }

      // Course
      if (filters.course && book.course !== filters.course) {
        return false;
      }

      // Branch
      if (filters.branch && book.branch !== filters.branch) {
        return false;
      }

      // Semester
      if (filters.semester && book.semester !== Number(filters.semester)) {
        return false;
      }

      // Condition
      if (filters.condition && book.condition !== filters.condition) {
        return false;
      }

      // Price Range
      if (filters.priceRange) {
        if (filters.priceRange === 'under-100' && book.price >= 100) return false;
        if (filters.priceRange === '100-300' && (book.price < 100 || book.price > 300)) return false;
        if (filters.priceRange === '300-500' && (book.price < 300 || book.price > 500)) return false;
        if (filters.priceRange === '500-plus' && book.price <= 500) return false;
      }

      // Location filters
      if (filters.state && book.state !== filters.state) {
        return false;
      }
      if (filters.city && book.city !== filters.city) {
        return false;
      }
      if (filters.college && book.college !== filters.college) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-low') return a.price - b.price;
      if (filters.sortBy === 'price-high') return b.price - a.price;
      // latest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [approvedBooks, filters]);

  // Active filter tags
  const activeTags: { key: keyof typeof filters; label: string; value: string }[] = [];
  if (filters.course) activeTags.push({ key: 'course', label: 'Course', value: filters.course });
  if (filters.branch) activeTags.push({ key: 'branch', label: 'Branch', value: filters.branch });
  if (filters.semester) activeTags.push({ key: 'semester', label: 'Semester', value: `Sem ${filters.semester}` });
  if (filters.condition) activeTags.push({ key: 'condition', label: 'Condition', value: filters.condition });
  if (filters.priceRange) activeTags.push({ key: 'priceRange', label: 'Price', value: filters.priceRange });
  if (filters.college) activeTags.push({ key: 'college', label: 'Campus', value: filters.college });
  if (filters.city) activeTags.push({ key: 'city', label: 'City', value: filters.city });
  if (filters.state) activeTags.push({ key: 'state', label: 'State', value: filters.state });

  return (
    <div className="min-h-screen py-8 sm:py-12 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Search Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
                Academic Book Marketplace
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                Showing verified textbooks for Diploma & B.Tech curricula
              </p>
            </div>

            {/* Sort & Mobile Filter Toggle */}
            <div className="flex items-center gap-3">
              <div className="relative inline-flex items-center">
                <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                  className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="latest">Sort: Freshly Added</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-xs"
              >
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                <span>Filters {activeTags.length > 0 && `(${activeTags.length})`}</span>
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              id="books-page-search-input"
              type="text"
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              placeholder="Search by book title, author, subject (e.g. Higher Engineering Mathematics, Balagurusamy, DBMS)..."
              className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200/90 rounded-2xl text-sm font-medium text-slate-900 shadow-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            {filters.searchQuery && (
              <button
                onClick={() => updateFilter('searchQuery', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Active filter badges */}
          {activeTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-200/60">
              <span className="text-xs font-semibold text-slate-400">Active Filters:</span>
              {activeTags.map((tag) => (
                <span
                  key={tag.key}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80"
                >
                  <span>{tag.label}: {tag.value}</span>
                  <button
                    onClick={() => updateFilter(tag.key, '')}
                    className="hover:text-indigo-900 p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-slate-500 hover:text-indigo-600 ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Main Content Layout (Sidebar + Books Grid) */}
        <div className="flex gap-8 items-start">
          <BookFilter
            isMobileDrawerOpen={isMobileFilterOpen}
            onCloseMobileDrawer={() => setIsMobileFilterOpen(false)}
          />

          <main className="flex-1 w-full">
            {/* Results count banner */}
            <div className="flex items-center justify-between mb-6 text-xs text-slate-500">
              <span>
                Found <strong>{filteredBooks.length}</strong> available books
              </span>
            </div>

            {/* Grid */}
            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-md mx-auto my-12">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
                  No Books Match Your Filters
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
                  Try clearing some filter tags or searching with a broader keyword like branch or semester.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-md hover:bg-indigo-700 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
