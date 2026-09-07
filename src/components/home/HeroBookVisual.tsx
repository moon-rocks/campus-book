import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Laptop,
  Cpu,
  Zap,
  Cog,
  HardHat,
  Check,
  BookOpen,
  GraduationCap,
  MapPin,
  ChevronRight,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  Play,
  Pause,
} from 'lucide-react';
import gsap from 'gsap';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperCore } from 'swiper';
import { Autoplay, EffectCards, Pagination } from 'swiper/modules';

type DepartmentKey = 'CSE' | 'ECE' | 'EE' | 'ME' | 'CIVIL';

interface DepartmentConfig {
  id: DepartmentKey;
  label: string;
  sublabel: string;
  name: string;
  gradient: string;
  cardBg: string;
  shadowGlow: string;
  accentBg: string;
  nodeBg: string;
  nodeRing: string;
  nodeColor: string;
  icon: React.ComponentType<{ className?: string }>;
  tags: string[];
}

const DEPARTMENTS: Record<DepartmentKey, DepartmentConfig> = {
  CSE: {
    id: 'CSE',
    label: 'CSE',
    sublabel: 'COLLECTION',
    name: 'Computer Science & Engineering',
    gradient: 'from-[#1a56db] via-[#1e40af] to-[#0284c7]',
    cardBg: 'bg-[#1e40af]',
    shadowGlow: 'rgba(37, 99, 235, 0.45)',
    accentBg: 'bg-blue-500/20 text-blue-200 border-blue-400/30',
    nodeBg: 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white',
    nodeRing: 'ring-blue-400 shadow-blue-500/30',
    nodeColor: 'text-blue-600',
    icon: Laptop,
    tags: ['Programming', 'DSA', 'DBMS', 'and more...'],
  },
  ECE: {
    id: 'ECE',
    label: 'ECE',
    sublabel: 'COLLECTION',
    name: 'Electronics & Communication',
    gradient: 'from-[#6b21a8] via-[#7c3aed] to-[#9333ea]',
    cardBg: 'bg-[#7c3aed]',
    shadowGlow: 'rgba(124, 58, 237, 0.45)',
    accentBg: 'bg-purple-500/20 text-purple-200 border-purple-400/30',
    nodeBg: 'bg-gradient-to-br from-purple-600 to-indigo-800 text-white',
    nodeRing: 'ring-purple-400 shadow-purple-500/30',
    nodeColor: 'text-purple-600',
    icon: Cpu,
    tags: ['Analog Circuits', 'Signals', 'Microprocessors', 'and more...'],
  },
  EE: {
    id: 'EE',
    label: 'EE',
    sublabel: 'COLLECTION',
    name: 'Electrical Engineering',
    gradient: 'from-[#9f1239] via-[#be123c] to-[#e11d48]',
    cardBg: 'bg-[#be123c]',
    shadowGlow: 'rgba(225, 29, 72, 0.45)',
    accentBg: 'bg-rose-500/20 text-rose-200 border-rose-400/30',
    nodeBg: 'bg-gradient-to-br from-rose-600 to-red-700 text-white',
    nodeRing: 'ring-rose-400 shadow-rose-500/30',
    nodeColor: 'text-rose-600',
    icon: Zap,
    tags: ['Electrical Machines', 'Power Systems', 'Control', 'and more...'],
  },
  ME: {
    id: 'ME',
    label: 'ME',
    sublabel: 'COLLECTION',
    name: 'Mechanical Engineering',
    gradient: 'from-[#0f766e] via-[#0d9488] to-[#14b8a6]',
    cardBg: 'bg-[#0d9488]',
    shadowGlow: 'rgba(13, 148, 136, 0.45)',
    accentBg: 'bg-teal-500/20 text-teal-200 border-teal-400/30',
    nodeBg: 'bg-gradient-to-br from-teal-600 to-emerald-700 text-white',
    nodeRing: 'ring-teal-400 shadow-teal-500/30',
    nodeColor: 'text-teal-600',
    icon: Cog,
    tags: ['Thermodynamics', 'Fluid Mechanics', 'Machine Design', 'and more...'],
  },
  CIVIL: {
    id: 'CIVIL',
    label: 'CIVIL',
    sublabel: 'COLLECTION',
    name: 'Civil Engineering',
    gradient: 'from-[#c2410c] via-[#ea580c] to-[#f97316]',
    cardBg: 'bg-[#ea580c]',
    shadowGlow: 'rgba(234, 88, 12, 0.45)',
    accentBg: 'bg-orange-500/20 text-orange-200 border-orange-400/30',
    nodeBg: 'bg-gradient-to-br from-orange-600 to-amber-700 text-white',
    nodeRing: 'ring-orange-400 shadow-orange-500/30',
    nodeColor: 'text-orange-600',
    icon: HardHat,
    tags: ['Surveying', 'Structural Analysis', 'Concrete', 'and more...'],
  },
};

// Department order for Swiper slides (Starts with CSE as requested)
const DEPT_ORDER: DepartmentKey[] = ['CSE', 'ECE', 'EE', 'ME', 'CIVIL'];

// Semester numbers
const SEMESTERS = ['1st', '2nd', '3rd', '4th', '5th', '6th'];

export const HeroBookVisual: React.FC = () => {
  const [activeDept, setActiveDept] = useState<DepartmentKey>('CSE');
  const [isAutoplayRunning, setIsAutoplayRunning] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<SVGSVGElement>(null);
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const cornerCardsRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperCore | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Gentle continuous floating animation for the center deck
    const deckAnim = gsap.to(deckRef.current, {
      y: -6,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Subtle gentle floating for corners
    const corners = cornerCardsRef.current?.children;
    if (corners) {
      Array.from(corners).forEach((card, index) => {
        gsap.to(card as HTMLElement, {
          y: index % 2 === 0 ? -5 : 5,
          duration: 3 + index * 0.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.2,
        });
      });
    }

    // Mouse parallax
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const xPercent = (e.clientX - rect.left) / rect.width - 0.5;
      const yPercent = (e.clientY - rect.top) / rect.height - 0.5;

      if (deckRef.current) {
        gsap.to(deckRef.current, {
          rotateY: xPercent * 10,
          rotateX: -yPercent * 8,
          duration: 0.6,
          ease: 'power2.out',
        });
      }

      if (orbitRef.current) {
        gsap.to(orbitRef.current, {
          x: xPercent * 6,
          y: yPercent * 6,
          duration: 0.8,
          ease: 'power2.out',
        });
      }
    };

    const handleMouseLeave = () => {
      if (deckRef.current) {
        gsap.to(deckRef.current, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.8,
          ease: 'power2.out',
        });
      }
      if (orbitRef.current) {
        gsap.to(orbitRef.current, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
        });
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      deckAnim.kill();
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleDepartmentClick = (dept: DepartmentKey) => {
    setActiveDept(dept);
    const targetIndex = DEPT_ORDER.indexOf(dept);
    if (swiperRef.current && targetIndex !== -1) {
      swiperRef.current.slideToLoop(targetIndex);
    }
  };

  const toggleAutoplay = () => {
    if (!swiperRef.current) return;
    if (isAutoplayRunning) {
      swiperRef.current.autoplay.stop();
      setIsAutoplayRunning(false);
    } else {
      swiperRef.current.autoplay.start();
      setIsAutoplayRunning(true);
    }
  };

  const handleSemesterClick = (semNumber: string) => {
    navigate(`/books?semester=${encodeURIComponent(semNumber)}`);
  };

  return (
    <div
      id="hero-book-visual-wrapper"
      ref={containerRef}
      className="relative w-full max-w-[760px] mx-auto rounded-[32px] sm:rounded-[40px] bg-gradient-to-b from-[#f8faff]/95 via-[#f1f5fe]/90 to-[#edf2fb]/90 border border-slate-200/80 shadow-[0_20px_60px_rgba(79,70,229,0.07)] p-3 sm:p-6 md:p-8 overflow-hidden select-none"
    >
      {/* Soft floating pearl spheres in background */}
      <div className="pointer-events-none absolute top-12 left-8 w-6 h-6 rounded-full bg-gradient-to-br from-white via-blue-100 to-indigo-200/60 shadow-md blur-[0.5px]" />
      <div className="pointer-events-none absolute top-24 right-10 w-7 h-7 rounded-full bg-gradient-to-br from-white via-indigo-100 to-purple-200/60 shadow-md blur-[0.5px]" />
      <div className="pointer-events-none absolute bottom-24 left-12 w-5 h-5 rounded-full bg-gradient-to-br from-white via-blue-50 to-blue-200/50 shadow-xs blur-[0.5px]" />
      <div className="pointer-events-none absolute bottom-20 right-12 w-6 h-6 rounded-full bg-gradient-to-br from-white via-rose-50 to-rose-200/50 shadow-xs blur-[0.5px]" />

      {/* Handwritten editorial accent notes on the sides (visible on md+) */}
      <div className="hidden lg:flex flex-col items-center absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500/80 z-10">
        <span className="font-serif italic text-[11px] leading-tight text-center font-medium tracking-wide">
          Same<br />Students<br />New Opportunities
        </span>
        <svg className="w-9 h-4 text-indigo-400/80 mt-1 stroke-current fill-none stroke-[1.4]" viewBox="0 0 40 20">
          <path d="M 5 6 Q 20 18 35 9 M 29 4 L 35 9 L 28 14" />
        </svg>
      </div>

      <div className="hidden lg:flex flex-col items-center absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500/80 z-10">
        <span className="font-serif italic text-[11px] leading-tight text-center font-medium tracking-wide">
          Books<br />Build<br />Better Futures
        </span>
        <svg className="w-9 h-4 text-indigo-400/80 mt-1 stroke-current fill-none stroke-[1.4]" viewBox="0 0 40 20">
          <path d="M 5 12 Q 20 3 35 10 M 27 7 L 35 10 L 29 15" />
        </svg>
      </div>

      {/* SVG Dotted Orbit Background Layer */}
      <svg
        ref={orbitRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox="0 0 700 480"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Main Dotted Orbit Ellipse */}
        <ellipse
          cx="350"
          cy="225"
          rx="255"
          ry="155"
          fill="none"
          stroke="#818cf8"
          strokeWidth="1.6"
          strokeDasharray="5 7"
          strokeOpacity="0.4"
        />

        {/* Diagonal and radial connector dashed lines to corners and nodes */}
        <line x1="160" y1="100" x2="225" y2="140" stroke="#818cf8" strokeWidth="1.2" strokeDasharray="4 6" strokeOpacity="0.35" />
        <line x1="540" y1="100" x2="475" y2="140" stroke="#818cf8" strokeWidth="1.2" strokeDasharray="4 6" strokeOpacity="0.35" />
        <line x1="160" y1="350" x2="225" y2="310" stroke="#818cf8" strokeWidth="1.2" strokeDasharray="4 6" strokeOpacity="0.35" />
        <line x1="540" y1="350" x2="475" y2="310" stroke="#818cf8" strokeWidth="1.2" strokeDasharray="4 6" strokeOpacity="0.35" />
        <line x1="350" y1="50" x2="350" y2="90" stroke="#818cf8" strokeWidth="1.2" strokeDasharray="3 5" strokeOpacity="0.4" />
        <line x1="350" y1="360" x2="350" y2="400" stroke="#818cf8" strokeWidth="1.2" strokeDasharray="3 5" strokeOpacity="0.4" />
      </svg>

      {/* ========================================================================= */}
      {/* 4 Corner Floating Glassmorphism Cards                                     */}
      {/* ========================================================================= */}
      <div ref={cornerCardsRef} className="relative z-10 w-full">
        {/* TOP ROW: Verified Books (Left) & Academic Collection (Right) */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-5">
          {/* 1. Verified Books (Top Left) */}
          <button
            type="button"
            onClick={() => navigate('/books')}
            className="group flex items-center gap-2 sm:gap-3 px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white/95 hover:bg-white backdrop-blur-md border border-white/90 hover:border-emerald-300 shadow-[0_8px_22px_rgba(16,185,129,0.08)] hover:shadow-[0_12px_28px_rgba(16,185,129,0.16)] transition-all cursor-pointer text-left active:scale-95"
            title="View verified campus books"
          >
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 shrink-0">
              <Check className="w-3.5 h-3.5 sm:w-5 sm:h-5 stroke-[3]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1">
                Verified Books
              </span>
              <span className="text-[9px] sm:text-[11px] text-slate-500 font-medium">
                Campus checked
              </span>
            </div>
            <div className="hidden sm:flex w-6 h-6 rounded-lg bg-slate-100/80 group-hover:bg-emerald-50 text-slate-400 group-hover:text-emerald-700 items-center justify-center transition-colors shrink-0 ml-1">
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* 2. Academic Collection (Top Right) */}
          <button
            type="button"
            onClick={() => navigate('/books')}
            className="group flex items-center gap-2 sm:gap-3 px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white/95 hover:bg-white backdrop-blur-md border border-white/90 hover:border-amber-300 shadow-[0_8px_22px_rgba(245,158,11,0.08)] hover:shadow-[0_12px_28px_rgba(245,158,11,0.16)] transition-all cursor-pointer text-left active:scale-95"
            title="Browse all academic collections"
          >
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/25 shrink-0">
              <BookOpen className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1">
                Academic Collection
              </span>
              <span className="text-[9px] sm:text-[11px] text-slate-500 font-medium">
                Subjects & semesters
              </span>
            </div>
            <div className="hidden sm:flex w-6 h-6 rounded-lg bg-slate-100/80 group-hover:bg-amber-50 text-slate-400 group-hover:text-amber-700 items-center justify-center transition-colors shrink-0 ml-1">
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* Department Floating Nodes on Orbit (Around the Center Stack)              */}
        {/* ========================================================================= */}
        <div className="relative flex items-center justify-center my-2 sm:my-4">
          {/* 1. CSE Node (Top Center) */}
          <button
            type="button"
            onClick={() => handleDepartmentClick('CSE')}
            ref={(el) => (nodeRefs.current['CSE'] = el)}
            className={`absolute -top-3 sm:-top-5 z-20 flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all duration-300 cursor-pointer active:scale-95 min-h-[34px] sm:min-h-[38px] ${
              activeDept === 'CSE'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-4 ring-blue-300 scale-105'
                : 'bg-white/95 text-slate-700 hover:text-blue-600 border border-slate-200/80 hover:border-blue-300 shadow-sm'
            }`}
            title="Switch to Computer Science & Engineering collection"
          >
            <Laptop className="w-3.5 h-3.5" />
            <span className="text-[11px] sm:text-xs font-bold tracking-wide">CSE</span>
          </button>

          {/* 2. ECE Node (Top Right Orbit) */}
          <button
            type="button"
            onClick={() => handleDepartmentClick('ECE')}
            ref={(el) => (nodeRefs.current['ECE'] = el)}
            className={`absolute top-2 sm:top-5 right-1 sm:right-6 md:right-8 z-20 flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all duration-300 cursor-pointer active:scale-95 min-h-[34px] sm:min-h-[38px] ${
              activeDept === 'ECE'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 ring-4 ring-purple-300 scale-105'
                : 'bg-white/95 text-slate-700 hover:text-purple-600 border border-slate-200/80 hover:border-purple-300 shadow-sm'
            }`}
            title="Switch to Electronics & Communication collection"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span className="text-[11px] sm:text-xs font-bold tracking-wide">ECE</span>
          </button>

          {/* 3. CIVIL Node (Bottom Right Orbit) */}
          <button
            type="button"
            onClick={() => handleDepartmentClick('CIVIL')}
            ref={(el) => (nodeRefs.current['CIVIL'] = el)}
            className={`absolute bottom-4 sm:bottom-7 right-1 sm:right-6 md:right-8 z-20 flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all duration-300 cursor-pointer active:scale-95 min-h-[34px] sm:min-h-[38px] ${
              activeDept === 'CIVIL'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30 ring-4 ring-orange-300 scale-105'
                : 'bg-white/95 text-slate-700 hover:text-orange-600 border border-slate-200/80 hover:border-orange-300 shadow-sm'
            }`}
            title="Switch to Civil Engineering collection"
          >
            <HardHat className="w-3.5 h-3.5" />
            <span className="text-[11px] sm:text-xs font-bold tracking-wide">CIVIL</span>
          </button>

          {/* 4. EE Node (Bottom Center) */}
          <button
            type="button"
            onClick={() => handleDepartmentClick('EE')}
            ref={(el) => (nodeRefs.current['EE'] = el)}
            className={`absolute -bottom-3 sm:-bottom-5 z-20 flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all duration-300 cursor-pointer active:scale-95 min-h-[34px] sm:min-h-[38px] ${
              activeDept === 'EE'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 ring-4 ring-rose-300 scale-105'
                : 'bg-white/95 text-slate-700 hover:text-rose-600 border border-slate-200/80 hover:border-rose-300 shadow-sm'
            }`}
            title="Switch to Electrical Engineering collection"
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="text-[11px] sm:text-xs font-bold tracking-wide">EE</span>
          </button>

          {/* 5. ME Node (Bottom Left Orbit) */}
          <button
            type="button"
            onClick={() => handleDepartmentClick('ME')}
            ref={(el) => (nodeRefs.current['ME'] = el)}
            className={`absolute bottom-4 sm:bottom-7 left-1 sm:left-6 md:left-8 z-20 flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all duration-300 cursor-pointer active:scale-95 min-h-[34px] sm:min-h-[38px] ${
              activeDept === 'ME'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30 ring-4 ring-teal-300 scale-105'
                : 'bg-white/95 text-slate-700 hover:text-teal-600 border border-slate-200/80 hover:border-teal-300 shadow-sm'
            }`}
            title="Switch to Mechanical Engineering collection"
          >
            <Cog className="w-3.5 h-3.5" />
            <span className="text-[11px] sm:text-xs font-bold tracking-wide">ME</span>
          </button>

          {/* ========================================================================= */}
          {/* SWIPER.JS AUTOMOTIVE DECK (CENTERPIECE)                                   */}
          {/* ========================================================================= */}
          <div
            ref={deckRef}
            className="relative flex flex-col items-center justify-center transform-gpu my-1 sm:my-2"
            style={{ perspective: '1200px' }}
          >
            {/* Swiper Deck Wrapper */}
            <div className="relative w-[260px] xs:w-[280px] sm:w-[320px] md:w-[340px] h-[330px] sm:h-[360px] md:h-[370px]">
              {/* Quick Side Nav Chevrons */}
              <button
                type="button"
                onClick={() => swiperRef.current?.slidePrev()}
                className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-40 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-indigo-600 shadow-md border border-slate-200/80 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title="Previous department card"
                aria-label="Previous department"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                type="button"
                onClick={() => swiperRef.current?.slideNext()}
                className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-40 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-indigo-600 shadow-md border border-slate-200/80 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title="Next department card"
                aria-label="Next department"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <Swiper
                modules={[Autoplay, EffectCards, Pagination]}
                effect="cards"
                grabCursor={true}
                loop={true}
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                cardsEffect={{
                  slideShadows: false,
                  perSlideOffset: 8,
                  perSlideRotate: 3,
                }}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                onSlideChange={(swiper) => {
                  const nextDept = DEPT_ORDER[swiper.realIndex];
                  if (nextDept) {
                    setActiveDept(nextDept);
                  }
                }}
                className="hero-dept-swiper w-full h-full"
              >
                {DEPT_ORDER.map((deptKey) => {
                  const cfg = DEPARTMENTS[deptKey];
                  const DeptIcon = cfg.icon;

                  return (
                    <SwiperSlide
                      key={deptKey}
                      className="w-full h-full rounded-[26px] sm:rounded-[34px] overflow-hidden"
                    >
                      <div
                        className={`w-full h-full rounded-[26px] sm:rounded-[34px] bg-gradient-to-b ${cfg.gradient} text-white p-4 sm:p-6 flex flex-col justify-between border-t-2 border-white/40 shadow-2xl transition-shadow select-none`}
                        style={{
                          boxShadow: `0 20px 45px -10px ${cfg.shadowGlow}`,
                        }}
                      >
                        {/* Top Header Label */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.22em] text-white/90 uppercase">
                            CAMPUS BOOK
                          </span>
                          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-xs text-[10px] text-white/90">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 -ml-2" />
                            <span className="font-semibold">{cfg.label}</span>
                          </div>
                        </div>

                        {/* Middle: Icon, Department Name & Tagline */}
                        <div className="flex flex-col items-center text-center my-auto">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white mb-2 sm:mb-3 shadow-inner">
                            <DeptIcon className="w-6 h-6 sm:w-8 sm:h-8 stroke-[1.8]" />
                          </div>

                          <h3 className="font-display font-black text-2xl sm:text-4xl tracking-tight text-white leading-none mb-1">
                            {cfg.label}
                          </h3>
                          <span className="text-xs sm:text-sm font-extrabold tracking-[0.18em] text-white/90 uppercase mb-1 sm:mb-2">
                            {cfg.sublabel}
                          </span>
                          <p className="text-[11px] sm:text-xs text-white/80 max-w-[220px] leading-snug mb-2 sm:mb-3">
                            Explore books for your semester & subjects
                          </p>

                          {/* Department subject pills */}
                          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 max-w-[240px]">
                            {cfg.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 rounded-md bg-white/15 text-[10px] sm:text-[11px] font-medium text-white/95 border border-white/20 backdrop-blur-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Bottom CTA Button inside Center Card */}
                        <button
                          type="button"
                          onClick={() => navigate(`/books?branch=${encodeURIComponent(deptKey)}`)}
                          className="group/cta w-full py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs sm:text-sm shadow-lg shadow-black/10 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                        >
                          <span>Explore Books</span>
                          <ArrowRight className="w-4 h-4 text-slate-900 transition-transform group-hover/cta:translate-x-1" />
                        </button>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>

            {/* Automotive Swiper Controls: Autoplay Pill & Department Dots */}
            <div className="flex items-center justify-center gap-2.5 mt-3 z-30">
              <button
                type="button"
                onClick={toggleAutoplay}
                className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-bold transition-all shadow-xs border cursor-pointer active:scale-95 ${
                  isAutoplayRunning
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title={isAutoplayRunning ? 'Click to pause auto-slide' : 'Click to resume auto-slide'}
              >
                {isAutoplayRunning ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    <Pause className="w-3 h-3" />
                    <span>Auto Active</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-slate-500 fill-slate-500" />
                    <span>Paused</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-200/80 shadow-2xs">
                {DEPT_ORDER.map((deptKey) => {
                  const isCurrent = deptKey === activeDept;
                  return (
                    <button
                      key={deptKey}
                      type="button"
                      onClick={() => handleDepartmentClick(deptKey)}
                      className={`transition-all rounded-full cursor-pointer ${
                        isCurrent
                          ? 'w-5 h-2 bg-indigo-600 shadow-xs'
                          : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                      }`}
                      title={`Slide to ${deptKey}`}
                      aria-label={`Slide to ${deptKey}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Student Marketplace (Left) & Muzaffarpur Campus (Right) */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 mt-3 sm:mt-5">
          {/* 3. Student Marketplace (Bottom Left) */}
          <button
            type="button"
            onClick={() => navigate('/sell-book')}
            className="group flex items-center gap-2 sm:gap-3 px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white/95 hover:bg-white backdrop-blur-md border border-white/90 hover:border-indigo-300 shadow-[0_8px_22px_rgba(79,70,229,0.08)] hover:shadow-[0_12px_28px_rgba(79,70,229,0.16)] transition-all cursor-pointer text-left active:scale-95"
            title="Buy, Sell, or Exchange academic books"
          >
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/25 shrink-0">
              <GraduationCap className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1">
                Student Marketplace
              </span>
              <span className="text-[9px] sm:text-[11px] text-slate-500 font-medium">
                Buy • Sell • Exchange
              </span>
            </div>
            <div className="hidden sm:flex w-6 h-6 rounded-lg bg-slate-100/80 group-hover:bg-indigo-50 text-slate-400 group-hover:text-indigo-700 items-center justify-center transition-colors shrink-0 ml-1">
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* 4. Muzaffarpur Campus (Bottom Right) */}
          <button
            type="button"
            onClick={() => navigate('/books?campus=gp-muzaffarpur')}
            className="group flex items-center gap-2 sm:gap-3 px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white/95 hover:bg-white backdrop-blur-md border border-white/90 hover:border-rose-300 shadow-[0_8px_22px_rgba(244,63,94,0.08)] hover:shadow-[0_12px_28px_rgba(244,63,94,0.16)] transition-all cursor-pointer text-left active:scale-95"
            title="Explore Government Polytechnic Muzaffarpur listings"
          >
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center shadow-md shadow-rose-500/25 shrink-0">
              <MapPin className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1">
                Muzaffarpur Campus
              </span>
              <span className="text-[9px] sm:text-[11px] text-slate-500 font-medium">
                Govt. Polytechnic
              </span>
            </div>
            <div className="hidden sm:flex w-6 h-6 rounded-lg bg-slate-100/80 group-hover:bg-rose-50 text-slate-400 group-hover:text-rose-700 items-center justify-center transition-colors shrink-0 ml-1">
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BROWSE BY SEMESTER (Bottom Bar)                                            */}
      {/* ========================================================================= */}
      <div className="relative z-10 pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-slate-200/70 flex flex-col items-center w-full">
        <div className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.2em] text-slate-400 uppercase mb-2">
          B R O W S E &nbsp; B Y &nbsp; S E M E S T E R
        </div>

        {/* Semester Interactive Chips (horizontally scrollable on mobile) */}
        <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar px-1">
          {SEMESTERS.map((sem) => (
            <button
              key={sem}
              type="button"
              onClick={() => handleSemesterClick(sem)}
              className="shrink-0 px-3 sm:px-3.5 py-1 rounded-xl bg-white/90 hover:bg-indigo-50/90 text-slate-700 hover:text-indigo-700 font-semibold text-xs border border-slate-200/80 hover:border-indigo-200 transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              {sem} Sem
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

