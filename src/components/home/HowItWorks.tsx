import React, { useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, MessageSquare, Handshake, CheckCircle } from 'lucide-react';
import { animations } from '../../animations/gsapAnimations';

export const HowItWorks: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      animations.revealSection(sectionRef.current);
    }
  }, []);

  const steps = [
    {
      num: '01',
      title: 'FIND',
      desc: 'Search for your required book by course, branch, semester, or college.',
      icon: Search,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200/80',
    },
    {
      num: '02',
      title: 'COMPARE',
      desc: 'Check price, condition, branch, semester syllabus and college location.',
      icon: SlidersHorizontal,
      color: 'bg-amber-50 text-amber-600 border-amber-200/80',
    },
    {
      num: '03',
      title: 'CONNECT',
      desc: 'Contact the seller directly through Campus Book messaging.',
      icon: MessageSquare,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200/80',
    },
    {
      num: '04',
      title: 'BUY',
      desc: 'Complete the exchange safely on your university campus.',
      icon: Handshake,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
    },
  ];

  return (
    <section id="how-it-works-section" ref={sectionRef} className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2 block">
            Simple 4-Step Flow
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-[40px] text-slate-900 font-bold tracking-tight">
            How Campus Book Works
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-3">
            Designed for quick, safe peer-to-peer exchanges right between lectures.
          </p>
        </div>

        {/* Steps Grid with Connecting Line for Desktop */}
        <div className="relative">
          {/* Subtle Horizontal Connecting Line on Large Screens */}
          <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] -translate-y-8 h-[2px] bg-gradient-to-r from-indigo-200 via-indigo-300 to-emerald-200 -z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="group relative bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Step Number & Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-serif-heading font-extrabold text-3xl sm:text-4xl text-indigo-200 group-hover:text-indigo-600 transition-colors">
                        {step.num}
                      </span>
                      <div className={`w-12 h-12 rounded-2xl ${step.color} border flex items-center justify-center shadow-xs transition-transform group-hover:scale-110`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="font-display font-extrabold text-lg sm:text-xl text-slate-900 mb-2 tracking-wide">
                      {step.title}
                    </h3>

                    <p className="text-slate-600 text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Campus Verified</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
