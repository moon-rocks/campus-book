import React from 'react';
import { Filter, X, RotateCcw, MapPin, BookOpen, Layers, IndianRupee } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ALL_BRANCHES } from '../../data/branches';
import { STATES_AND_CITIES } from '../../data/courses';

interface BookFilterProps {
  isMobileDrawerOpen?: boolean;
  onCloseMobileDrawer?: () => void;
}

export const BookFilter: React.FC<BookFilterProps> = ({
  isMobileDrawerOpen = false,
  onCloseMobileDrawer,
}) => {
  const { filters, updateFilter, resetFilters, colleges } = useMarketplace();

  // Active filter count
  const activeCount = [
    filters.course,
    filters.branch,
    filters.semester,
    filters.condition,
    filters.priceRange,
    filters.state,
    filters.city,
    filters.college,
  ].filter(Boolean).length;

  const content = (
    <div className="space-y-6">
      {/* Header (Sticky during scrolling) */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 sticky top-0 bg-white/95 backdrop-blur-xs z-10 pt-1 -mt-1">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-600" />
          <h3 className="font-display font-bold text-base text-slate-900">
            Filter Books
          </h3>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Course Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Academic Course
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => updateFilter('course', '')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filters.course === ''
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => updateFilter('course', 'Diploma')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filters.course === 'Diploma'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Diploma
          </button>
          <button
            type="button"
            onClick={() => updateFilter('course', 'B.Tech')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filters.course === 'B.Tech'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            B.Tech
          </button>
        </div>
      </div>

      {/* Branch Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Branch / Discipline
        </label>
        <select
          value={filters.branch}
          onChange={(e) => updateFilter('branch', e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        >
          <option value="">All Branches</option>
          {Array.from(new Set(ALL_BRANCHES.map((b) => b.name))).map((branchName) => (
            <option key={branchName} value={branchName}>
              {branchName}
            </option>
          ))}
        </select>
      </div>

      {/* Semester */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Semester
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
            <button
              key={sem}
              type="button"
              onClick={() =>
                updateFilter('semester', filters.semester === String(sem) ? '' : String(sem))
              }
              className={`py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                filters.semester === String(sem)
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              Sem {sem}
            </button>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Book Condition
        </label>
        <div className="space-y-1.5">
          {['Like New', 'Excellent', 'Good', 'Fair'].map((cond) => (
            <label
              key={cond}
              className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer border transition-colors ${
                filters.condition === cond
                  ? 'bg-indigo-50/60 border-indigo-300 text-indigo-900 font-semibold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span>{cond}</span>
              <input
                type="radio"
                name="condition"
                checked={filters.condition === cond}
                onChange={() =>
                  updateFilter('condition', filters.condition === cond ? '' : cond)
                }
                className="text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Budget / Price
        </label>
        <div className="space-y-1.5">
          {[
            { label: 'All Prices', value: '' },
            { label: 'Under ₹100', value: 'under-100' },
            { label: '₹100 – ₹300', value: '100-300' },
            { label: '₹300 – ₹500', value: '300-500' },
            { label: '₹500+', value: '500-plus' },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => updateFilter('priceRange', item.value)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filters.priceRange === item.value
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* College / Campus Location */}
      <div className="pt-2 border-t border-slate-200">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          College / Institute
        </label>
        <select
          value={filters.college}
          onChange={(e) => updateFilter('college', e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        >
          <option value="">All Campuses</option>
          {colleges.filter((c) => c.status !== 'inactive').map((c) => (
            <option key={c.id} value={c.name}>
              {c.name} ({c.city})
            </option>
          ))}
        </select>
      </div>

      {/* State & City Filter */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-1">
            State
          </label>
          <select
            value={filters.state}
            onChange={(e) => {
              updateFilter('state', e.target.value);
              updateFilter('city', '');
            }}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800"
          >
            <option value="">All States</option>
            {STATES_AND_CITIES.map((s) => (
              <option key={s.state} value={s.state}>
                {s.state}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-1">
            City
          </label>
          <select
            value={filters.city}
            onChange={(e) => updateFilter('city', e.target.value)}
            disabled={!filters.state}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 disabled:opacity-50"
          >
            <option value="">All Cities</option>
            {filters.state &&
              STATES_AND_CITIES.find((s) => s.state === filters.state)?.cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain pr-1">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          {content}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={onCloseMobileDrawer}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 shadow-2xl overflow-y-auto z-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <span className="font-display font-bold text-lg text-slate-900">
                  Filters
                </span>
                <button
                  onClick={onCloseMobileDrawer}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
            </div>

            <div className="pt-6 border-t border-slate-100 mt-6">
              <button
                onClick={onCloseMobileDrawer}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
