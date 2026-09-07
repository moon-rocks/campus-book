import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, Heart, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="main-footer" className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 pb-12 border-b border-slate-800/80">
          {/* Brand Column */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <span className="text-2xl">📚</span>
              <span className="font-serif-heading font-extrabold text-2xl tracking-tight text-white">
                CAMPUS <span className="text-indigo-400">BOOK</span>
              </span>
            </Link>
            <p className="text-base font-medium text-slate-200">
              “Your Books. Your Campus. Your Marketplace.”
            </p>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Designed specifically for Diploma and B.Tech engineering students to find, buy, and pass forward verified second-hand academic textbooks on campus.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950 text-indigo-400 border border-indigo-800/50">
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Verified Listings
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                Diploma + B.Tech
              </span>
            </div>
          </div>

          {/* Explore Column */}
          <div>
            <h4 className="font-display font-bold text-sm tracking-wider uppercase text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/books" className="hover:text-white transition-colors">
                  Browse Books
                </Link>
              </li>
              <li>
                <Link to="/branches" className="hover:text-white transition-colors">
                  Branches
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Sell Column */}
          <div>
            <h4 className="font-display font-bold text-sm tracking-wider uppercase text-white mb-4">
              Sell
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/sell-book" className="hover:text-white transition-colors inline-flex items-center gap-1">
                  <span>Sell a Book</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400" />
                </Link>
              </li>
              <li>
                <Link to="/how-it-works#selling-guide" className="hover:text-white transition-colors">
                  Listing Guidelines
                </Link>
              </li>
              <li>
                <Link to="/branches" className="hover:text-white transition-colors">
                  Popular Subjects
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-white transition-colors text-slate-400 hover:text-indigo-300">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="font-display font-bold text-sm tracking-wider uppercase text-white mb-4">
              Support
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/about#contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/admin/reports" className="hover:text-white transition-colors">
                  Report Listing
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="font-display font-bold text-sm tracking-wider uppercase text-white mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                  Campus Code of Conduct
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 Campus Book. Built for students.</p>
          <div className="flex items-center gap-2">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Diploma & B.Tech scholars across India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
