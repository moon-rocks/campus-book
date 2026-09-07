import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
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
} from 'lucide-react';
import { ALL_BRANCHES, DIPLOMA_BRANCHES, BTECH_BRANCHES } from '../../data/branches';
import { useMarketplace } from '../../context/MarketplaceContext';
import { animations } from '../../animations/gsapAnimations';

// Map icon strings to Lucide components
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

export const BranchSlider: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'Diploma' | 'B.Tech'>('All');
  const sectionRef = useRef<HTMLDivElement>(null);
  const { updateFilter } = useMarketplace();
  const navigate = useNavigate();

  useEffect(() => {
    if (sectionRef.current) {
      animations.revealSection(sectionRef.current);
    }
  }, []);

  const branchList =
    activeTab === 'All'
      ? ALL_BRANCHES
      : activeTab === 'Diploma'
      ? DIPLOMA_BRANCHES
      : BTECH_BRANCHES;

  const handleBranchClick = (branchName: string, course: 'Diploma' | 'B.Tech') => {
    updateFilter('branch', branchName);
    updateFilter('course', course);
    navigate('/books');
  };

  return (
    <section id="browse-by-branch-section" ref={sectionRef} className="py-14 sm:py-20 bg-slate-50/50 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2 block">
              Discipline Explorer
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-[40px] text-slate-900 font-bold tracking-tight">
              Find Books by Branch
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-2">
              Browse syllabus-mapped textbooks tailored for your specific engineering department.
            </p>
          </div>

          {/* Stream Selector Tabs */}
          <div className="inline-flex p-1 bg-white border border-slate-200 rounded-2xl shadow-xs self-start md:self-auto">
            {(['All', 'Diploma', 'B.Tech'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab === 'All' ? 'All Branches' : `${tab} Only`}
              </button>
            ))}
          </div>
        </div>

        {/* Swiper Slider */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={20}
            slidesPerView={1.15}
            breakpoints={{
              640: { slidesPerView: 2.2, spaceBetween: 20 },
              1024: { slidesPerView: 3.2, spaceBetween: 24 },
              1280: { slidesPerView: 4, spaceBetween: 24 },
            }}
            className="pb-12"
          >
            {branchList.map((branch) => {
              const IconComponent = ICON_MAP[branch.icon] || BookOpen;
              return (
                <SwiperSlide key={branch.id} className="h-auto">
                  <div
                    className="h-full flex flex-col justify-between bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer"
                    onClick={() => handleBranchClick(branch.name, branch.course)}
                  >
                    <div>
                      {/* Top icon and course badge */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-all duration-300">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {branch.course} • {branch.code}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-display font-bold text-lg text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {branch.name}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-6">
                        {branch.description}
                      </p>
                    </div>

                    {/* Footer: Count & CTA */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400">
                        {branch.bookCount}+ Available
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                        <span>Explore</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
};
