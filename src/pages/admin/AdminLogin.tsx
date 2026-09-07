import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Database,
  CheckCircle2,
  LogIn,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { supabase, isSupabaseConfigured, supabaseUrl } from '../../lib/supabase';

export const AdminLogin: React.FC = () => {
  const { isAdminLoggedIn, setIsAdminLoggedIn, adminEmail, adminLogout, showToast } = useMarketplace();
  const navigate = useNavigate();

  // Empty initial inputs - NO pre-filled demo email or password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  const handlePasswordReset = async () => {
    setAuthError(null);
    setAuthSuccess(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setAuthError('Enter your admin email first, then select Forgot password.');
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setAuthError('Password recovery is unavailable until Supabase is configured.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/admin/login`,
      });

      if (error) {
        setAuthError(error.message);
        return;
      }

      setAuthSuccess('Password reset instructions were sent. Check your email inbox.');
    } catch (err: any) {
      setAuthError(err?.message || 'Unable to send password reset instructions.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Supabase Authentication
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setAuthError('Please enter your admin email address.');
      return;
    }

    if (!password) {
      setAuthError('Please enter your admin password.');
      return;
    }

    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        // Live Supabase Auth: Sign In
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });

        if (error) {
          const message = error.message.toLowerCase().includes('invalid login credentials')
            ? 'Invalid email or password. Create this admin user in Supabase Authentication, or use Forgot password to recover an existing account.'
            : error.message;
          setAuthError(message);
          showToast(`Auth Error: ${message}`, 'error');
          setIsLoading(false);
          return;
        }

        if (data?.user) {
          setIsAdminLoggedIn(true);
          localStorage.setItem('campus_book_admin_email', data.user.email || cleanEmail);
          showToast('Authenticated successfully!', 'success');
          navigate('/admin/dashboard');
        }
      } else {
        // Fallback when Supabase env variables have not been configured yet
        setIsAdminLoggedIn(true);
        localStorage.setItem('campus_book_admin_email', cleanEmail);
        showToast('Signed in to Admin Panel.', 'info');
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      const msg = err?.message || 'An unexpected authentication error occurred.';
      setAuthError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // If already logged in, show active session banner with option to continue
  if (isAdminLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-100">
        <div className="w-full max-w-md bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-5">
            <ShieldCheck className="w-9 h-9" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-bold mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>AUTHENTICATED SESSION</span>
          </div>

          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight mb-2">
            Admin Session Active
          </h1>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            You are currently signed in as{' '}
            <span className="text-amber-400 font-semibold">{adminEmail || 'Administrator'}</span>.
          </p>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="w-full py-3.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-display font-extrabold text-sm shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Go to Admin Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={async () => {
                await adminLogout();
              }}
              className="w-full py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Switch Account / Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-100">
      <div className="w-full max-w-md bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />

        {/* Brand & Badge Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-[11px] font-bold mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
            <span>CAMPUS BOOK MODERATION</span>
          </div>

          <h1 className="font-display font-extrabold text-2xl text-white tracking-tight">
            Admin Login
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sign in with your administrator account to manage student listings.
          </p>
        </div>

        {/* Connection Status Tag */}
        <div className="mb-6 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-300 font-medium">Authentication Status:</span>
          </div>
          {isSupabaseConfigured ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-800/60">
              Awaiting Config
            </span>
          )}
        </div>

        {/* Error Feedback */}
        {authError && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <div className="leading-relaxed">{authError}</div>
          </div>
        )}

        {/* Success Feedback */}
        {authSuccess && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <div className="leading-relaxed">{authSuccess}</div>
          </div>
        )}

        {/* Supabase Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="block text-xs font-bold text-slate-300 mb-1.5">
              Supabase Admin Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@yourcampus.edu"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-xs font-bold text-slate-300 mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button
              type="button"
              onClick={handlePasswordReset}
              disabled={isLoading}
              className="mt-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 disabled:opacity-50 transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            id="admin-login-submit-btn"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:opacity-60 text-white font-display font-extrabold text-sm shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In to Admin Panel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Public Marketplace Link */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <Link
            to="/"
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center gap-1.5"
          >
            <span>Return to Public Campus Book Marketplace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
