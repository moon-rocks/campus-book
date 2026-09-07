import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  BookCheck,
  Users,
  AlertTriangle,
  LogOut,
  ExternalLink,
  ShieldAlert,
  Database,
  Building2,
  HardDrive,
  Settings,
  ClipboardList,
  FolderTree,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export const AdminSidebar: React.FC = () => {
  const { adminLogout, adminEmail, otherCollegeRequests } = useMarketplace();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await adminLogout();
    navigate('/admin/login');
  };

  const pendingRequestsCount = otherCollegeRequests.filter((r) => r.status === 'pending').length;

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Books & Approvals', path: '/admin/books', icon: BookCheck },
    { label: 'Orders / Inquiries', path: '/admin/inquiries', icon: ClipboardList },
    { label: 'Projects', path: '/admin/projects', icon: FolderTree },
    {
      label: 'College Network',
      path: '/admin/colleges',
      icon: Building2,
      badge: pendingRequestsCount > 0 ? String(pendingRequestsCount) : undefined,
    },
    { label: 'Users Directory', path: '/admin/users', icon: Users },
    { label: 'Reports & Flagged', path: '/admin/reports', icon: AlertTriangle },
    { label: 'Data Management', path: '/admin/data-management', icon: Database },
    { label: 'Storage Cleanup', path: '/admin/storage-cleanup', icon: HardDrive },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 h-screen sticky top-0 flex flex-col justify-between border-r border-slate-800 shrink-0">
      <div className="flex flex-col min-h-0 flex-1">
        {/* Admin Brand Header */}
        <div className="p-6 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">📚</span>
            <span className="font-display font-bold text-lg text-white">
              CAMPUS<span className="text-indigo-400">BOOK</span>
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/30">
            <ShieldAlert className="w-3 h-3" />
            ADMIN PANEL
          </div>
          {adminEmail && (
            <p className="text-[11px] text-slate-400 mt-2 truncate" title={adminEmail}>
              Logged in: <span className="text-slate-200 font-medium">{adminEmail}</span>
            </p>
          )}
        </div>

        {/* Navigation Links (Scrollable) */}
        <nav className="p-4 space-y-1.5 overflow-y-auto overscroll-contain flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] shadow-sm">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-slate-800 space-y-2 shrink-0">
        <Link
          to="/"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <span>View Public Marketplace</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Admin</span>
        </button>
      </div>
    </aside>
  );
};
