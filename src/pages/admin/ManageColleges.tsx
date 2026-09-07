import React, { useState, useMemo } from 'react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { useMarketplace } from '../../context/MarketplaceContext';
import { CollegeInfo, OtherCollegeRequest } from '../../types';
import {
  Building2,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  BookOpen,
  MapPin,
  Edit3,
  Power,
  ShieldCheck,
  AlertCircle,
  Inbox,
  Filter,
  Check,
  X,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ManageColleges: React.FC = () => {
  const {
    colleges,
    otherCollegeRequests,
    activateCollege,
    deactivateCollege,
    editCollege,
    addCollege,
    approveOtherCollegeRequest,
    rejectOtherCollegeRequest,
    books,
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'active' | 'requests' | 'inactive'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<CollegeInfo | null>(null);
  const [approvingRequest, setApprovingRequest] = useState<OtherCollegeRequest | null>(null);
  const [rejectingRequest, setRejectingRequest] = useState<OtherCollegeRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // New College Form state
  const [newCollegeForm, setNewCollegeForm] = useState({
    name: '',
    city: '',
    state: 'Bihar',
    courses: 'Diploma',
    popularBranches: 'Civil, Mechanical, Electrical, Electronics',
    image: '',
  });

  // Calculate stats
  const activeCollegesList = useMemo(() => {
    return colleges.filter((c) => c.status !== 'inactive');
  }, [colleges]);

  const inactiveCollegesList = useMemo(() => {
    return colleges.filter((c) => c.status === 'inactive');
  }, [colleges]);

  const pendingRequests = useMemo(() => {
    return otherCollegeRequests.filter((r) => r.status === 'pending');
  }, [otherCollegeRequests]);

  const approvedRequests = useMemo(() => {
    return otherCollegeRequests.filter((r) => r.status === 'approved');
  }, [otherCollegeRequests]);

  // Unique cities for filter
  const uniqueCities = useMemo(() => {
    const set = new Set<string>();
    colleges.forEach((c) => {
      if (c.city) set.add(c.city);
    });
    return Array.from(set).sort();
  }, [colleges]);

  // Filtered lists based on search & city
  const filteredActiveColleges = useMemo(() => {
    return activeCollegesList.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCity = !cityFilter || c.city === cityFilter;
      return matchSearch && matchCity;
    });
  }, [activeCollegesList, searchQuery, cityFilter]);

  const filteredInactiveColleges = useMemo(() => {
    return inactiveCollegesList.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCity = !cityFilter || c.city === cityFilter;
      return matchSearch && matchCity;
    });
  }, [inactiveCollegesList, searchQuery, cityFilter]);

  const filteredRequests = useMemo(() => {
    return otherCollegeRequests.filter((r) => {
      const matchSearch =
        r.collegeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.city.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [otherCollegeRequests, searchQuery]);

  // Handlers
  const handleCreateCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollegeForm.name.trim() || !newCollegeForm.city.trim()) return;

    await addCollege({
      name: newCollegeForm.name.trim(),
      city: newCollegeForm.city.trim(),
      state: newCollegeForm.state.trim(),
      courses: newCollegeForm.courses.split(',').map((s) => s.trim()).filter(Boolean),
      popularBranches: newCollegeForm.popularBranches.split(',').map((s) => s.trim()).filter(Boolean),
      image: newCollegeForm.image.trim() || 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
      status: 'active',
      isOfficial: true,
      bookCount: 0,
    });

    setNewCollegeForm({
      name: '',
      city: '',
      state: 'Bihar',
      courses: 'Diploma',
      popularBranches: 'Civil, Mechanical, Electrical, Electronics',
      image: '',
    });
    setIsAddModalOpen(false);
  };

  const handleUpdateCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCollege) return;
    await editCollege(editingCollege);
    setEditingCollege(null);
  };

  const handleApproveRequest = async () => {
    if (!approvingRequest) return;
    await approveOtherCollegeRequest(approvingRequest);
    setApprovingRequest(null);
  };

  const handleRejectRequest = async () => {
    if (!rejectingRequest) return;
    await rejectOtherCollegeRequest(rejectingRequest.collegeName, rejectReason);
    setRejectingRequest(null);
    setRejectReason('');
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Official Network
              </span>
              <span className="text-xs text-slate-400">Bihar SBTE Polytechnic Network</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Building2 className="w-7 h-7 text-indigo-400" />
              College Network Management
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Campus Book is tailored specifically for Bihar's 11 official Government Polytechnic Colleges.
              Review and approve inbound requests from students wanting new campuses added.
            </p>
          </div>

          <button
            id="btn-add-official-college"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Official College</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Official Network</p>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mt-3">{colleges.length}</p>
            <p className="text-xs text-indigo-400 mt-1 flex items-center gap-1">
              <span>Selected 11 Government Polytechnics</span>
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Campuses</p>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mt-3">{activeCollegesList.length}</p>
            <p className="text-xs text-emerald-400 mt-1">Accepting student listings</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Other College Requests</p>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-amber-300 mt-3">{pendingRequests.length}</p>
            <p className="text-xs text-amber-400/80 mt-1">Requires admin review</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Inactive Campuses</p>
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Power className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-300 mt-3">{inactiveCollegesList.length}</p>
            <p className="text-xs text-slate-500 mt-1">Deactivated by admin</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6">
          <button
            id="tab-active-colleges"
            onClick={() => setActiveTab('active')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'active'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Active Colleges ({activeCollegesList.length})</span>
          </button>

          <button
            id="tab-other-college-requests"
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all relative ${
              activeTab === 'requests'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Other College Requests</span>
            {pendingRequests.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[11px]">
                {pendingRequests.length}
              </span>
            )}
          </button>

          <button
            id="tab-inactive-colleges"
            onClick={() => setActiveTab('inactive')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'inactive'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <XCircle className="w-4 h-4" />
            <span>Inactive ({inactiveCollegesList.length})</span>
          </button>
        </div>

        {/* Search & Filters Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              id="input-college-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by college name or city..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {activeTab !== 'requests' && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-500" />
              <select
                id="select-city-filter"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-300 py-2 px-3 focus:outline-none focus:border-indigo-500 w-full sm:w-auto"
              >
                <option value="">All Cities ({uniqueCities.length})</option>
                {uniqueCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* TAB 1: ACTIVE COLLEGES */}
        {activeTab === 'active' && (
          <div>
            {filteredActiveColleges.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800/80">
                <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-300 font-medium">No active colleges found matching your criteria.</p>
                <p className="text-xs text-slate-500 mt-1">Try resetting the search or filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredActiveColleges.map((college, index) => {
                  const collegeBooksCount = books.filter(
                    (b) => b.college.toLowerCase().trim() === college.name.toLowerCase().trim()
                  ).length;

                  return (
                    <div
                      key={college.id}
                      id={`college-card-${college.id}`}
                      className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between shadow-sm"
                    >
                      <div>
                        {/* Card Header & Image */}
                        <div className="relative h-28 bg-slate-800 overflow-hidden">
                          <img
                            src={college.image}
                            alt={college.name}
                            className="w-full h-full object-cover opacity-60"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                          
                          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              ACTIVE
                            </span>
                            {college.isOfficial && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                OFFICIAL
                              </span>
                            )}
                          </div>

                          <div className="absolute bottom-2.5 left-3 right-3">
                            <div className="flex items-center gap-1 text-[11px] text-indigo-300 font-medium">
                              <MapPin className="w-3.5 h-3.5 shrink-0" />
                              <span>{college.city}, {college.state}</span>
                            </div>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-4">
                          <h3 className="font-bold text-white text-base leading-tight mb-2 line-clamp-2" title={college.name}>
                            {index + 1}. {college.name}
                          </h3>

                          {/* Branches tags */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {college.popularBranches.slice(0, 3).map((branch) => (
                              <span
                                key={branch}
                                className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] text-slate-300 border border-slate-700/60"
                              >
                                {branch}
                              </span>
                            ))}
                            {college.popularBranches.length > 3 && (
                              <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-400">
                                +{college.popularBranches.length - 3}
                              </span>
                            )}
                          </div>

                          {/* Stats info */}
                          <div className="flex items-center justify-between text-xs text-slate-400 py-2 px-3 rounded-xl bg-slate-950/60 border border-slate-800/60 mb-3">
                            <span className="flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                              Books Listed
                            </span>
                            <span className="font-bold text-slate-200">{collegeBooksCount} books</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="p-4 pt-0 border-t border-slate-800/60 flex items-center justify-between gap-2">
                        <button
                          id={`btn-edit-${college.id}`}
                          onClick={() => setEditingCollege(college)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Edit</span>
                        </button>

                        <button
                          id={`btn-deactivate-${college.id}`}
                          onClick={() => deactivateCollege(college.id)}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors"
                          title="Deactivate this college from official network"
                        >
                          <Power className="w-3.5 h-3.5" />
                          <span>Deactivate</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: OTHER COLLEGE REQUESTS */}
        {activeTab === 'requests' && (
          <div>
            <div className="mb-4 bg-indigo-950/30 border border-indigo-500/30 rounded-2xl p-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs text-indigo-200">
                <p className="font-bold text-sm text-white mb-0.5">Automated Inbound Requests Queue</p>
                When students sell a book and select "Other College", a request is automatically queued here
                with their college name, location, and submitted books count.
                <br />
                <span className="font-semibold text-amber-300">Policy:</span> Other College requests do NOT automatically enter the official 11-college network until an admin explicitly clicks "Approve into Official Network".
              </div>
            </div>

            {filteredRequests.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800/80">
                <Inbox className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-300 font-medium">No "Other College" requests right now.</p>
                <p className="text-xs text-slate-500 mt-1">All submissions from outside the 11 colleges will appear here.</p>
              </div>
            ) : (
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-950/80 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="py-3.5 px-4 font-semibold">Requested College</th>
                        <th className="py-3.5 px-4 font-semibold">Location</th>
                        <th className="py-3.5 px-4 font-semibold">Submitted Books</th>
                        <th className="py-3.5 px-4 font-semibold">First / Latest Date</th>
                        <th className="py-3.5 px-4 font-semibold">Status</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-4 px-4 font-medium text-white">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                              <div>
                                <span className="font-bold text-slate-100">{req.collegeName}</span>
                                {req.submittedBy && (
                                  <p className="text-xs text-slate-400 font-normal">
                                    Submitted by: {req.submittedBy}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 text-slate-300">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-500" />
                              {req.city}, {req.state}
                            </span>
                          </td>

                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                              <BookOpen className="w-3 h-3" />
                              {req.submittedBooksCount} {req.submittedBooksCount === 1 ? 'book' : 'books'}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-xs text-slate-400">
                            <div>Latest: {new Date(req.latestSubmissionDate).toLocaleDateString()}</div>
                            <div className="text-[11px] text-slate-500">First: {new Date(req.firstSubmissionDate).toLocaleDateString()}</div>
                          </td>

                          <td className="py-4 px-4">
                            {req.status === 'pending' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                <Clock className="w-3 h-3" />
                                PENDING
                              </span>
                            )}
                            {req.status === 'approved' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                <Check className="w-3 h-3" />
                                APPROVED
                              </span>
                            )}
                            {req.status === 'rejected' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                <X className="w-3 h-3" />
                                REJECTED
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              {req.status === 'pending' && (
                                <>
                                  <button
                                    id={`btn-approve-request-${req.id}`}
                                    onClick={() => setApprovingRequest(req)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
                                    title="Approve and promote this campus to official network"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Approve</span>
                                  </button>

                                  <button
                                    id={`btn-reject-request-${req.id}`}
                                    onClick={() => setRejectingRequest(req)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all"
                                    title="Decline this college request"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                    <span>Reject</span>
                                  </button>
                                </>
                              )}

                              <Link
                                to={`/admin/books?college=${encodeURIComponent(req.collegeName)}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                                title="View books submitted from this college"
                              >
                                <span>View Books</span>
                                <ExternalLink className="w-3 h-3 text-slate-400" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: INACTIVE COLLEGES */}
        {activeTab === 'inactive' && (
          <div>
            {filteredInactiveColleges.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800/80">
                <CheckCircle2 className="w-12 h-12 text-emerald-500/40 mx-auto mb-3" />
                <p className="text-slate-300 font-medium">No inactive colleges.</p>
                <p className="text-xs text-slate-500 mt-1">All official colleges are currently active and accepting listings.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredInactiveColleges.map((college) => (
                  <div
                    key={college.id}
                    id={`inactive-college-${college.id}`}
                    className="bg-slate-900/80 border border-rose-900/40 rounded-2xl p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          INACTIVE
                        </span>
                        <span className="text-xs text-slate-500">{college.city}, {college.state}</span>
                      </div>

                      <h3 className="font-bold text-white text-base leading-tight mb-2">
                        {college.name}
                      </h3>

                      <p className="text-xs text-slate-400">
                        Students from this college cannot submit new listings until reactivated.
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <button
                        id={`btn-reactivate-${college.id}`}
                        onClick={() => activateCollege(college.id)}
                        className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Re-Activate College</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODAL: ADD OFFICIAL COLLEGE */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-400" />
                  Add New Official College
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCollege} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    College Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCollegeForm.name}
                    onChange={(e) => setNewCollegeForm({ ...newCollegeForm, name: e.target.value })}
                    placeholder="e.g. Government Polytechnic, Sheohar"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      City / District *
                    </label>
                    <input
                      type="text"
                      required
                      value={newCollegeForm.city}
                      onChange={(e) => setNewCollegeForm({ ...newCollegeForm, city: e.target.value })}
                      placeholder="e.g. Sheohar"
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={newCollegeForm.state}
                      onChange={(e) => setNewCollegeForm({ ...newCollegeForm, state: e.target.value })}
                      placeholder="Bihar"
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Offered Courses (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newCollegeForm.courses}
                    onChange={(e) => setNewCollegeForm({ ...newCollegeForm, courses: e.target.value })}
                    placeholder="Diploma, Polytechnic"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Popular Branches (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newCollegeForm.popularBranches}
                    onChange={(e) =>
                      setNewCollegeForm({ ...newCollegeForm, popularBranches: e.target.value })
                    }
                    placeholder="Civil, Mechanical, Electrical, Electronics"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Campus Banner Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={newCollegeForm.image}
                    onChange={(e) => setNewCollegeForm({ ...newCollegeForm, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-md shadow-indigo-600/20"
                  >
                    Save College
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EDIT COLLEGE */}
        {editingCollege && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-indigo-400" />
                  Edit College Details
                </h3>
                <button
                  onClick={() => setEditingCollege(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateCollege} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    College Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCollege.name}
                    onChange={(e) => setEditingCollege({ ...editingCollege, name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingCollege.city}
                      onChange={(e) => setEditingCollege({ ...editingCollege, city: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={editingCollege.state}
                      onChange={(e) => setEditingCollege({ ...editingCollege, state: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Branches (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editingCollege.popularBranches.join(', ')}
                    onChange={(e) =>
                      setEditingCollege({
                        ...editingCollege,
                        popularBranches: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={editingCollege.image}
                    onChange={(e) => setEditingCollege({ ...editingCollege, image: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingCollege(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-md shadow-indigo-600/20"
                  >
                    Update College
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: APPROVE OTHER COLLEGE REQUEST */}
        {approvingRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Approve Into Official Network?</h3>
                  <p className="text-xs text-slate-400">Promote to verified polytechnic network</p>
                </div>
              </div>

              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 mb-4 space-y-2 text-xs">
                <div>
                  <span className="text-slate-500 block">College Name:</span>
                  <span className="text-white font-bold text-sm">{approvingRequest.collegeName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Location:</span>
                  <span className="text-slate-300">{approvingRequest.city}, {approvingRequest.state}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Linked Submitted Books:</span>
                  <span className="text-indigo-400 font-semibold">{approvingRequest.submittedBooksCount} student listings will be automatically linked to this official campus</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setApprovingRequest(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApproveRequest}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                >
                  Yes, Approve College
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: REJECT OTHER COLLEGE REQUEST */}
        {rejectingRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-rose-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Decline College Request?</h3>
                  <p className="text-xs text-slate-400">{rejectingRequest.collegeName}</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 mb-3">
                This will decline adding this campus to the official list. Existing books under "Other College" will remain categorized as Other College.
              </p>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Reason / Internal Note (Optional)
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Non-polytechnic institution, or duplicate request"
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setRejectingRequest(null);
                    setRejectReason('');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectRequest}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/20"
                >
                  Reject Request
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
