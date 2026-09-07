import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book, BookStatus, FilterState, UserProfile, ListingReport, CollegeInfo, OtherCollegeRequest } from '../types';
import { api, DemoDataStats, isDemoRecord } from '../services/api';
import { MOCK_REPORTS, MOCK_USERS } from '../data/books';
import { supabase } from '../lib/supabase';

interface MarketplaceContextType {
  books: Book[];
  approvedBooks: Book[];
  loading: boolean;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  updateFilter: (key: keyof FilterState, value: any) => void;
  submitBook: (bookData: Omit<Book, 'id' | 'status' | 'createdAt'>) => Promise<Book>;
  approveBook: (id: string) => Promise<void>;
  rejectBook: (id: string, reason: string) => Promise<void>;
  markBookSold: (id: string) => Promise<void>;
  archiveBook: (id: string) => Promise<void>;
  updateBookStatus: (id: string, status: BookStatus, reason?: string) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  deleteBookPermanently: (id: string) => Promise<void>;
  toggleFeaturedBook: (id: string) => Promise<void> | void;
  users: UserProfile[];
  toggleUserStatus: (id: string) => Promise<void> | void;
  reports: ListingReport[];
  resolveReport: (id: string) => Promise<void> | void;
  dismissReport: (id: string) => Promise<void> | void;
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  isAccountMenuOpen: boolean;
  setIsAccountMenuOpen: (open: boolean) => void;
  messageModalBook: Book | null;
  setMessageModalBook: (book: Book | null) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (logged: boolean) => void;
  adminEmail: string | null;
  adminLogout: () => Promise<void>;
  // College & Other College Management
  colleges: CollegeInfo[];
  otherCollegeRequests: OtherCollegeRequest[];
  loadCollegesAndRequests: () => Promise<void>;
  activateCollege: (id: string) => Promise<void>;
  deactivateCollege: (id: string) => Promise<void>;
  editCollege: (college: CollegeInfo) => Promise<void>;
  addCollege: (collegeData: Omit<CollegeInfo, 'id'>) => Promise<void>;
  approveOtherCollegeRequest: (req: OtherCollegeRequest) => Promise<void>;
  rejectOtherCollegeRequest: (collegeName: string, reason?: string) => Promise<void>;
  // Demo Data Management - Admin Controlled
  demoStats: DemoDataStats;
  isDemoHidden: boolean;
  toggleHideDemoData: () => Promise<void>;
  deleteDemoData: () => Promise<{ deletedBooks: number; deletedUsers: number; deletedColleges: number; remainingRealBooks: number }>;
  reseedDemoData: () => Promise<void>;
  refreshData: () => Promise<void>;
  testSupabaseConnection: () => Promise<{ connected: boolean; message: string; booksCount?: number }>;
}

const initialFilters: FilterState = {
  searchQuery: '',
  course: '',
  branch: '',
  semester: '',
  condition: '',
  priceRange: '',
  state: '',
  city: '',
  college: '',
  sortBy: 'latest',
};

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<UserProfile[]>(MOCK_USERS);
  const [reports, setReports] = useState<ListingReport[]>(MOCK_REPORTS);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState<boolean>(false);
  const [messageModalBook, setMessageModalBook] = useState<Book | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('campus_book_admin_auth') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [adminEmail, setAdminEmail] = useState<string | null>(() => {
    try {
      return localStorage.getItem('campus_book_admin_email');
    } catch (e) {
      return null;
    }
  });

  const adminLogout = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase sign out error:', err);
      }
    }
    setIsAdminLoggedIn(false);
    setAdminEmail(null);
    localStorage.removeItem('campus_book_admin_auth');
    localStorage.removeItem('campus_book_admin_email');
    showToast('Logged out of Admin Portal.', 'info');
  };

  // Sync with Supabase Auth Session
  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setIsAdminLoggedIn(true);
          setAdminEmail(session.user.email || null);
          localStorage.setItem('campus_book_admin_auth', 'true');
          if (session.user.email) {
            localStorage.setItem('campus_book_admin_email', session.user.email);
          }
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          setIsAdminLoggedIn(true);
          setAdminEmail(session.user.email || null);
          localStorage.setItem('campus_book_admin_auth', 'true');
          if (session.user.email) {
            localStorage.setItem('campus_book_admin_email', session.user.email);
          }
        } else if (event === 'SIGNED_OUT') {
          setIsAdminLoggedIn(false);
          setAdminEmail(null);
          localStorage.removeItem('campus_book_admin_auth');
          localStorage.removeItem('campus_book_admin_email');
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);
  const [isDemoHidden, setIsDemoHidden] = useState<boolean>(() => {
    return localStorage.getItem('campus_book_demo_hidden') === 'true';
  });
  const [demoStats, setDemoStats] = useState<DemoDataStats>(() => api.getDemoStats());
  const [colleges, setColleges] = useState<CollegeInfo[]>([]);
  const [otherCollegeRequests, setOtherCollegeRequests] = useState<OtherCollegeRequest[]>([]);

  const loadCollegesAndRequests = async () => {
    try {
      const [colls, reqs] = await Promise.all([
        api.getColleges(),
        api.getOtherCollegeRequests(),
      ]);
      setColleges(colls);
      setOtherCollegeRequests(reqs);
    } catch (e) {
      console.error('Error loading colleges and requests:', e);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookData, userData, reportData] = await Promise.all([
        api.getBooks(true),
        api.getUsers(),
        api.getReports(),
      ]);
      setBooks(Array.isArray(bookData) ? bookData : []);
      if (Array.isArray(userData)) {
        setUsers(userData);
      }
      if (Array.isArray(reportData) && reportData.length > 0) {
        setReports(reportData);
      }
      await loadCollegesAndRequests();
      setDemoStats(api.getDemoStats());
    } catch (e) {
      console.error(e);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const submitBook = async (bookData: Omit<Book, 'id' | 'status' | 'createdAt'>): Promise<Book> => {
    const created = await api.submitNewBook(bookData);
    setBooks((prev) => [created, ...(prev || [])]);
    setDemoStats(api.getDemoStats());
    showToast('Your textbook has been submitted for admin review.', 'success');
    return created;
  };

  const approveBook = async (id: string) => {
    const updated = await api.updateBookStatus(id, 'approved');
    if (updated) {
      setBooks((prev) => (prev || []).map((b) => (b.id === id ? updated : b)));
      setDemoStats(api.getDemoStats());
      showToast('Book Approved Successfully. Listing is now live!', 'success');
    }
  };

  const rejectBook = async (id: string, reason: string) => {
    const updated = await api.updateBookStatus(id, 'rejected', reason);
    if (updated) {
      setBooks((prev) => (prev || []).map((b) => (b.id === id ? updated : b)));
      setDemoStats(api.getDemoStats());
      showToast('Listing marked as rejected with provided feedback.', 'info');
    }
  };

  const markBookSold = async (id: string) => {
    const updated = await api.updateBookStatus(id, 'sold');
    if (updated) {
      setBooks((prev) => (prev || []).map((b) => (b.id === id ? updated : b)));
      setDemoStats(api.getDemoStats());
      showToast('Listing status marked as Sold.', 'info');
    }
  };

  const archiveBook = async (id: string) => {
    const updated = await api.updateBookStatus(id, 'archived');
    if (updated) {
      setBooks((prev) => (prev || []).map((b) => (b.id === id ? updated : b)));
      setDemoStats(api.getDemoStats());
      showToast('Book listing archived.', 'info');
    }
  };

  const updateBookStatus = async (id: string, status: BookStatus, reason?: string) => {
    const updated = await api.updateBookStatus(id, status, reason);
    if (updated) {
      setBooks((prev) => (prev || []).map((b) => (b.id === id ? updated : b)));
      setDemoStats(api.getDemoStats());
      showToast(`Book listing status updated to ${status.toUpperCase()}.`, 'success');
    }
  };

  const deleteBook = async (id: string) => {
    await api.deleteBook(id);
    setBooks((prev) => (prev || []).filter((b) => b.id !== id));
    setDemoStats(api.getDemoStats());
    showToast('Book listing removed successfully.', 'info');
  };

  const deleteBookPermanently = async (id: string) => {
    await api.deleteBook(id);
    setBooks((prev) => (prev || []).filter((b) => b.id !== id));
    setDemoStats(api.getDemoStats());
    showToast('Book permanently removed from system.', 'success');
  };

  // College Operations
  const activateCollege = async (id: string) => {
    const ok = await api.activateCollege(id);
    if (ok) {
      setColleges((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'active' } : c)));
      showToast('College successfully activated in official network.', 'success');
    }
  };

  const deactivateCollege = async (id: string) => {
    const ok = await api.deactivateCollege(id);
    if (ok) {
      setColleges((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'inactive' } : c)));
      showToast('College deactivated from official network.', 'info');
    }
  };

  const editCollege = async (college: CollegeInfo) => {
    const updated = await api.updateCollege(college);
    if (updated) {
      setColleges((prev) => prev.map((c) => (c.id === college.id ? updated : c)));
      showToast('College details updated successfully.', 'success');
    }
  };

  const addCollege = async (collegeData: Omit<CollegeInfo, 'id'>) => {
    const added = await api.addCollege(collegeData);
    if (added) {
      setColleges((prev) => [...prev, added]);
      showToast('New official college added to network.', 'success');
    }
  };

  const approveOtherCollegeRequest = async (req: OtherCollegeRequest) => {
    const newCollege = await api.approveOtherCollegeRequest(req);
    await loadCollegesAndRequests();
    await loadData();
    showToast(`Approved "${req.collegeName}" into official network.`, 'success');
  };

  const rejectOtherCollegeRequest = async (collegeName: string, reason?: string) => {
    await api.rejectOtherCollegeRequest(collegeName, reason);
    await loadCollegesAndRequests();
    showToast(`Request for "${collegeName}" rejected.`, 'info');
  };

  const toggleFeaturedBook = async (id: string) => {
    setBooks((prev) => {
      const updated = (prev || []).map((b) => (b.id === id ? { ...b, featured: !b.featured } : b));
      try {
        localStorage.setItem('campus_book_listings_v1', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    showToast('Book featured status updated.', 'info');
  };

  const toggleUserStatus = async (id: string) => {
    const target = (users || []).find((u) => u.id === id);
    if (!target) return;
    const isAct = target.status === 'Active' || target.status === 'active';
    const nextStatus = isAct ? 'Suspended' : 'Active';
    const updated = await api.updateUserStatus(id, nextStatus);
    if (updated) {
      setUsers((prev) => (prev || []).map((u) => (u.id === id ? updated : u)));
      showToast(`Student status updated to ${nextStatus}.`, 'info');
    }
  };

  const resolveReport = (id: string) => {
    setReports((prev) =>
      (prev || []).map((r) => (r.id === id ? { ...r, status: 'resolved' } : r))
    );
    showToast('Report marked as resolved.', 'success');
  };

  const dismissReport = (id: string) => {
    setReports((prev) =>
      (prev || []).map((r) => (r.id === id ? { ...r, status: 'dismissed' } : r))
    );
    showToast('Report flag dismissed.', 'info');
  };

  // Demo Data Controls
  const toggleHideDemoData = async () => {
    const nextVal = !isDemoHidden;
    api.setDemoDataHidden(nextVal);
    setIsDemoHidden(nextVal);
    setDemoStats(api.getDemoStats());
    showToast(
      nextVal
        ? 'Demo data is now hidden on public marketplace views.'
        : 'Demo data is now visible on public marketplace views.',
      'info'
    );
  };

  const deleteDemoData = async () => {
    const result = await api.deleteDemoData();
    await loadData();
    showToast(
      `Permanently deleted ${result.deletedBooks} demo books, ${result.deletedUsers} demo users, and ${result.deletedColleges} demo colleges. All real student listings remain safe.`,
      'success'
    );
    return result;
  };

  const reseedDemoData = async () => {
    await api.reseedDemoData();
    setIsDemoHidden(false);
    await loadData();
    showToast('Demo data re-seeded for testing.', 'success');
  };

  const testSupabaseConnection = async () => {
    return api.testSupabaseConnection();
  };

  // Public approved books calculation:
  // If isDemoHidden is true, exclude demo records from public approved list
  const approvedBooks = (books || []).filter((b) => {
    if (b?.status !== 'approved') return false;
    if (isDemoHidden && isDemoRecord(b)) return false;
    return true;
  });

  return (
    <MarketplaceContext.Provider
      value={{
        books: books || [],
        approvedBooks,
        loading,
        filters,
        setFilters,
        resetFilters,
        updateFilter,
        submitBook,
        approveBook,
        rejectBook,
        markBookSold,
        archiveBook,
        updateBookStatus,
        deleteBook,
        deleteBookPermanently,
        toggleFeaturedBook,
        users: users || [],
        toggleUserStatus,
        reports: reports || [],
        resolveReport,
        dismissReport,
        toast,
        showToast,
        isAccountMenuOpen,
        setIsAccountMenuOpen,
        messageModalBook,
        setMessageModalBook,
        isAdminLoggedIn,
        setIsAdminLoggedIn: (val: boolean) => {
          setIsAdminLoggedIn(val);
          localStorage.setItem('campus_book_admin_auth', String(val));
        },
        adminEmail,
        adminLogout,
        colleges,
        otherCollegeRequests,
        loadCollegesAndRequests,
        activateCollege,
        deactivateCollege,
        editCollege,
        addCollege,
        approveOtherCollegeRequest,
        rejectOtherCollegeRequest,
        demoStats,
        isDemoHidden,
        toggleHideDemoData,
        deleteDemoData,
        reseedDemoData,
        refreshData: loadData,
        testSupabaseConnection,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
