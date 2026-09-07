import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Sparkles } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { POPULAR_SEARCH_SUGGESTIONS } from '../../data/courses';

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const { updateFilter } = useMarketplace();
  const navigate = useNavigate();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateFilter('searchQuery', query);
    if (selectedCourse) {
      updateFilter('course', selectedCourse as 'Diploma' | 'B.Tech');
    }
    navigate('/books');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    updateFilter('searchQuery', suggestion);
    navigate('/books');
  };

  return (
    <div id="home-search-container" className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6 relative z-20 mb-14 sm:mb-20">
      <div className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl border border-slate-100">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 flex items-center gap-3 pl-3 w-full">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              id="home-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search books, subjects, authors..."
              className="w-full bg-transparent text-slate-700 placeholder:text-slate-400 font-medium text-sm sm:text-base focus:outline-none"
            />
          </div>

          {/* Divider */}
          <div className="h-8 w-[1px] bg-slate-100 hidden sm:block" />

          {/* Course select */}
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 sm:bg-transparent rounded-xl w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Course</span>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="bg-transparent border-none text-xs font-bold text-indigo-600 focus:outline-none cursor-pointer py-1 pr-2"
            >
              <option value="">All Courses</option>
              <option value="B.Tech">B.Tech</option>
              <option value="Diploma">Diploma</option>
            </select>
          </div>

          <button
            type="submit"
            id="home-search-submit-btn"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shrink-0"
            data-cursor-label="Search"
          >
            <span>Search Books</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Suggestions */}
        <div className="mt-3.5 pt-3 border-t border-slate-100/90 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-400 flex items-center gap-1.5 pl-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Popular:
          </span>
          {POPULAR_SEARCH_SUGGESTIONS.slice(0, 5).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleSuggestionClick(item)}
              className="px-3.5 py-1.5 rounded-full bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 font-semibold transition-colors cursor-pointer border border-slate-200/60"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
