import React, { useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { X, BookOpen, Search, PlusCircle, Layers, HelpCircle, Info, User, ArrowRight, Shield } from 'lucide-react';
import gsap from 'gsap';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, onOpenSearch }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && panelRef.current) {
      document.body.style.overflow = 'hidden';
      const items = panelRef.current.querySelectorAll('.mobile-nav-item');
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, x: '100%' },
        { opacity: 1, x: '0%', duration: 0.35, ease: 'power3.out' }
      );
      gsap.fromTo(
        items,
        { opacity: 0, x: 25 },
        { opacity: 1, x: 0, stagger: 0.06, duration: 0.35, delay: 0.15, ease: 'power2.out' }
      );
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNavigate = (path: string) => {
    onClose();
    navigate(path);
  };

  if (!isOpen) return null;

  return (
    <div
      id="mobile-nav-fullscreen"
      ref={panelRef}
      className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-xl text-white flex flex-col p-6 overflow-y-auto"
    >
      {/* Header with Close */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📚</span>
          <span className="font-display font-extrabold text-xl tracking-tight text-white">
            CAMPUS<span className="text-indigo-400">BOOK</span>
          </span>
        </div>
        <button
          id="mobile-nav-close-btn"
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Close menu"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-8 flex flex-col justify-center gap-3">
        {[
          { label: 'Home', path: '/', icon: BookOpen },
          { label: 'Browse Books', path: '/books', icon: Search },
          { label: 'Sell a Book', path: '/sell-book', icon: PlusCircle, badge: 'Free' },
          { label: 'Branches', path: '/branches', icon: Layers },
          { label: 'How It Works', path: '/how-it-works', icon: HelpCircle },
          { label: 'About', path: '/about', icon: Info },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className="mobile-nav-item flex items-center justify-between p-3.5 rounded-2xl hover:bg-white/10 text-left transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-indigo-500/20 flex items-center justify-center text-indigo-400 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-lg font-semibold tracking-wide text-slate-100 group-hover:text-white">
                  {item.label}
                </span>
              </div>
              {item.badge && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Account Row */}
        <div className="mobile-nav-item pt-4 mt-2 border-t border-white/10">
          <div className="grid grid-cols-2 gap-3">
            <button
              id="mobile-login-btn"
              onClick={() => handleNavigate('/login')}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/10"
            >
              <User className="w-4 h-4 text-indigo-400" />
              <span>Login</span>
            </button>
            <button
              id="mobile-register-btn"
              onClick={() => handleNavigate('/register')}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30"
            >
              <span>Register</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Footer */}
      <div className="pt-6 border-t border-white/10 text-center text-xs text-slate-400">
        <p>Diploma + B.Tech Verified Marketplace</p>
        <div className="mt-2 flex justify-center gap-4 text-slate-500">
          <button onClick={() => handleNavigate('/admin/dashboard')} className="hover:text-slate-300 transition-colors">
            Admin Portal
          </button>
          <span>•</span>
          <span>© 2026 Campus Book</span>
        </div>
      </div>
    </div>
  );
};
