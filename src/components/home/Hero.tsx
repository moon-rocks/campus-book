import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Sparkles, BookOpen, Zap } from 'lucide-react';
import { animations } from '../../animations/gsapAnimations';
import { HeroBookVisual } from './HeroBookVisual';

const LIVE_ACTIVITIES = [
  { student: 'Aman K.', college: 'GP Muzaffarpur', dept: 'CSE', book: 'Data Structures & Algorithms', time: '2m ago' },
  { student: 'Pooja S.', college: 'GP Muzaffarpur', dept: 'Civil', book: 'Surveying & Advanced Geomatics', time: '5m ago' },
  { student: 'Rohan V.', college: 'GP Muzaffarpur', dept: 'ME', book: 'Applied Thermodynamics', time: '9m ago' },
  { student: 'Sneha P.', college: 'GP Muzaffarpur', dept: 'ECE', book: 'Signals & Network Theory', time: '14m ago' },
];

export const Hero: React.FC = () => {
  const heroWrapperRef = useRef<HTMLDivElement>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [activityIndex, setActivityIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (heroCardRef.current && contentRef.current && visualRef.current) {
      animations.animateHero(heroCardRef.current, contentRef.current, visualRef.current);
    }
  }, []);

  // Rotate live activity ticker every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActivityIndex((prev) => (prev + 1) % LIVE_ACTIVITIES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Handle interactive mouse spotlight inside the hero card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroCardRef.current) return;
    const rect = heroCardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const currentActivity = LIVE_ACTIVITIES[activityIndex];

  return (
    <section
      id="hero-section"
      ref={heroWrapperRef}
      className="relative pt-4 pb-12 sm:pt-6 sm:pb-16 lg:pt-8 lg:pb-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Large Rounded Hero Container Frame with Interactive Spotlight */}
        <div
          ref={heroCardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative rounded-[32px] sm:rounded-[44px] bg-gradient-to-b from-white via-[#FCFDFF] to-[#F3F6FD] border border-slate-200/90 shadow-[0_20px_60px_rgba(79,70,229,0.06)] hover:shadow-[0_25px_70px_rgba(79,70,229,0.1)] transition-shadow duration-300 p-6 sm:p-10 lg:p-12 xl:p-14 overflow-hidden"
        >
          {/* Dynamic Mouse Spotlight Glow */}
          {isHovered && (
            <div
              className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0"
              style={{
                background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.09), transparent 50%)`,
              }}
            />
          )}

          {/* Subtle Ambient Lighting inside container */}
          <div className="absolute -top-32 right-1/4 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none -z-0" />
          <div className="absolute -bottom-24 left-10 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl pointer-events-none -z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center relative z-10">
            {/* Left Column: Typography, CTAs & Interactive Controls */}
            <div ref={contentRef} className="lg:col-span-5 flex flex-col items-start">
              {/* TOP LIVE STATUS & CAMPUS ACTIVITY TICKER */}
              <div className="hero-anim-label flex flex-wrap items-center gap-2.5 sm:gap-3 mb-4 sm:mb-5 text-[11px] sm:text-xs">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-900 hover:bg-indigo-800 text-indigo-100 border border-indigo-700/60 hover:border-indigo-600 font-bold tracking-wide shadow-2xs hover:shadow-xs transition-all duration-200 hover:-translate-y-0.5 cursor-pointer select-none">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>CAMPUS BOOK</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 hover:border-emerald-300 text-emerald-800 hover:text-emerald-900 font-bold tracking-wide shadow-2xs hover:shadow-xs transition-all duration-200 hover:-translate-y-0.5 cursor-pointer select-none">
                  <span>BIHAR & EXPANDING</span>
                </div>

                {/* Interactive ticker pill */}
                <div
                  onClick={() => setActivityIndex((prev) => (prev + 1) % LIVE_ACTIVITIES.length)}
                  className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50/90 hover:bg-indigo-100/80 border border-indigo-200/70 text-indigo-900 font-medium cursor-pointer transition-colors shadow-2xs"
                  title="Click to view next recent campus activity"
                >
                  <Zap className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600 animate-bounce" />
                  <span className="font-semibold text-slate-900">{currentActivity.student}</span>
                  <span className="text-slate-500">({currentActivity.dept}) exchanged</span>
                  <span className="font-bold text-indigo-700">{currentActivity.book}</span>
                  <span className="text-[10px] text-slate-400">· {currentActivity.time}</span>
                </div>
              </div>

              {/* HERO HEADING: Editorial serif heading with indigo-to-blue gradient highlight */}
              <h1 className="hero-anim-heading font-serif-heading text-4xl sm:text-5xl md:text-6xl lg:text-[54px] text-slate-900 font-bold leading-[1.08] tracking-tight mb-4 sm:mb-5">
                Give Your Books <br className="hidden sm:inline" />
                a{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-500 bg-clip-text text-transparent">
                  Second Campus Life.
                </span>
              </h1>

              {/* HERO DESCRIPTION */}
              <p
                id="hero-tagline-description"
                className="hero-anim-desc max-w-xl text-slate-600 text-base sm:text-lg leading-relaxed mb-8"
              >
                A student-powered academic marketplace connecting Government Polytechnic and B.Tech colleges across Bihar to buy, sell, and exchange affordable textbooks and study materials.
              </p>

              {/* HERO CTA BUTTONS: Dual action buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 w-full sm:w-auto mb-8">
                {/* PRIMARY: Browse Books */}
                <Link
                  to="/books"
                  id="hero-browse-books-btn"
                  className="hero-anim-cta group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 text-white font-bold text-base shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-indigo-200 transition-transform group-hover:rotate-12" />
                  <span>Explore Marketplace</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>

                {/* SECONDARY: Sell Your Book */}
                <Link
                  to="/sell-book"
                  id="hero-sell-book-btn"
                  className="hero-anim-cta group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white/95 hover:bg-slate-50 text-slate-800 hover:text-indigo-600 font-bold text-base border border-slate-200 shadow-xs hover:border-indigo-200 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer backdrop-blur-sm"
                >
                  <BookOpen className="w-4 h-4 text-indigo-600 transition-transform group-hover:scale-110" />
                  <span>List a Book for Sale</span>
                </Link>
              </div>

              {/* TRUST INDICATORS: Interactive badges */}
              <div className="hero-anim-trust pt-5 border-t border-slate-200/70 w-full">
                <div className="flex flex-wrap items-center gap-y-2.5 gap-x-5 sm:gap-x-7 text-xs sm:text-sm font-semibold text-slate-600">
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-50/60 text-emerald-800">
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    <span>100% Peer Verified</span>
                  </div>

                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-indigo-50/60 text-indigo-800">
                    <span>🎓</span>
                    <span>1st–6th Semesters Syllabus</span>
                  </div>

                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-blue-50/60 text-blue-800">
                    <span>📍</span>
                    <span>GP Muzaffarpur Campus</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Academic Book Visual with Clickable Books & Badges */}
            <div ref={visualRef} className="lg:col-span-7 w-full flex items-center justify-center">
              <HeroBookVisual />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


