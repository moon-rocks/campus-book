import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, Heart, Sparkles, Award, Users, ShieldCheck, ArrowRight } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen py-12 sm:py-20 bg-slate-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-4 border border-indigo-200/80">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>Built by Students, For Students</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight leading-tight">
            Empowering Engineering Education Through Book Circulation.
          </h1>
          <p className="text-slate-500 text-base sm:text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
            Campus Book was created to solve a persistent challenge: high technical textbook costs and unused books gathering dust after exams.
          </p>
        </div>

        {/* Mission Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-sm mb-12">
          <h2 className="font-display font-extrabold text-2xl text-slate-900 mb-4">
            Our Mission
          </h2>
          <p className="text-slate-600 text-base leading-relaxed mb-6">
            Every semester, thousands of Diploma and B.Tech students across technical universities and polytechnics spend thousands on standard reference textbooks like <em>Higher Engineering Mathematics</em>, <em>Basic Electrical Engineering</em>, and <em>Mechanics of Solids</em>. Once semester examinations finish, those valuable textbooks sit unread.
          </p>
          <p className="text-slate-600 text-base leading-relaxed mb-8">
            <strong>Campus Book</strong> bridges the gap between seniors and juniors. By enabling direct peer-to-peer exchanges within college campuses, juniors save up to 75% on semester course materials, while seniors recoup their educational investments.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
            <div>
              <p className="font-display font-extrabold text-3xl text-indigo-600 mb-1">₹3,500+</p>
              <p className="text-xs text-slate-500 font-medium">Average Student Savings per Semester</p>
            </div>
            <div>
              <p className="font-display font-extrabold text-3xl text-emerald-600 mb-1">100%</p>
              <p className="text-xs text-slate-500 font-medium">Curriculum Verified Listings</p>
            </div>
            <div>
              <p className="font-display font-extrabold text-3xl text-indigo-900 mb-1">Zero</p>
              <p className="text-xs text-slate-500 font-medium">Middleman Courier Surcharges</p>
            </div>
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
              Syllabus Focused
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Unlike generic online second-hand retailers, our system organizes books strictly according to Diploma and B.Tech branches, semester numbers, and AICTE university curricula.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
              Admin Moderated
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Every book submission undergoes visual verification by campus moderators to verify legitimate photos, fair pricing, and correct edition details.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-700 text-white rounded-3xl p-8 sm:p-10 text-center shadow-xl">
          <h3 className="font-display font-bold text-2xl mb-2">
            Join the Campus Book Movement
          </h3>
          <p className="text-indigo-100 text-sm mb-6 max-w-md mx-auto">
            Whether you are entering your 1st semester or graduating your final year, give your books a new campus life today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/books"
              className="px-6 py-3 rounded-xl bg-white text-indigo-700 font-bold text-xs shadow-md hover:bg-indigo-50 transition-colors"
            >
              Browse Marketplace
            </Link>
            <Link
              to="/sell-book"
              className="px-6 py-3 rounded-xl bg-indigo-800/70 hover:bg-indigo-800 text-white font-bold text-xs border border-indigo-400/30 transition-colors"
            >
              Sell Your Books
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
