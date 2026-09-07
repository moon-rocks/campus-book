import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu,
  Wrench,
  Building2,
  Zap,
  Radio,
  Car,
  FlaskConical,
  Code2,
  Globe,
  Bot,
  Database,
  ArrowRight,
  BookOpen,
  Search,
} from 'lucide-react';
import { ALL_BRANCHES } from '../data/branches';
import { useMarketplace } from '../context/MarketplaceContext';

const ICON_MAP: Record<string, React.ElementType> = {
  Cpu,
  Wrench,
  Building2,
  Zap,
  Radio,
  Car,
  FlaskConical,
  Code2,
  Globe,
  Bot,
  Database,
};

export const Branches: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<'All' | 'Diploma' | 'B.Tech'>('All');
  const [search, setSearch] = useState('');
  const { updateFilter } = useMarketplace();
  const navigate = useNavigate();

  const filtered = ALL_BRANCHES.filter((b) => {
    if (selectedCourse !== 'All' && b.course !== selectedCourse) return false;
    if (search && !b.name.toLowerCase().includes(search.toLowerCase()) && !b.code.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleBranchClick = (branchName: string, course: 'Diploma' | 'B.Tech') => {
    updateFilter('branch', branchName);
    updateFilter('course', course);
    navigate('/books');
  };

  return (
    <div className="min-h-screen py-12 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2 block">
            Academic Engineering Disciplines
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Explore All Branches
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            Select your technical discipline to browse semester textbooks, laboratory guides, and standard reference manuals.
          </p>
        </div>

        {/* Filters and search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 max-w-4xl mx-auto">
          {/* Stream selector */}
          <div className="inline-flex p-1 bg-white border border-slate-200 rounded-2xl shadow-xs">
            {(['All', 'Diploma', 'B.Tech'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedCourse(tab)}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedCourse === tab
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab === 'All' ? 'All Disciplines' : tab}
              </button>
            ))}
          </div>

          {/* Quick search input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search branch name or code..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((branch) => {
            const Icon = ICON_MAP[branch.icon] || BookOpen;
            return (
              <div
                key={branch.id}
                onClick={() => handleBranchClick(branch.name, branch.course)}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {branch.course} • {branch.code}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {branch.name}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    {branch.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">
                    {branch.bookCount}+ Books
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                    <span>Browse Books</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
