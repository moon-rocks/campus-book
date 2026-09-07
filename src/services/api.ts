import { Book, BookStatus, ListingReport, UserProfile, CollegeInfo, OtherCollegeRequest, ChatConversation, ChatMessage, StorageStats, BookInquiry, MarketplaceSettings } from '../types';
import { INITIAL_BOOKS, MOCK_REPORTS, MOCK_USERS, MOCK_MESSAGES } from '../data/books';
import { COLLEGES } from '../data/colleges';
import {
  supabase,
  isSupabaseConfigured,
  supabaseUrl,
  rawSupabaseUrl,
  hasPathInRawUrl,
  mapSupabaseBookToApp,
  mapAppBookToSupabase,
  mapSupabaseUserToApp,
  mapSupabaseReportToApp,
} from '../lib/supabase';

export const LOCAL_STORAGE_KEY_BOOKS = 'campus_book_listings_v1';
export const LOCAL_STORAGE_KEY_REPORTS = 'campus_book_reports_v1';
export const LOCAL_STORAGE_KEY_USERS = 'campus_book_users_v1';
export const LOCAL_STORAGE_KEY_COLLEGES = 'campus_book_colleges_v1';
export const LOCAL_STORAGE_KEY_CHATS = 'campus_book_chats_v1';
export const LOCAL_STORAGE_KEY_MESSAGES = 'campus_book_messages_v1';
export const LOCAL_STORAGE_KEY_OTHER_COLLEGE_STATUS = 'campus_book_other_college_status_v1';
export const LOCAL_STORAGE_KEY_DEMO_DELETED = 'campus_book_demo_deleted';
export const LOCAL_STORAGE_KEY_DEMO_HIDDEN = 'campus_book_demo_hidden';
export const LOCAL_STORAGE_KEY_INQUIRIES = 'campus_book_inquiries_v1';
export const LOCAL_STORAGE_KEY_SETTINGS = 'campus_book_settings_v1';

const DEFAULT_MARKETPLACE_SETTINGS: MarketplaceSettings = {
  buyerMobileRequired: true,
  adminInquiryApproval: true,
  privateConversation: true,
  smsNotification: true,
  contactSharing: false,
  antiSpamProtection: true,
};
export const LOCAL_STORAGE_KEY_COLLEGE_NETWORK_VERSION = 'campus_book_college_network_v2';

export interface DemoDataStats {
  demoBooks: number;
  realBooks: number;
  totalBooks: number;
  demoColleges: number;
  realColleges: number;
  totalColleges: number;
  demoUsers: number;
  realUsers: number;
  totalUsers: number;
  isDemoDeleted: boolean;
  isDemoHidden: boolean;
  supabaseConfigured: boolean;
  supabaseUrl: string;
  rawSupabaseUrl?: string;
  hasPathInRawUrl?: boolean;
}

export function isDemoRecord(item: { is_demo?: boolean; isDemo?: boolean; data_type?: string }): boolean {
  return item.is_demo === true || item.isDemo === true || item.data_type === 'demo';
}

function isDemoDeleted(): boolean {
  try {
    return localStorage.getItem(LOCAL_STORAGE_KEY_DEMO_DELETED) === 'true';
  } catch (e) {
    return false;
  }
}

function isDemoHidden(): boolean {
  try {
    return localStorage.getItem(LOCAL_STORAGE_KEY_DEMO_HIDDEN) === 'true';
  } catch (e) {
    return false;
  }
}

function getStoredBooks(): Book[] {
  const demoDeleted = isDemoDeleted();
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_BOOKS);
    if (raw) {
      const parsed: Book[] = JSON.parse(raw);
      if (demoDeleted) {
        // Return only real books; demo records must not be present
        return parsed.filter((b) => !isDemoRecord(b));
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to read books from localStorage', e);
  }

  if (demoDeleted) {
    return [];
  }

  // First time initialization with demo data
  localStorage.setItem(LOCAL_STORAGE_KEY_BOOKS, JSON.stringify(INITIAL_BOOKS));
  return INITIAL_BOOKS;
}

function saveStoredBooks(books: Book[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_BOOKS, JSON.stringify(books));
  } catch (e) {
    console.error('Failed to write books to localStorage', e);
  }
}

function getStoredUsers(): UserProfile[] {
  const demoDeleted = isDemoDeleted();
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_USERS);
    if (raw) {
      const parsed: UserProfile[] = JSON.parse(raw);
      if (demoDeleted) {
        return parsed.filter((u) => !isDemoRecord(u));
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to read users from localStorage', e);
  }

  if (demoDeleted) {
    return [];
  }

  localStorage.setItem(LOCAL_STORAGE_KEY_USERS, JSON.stringify(MOCK_USERS));
  return MOCK_USERS;
}

function saveStoredUsers(users: UserProfile[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to write users to localStorage', e);
  }
}

function getStoredColleges(): CollegeInfo[] {
  const demoDeleted = isDemoDeleted();
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_COLLEGES);
    if (raw) {
      const parsed: CollegeInfo[] = JSON.parse(raw);
      if (localStorage.getItem(LOCAL_STORAGE_KEY_COLLEGE_NETWORK_VERSION) !== 'true') {
        const realColleges = parsed.filter((college) => !isDemoRecord(college));
        const merged = [...COLLEGES, ...realColleges.filter((college) => !COLLEGES.some((seed) => seed.name === college.name))];
        localStorage.setItem(LOCAL_STORAGE_KEY_COLLEGES, JSON.stringify(merged));
        localStorage.setItem(LOCAL_STORAGE_KEY_COLLEGE_NETWORK_VERSION, 'true');
        return merged;
      }
      if (demoDeleted) {
        return parsed.filter((c) => !isDemoRecord(c));
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to read colleges from localStorage', e);
  }

  if (demoDeleted) {
    return [];
  }

  localStorage.setItem(LOCAL_STORAGE_KEY_COLLEGES, JSON.stringify(COLLEGES));
  localStorage.setItem(LOCAL_STORAGE_KEY_COLLEGE_NETWORK_VERSION, 'true');
  return COLLEGES;
}

function saveStoredColleges(colleges: CollegeInfo[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_COLLEGES, JSON.stringify(colleges));
  } catch (e) {
    console.error('Failed to write colleges to localStorage', e);
  }
}

export const api = {
  // ==========================================
  // SUPABASE STATUS & CONNECTION CHECK
  // ==========================================

  isSupabaseEnabled(): boolean {
    return isSupabaseConfigured && supabase !== null;
  },

  async testSupabaseConnection(): Promise<{
    connected: boolean;
    message: string;
    booksCount?: number;
    profilesCount?: number;
  }> {
    if (!this.isSupabaseEnabled() || !supabase) {
      return {
        connected: false,
        message: 'Supabase credentials not configured in environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).',
      };
    }

    try {
      const { data, error, count } = await supabase
        .from('books')
        .select('*', { count: 'exact', head: true });

      if (error) {
        if (error.code === 'PGRST125' || error.message?.includes('Invalid path specified in request URL')) {
          return {
            connected: false,
            message: `Supabase URL path error: "${error.message}". The configured URL must be the base project URL (e.g. https://your-project.supabase.co), without subpaths like /rest/v1 or trailing slashes. Active endpoint: ${supabaseUrl}`,
          };
        }
        return {
          connected: false,
          message: `Supabase reached but table query returned error: ${error.message}. (Have you run the SQL migration schema?)`,
        };
      }

      return {
        connected: true,
        message: `Successfully connected to Supabase database (${supabaseUrl}). Real-time academic marketplace sync active.`,
        booksCount: count ?? 0,
      };
    } catch (err: any) {
      const msg = err?.message || 'Unknown network error';
      if (msg.includes('Invalid path specified in request URL')) {
        return {
          connected: false,
          message: `Supabase URL path error: "${msg}". Please ensure VITE_SUPABASE_URL is strictly your project origin (e.g. https://your-id.supabase.co). Sanitized origin: ${supabaseUrl}`,
        };
      }
      return {
        connected: false,
        message: `Connection failed: ${msg}`,
      };
    }
  },

  // ==========================================
  // BOOKS API (DUAL SUPABASE + DEMO SUPPORT)
  // ==========================================

  async getBooks(includeHiddenDemo: boolean = true): Promise<Book[]> {
    const localBooks = getStoredBooks();
    const demoDeleted = isDemoDeleted();
    const demoHidden = isDemoHidden();

    let supabaseBooks: Book[] = [];

    if (this.isSupabaseEnabled() && supabase) {
      try {
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          supabaseBooks = data.map(mapSupabaseBookToApp);
        }
      } catch (err) {
        console.warn('Could not fetch books from Supabase, using local store:', err);
      }
    }

    // Merge Supabase books and Local books (avoiding duplicate IDs)
    const seenIds = new Set<string>();
    const combined: Book[] = [];

    // Supabase books first (highest priority for real-time live data)
    for (const b of supabaseBooks) {
      if (!seenIds.has(b.id)) {
        seenIds.add(b.id);
        combined.push(b);
      }
    }

    // Local books (including demo books if allowed)
    for (const b of localBooks) {
      if (!seenIds.has(b.id)) {
        // If demo data was deleted, never include demo records
        if (demoDeleted && isDemoRecord(b)) continue;
        seenIds.add(b.id);
        combined.push(b);
      }
    }

    // Filter hidden demo data if on public view
    if (!includeHiddenDemo && demoHidden) {
      return combined.filter((b) => !isDemoRecord(b));
    }

    return combined;
  },

  async getApprovedBooks(includeHiddenDemo: boolean = false): Promise<Book[]> {
    const all = await this.getBooks(true);
    const hidden = isDemoHidden();

    return all.filter((b) => {
      if (b.status !== 'approved') return false;
      if (!includeHiddenDemo && hidden && isDemoRecord(b)) return false;
      return true;
    });
  },

  async getBookById(id: string): Promise<Book | undefined> {
    if (this.isSupabaseEnabled() && supabase) {
      try {
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          return mapSupabaseBookToApp(data);
        }
      } catch (err) {
        console.warn('Supabase getBookById error:', err);
      }
    }

    const all = getStoredBooks();
    return all.find((b) => b.id === id);
  },

  // Submit book - Real user submission (is_demo: false, data_type: 'real')
  async submitNewBook(newBookData: Omit<Book, 'id' | 'status' | 'createdAt'>): Promise<Book> {
    const localId = `book-${Date.now()}`;
    let newBook: Book = {
      ...newBookData,
      id: localId,
      status: 'pending', // Starts as pending admin approval
      createdAt: new Date().toISOString(),
      // Explicit real user data markings
      is_demo: false,
      isDemo: false,
      data_type: 'real',
    };

    // If Supabase is connected, insert directly to Supabase
    if (this.isSupabaseEnabled() && supabase) {
      try {
        const supabasePayload = mapAppBookToSupabase(newBook);
        const { data, error } = await supabase
          .from('books')
          .insert([supabasePayload])
          .select()
          .single();

        if (!error && data) {
          newBook = mapSupabaseBookToApp(data);
        } else if (error) {
          console.warn('Supabase insert error, saving locally:', error.message);
        }
      } catch (err) {
        console.warn('Failed to insert to Supabase, saving locally:', err);
      }
    }

    // Always keep in local storage for fast client UI responsiveness
    const all = getStoredBooks();
    const updated = [newBook, ...all.filter((b) => b.id !== newBook.id)];
    saveStoredBooks(updated);

    return newBook;
  },

  async updateBookStatus(id: string, status: BookStatus, rejectionReason?: string): Promise<Book | null> {
    // If Supabase is connected, update Supabase
    if (this.isSupabaseEnabled() && supabase) {
      try {
        const updatePayload: Record<string, any> = {
          status,
          rejection_reason: status === 'rejected' ? rejectionReason || 'Does not meet campus verification criteria' : null,
          updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
          .from('books')
          .update(updatePayload)
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          const updatedBook = mapSupabaseBookToApp(data);
          // Sync local storage
          const all = getStoredBooks();
          const index = all.findIndex((b) => b.id === id);
          if (index !== -1) {
            all[index] = updatedBook;
            saveStoredBooks(all);
          }
          return updatedBook;
        }
      } catch (err) {
        console.warn('Supabase updateBookStatus error, updating local:', err);
      }
    }

    const all = getStoredBooks();
    const index = all.findIndex((b) => b.id === id);
    if (index === -1) return null;

    all[index] = {
      ...all[index],
      status,
      rejectionReason: status === 'rejected' ? rejectionReason || 'Does not meet campus verification criteria' : undefined,
    };
    saveStoredBooks(all);
    return all[index];
  },

  async deleteBook(id: string): Promise<boolean> {
    if (this.isSupabaseEnabled() && supabase) {
      try {
        await supabase.from('books').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete error:', err);
      }
    }

    const all = getStoredBooks();
    const filtered = all.filter((b) => b.id !== id);
    saveStoredBooks(filtered);
    return true;
  },

  // ==========================================
  // USERS API
  // ==========================================

  async getUsers(): Promise<UserProfile[]> {
    // The Users Directory is a production view. Demo profiles remain available
    // only to the explicit demo-data cleanup workflow, never in this listing.
    const localUsers = getStoredUsers().filter((user) => !isDemoRecord(user));
    const demoDeleted = isDemoDeleted();

    if (this.isSupabaseEnabled() && supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('is_demo', false)
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          const supabaseUsers = data.map(mapSupabaseUserToApp).filter((user) => !isDemoRecord(user));
          const seen = new Set<string>();
          const combined: UserProfile[] = [];

          for (const u of supabaseUsers) {
            if (!seen.has(u.id)) {
              seen.add(u.id);
              combined.push(u);
            }
          }
          for (const u of localUsers) {
            if (!seen.has(u.id)) {
              if (demoDeleted && isDemoRecord(u)) continue;
              seen.add(u.id);
              combined.push(u);
            }
          }
          return combined;
        }
      } catch (err) {
        console.warn('Supabase getUsers error:', err);
      }
    }

    return localUsers;
  },

  async updateUserStatus(id: string, nextStatus: 'Active' | 'Suspended'): Promise<UserProfile | null> {
    if (this.isSupabaseEnabled() && supabase) {
      try {
        const { data } = await supabase
          .from('profiles')
          .update({ status: nextStatus })
          .eq('id', id)
          .select()
          .single();

        if (data) {
          return mapSupabaseUserToApp(data);
        }
      } catch (err) {
        console.warn('Supabase updateUserStatus error:', err);
      }
    }

    const all = getStoredUsers();
    const index = all.findIndex((u) => u.id === id);
    if (index === -1) return null;

    all[index] = { ...all[index], status: nextStatus };
    saveStoredUsers(all);
    return all[index];
  },

  // ==========================================
  // COLLEGES API & OTHER COLLEGE REQUESTS
  // ==========================================

  async getColleges(): Promise<CollegeInfo[]> {
    const localColleges = getStoredColleges();
    const demoDeleted = isDemoDeleted();
    const allBooks = (await this.getBooks(true)).filter((book) => !isDemoRecord(book));
    const bookCounts: Record<string, number> = allBooks.reduce((counts: Record<string, number>, book) => {
      if (book.status !== 'archived') counts[book.college] = (counts[book.college] || 0) + 1;
      return counts;
    }, {});

    if (this.isSupabaseEnabled() && supabase) {
      try {
        const { data, error } = await supabase
          .from('colleges')
          .select('*')
          .order('name', { ascending: true });

        if (!error && Array.isArray(data) && data.length > 0) {
          const supabaseColleges: CollegeInfo[] = data.map((c: any) => ({
            id: c.id,
            name: c.name,
            city: c.city || '',
            state: c.state || 'Bihar',
            courses: c.courses || ['Diploma'],
            popularBranches: c.popular_branches || ['Civil', 'Mechanical', 'Electrical'],
            bookCount: bookCounts[c.name] || 0,
            image: c.image || 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
            status: c.status || 'active',
            isOfficial: c.is_official !== false,
            is_demo: c.is_demo === true,
            isDemo: c.is_demo === true,
            data_type: c.data_type || (c.is_demo ? 'demo' : 'real'),
          })).filter((college) => !isDemoRecord(college));

          const seen = new Set<string>();
          const combined: CollegeInfo[] = [];

          for (const c of supabaseColleges) {
            if (!seen.has(c.id)) {
              seen.add(c.id);
              combined.push(c);
            }
          }
          for (const c of localColleges.filter((college) => !isDemoRecord(college))) {
            if (!seen.has(c.id)) {
              if (demoDeleted && isDemoRecord(c)) continue;
              seen.add(c.id);
              combined.push(c);
            }
          }
          return combined;
        }
      } catch (err) {
        console.warn('Supabase getColleges error:', err);
      }
    }

    return localColleges
      .filter((college) => !isDemoRecord(college))
      .map((college) => ({ ...college, bookCount: bookCounts[college.name] || 0 }));
  },

  async updateCollege(college: CollegeInfo): Promise<CollegeInfo | null> {
    if (this.isSupabaseEnabled() && supabase) {
      try {
        await supabase
          .from('colleges')
          .upsert({
            id: college.id,
            name: college.name,
            city: college.city,
            state: college.state,
            courses: college.courses,
            popular_branches: college.popularBranches,
            status: college.status,
            is_official: college.isOfficial,
            book_count: college.bookCount,
          });
      } catch (err) {
        console.warn('Supabase updateCollege error:', err);
      }
    }

    const all = getStoredColleges();
    const idx = all.findIndex((c) => c.id === college.id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...college };
    } else {
      all.push(college);
    }
    saveStoredColleges(all);
    return college;
  },

  async activateCollege(id: string): Promise<boolean> {
    if (this.isSupabaseEnabled() && supabase) {
      try {
        await supabase.from('colleges').update({ status: 'active' }).eq('id', id);
      } catch (err) {
        console.warn('Supabase activateCollege error:', err);
      }
    }

    const all = getStoredColleges();
    const idx = all.findIndex((c) => c.id === id);
    if (idx !== -1) {
      all[idx].status = 'active';
      saveStoredColleges(all);
      return true;
    }
    return false;
  },

  async deactivateCollege(id: string): Promise<boolean> {
    if (this.isSupabaseEnabled() && supabase) {
      try {
        await supabase.from('colleges').update({ status: 'inactive' }).eq('id', id);
      } catch (err) {
        console.warn('Supabase deactivateCollege error:', err);
      }
    }

    const all = getStoredColleges();
    const idx = all.findIndex((c) => c.id === id);
    if (idx !== -1) {
      all[idx].status = 'inactive';
      saveStoredColleges(all);
      return true;
    }
    return false;
  },

  async addCollege(collegeData: Omit<CollegeInfo, 'id'>): Promise<CollegeInfo> {
    const id = `col-${Date.now()}-${collegeData.name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20)}`;
    const newCollege: CollegeInfo = {
      ...collegeData,
      id,
      status: collegeData.status || 'active',
      isOfficial: true,
      bookCount: collegeData.bookCount || 0,
      image: collegeData.image || 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    };

    if (this.isSupabaseEnabled() && supabase) {
      try {
        await supabase.from('colleges').insert([
          {
            id: newCollege.id,
            name: newCollege.name,
            city: newCollege.city,
            state: newCollege.state,
            courses: newCollege.courses,
            popular_branches: newCollege.popularBranches,
            status: newCollege.status,
            is_official: true,
            book_count: newCollege.bookCount,
          },
        ]);
      } catch (err) {
        console.warn('Supabase addCollege error:', err);
      }
    }

    const all = getStoredColleges();
    all.push(newCollege);
    saveStoredColleges(all);
    return newCollege;
  },

  async getOtherCollegeRequests(): Promise<OtherCollegeRequest[]> {
    const allBooks = getStoredBooks().filter((book) => !isDemoRecord(book));
    const statusMap: Record<string, 'pending' | 'approved' | 'rejected'> = {};

    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY_OTHER_COLLEGE_STATUS);
      if (raw) {
        Object.assign(statusMap, JSON.parse(raw));
      }
    } catch (e) {
      console.error(e);
    }

    const groups = new Map<string, {
      collegeName: string;
      city: string;
      state: string;
      submittedBooksCount: number;
      firstDate: string;
      latestDate: string;
      submittedBy?: string;
    }>();

    for (const b of allBooks) {
      const isOther = b.isOtherCollege || b.college === 'Other College' || (b.otherCollegeName && b.otherCollegeName.trim().length > 0);
      if (!isOther) continue;

      const name = (b.otherCollegeName || b.college).trim();
      const key = name.toLowerCase();

      const existing = groups.get(key);
      if (existing) {
        existing.submittedBooksCount += 1;
        if (b.createdAt < existing.firstDate) existing.firstDate = b.createdAt;
        if (b.createdAt > existing.latestDate) existing.latestDate = b.createdAt;
      } else {
        groups.set(key, {
          collegeName: name,
          city: b.otherCollegeCity || b.city,
          state: b.otherCollegeState || b.state,
          submittedBooksCount: 1,
          firstDate: b.createdAt || new Date().toISOString(),
          latestDate: b.createdAt || new Date().toISOString(),
          submittedBy: b.sellerName,
        });
      }
    }

    const requests: OtherCollegeRequest[] = [];
    for (const [key, g] of groups.entries()) {
      requests.push({
        id: `req-${key.replace(/[^a-z0-9]/g, '-')}`,
        collegeName: g.collegeName,
        city: g.city,
        state: g.state,
        submittedBooksCount: g.submittedBooksCount,
        firstSubmissionDate: g.firstDate,
        latestSubmissionDate: g.latestDate,
        status: statusMap[key] || 'pending',
        submittedBy: g.submittedBy,
      });
    }

    return requests;
  },

  async approveOtherCollegeRequest(request: OtherCollegeRequest): Promise<CollegeInfo> {
    // 1. Mark status as approved
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY_OTHER_COLLEGE_STATUS);
      const map = raw ? JSON.parse(raw) : {};
      map[request.collegeName.toLowerCase()] = 'approved';
      localStorage.setItem(LOCAL_STORAGE_KEY_OTHER_COLLEGE_STATUS, JSON.stringify(map));
    } catch (e) {
      console.error(e);
    }

    // 2. Create proper official college record
    const newCollege = await this.addCollege({
      name: request.collegeName,
      city: request.city,
      state: request.state,
      courses: ['Diploma', 'B.Tech'],
      popularBranches: ['Civil', 'Mechanical', 'Electrical', 'Computer Science'],
      bookCount: request.submittedBooksCount,
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
      status: 'active',
      isOfficial: true,
    });

    // 3. Update all books submitted with this other college name so they link to the official college
    const allBooks = getStoredBooks();
    let updatedAny = false;
    for (const b of allBooks) {
      if (b.otherCollegeName && b.otherCollegeName.toLowerCase().trim() === request.collegeName.toLowerCase().trim()) {
        b.college = request.collegeName;
        updatedAny = true;
      }
    }
    if (updatedAny) {
      saveStoredBooks(allBooks);
    }

    return newCollege;
  },

  async rejectOtherCollegeRequest(collegeName: string, _reason?: string): Promise<boolean> {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY_OTHER_COLLEGE_STATUS);
      const map = raw ? JSON.parse(raw) : {};
      map[collegeName.toLowerCase()] = 'rejected';
      localStorage.setItem(LOCAL_STORAGE_KEY_OTHER_COLLEGE_STATUS, JSON.stringify(map));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  // ==========================================
  // CHATS & PRIVATE MESSAGING (FUTURE READY)
  // ==========================================

  async getMarketplaceSettings(): Promise<MarketplaceSettings> {
    if (this.isSupabaseEnabled() && supabase) {
      try {
        const { data, error } = await supabase.from('site_settings').select('key, value');
        if (!error && Array.isArray(data)) {
          return data.reduce((settings, row) => ({ ...settings, [row.key]: row.value }), { ...DEFAULT_MARKETPLACE_SETTINGS });
        }
      } catch (err) {
        console.warn('Supabase settings error:', err);
      }
    }
    try {
      const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS) || '{}');
      return { ...DEFAULT_MARKETPLACE_SETTINGS, ...stored };
    } catch {
      return { ...DEFAULT_MARKETPLACE_SETTINGS };
    }
  },

  async updateMarketplaceSetting(key: keyof MarketplaceSettings, value: boolean): Promise<boolean> {
    if (this.isSupabaseEnabled() && supabase) {
      const { error } = await supabase.from('site_settings').upsert({ key, value, updated_at: new Date().toISOString() });
      if (!error) return true;
    }
    const settings = await this.getMarketplaceSettings();
    settings[key] = value;
    localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    return true;
  },

  async createInquiry(book: Book, buyer: { id?: string; name: string; phone: string; email?: string }, content: string): Promise<BookInquiry> {
    const settings = await this.getMarketplaceSettings();
    const normalizedPhone = buyer.phone.replace(/[^0-9+() -]/g, '').trim();
    if (settings.buyerMobileRequired && normalizedPhone.replace(/\D/g, '').length < 7) {
      throw new Error('Please enter a valid mobile number.');
    }
    const now = new Date().toISOString();
    const inquiry: BookInquiry = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `inquiry-${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      buyerId: buyer.id,
      buyerName: buyer.name,
      buyerPhone: normalizedPhone,
      buyerEmail: buyer.email,
      sellerId: book.sellerName,
      sellerName: book.sellerName,
      sellerEmail: book.sellerEmail,
      sellerPhone: book.sellerPhone,
      college: book.college,
      message: content,
      status: settings.adminInquiryApproval ? 'pending' : 'approved',
      approvalRequired: settings.adminInquiryApproval,
      createdAt: now,
    };

    if (this.isSupabaseEnabled() && supabase) {
      const { data, error } = await supabase.from('book_inquiries').insert({
        id: inquiry.id,
        book_id: book.id,
        buyer_id: buyer.id || null,
        buyer_name: buyer.name,
        buyer_phone: normalizedPhone,
        buyer_email: buyer.email || null,
        seller_id: book.sellerName,
        seller_name: book.sellerName,
        message: content,
        status: inquiry.status,
        approval_required: inquiry.approvalRequired,
        is_demo: false,
      }).select().single();
      if (!error && data) {
        if (!settings.adminInquiryApproval && settings.privateConversation) {
          await this.createConversation(book, buyer, content);
        }
        return inquiry;
      }
    }

    const stored: BookInquiry[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_INQUIRIES) || '[]');
    const duplicate = stored.find((item) => item.bookId === book.id && item.buyerPhone === normalizedPhone && ['pending', 'approved', 'active'].includes(item.status));
    if (duplicate) throw new Error('You already have an active inquiry for this book.');
    stored.unshift(inquiry);
    localStorage.setItem(LOCAL_STORAGE_KEY_INQUIRIES, JSON.stringify(stored));

    if (!settings.adminInquiryApproval && settings.privateConversation) {
      await this.createConversation(book, buyer, content);
    }
    return inquiry;
  },

  async getInquiries(): Promise<BookInquiry[]> {
    if (this.isSupabaseEnabled() && supabase) {
      const { data, error } = await supabase
        .from('book_inquiries')
        .select('*, books(title, author, price, images, college, seller_name, seller_email, seller_phone)')
        .order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) {
        return data.map((row: any) => ({
          id: row.id,
          bookId: row.book_id,
          bookTitle: row.books?.title || row.book_title || '',
          buyerId: row.buyer_id,
          buyerName: row.buyer_name,
          buyerPhone: row.buyer_phone,
          buyerEmail: row.buyer_email,
          sellerId: row.seller_id,
          sellerName: row.seller_name || row.books?.seller_name || '',
          sellerEmail: row.books?.seller_email || row.seller_email || undefined,
          sellerPhone: row.books?.seller_phone || row.seller_phone || undefined,
          college: row.college || row.books?.college || '',
          message: row.message,
          status: row.status,
          approvalRequired: Boolean(row.approval_required),
          createdAt: row.created_at,
        }));
      }
    }
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_INQUIRIES) || '[]');
  },

  async updateInquiryStatus(inquiryId: string, status: BookInquiry['status']): Promise<boolean> {
    const inquiries = await this.getInquiries();
    const inquiry = inquiries.find((item) => item.id === inquiryId);
    if (!inquiry) return false;

    if (this.isSupabaseEnabled() && supabase) {
      const { error } = await supabase.from('book_inquiries').update({ status }).eq('id', inquiryId);
      if (error) return false;
    }

    inquiry.status = status;
    localStorage.setItem(LOCAL_STORAGE_KEY_INQUIRIES, JSON.stringify(inquiries));

    if (status === 'approved') {
      const settings = await this.getMarketplaceSettings();
      if (settings.privateConversation) {
        const book = await this.getBookById(inquiry.bookId);
        if (book) {
          const conversations = await this.getConversations();
          const hasConversation = conversations.some((conversation) =>
            conversation.bookId === inquiry.bookId &&
            (conversation.buyerId === inquiry.buyerId || conversation.buyerPhone === inquiry.buyerPhone)
          );
          if (!hasConversation) {
            await this.createConversation(book, {
              id: inquiry.buyerId,
              name: inquiry.buyerName,
              phone: inquiry.buyerPhone,
              email: inquiry.buyerEmail,
            }, inquiry.message);
          }
        }
      }
    }

    return true;
  },

  async deleteInquiry(inquiryId: string): Promise<boolean> {
    const inquiries = await this.getInquiries();
    if (!inquiries.some((item) => item.id === inquiryId)) return false;

    if (this.isSupabaseEnabled() && supabase) {
      const { error } = await supabase.from('book_inquiries').delete().eq('id', inquiryId);
      if (error) {
        console.warn('Supabase deleteInquiry error:', error);
        return false;
      }
    }

    localStorage.setItem(
      LOCAL_STORAGE_KEY_INQUIRIES,
      JSON.stringify(inquiries.filter((item) => item.id !== inquiryId)),
    );
    return true;
  },

  async getConversations(): Promise<ChatConversation[]> {
    const isRealConversation = (conversation: ChatConversation) =>
      !conversation.isDemo &&
      conversation.data_type !== 'demo' &&
      !conversation.id.startsWith('conv-');

    if (this.isSupabaseEnabled() && supabase) {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select('*, books(title, college), messages(content, created_at, is_read, sender_id)')
          .order('last_message_at', { ascending: false });
        if (!error && Array.isArray(data)) {
          return data.map((row: any) => ({
            id: row.id,
            bookId: row.book_id,
            bookTitle: row.books?.title || row.book_title || '',
            buyerId: row.buyer_id,
            buyerName: row.buyer_name || 'Buyer',
            buyerEmail: row.buyer_email || undefined,
            sellerId: row.seller_id,
            sellerName: row.seller_name || 'Seller',
            sellerEmail: row.seller_email || undefined,
            college: row.college || row.books?.college || '',
            lastMessage: row.last_message || '',
            lastMessageAt: row.last_message_at || row.created_at,
            createdAt: row.created_at,
            status: row.status || 'active',
            messagesCount: Number(row.messages_count) || row.messages?.length || 0,
            unreadCount: Number(row.unread_count) || 0,
            isDemo: Boolean(row.is_demo),
            data_type: row.data_type || (row.is_demo ? 'demo' : 'real'),
          })).filter(isRealConversation);
        }
      } catch (err) {
        console.warn('Supabase getConversations error:', err);
      }
    }
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY_CHATS);
      if (raw) {
        const parsed: ChatConversation[] = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const realConversations = parsed.filter(isRealConversation);
          localStorage.setItem(LOCAL_STORAGE_KEY_CHATS, JSON.stringify(realConversations));
          return realConversations;
        }
      }
    } catch (e) {
      console.error(e);
    }

    localStorage.setItem(LOCAL_STORAGE_KEY_CHATS, JSON.stringify([]));
    return [];
  },

  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    if (this.isSupabaseEnabled() && supabase) {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });
        if (!error && Array.isArray(data)) {
          return data.map((row: any) => ({
            id: row.id,
            conversationId: row.conversation_id,
            senderId: row.sender_id,
            senderName: row.sender_name || 'User',
            senderRole: row.sender_role || 'buyer',
            content: row.content,
            timestamp: row.created_at,
            isRead: Boolean(row.is_read),
          }));
        }
      } catch (err) {
        console.warn('Supabase getMessages error:', err);
      }
    }
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY_MESSAGES);
      if (raw) {
        const parsed: Record<string, ChatMessage[]> = JSON.parse(raw);
        if (parsed[conversationId]) return parsed[conversationId];
      }
    } catch (e) {
      console.error(e);
    }

    const defaultMsgs = MOCK_MESSAGES[conversationId] || [];
    return defaultMsgs;
  },

  async sendMessage(conversationId: string, messageData: Omit<ChatMessage, 'id' | 'timestamp' | 'isRead'>): Promise<ChatMessage> {
    const newMsg: ChatMessage = {
      ...messageData,
      id: `msg-${Date.now()}`,
      conversationId,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    if (this.isSupabaseEnabled() && supabase) {
      try {
        const { data, error } = await supabase.from('messages').insert({
          id: newMsg.id,
          conversation_id: conversationId,
          sender_id: messageData.senderId,
          sender_name: messageData.senderName,
          sender_role: messageData.senderRole,
          content: messageData.content,
          is_read: false,
        }).select().single();
        if (!error && data) {
          await supabase.from('conversations').update({
            last_message: messageData.content,
            last_message_at: newMsg.timestamp,
            messages_count: (await this.getMessages(conversationId)).length + 1,
          }).eq('id', conversationId);
          return { ...newMsg, id: data.id, timestamp: data.created_at };
        }
      } catch (err) {
        console.warn('Supabase sendMessage error, using local store:', err);
      }
    }

    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY_MESSAGES);
      const all: Record<string, ChatMessage[]> = raw ? JSON.parse(raw) : { ...MOCK_MESSAGES };
      if (!all[conversationId]) all[conversationId] = [];
      all[conversationId].push(newMsg);
      localStorage.setItem(LOCAL_STORAGE_KEY_MESSAGES, JSON.stringify(all));

      // Update conversation lastMessage
      const convs = await this.getConversations();
      const cIdx = convs.findIndex((c) => c.id === conversationId);
      if (cIdx !== -1) {
        convs[cIdx].lastMessage = newMsg.content;
        convs[cIdx].lastMessageAt = newMsg.timestamp;
        convs[cIdx].messagesCount += 1;
        localStorage.setItem(LOCAL_STORAGE_KEY_CHATS, JSON.stringify(convs));
      }
    } catch (e) {
      console.error(e);
    }

    return newMsg;
  },

  async moderateConversation(conversationId: string, status: 'active' | 'flagged' | 'closed'): Promise<boolean> {
    if (this.isSupabaseEnabled() && supabase) {
      const { error } = await supabase.from('conversations').update({ status, is_moderated: true }).eq('id', conversationId);
      if (!error) return true;
    }
    try {
      const convs = await this.getConversations();
      const cIdx = convs.findIndex((c) => c.id === conversationId);
      if (cIdx !== -1) {
        convs[cIdx].status = status;
        convs[cIdx].isModerated = true;
        localStorage.setItem(LOCAL_STORAGE_KEY_CHATS, JSON.stringify(convs));
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  },

  async createConversation(book: Book, buyer: { id?: string; name: string; email?: string; phone?: string }, content: string): Promise<ChatConversation> {
    const now = new Date().toISOString();
    const conversation: ChatConversation = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `conv-${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      buyerId: buyer.id || `guest-${Date.now()}`,
      buyerName: buyer.name,
      buyerEmail: buyer.email,
      buyerPhone: buyer.phone,
      sellerId: book.sellerName,
      sellerName: book.sellerName,
      sellerEmail: book.sellerEmail,
      sellerPhone: book.sellerPhone,
      college: book.college,
      lastMessage: content,
      lastMessageAt: now,
      createdAt: now,
      status: 'active',
      messagesCount: 1,
      unreadCount: 1,
      isDemo: false,
      data_type: 'real',
    };

    if (this.isSupabaseEnabled() && supabase) {
      try {
        const { data, error } = await supabase.from('conversations').insert({
          id: conversation.id,
          book_id: book.id,
          buyer_id: conversation.buyerId,
          buyer_name: buyer.name,
          buyer_email: buyer.email || null,
          buyer_phone: buyer.phone || null,
          seller_id: book.sellerName,
          seller_name: book.sellerName,
          college: book.college,
          last_message: content,
          last_message_at: now,
          messages_count: 1,
          unread_count: 1,
          is_demo: false,
          data_type: 'real',
        }).select().single();
        if (!error && data) {
          await this.sendMessage(conversation.id, {
            conversationId: conversation.id,
            senderId: conversation.buyerId,
            senderName: buyer.name,
            senderRole: 'buyer',
            content,
          });
          return conversation;
        }
      } catch (err) {
        console.warn('Supabase createConversation error, using local store:', err);
      }
    }

    const conversations = await this.getConversations();
    conversations.unshift(conversation);
    localStorage.setItem(LOCAL_STORAGE_KEY_CHATS, JSON.stringify(conversations));
    await this.sendMessage(conversation.id, {
      conversationId: conversation.id,
      senderId: conversation.buyerId,
      senderName: buyer.name,
      senderRole: 'buyer',
      content,
    });
    return conversation;
  },

  async markConversationRead(conversationId: string, isRead: boolean): Promise<boolean> {
    if (this.isSupabaseEnabled() && supabase) {
      const { error } = await supabase.from('conversations').update({ unread_count: isRead ? 0 : 1 }).eq('id', conversationId);
      if (!error) {
        await supabase.from('messages').update({ is_read: isRead }).eq('conversation_id', conversationId);
        return true;
      }
    }
    const conversations = await this.getConversations();
    const conversation = conversations.find((item) => item.id === conversationId);
    if (!conversation) return false;
    conversation.unreadCount = isRead ? 0 : 1;
    localStorage.setItem(LOCAL_STORAGE_KEY_CHATS, JSON.stringify(conversations));
    const messages: Record<string, ChatMessage[]> = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_MESSAGES) || '{}');
    messages[conversationId] = (messages[conversationId] || []).map((message: ChatMessage) => ({ ...message, isRead }));
    localStorage.setItem(LOCAL_STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    return true;
  },

  async deleteMessage(messageId: string, conversationId: string): Promise<boolean> {
    if (this.isSupabaseEnabled() && supabase) {
      const { error } = await supabase.from('messages').delete().eq('id', messageId);
      if (!error) return true;
    }
    const messages = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_MESSAGES) || '{}');
    messages[conversationId] = (messages[conversationId] || []).filter((message: ChatMessage) => message.id !== messageId);
    localStorage.setItem(LOCAL_STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    return true;
  },

  async deleteConversation(conversationId: string): Promise<boolean> {
    if (this.isSupabaseEnabled() && supabase) {
      const { error } = await supabase.from('conversations').delete().eq('id', conversationId);
      if (!error) return true;
    }
    const conversations = (await this.getConversations()).filter((conversation) => conversation.id !== conversationId);
    localStorage.setItem(LOCAL_STORAGE_KEY_CHATS, JSON.stringify(conversations));
    const messages = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_MESSAGES) || '{}');
    delete messages[conversationId];
    localStorage.setItem(LOCAL_STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    return true;
  },

  async deleteDemoChats(): Promise<number> {
    if (this.isSupabaseEnabled() && supabase) {
      const { data, error } = await supabase.rpc('delete_demo_chats');
      if (!error) return Number(data?.deleted_conversations || 0);
    }
    const conversations = await this.getConversations();
    const demoIds = new Set<string>(conversations.filter((conversation) => conversation.isDemo || conversation.data_type === 'demo').map((conversation) => conversation.id));
    localStorage.setItem(LOCAL_STORAGE_KEY_CHATS, JSON.stringify(conversations.filter((conversation) => !demoIds.has(conversation.id))));
    const messages: Record<string, ChatMessage[]> = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_MESSAGES) || '{}');
    demoIds.forEach((id) => delete messages[id]);
    localStorage.setItem(LOCAL_STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    return demoIds.size;
  },

  async getStorageStats(): Promise<StorageStats> {
    const [books, users, conversations] = await Promise.all([this.getBooks(true), this.getUsers(), this.getConversations()]);
    const messages = (await Promise.all(conversations.map((conversation) => this.getMessages(conversation.id)))).flat();
    const serializedBytes = (value: unknown) => new Blob([JSON.stringify(value)]).size;
    const storageBytes = serializedBytes({ books, users, conversations, messages });
    return {
      databaseBytes: storageBytes,
      storageBytes: 0,
      storageLimitBytes: null,
      books: books.length,
      users: users.length,
      messages: messages.length,
      conversations: conversations.length,
      uploadedFiles: books.reduce((count, book) => count + book.images.length, 0),
      fileBytes: 0,
      imageBytes: 0,
      otherBytes: storageBytes,
      source: this.isSupabaseEnabled() ? 'supabase' : 'local',
    };
  },

  // ==========================================
  // REPORTS API
  // ==========================================

  async getReports(): Promise<ListingReport[]> {
    if (this.isSupabaseEnabled() && supabase) {
      try {
        const { data, error } = await supabase
          .from('listing_reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map(mapSupabaseReportToApp);
        }
      } catch (err) {
        console.warn('Supabase getReports error:', err);
      }
    }

    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY_REPORTS);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error(e);
    }
    return MOCK_REPORTS;
  },

  async submitReport(report: Omit<ListingReport, 'id' | 'date' | 'status'>): Promise<ListingReport> {
    let newRep: ListingReport = {
      ...report,
      id: `rep-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Under Review',
    };

    if (this.isSupabaseEnabled() && supabase) {
      try {
        const { data } = await supabase
          .from('listing_reports')
          .insert([
            {
              book_id: report.bookId,
              book_title: report.bookTitle,
              reporter_name: report.reportedBy || report.reporterName,
              reporter_email: report.reporterEmail,
              reason: report.reason,
              details: report.details,
              status: 'Under Review',
            },
          ])
          .select()
          .single();

        if (data) {
          newRep = mapSupabaseReportToApp(data);
        }
      } catch (err) {
        console.warn('Supabase submitReport error:', err);
      }
    }

    const existing = await this.getReports();
    const updated = [newRep, ...existing];
    localStorage.setItem(LOCAL_STORAGE_KEY_REPORTS, JSON.stringify(updated));
    return newRep;
  },

  // ==========================================
  // DEMO DATA MANAGEMENT - ADMIN CONTROLLED
  // ==========================================

  getDemoStats(): DemoDataStats {
    const allBooks = getStoredBooks();
    const allUsers = getStoredUsers();
    const allColleges = getStoredColleges();

    const demoBooks = allBooks.filter((b) => isDemoRecord(b)).length;
    const realBooks = allBooks.filter((b) => !isDemoRecord(b)).length;

    const demoUsers = allUsers.filter((u) => isDemoRecord(u)).length;
    const realUsers = allUsers.filter((u) => !isDemoRecord(u)).length;

    const demoColleges = allColleges.filter((c) => isDemoRecord(c)).length;
    const realColleges = allColleges.filter((c) => !isDemoRecord(c)).length;

    return {
      demoBooks,
      realBooks,
      totalBooks: allBooks.length,
      demoColleges,
      realColleges,
      totalColleges: allColleges.length,
      demoUsers,
      realUsers,
      totalUsers: allUsers.length,
      isDemoDeleted: isDemoDeleted(),
      isDemoHidden: isDemoHidden(),
      supabaseConfigured: this.isSupabaseEnabled(),
      supabaseUrl: supabaseUrl || '',
      rawSupabaseUrl: rawSupabaseUrl || '',
      hasPathInRawUrl: hasPathInRawUrl || false,
    };
  },

  setDemoDataHidden(hidden: boolean): boolean {
    const isAdmin = localStorage.getItem('campus_book_admin_auth') === 'true';
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin authorization is required to change demo visibility.');
    }
    localStorage.setItem(LOCAL_STORAGE_KEY_DEMO_HIDDEN, String(hidden));
    return hidden;
  },

  /**
   * Admin-only deleteDemoData function
   * Strictly deletes ONLY records where is_demo = true or data_type = 'demo'.
   * Real user data is protected and kept intact.
   */
  async deleteDemoData(): Promise<{
    deletedBooks: number;
    deletedUsers: number;
    deletedColleges: number;
    remainingRealBooks: number;
  }> {
    const isAdmin = localStorage.getItem('campus_book_admin_auth') === 'true';
    if (!isAdmin) {
      throw new Error('Unauthorized: Only authorized administrators can delete demo data.');
    }

    // 1. If Supabase is connected, delete demo records from Supabase
    if (this.isSupabaseEnabled() && supabase) {
      try {
        // Strict is_demo = true condition: Real records are NEVER touched!
        await Promise.all([
          supabase.from('books').delete().eq('is_demo', true),
          supabase.from('profiles').delete().eq('is_demo', true),
          supabase.from('colleges').delete().eq('is_demo', true),
        ]);
      } catch (err) {
        console.warn('Supabase demo deletion error:', err);
      }
    }

    // 2. Fetch current local records
    const allBooks = getStoredBooks();
    const allUsers = getStoredUsers();
    const allColleges = getStoredColleges();

    // 3. Real Data Protection: Filter ONLY records where is_demo is FALSE (or not demo)
    const realBooks = allBooks.filter((b) => !isDemoRecord(b));
    const demoBooksCount = allBooks.length - realBooks.length;

    const realUsers = allUsers.filter((u) => !isDemoRecord(u));
    const demoUsersCount = allUsers.length - realUsers.length;

    const realColleges = allColleges.filter((c) => !isDemoRecord(c));
    const demoCollegesCount = allColleges.length - realColleges.length;

    // 4. Save preserved real data
    saveStoredBooks(realBooks);
    saveStoredUsers(realUsers);
    saveStoredColleges(realColleges);

    // 5. Mark demo as permanently deleted
    localStorage.setItem(LOCAL_STORAGE_KEY_DEMO_DELETED, 'true');

    return {
      deletedBooks: demoBooksCount,
      deletedUsers: demoUsersCount,
      deletedColleges: demoCollegesCount,
      remainingRealBooks: realBooks.length,
    };
  },

  /**
   * Re-seed Demo Data (Admin testing utility)
   */
  async reseedDemoData(): Promise<boolean> {
    const isAdmin = localStorage.getItem('campus_book_admin_auth') === 'true';
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin privileges required.');
    }
    localStorage.removeItem(LOCAL_STORAGE_KEY_DEMO_DELETED);
    localStorage.removeItem(LOCAL_STORAGE_KEY_DEMO_HIDDEN);
    localStorage.setItem(LOCAL_STORAGE_KEY_BOOKS, JSON.stringify(INITIAL_BOOKS));
    localStorage.setItem(LOCAL_STORAGE_KEY_USERS, JSON.stringify(MOCK_USERS));
    localStorage.setItem(LOCAL_STORAGE_KEY_COLLEGES, JSON.stringify(COLLEGES));
    return true;
  },
};
