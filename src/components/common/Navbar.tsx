import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, ChevronDown, User, Sparkles, Plus } from 'lucide-react';
import gsap from 'gsap';
import { AccountMenu } from './AccountMenu';
import { MobileNav } from './MobileNav';
import { useMarketplace } from '../../context/MarketplaceContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { isAccountMenuOpen, setIsAccountMenuOpen, setFilters } = useMarketplace();
  const logoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // GSAP Logo Entrance
  useEffect(() => {
    if (logoRef.current) {
      const bookIcon = logoRef.current.querySelector('.logo-book-icon');
      const textChars = logoRef.current.querySelector('.logo-text');

      gsap.fromTo(
        logoRef.current,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
      );

      if (bookIcon) {
        gsap.fromTo(
          bookIcon,
          { rotateY: 35, scale: 0.8 },
          { rotateY: 0, scale: 1, duration: 0.8, delay: 0.1, ease: 'back.out(2)' }
        );
      }
    }
  }, []);

  // Track scroll position for elevated frosted glass style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Quick search focus or navigate
  const handleQuickSearchClick = () => {
    if (location.pathname !== '/books') {
      navigate('/books');
    } else {
      const searchInput = document.getElementById('books-page-search-input');
      if (searchInput) {
        searchInput.focus();
      }
    }
  };

  return (
    <>
      <header
        ref={navRef}
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              ref={logoRef}
              className="flex items-center gap-2.5 group cursor-pointer transition-transform hover:scale-[1.02]"
              id="navbar-brand-logo"
            >
              <div className="logo-book-icon bg-indigo-600 p-2 rounded-xl text-white shadow-sm shadow-indigo-200 transition-transform group-hover:rotate-6 group-hover:scale-110 flex items-center justify-center text-lg">
                📚
              </div>
              <div className="logo-text flex flex-col">
                <span className="font-display font-extrabold text-xl tracking-tight text-slate-900 leading-none">
                  CAMPUS <span className="text-indigo-600">BOOK</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase mt-0.5 hidden sm:block">
                  Diploma • B.Tech Marketplace
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50/80'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/70'
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/books"
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50/80'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/70'
                  }`
                }
              >
                Browse Books
              </NavLink>
              <NavLink
                to="/sell-book"
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50/80'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/70'
                  }`
                }
              >
                <span>Sell a Book</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  +₹
                </span>
              </NavLink>
              <NavLink
                to="/branches"
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50/80'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/70'
                  }`
                }
              >
                Branches
              </NavLink>
              <NavLink
                to="/how-it-works"
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50/80'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/70'
                  }`
                }
              >
                How It Works
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50/80'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/70'
                  }`
                }
              >
                About
              </NavLink>
            </nav>

            {/* Right Side: Sell Book + Account */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* + Sell Book button */}
              <Link
                to="/sell-book"
                id="navbar-sell-book-btn"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full font-bold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Sell Book</span>
              </Link>

              {/* Single Account Button (Matching the exact light colors and squircle styling from the image) */}
              <div className="relative">
                <button
                  id="navbar-account-btn"
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className={`flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95 ${
                    isAccountMenuOpen
                      ? 'bg-slate-50 border border-indigo-400 ring-2 ring-indigo-100 shadow-xs'
                      : 'bg-white border border-[#cad7ee] hover:border-indigo-300 hover:bg-slate-50 shadow-xs'
                  }`}
                  title="Account - Student access"
                  aria-label="Account - Student access"
                  aria-expanded={isAccountMenuOpen}
                  aria-haspopup="true"
                >
                  <User
                    className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.2] text-[#1e293b] transition-colors"
                  />
                </button>

                {/* Animated Dropdown */}
                <AccountMenu
                  isOpen={isAccountMenuOpen}
                  onClose={() => setIsAccountMenuOpen(false)}
                />
              </div>

              {/* Mobile Hamburger (Under 1024px) */}
              <button
                id="navbar-mobile-toggle-btn"
                onClick={() => setIsMobileNavOpen(true)}
                className="lg:hidden p-2.5 rounded-xl text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                aria-label="Open mobile menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Panel */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        onOpenSearch={handleQuickSearchClick}
      />
    </>
  );
};
