import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  BookPlus,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Info,
  Clock,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useMarketplace } from '../context/MarketplaceContext';
import { CourseType, BookCondition } from '../types';
import { DIPLOMA_BRANCHES, BTECH_BRANCHES } from '../data/branches';
import { STATES_AND_CITIES } from '../data/courses';

export const SellBook: React.FC = () => {
  const { submitBook, colleges } = useMarketplace();
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [edition, setEdition] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const [course, setCourse] = useState<CourseType>('B.Tech');
  const [branch, setBranch] = useState(BTECH_BRANCHES[0].name);
  const [semester, setSemester] = useState<number>(1);

  const [condition, setCondition] = useState<BookCondition>('Good');
  const [price, setPrice] = useState<string>('');
  const [originalPrice, setOriginalPrice] = useState<string>('');

  const [state, setState] = useState('Bihar');
  const [city, setCity] = useState('Muzaffarpur');
  const [college, setCollege] = useState('Government Polytechnic, Muzaffarpur');

  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80',
  ]);

  const [sellerName, setSellerName] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedBookId, setSubmittedBookId] = useState('');

  // Update branches when course toggles
  const handleCourseChange = (newCourse: CourseType) => {
    setCourse(newCourse);
    if (newCourse === 'Diploma') {
      setBranch(DIPLOMA_BRANCHES[0].name);
      if (semester > 6) setSemester(6);
    } else {
      setBranch(BTECH_BRANCHES[0].name);
    }
  };

  const branchOptions = course === 'Diploma' ? DIPLOMA_BRANCHES : BTECH_BRANCHES;
  const maxSem = course === 'Diploma' ? 6 : 8;

  useEffect(() => {
    const selectedCollege = colleges.find((item) => item.name === college);
    if (selectedCollege && selectedCollege.city !== city) {
      setCity(selectedCollege.city);
    }
  }, [colleges, college, city]);

  // Image Upload handler (mock simulation with instant file reader / sample preview)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImages((prev) => [reader.result as string, ...prev]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addPresetImage = (url: string) => {
    if (!images.includes(url)) {
      setImages((prev) => [...prev, url]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const created = await submitBook({
        title: title.trim(),
        author: author.trim(),
        publisher: publisher.trim() || 'University Recommended',
        edition: edition.trim() || 'Latest Edition',
        subject: subject.trim() || 'Engineering Core',
        description: description.trim(),
        course,
        branch,
        semester,
        condition,
        price: Number(price) || 200,
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80'],
        college,
        city,
        state,
        sellerName: sellerName.trim() || 'Campus Student',
        sellerEmail: sellerEmail.trim(),
        sellerPhone: sellerPhone.trim(),
      });

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });

      setSubmittedBookId(created.id);
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 sm:py-16 bg-slate-50/60">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-3 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>No Account Required • Instant Submission</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Sell Your Academic Books
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Submit your used textbook without creating an account. Once approved by our campus admin, your listing goes live to peers across your college.
          </p>

          {/* Visual Submission Flow Stepper */}
          <div className="mt-6 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs max-w-2xl mx-auto">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">
              Campus Book Moderation Workflow
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-slate-600">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold">
                1. Book Details
              </span>
              <span className="text-slate-300">→</span>
              <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold">
                2. Seller Info
              </span>
              <span className="text-slate-300">→</span>
              <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold">
                3. Submit
              </span>
              <span className="text-slate-300">→</span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                4. Pending Admin Approval
              </span>
              <span className="text-slate-300">→</span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                5. Public Listing
              </span>
            </div>
          </div>
        </div>

        {/* Multi-Section Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl space-y-10"
        >
          {/* 1. Book Information */}
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-6">
              <span className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                1
              </span>
              <h2 className="font-display font-bold text-lg text-slate-900">
                Book Information
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Book Name / Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Higher Engineering Mathematics, Programming in ANSI C"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Author *
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g., Dr. B.S. Grewal, E. Balagurusamy"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Publisher
                  </label>
                  <input
                    type="text"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    placeholder="e.g., Khanna Publishers, McGraw Hill, S. Chand"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Edition
                  </label>
                  <input
                    type="text"
                    value={edition}
                    onChange={(e) => setEdition(e.target.value)}
                    placeholder="e.g., 44th Edition, 8th Revised"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Subject / Course Unit
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Mathematics-I, Data Structures, Fluid Mechanics"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Description / Condition Notes
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mention if pencil markings exist, solved questions attached, CD included, or binding condition..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* 2. Academic Information */}
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-6">
              <span className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                2
              </span>
              <h2 className="font-display font-bold text-lg text-slate-900">
                Academic Information
              </h2>
            </div>

            <div className="space-y-4">
              {/* Course Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Course Stream *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleCourseChange('Diploma')}
                    className={`py-3 px-4 rounded-xl font-bold text-sm border transition-all ${
                      course === 'Diploma'
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700 ring-2 ring-indigo-600/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    Diploma (Polytechnic)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCourseChange('B.Tech')}
                    className={`py-3 px-4 rounded-xl font-bold text-sm border transition-all ${
                      course === 'B.Tech'
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700 ring-2 ring-indigo-600/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    B.Tech / B.E. Degree
                  </button>
                </div>
              </div>

              {/* Dynamic Branch Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Branch / Department *
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  {branchOptions.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name} ({b.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Semester 1 to 8 */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Semester *
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {Array.from({ length: maxSem }, (_, i) => i + 1).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSemester(s)}
                      className={`py-2.5 rounded-xl font-bold text-xs border transition-all ${
                        semester === s
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      Sem {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Condition & Price */}
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-6">
              <span className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                3
              </span>
              <h2 className="font-display font-bold text-lg text-slate-900">
                Condition & Pricing
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Physical Condition *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['Like New', 'Excellent', 'Good', 'Fair'] as BookCondition[]).map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setCondition(cond)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                        condition === cond
                          ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Selling Price (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      required
                      min="10"
                      max="10000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. 250"
                      className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Original MRP (Optional for discount badge)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="10"
                      max="10000"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      placeholder="e.g. 699"
                      className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Location Hierarchy */}
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-6">
              <span className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                4
              </span>
              <h2 className="font-display font-bold text-lg text-slate-900">
                Location & College (Handoff Point)
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    State *
                  </label>
                  <select
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      const found = STATES_AND_CITIES.find((s) => s.state === e.target.value);
                      if (found && found.cities[0]) setCity(found.cities[0]);
                    }}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    {STATES_AND_CITIES.map((s) => (
                      <option key={s.state} value={s.state}>
                        {s.state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    District / City *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    {STATES_AND_CITIES.find((s) => s.state === state)?.cities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  College / Institute *
                </label>
                <select
                  value={college}
                  onChange={(e) => {
                    const nextCollege = e.target.value;
                    setCollege(nextCollege);
                    const selectedCollege = colleges.find((item) => item.name === nextCollege);
                    if (selectedCollege) setCity(selectedCollege.city);
                  }}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  {colleges.filter((c) => c.status !== 'inactive').map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.city})
                    </option>
                  ))}
                  <option value="Other Regional Technical Institute">
                    Other Regional Polytechnic / Engineering College
                  </option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Publicly displayed to let peer buyers know which campus to coordinate meetup at.
                </p>
              </div>
            </div>
          </div>

          {/* 5. Images Upload UI */}
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-6">
              <span className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                5
              </span>
              <h2 className="font-display font-bold text-lg text-slate-900">
                Book Images
              </h2>
            </div>

            <div className="space-y-4">
              {/* Image Previews */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
                    <img src={img} alt={`Book view ${idx + 1}`} className="w-full h-full object-cover" />
                    {images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Upload trigger */}
              <div className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 text-center transition-colors bg-slate-50/50">
                <input
                  type="file"
                  id="book-image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="book-image-upload"
                  className="cursor-pointer flex flex-col items-center justify-center gap-2 text-slate-600 hover:text-indigo-600"
                >
                  <Upload className="w-6 h-6 text-indigo-600" />
                  <span className="text-xs font-semibold">
                    Click to upload book cover or pages photo
                  </span>
                  <span className="text-[11px] text-slate-400">
                    PNG, JPG or WEBP (Max 5MB)
                  </span>
                </label>
              </div>

              {/* Quick sample academic photos picker */}
              <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                <span>Or add quick textbook shot:</span>
                <button
                  type="button"
                  onClick={() =>
                    addPresetImage(
                      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80'
                    )
                  }
                  className="underline hover:text-indigo-600"
                >
                  Cover photo
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() =>
                    addPresetImage(
                      'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=900&q=80'
                    )
                  }
                  className="underline hover:text-indigo-600"
                >
                  Pages view
                </button>
              </div>
            </div>
          </div>

          {/* 6. Seller Information */}
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-6">
              <span className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                6
              </span>
              <h2 className="font-display font-bold text-lg text-slate-900">
                Seller Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  placeholder="e.g., Rohit Verma"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={sellerEmail}
                  onChange={(e) => setSellerEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  required
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Verification Notice Box (Prompt Section 18) */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
            <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-amber-950">
              <strong className="block font-bold mb-0.5">Admin Review Notice:</strong>
              “Your book will become publicly visible only after admin approval.”
              <span className="block text-xs text-amber-800 mt-1">
                Campus moderators review condition quality and price validity to protect junior students.
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              id="submit-book-approval-btn"
              className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-display font-bold text-base shadow-xl shadow-indigo-600/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Submitting...' : 'Submit Book for Approval'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Animated Success Modal (Prompt Section 18) */}
        {showSuccessModal && (
          <div
            id="sell-success-modal"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
          >
            <div className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 text-center animate-scaleUp">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 mb-2">
                Status: Pending Approval
              </span>

              <h3 className="font-display font-extrabold text-2xl text-slate-900 mb-2">
                Submitted Successfully!
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                “Your book has been submitted for admin review.” Our campus moderation team will verify the details within a few hours.
              </p>

              <div className="space-y-2.5">
                <Link
                  to="/admin/books"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>View in Admin Approval Queue (Demo)</span>
                </Link>

                <button
                  type="button"
                  onClick={() => navigate('/books')}
                  className="w-full py-3 px-5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
                >
                  Back to Marketplace
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
