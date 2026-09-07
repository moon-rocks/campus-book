import React from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  MessageSquare,
  Handshake,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Find Books Around Your Campus',
      desc: 'Use dynamic filters for course (Diploma/B.Tech), branch, semester, and college to find exact curriculum textbooks.',
      icon: Search,
      tips: 'Tip: Filter by your specific college to find classmates in the same department.',
    },
    {
      num: '02',
      title: 'Inspect Price & Condition',
      desc: 'Every listing is reviewed by campus admins. Inspect real photo uploads, condition labels (Like New, Good, etc.), and original MRP discounts.',
      icon: SlidersHorizontal,
      tips: 'Tip: Books with the green "Admin Verified" badge have photos and details checked for accuracy.',
    },
    {
      num: '03',
      title: 'Connect Securely with Sellers',
      desc: 'Contact the verified seller directly through Campus Book to arrange a mutual exchange without sharing your home address.',
      icon: MessageSquare,
      tips: 'Tip: Private messaging will be fully integrated with real-time sockets in Phase 2.',
    },
    {
      num: '04',
      title: 'Meet On Campus & Exchange',
      desc: 'Meet safely in well-lit public campus locations like the central library, college cafeteria, or department lawn.',
      icon: Handshake,
      tips: 'Tip: Check every chapter and page before handing over cash or completing UPI transfer.',
    },
  ];

  return (
    <div className="min-h-screen py-12 sm:py-16 bg-slate-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2 block">
            Safe & Simple Process
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight">
            How Campus Book Works
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-3 max-w-xl mx-auto">
            A peer-to-peer marketplace built specifically to make buying and selling engineering textbooks affordable and safe.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8 mb-16">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start gap-6"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100 font-display font-extrabold text-xl">
                  {step.num}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-5 h-5 text-indigo-600" />
                    <h2 className="font-display font-bold text-xl text-slate-900">
                      {step.title}
                    </h2>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {step.desc}
                  </p>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 font-medium">
                    💡 {step.tips}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dedicated Selling Workflow & Moderation Diagram */}
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl mb-12 border border-indigo-800/60">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2">
              No Login Needed to Sell
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight">
              The Campus Book Moderation Flow
            </h2>
            <p className="text-indigo-200 text-xs sm:text-sm mt-2">
              How student listings are submitted without accounts and verified before going live.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 text-center flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block mb-1">Step 1</span>
                <h3 className="font-bold text-white text-base mb-1.5">User Submits Book</h3>
                <p className="text-xs text-indigo-200/90 leading-relaxed">
                  Click "Sell a Book". No account or login is required.
                </p>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold mt-3 block">Zero Login Friction</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 text-center flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block mb-1">Step 2</span>
                <h3 className="font-bold text-white text-base mb-1.5">Fill Details</h3>
                <p className="text-xs text-indigo-200/90 leading-relaxed">
                  Enter textbook name, author, condition, price, college, and seller WhatsApp number.
                </p>
              </div>
              <span className="text-[10px] text-amber-300 font-semibold mt-3 block">Accurate Specs</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 text-center flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block mb-1">Step 3</span>
                <h3 className="font-bold text-white text-base mb-1.5">Admin Review</h3>
                <p className="text-xs text-indigo-200/90 leading-relaxed">
                  Listing enters "Pending Approval". Campus admins verify condition and pricing.
                </p>
              </div>
              <span className="text-[10px] text-indigo-300 font-semibold mt-3 block">Peer Protection</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 text-center flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block mb-1">Step 4</span>
                <h3 className="font-bold text-white text-base mb-1.5">Book Becomes Public</h3>
                <p className="text-xs text-indigo-200/90 leading-relaxed">
                  Once approved, your book appears immediately on the college marketplace.
                </p>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold mt-3 block">Campus Wide Discovery</span>
            </div>
          </div>
        </div>

        {/* Safety Guidelines */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm mb-12">
          <h3 className="font-display font-bold text-xl text-slate-900 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Campus Safety Best Practices</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <strong className="block text-slate-900 font-bold mb-1">Public Campus Areas</strong>
              Always meet during daylight hours at common student hubs (e.g. main library entrance, campus cafeteria).
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <strong className="block text-slate-900 font-bold mb-1">Verify Book Condition</strong>
              Check syllabus edition, index, and pages for missing leaves or heavy markings before paying.
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <strong className="block text-slate-900 font-bold mb-1">Direct Student Handoff</strong>
              No advance deposits required. Pay only upon physical verification of the textbook.
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <strong className="block text-slate-900 font-bold mb-1">Admin Verification</strong>
              Notice spam or misleading editions? Use the "Report Listing" link to inform our moderators.
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/books"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg hover:shadow-indigo-600/30 transition-all"
          >
            <span>Start Browsing Books</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
