import React, { useEffect, useRef } from 'react';
import { PiggyBank, School, ShieldCheck, Sparkles } from 'lucide-react';
import { animations } from '../../animations/gsapAnimations';

export const WhyCampusBook: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      animations.revealSection(sectionRef.current);
    }
  }, []);

  const features = [
    {
      num: '01',
      title: 'Affordable',
      highlight: 'Save money on academic books.',
      description: 'Acquire authentic engineering textbooks, manuals, and question banks at 50% to 75% below retail list price directly from seniors.',
      icon: PiggyBank,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
    },
    {
      num: '02',
      title: 'Campus Focused',
      highlight: 'Find books from students and colleges around you.',
      description: 'Filter by your exact institute and exchange books within minutes right on campus with zero courier costs or shipping delays.',
      icon: School,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200/80',
    },
    {
      num: '03',
      title: 'Verified Listings',
      highlight: 'Every submitted listing goes through admin review before appearing publicly.',
      description: 'Our team checks textbook photos, editions, and pricing so you can trust every academic transaction on Campus Book.',
      icon: ShieldCheck,
      color: 'bg-indigo-100/70 text-indigo-700 border-indigo-200/80',
    },
  ];

  return (
    <section id="why-campus-book-section" ref={sectionRef} className="py-16 sm:py-24 bg-slate-50/70 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2 block">
            The Student Advantage
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-[40px] text-slate-900 font-bold tracking-tight">
            Why Campus Book?
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-3">
            Built from real engineering college experiences to solve the high cost of textbooks every semester.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${item.color} border flex items-center justify-center shadow-xs transition-transform group-hover:scale-110`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="font-serif-heading font-extrabold text-2xl text-slate-300 group-hover:text-indigo-600 transition-colors">
                      {item.num}
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-2xl text-slate-900 mb-2">
                    {item.title}
                  </h3>

                  <p className="font-bold text-indigo-900 text-sm mb-3">
                    “{item.highlight}”
                  </p>

                  <p className="text-slate-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
