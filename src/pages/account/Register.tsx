import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, GraduationCap, Lock, Mail, User, School, ArrowRight } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('Other College');
  const [password, setPassword] = useState('');
  const { showToast, colleges } = useMarketplace();
  const navigate = useNavigate();

  useEffect(() => {
    if (college === 'Other College' && colleges[0]) setCollege(colleges[0].name);
  }, [college, colleges]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Student account registered successfully! (UI Prototype)', 'success');
    navigate('/books');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-xl">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <UserPlus className="w-7 h-7" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
            Create Student Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Join the peer-to-peer textbook marketplace for your college
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Rohit Verma"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              College Email / Personal Email *
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
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Your College / Polytechnic *
            </label>
            <div className="relative">
              <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {colleges.filter((c) => c.status !== 'inactive').map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Create Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-normal pt-1">
            By registering, you agree to the Campus Book safe exchange policy and student integrity code.
          </p>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Switch Link */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-indigo-600 hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};
