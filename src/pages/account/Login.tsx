import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, GraduationCap, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const { showToast } = useMarketplace();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Student logged in successfully! (UI Prototype)', 'success');
    navigate('/books');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-xl">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
            Welcome Back, Student
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Sign in to manage your campus book listings and saved inquiries
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              College Email / Roll No.
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@college.edu"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => showToast('Password reset link will be sent to your student email.', 'info')}
                className="text-xs text-indigo-600 hover:underline font-semibold"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Remember this device</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            <span>Sign In to Campus Book</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 border-t border-slate-200" />
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Or Continue With</span>
          <div className="flex-1 border-t border-slate-200" />
        </div>

        {/* Single Sign On Mock */}
        <button
          type="button"
          onClick={() => showToast('Student College SSO will be linked in Phase 2.', 'info')}
          className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-4 h-4"
          />
          <span>Continue with College Google Account</span>
        </button>

        {/* Switch Link */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Don’t have an account yet?{' '}
          <Link to="/register" className="font-bold text-indigo-600 hover:underline">
            Register as a Student
          </Link>
        </p>
      </div>
    </div>
  );
};
