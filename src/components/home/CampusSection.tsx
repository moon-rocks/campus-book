import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { MapPin, ArrowRight, Building } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { animations } from '../../animations/gsapAnimations';

export const CampusSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { updateFilter, colleges } = useMarketplace();
  const navigate = useNavigate();

  useEffect(() => {
    if (sectionRef.current) {
      animations.revealSection(sectionRef.current);
    }
  }, []);

  const handleExploreCollege = (collegeName: string, state: string, city: string) => {
    updateFilter('college', collegeName);
    updateFilter('state', state);
    updateFilter('city', city);
    navigate('/books');
  };

  return (
    <section id="campus-section" ref={sectionRef} className="py-12 sm:py-16 bg-slate-900 text-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-7 sm:mb-8 gap-4 sm:gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1.5 block">
              Hyper-Local University Hubs
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl lg:text-[34px] text-white font-bold tracking-tight">
              Find Books Around Your Campus
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-1.5">
              Discover affordable academic books from students near your college.
            </p>
          </div>

          {/* Location Hierarchy Indicator requested in prompt */}
          <div className="bg-slate-800/90 rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 border border-slate-700/80 self-start lg:self-auto">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
              Structured Campus Hierarchy
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-indigo-300">
              <span className="bg-slate-700/80 px-2 py-0.5 rounded text-white">State</span>
              <span className="text-slate-500">→</span>
              <span className="bg-slate-700/80 px-2 py-0.5 rounded text-white">City / District</span>
              <span className="text-slate-500">→</span>
              <span className="bg-slate-700/80 px-2 py-0.5 rounded text-white">College / Institute</span>
              <span className="text-slate-500">→</span>
              <span className="bg-indigo-900/80 px-2 py-0.5 rounded text-indigo-200 border border-indigo-500/30">Branch</span>
              <span className="text-slate-500">→</span>
              <span className="bg-indigo-900/80 px-2 py-0.5 rounded text-indigo-200 border border-indigo-500/30">Semester</span>
            </div>
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
              640: { slidesPerView: 2.1, spaceBetween: 20 },
              1024: { slidesPerView: 3.1, spaceBetween: 24 },
            }}
            className="pb-10"
          >
            {colleges.filter((college) => college.status !== 'inactive').map((college) => (
              <SwiperSlide key={college.id} className="h-auto">
                <div
                  className="h-full flex flex-col justify-between bg-slate-800/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-700/80 shadow-xl hover:border-indigo-500/50 hover:bg-slate-800 transition-all duration-300 group cursor-pointer"
                  onClick={() =>
                    handleExploreCollege(college.name, college.state, college.city)
                  }
                >
                  <div>
                    {/* Location Pin & City */}
                    <div className="flex items-start gap-2 text-indigo-400 text-xs font-semibold mb-3">
                      <MapPin className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                      <span>
                        {college.city}, {college.state}
                      </span>
                    </div>

                    {/* College Name */}
                    <h3 className="font-display font-bold text-lg sm:text-xl text-white mb-4 group-hover:text-indigo-300 transition-colors">
                      {college.name}
                    </h3>

                    {/* Popular Branches Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {college.popularBranches.map((br) => (
                        <span
                          key={br}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-700/70 text-slate-300 border border-slate-600/50"
                        >
                          {br}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer & CTA */}
                  <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">
                      {college.bookCount}+ Books Listed
                    </span>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 group-hover:text-indigo-300 group-hover:translate-x-1 transition-all cursor-pointer"
                    >
                      <span>Explore Books</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};
