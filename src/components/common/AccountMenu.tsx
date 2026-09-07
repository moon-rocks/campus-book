import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogIn, UserPlus, BookMarked, Compass, Shield, ArrowLeft } from 'lucide-react';
import { animations } from '../../animations/gsapAnimations';

interface AccountMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountMenu: React.FC<AccountMenuProps> = ({ isOpen, onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      animations.animateAccountDropdown(dropdownRef.current);
    }
  }, [isOpen]);

  const handleCloseAndNavigate = (path: string) => {
    if (dropdownRef.current) {
      animations.animateAccountDropdownClose(dropdownRef.current, () => {
        onClose();
        navigate(path);
      });
    } else {
      onClose();
      navigate(path);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        id="account-menu-backdrop"
        className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Dropdown Window styled precisely to match image */}
      <div
        id="account-dropdown-panel"
        ref={dropdownRef}
        className="absolute right-0 top-full mt-2.5 w-64 sm:w-72 max-w-[calc(100vw-2rem)] z-50 origin-top-right rounded-2xl bg-white p-4 sm:p-5 shadow-2xl ring-1 ring-slate-900/5 border border-slate-100"
      >
        {/* Header with Back button */}
        <div className="flex items-center gap-2.5 pb-2">
          <button
            id="account-back-btn"
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer active:scale-95 flex-shrink-0"
            title="Back / Close"
            aria-label="Back / Close"
          >
            <ArrowLeft className="w-4.5 h-4.5 stroke-[2.4]" />
          </button>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-b from-[#1877F2] via-[#0284c7] to-[#00b4d8] flex items-center justify-center text-white shadow-md shadow-sky-500/25 flex-shrink-0">
            <User className="w-6 h-6 text-white stroke-[2.2]" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-slate-900 tracking-tight leading-tight truncate">
              Account
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">
              Student access
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          {/* Login Item */}
          <button
            id="account-login-btn"
            onClick={() => handleCloseAndNavigate('/login')}
            className="account-stagger-btn w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-slate-800 hover:text-indigo-600 hover:bg-slate-50 font-bold text-base transition-all active:scale-[0.98] cursor-pointer text-left"
          >
            <LogIn className="w-5 h-5 text-slate-700 stroke-[2.4]" />
            <span>Login</span>
          </button>

          {/* Register Prominent Blue/Cyan Button */}
          <button
            id="account-register-btn"
            onClick={() => handleCloseAndNavigate('/register')}
            className="account-stagger-btn w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#1877F2] via-[#0284c7] to-[#00b4d8] hover:from-[#156cdb] hover:to-[#0284c7] text-white font-bold text-base shadow-md shadow-sky-500/25 active:scale-[0.98] transition-all cursor-pointer"
          >
            <UserPlus className="w-5 h-5 text-white stroke-[2.4]" />
            <span>Register</span>
          </button>
        </div>

        {/* Student Quick Links */}
        <div className="account-stagger-btn mt-3.5 pt-2.5 border-t border-slate-100 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 px-2 pb-0.5">
            Quick links
          </div>
          <button
            onClick={() => handleCloseAndNavigate('/sell-book')}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors text-left cursor-pointer"
          >
            <BookMarked className="w-3.5 h-3.5 text-slate-400" />
            <span>List a Book for Sale</span>
          </button>
          <button
            onClick={() => handleCloseAndNavigate('/books')}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors text-left cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-slate-400" />
            <span>Explore Campus Listings</span>
          </button>
          <button
            onClick={() => handleCloseAndNavigate('/admin/dashboard')}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors text-left cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span>Admin Portal</span>
          </button>
        </div>
      </div>
    </>
  );
};
