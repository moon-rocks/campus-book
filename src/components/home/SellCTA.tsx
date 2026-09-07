import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowRight, Sparkles, BookOpen, ShieldCheck } from 'lucide-react';
import { animations, gsap } from '../../animations/gsapAnimations';

export const SellCTA: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const floatingCardRef1 = useRef<HTMLDivElement>(null);
  const floatingCardRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        scale: 1.25,
        opacity: 0.8,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    if (floatingCardRef1.current) {
      gsap.to(floatingCardRef1.current, {
        y: -10,
        rotateZ: 2,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    if (floatingCardRef2.current) {
      gsap.to(floatingCardRef2.current, {
        y: 12,
        rotateZ: -2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.5,
      });
    }
  }, []);

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={containerRef}
          className="relative rounded-[32px] sm:rounded-[44px] bg-gradient-to-r from-indigo-950 via-indigo-900 to-blue-900 text-white p-8 sm:p-14 lg:p-16 overflow-hidden shadow-2xl border border-indigo-500/20"
        >
          {/* Animated Glow Backing */}
          <div
            ref={glowRef}
            className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none"
          />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            <div className="lg:col-span-7 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold mb-6 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Campus Peer-to-Peer Circulation</span>
              </div>

              <h2 className="font-serif-heading font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight mb-4">
                Got Books You Don’t Need Anymore?
              </h2>

              <p className="text-indigo-100 text-base sm:text-lg leading-relaxed mb-8">
                Give your old academic books a second life and help another student save money.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  to="/sell-book"
                  id="cta-sell-book-btn"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-base shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                  data-cursor-label="Sell"
                >
                  <Plus className="w-5 h-5 text-indigo-600 stroke-[3]" />
                  <span>+ Sell Your Book</span>
                </Link>

                <Link
                  to="/how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/15 transition-colors"
                >
                  <span>How It Works</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Floating Visual Elements on Right */}
            <div className="lg:col-span-5 relative hidden sm:flex items-center justify-center">
              {/* Floating Book Card 1 */}
              <div
                ref={floatingCardRef1}
                className="w-64 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl transform -rotate-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-indigo-950 flex items-center justify-center font-bold">
                    📚
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Engineering Physics</p>
                    <p className="text-[10px] text-indigo-200">Sold in 48 Hours • ₹210</p>
                  </div>
                </div>
              </div>

              {/* Floating Book Card 2 */}
              <div
                ref={floatingCardRef2}
                className="w-60 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-white shadow-2xl absolute -bottom-6 -right-2 transform rotate-3"
              >
                <div className="flex items-center gap-3 text-slate-900">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">Direct Handover</p>
                    <p className="text-[10px] text-emerald-600 font-semibold">Direct student pricing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
