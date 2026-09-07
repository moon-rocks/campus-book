import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, GraduationCap, Award, BookOpen, Layers } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { animations } from '../../animations/gsapAnimations';

export const CourseSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { updateFilter } = useMarketplace();
  const navigate = useNavigate();

  useEffect(() => {
    if (sectionRef.current) {
      animations.revealSection(sectionRef.current);
    }
  }, []);

  const handleExplore = (course: 'Diploma' | 'B.Tech') => {
    updateFilter('course', course);
    navigate('/books');
  };

  return (
    <section id="browse-by-course-section" ref={sectionRef} className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2 block">
            Curriculum Pathways
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-[40px] text-slate-900 font-bold tracking-tight">
            What Are You Studying?
          </h2>
          <p className="text-slate-500 text-base mt-3">
            Find affordable academic books for your course.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Diploma Card */}
          <div
            id="course-card-diploma"
            className="group relative bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
            onClick={() => handleExplore('Diploma')}
          >
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-amber-50 rounded-full blur-2xl group-hover:bg-amber-100/70 transition-colors pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-amber-100/70 text-amber-700 flex items-center justify-center font-bold text-2xl group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  <Award className="w-8 h-8" />
                </div>
                <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  3 Years • 6 Semesters
                </span>
              </div>

              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 mb-3 group-hover:text-amber-700 transition-colors">
                Diploma
              </h3>

              <p className="text-slate-600 text-base leading-relaxed mb-6">
                Find affordable books for Diploma students across engineering disciplines.
              </p>

              <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500 mb-8">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100">Polytechnic Core</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100">Practical Labs</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100">SBTE / State Board Approved</span>
              </div>
            </div>

            <button
              id="explore-diploma-btn"
              type="button"
              className="inline-flex items-center gap-2 font-display font-bold text-base text-amber-700 group-hover:gap-3 transition-all"
            >
              <span>Explore Diploma</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* B.Tech Card */}
          <div
            id="course-card-btech"
            className="group relative bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
            onClick={() => handleExplore('B.Tech')}
          >
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-indigo-50 rounded-full blur-2xl group-hover:bg-indigo-100/70 transition-colors pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-indigo-100/70 text-indigo-700 flex items-center justify-center font-bold text-2xl group-hover:scale-110 group-hover:-rotate-6 transition-transform">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  4 Years • 8 Semesters
                </span>
              </div>

              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 mb-3 group-hover:text-indigo-700 transition-colors">
                B.Tech
              </h3>

              <p className="text-slate-600 text-base leading-relaxed mb-6">
                Find academic books for B.Tech students from foundational sciences to advanced tech specializations.
              </p>

              <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500 mb-8">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100">AICTE Aligned</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100">GATE & Semester Prep</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100">Standard Authors</span>
              </div>
            </div>

            <button
              id="explore-btech-btn"
              type="button"
              className="inline-flex items-center gap-2 font-display font-bold text-base text-indigo-700 group-hover:gap-3 transition-all"
            >
              <span>Explore B.Tech</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
