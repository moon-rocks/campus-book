import React, { useState } from 'react';
import { Search, UserCheck, ShieldAlert, CheckCircle, Ban } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminNavbar } from '../../components/admin/AdminNavbar';

export const ManageUsers: React.FC = () => {
  const { users, toggleUserStatus } = useMarketplace();
  const [search, setSearch] = useState('');

  const filtered = users.filter((u) => {
    if (search) {
      const q = search.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.college.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen flex bg-slate-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar
          title="Student Users Directory"
          subtitle="Directory of registered peer buyers and book sellers across diploma and engineering colleges"
        />

        <main className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto">
          {/* Search bar */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students by name, email, or college..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
              Showing {filtered.length} of {users.length} students
            </span>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-6">Student</th>
                    <th className="py-3.5 px-4">College</th>
                    <th className="py-3.5 px-4">Program</th>
                    <th className="py-3.5 px-4">Books Listed</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Joined Date</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center font-display text-xs">
                            {user.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                              {user.is_demo || user.isDemo || user.data_type === 'demo' ? (
                                <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-amber-100 text-amber-900 border border-amber-300">
                                  DEMO
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                                  REAL
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-700 font-medium max-w-xs truncate">
                        {user.college}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px]">
                          {user.course}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-900">
                        {user.booksListed} listings
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            user.status?.toLowerCase() === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-500">
                        {user.joinedDate || user.joined}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => toggleUserStatus(user.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                            user.status?.toLowerCase() === 'active'
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {user.status?.toLowerCase() === 'active' ? (
                            <>
                              <Ban className="w-3.5 h-3.5" />
                              <span>Suspend</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Unsuspend</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
