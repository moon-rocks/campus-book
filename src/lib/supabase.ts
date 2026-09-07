import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Book, BookStatus, UserProfile, ListingReport } from '../types';

/**
 * Sanitizes and normalizes any user-supplied Supabase URL.
 * Automatically resolves and prevents PostgREST PGRST125 "Invalid path specified in request URL" errors caused by:
 * - Trailing slashes (e.g., https://xyz.supabase.co/ -> causes double slash //rest/v1)
 * - Path suffixes like /rest/v1 or /rest/v1/ (frequently copied from Supabase API documentation)
 * - Auth or Storage path suffixes like /auth/v1 or /storage/v1
 * - Supabase dashboard project URLs (e.g., https://supabase.com/dashboard/project/<ref>)
 * - Missing protocol schemes (e.g., xyz.supabase.co)
 */
export function sanitizeSupabaseUrl(url: unknown): string {
  if (typeof url !== 'string') return '';
  let cleaned = url.trim();
  if (!cleaned) return '';

  // Remove wrapping quotes if entered as "https://..." or 'https://...'
  cleaned = cleaned.replace(/^["']+|["']+$/g, '');

  // If user pasted a Supabase dashboard URL: https://supabase.com/dashboard/project/<project_ref>
  const dashboardMatch = cleaned.match(/supabase\.com\/dashboard\/project\/([a-zA-Z0-9_-]+)/i);
  if (dashboardMatch && dashboardMatch[1]) {
    return `https://${dashboardMatch[1]}.supabase.co`;
  }

  // If user entered only the 20-character project reference ID
  if (/^[a-z0-9]{20}$/i.test(cleaned)) {
    return `https://${cleaned}.supabase.co`;
  }

  // Ensure protocol
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = `https://${cleaned}`;
  }

  try {
    const parsed = new URL(cleaned);
    // SupabaseClient MUST only be initialized with the origin (e.g., https://xyz.supabase.co)
    // Any extra pathname like /rest/v1 or trailing slash will break supabase-js PostgREST requests with PGRST125
    return parsed.origin;
  } catch {
    // Fallback: strip subpaths and trailing slashes
    return cleaned
      .replace(/\/rest\/v1\/?$/i, '')
      .replace(/\/auth\/v1\/?$/i, '')
      .replace(/\/storage\/v1\/?$/i, '')
      .replace(/\/+$/, '');
  }
}

export function sanitizeSupabaseKey(key: unknown): string {
  if (typeof key !== 'string') return '';
  return key.trim().replace(/^["']+|["']+$/g, '');
}

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const rawSupabaseUrl: string = typeof rawUrl === 'string' ? rawUrl.trim() : '';
export const supabaseUrl: string = sanitizeSupabaseUrl(rawUrl);
export const supabaseAnonKey: string = sanitizeSupabaseKey(rawKey);

export const hasPathInRawUrl: boolean = Boolean(
  rawSupabaseUrl &&
  (rawSupabaseUrl.includes('/rest/v1') ||
   rawSupabaseUrl.includes('/auth/v1') ||
   rawSupabaseUrl.endsWith('/') ||
   rawSupabaseUrl.includes('/dashboard/project/'))
);

export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  (supabaseUrl.startsWith('https://') || supabaseUrl.startsWith('http://')) &&
  !supabaseUrl.includes('MY_SUPABASE_URL') &&
  !supabaseUrl.includes('my_supabase_url') &&
  supabaseAnonKey !== 'MY_SUPABASE_ANON_KEY' &&
  supabaseAnonKey.length >= 20
);

export const supabase: SupabaseClient | null = (() => {
  if (!isSupabaseConfigured) return null;
  try {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (err) {
    console.warn('Unable to initialize Supabase client:', err);
    return null;
  }
})();

// =======================================================
// MAPPER UTILITIES (Supabase snake_case <-> App camelCase)
// =======================================================

export function mapSupabaseBookToApp(row: any): Book {
  return {
    id: String(row.id),
    title: row.title || '',
    author: row.author || '',
    publisher: row.publisher || undefined,
    edition: row.edition || undefined,
    subject: row.subject || undefined,
    description: row.description || '',
    course: row.course || 'Diploma',
    branch: row.branch || 'General',
    semester: Number(row.semester) || 1,
    condition: row.condition || 'Good',
    price: Number(row.price) || 0,
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    images: Array.isArray(row.images) && row.images.length > 0 ? row.images : [],
    college: row.college || '',
    city: row.city || '',
    state: row.state || 'Bihar',
    sellerName: row.seller_name || '',
    sellerEmail: row.seller_email || '',
    sellerPhone: row.seller_phone || '',
    status: (row.status as BookStatus) || 'pending',
    rejectionReason: row.rejection_reason || undefined,
    featured: Boolean(row.featured),
    createdAt: row.created_at || new Date().toISOString(),
    is_demo: Boolean(row.is_demo),
    isDemo: Boolean(row.is_demo),
    data_type: row.data_type || (row.is_demo ? 'demo' : 'real'),
    // Other College Support
    isOtherCollege: Boolean(row.is_other_college),
    otherCollegeName: row.other_college_name || undefined,
    otherCollegeCity: row.other_college_city || undefined,
    otherCollegeState: row.other_college_state || undefined,
  };
}

export function mapAppBookToSupabase(book: Partial<Book>): Record<string, any> {
  const price = Number(book.price) || 0;
  const payload: Record<string, any> = {
    title: book.title,
    author: book.author,
    publisher: book.publisher || null,
    edition: book.edition || null,
    subject: book.subject || null,
    description: book.description || '',
    course: book.course,
    branch: book.branch,
    semester: book.semester,
    condition: book.condition,
    price: book.price,
    original_price: book.originalPrice || null,
    images: book.images || [],
    college: book.college,
    city: book.city,
    state: book.state || 'Bihar',
    seller_name: book.sellerName,
    seller_phone: book.sellerPhone,
    seller_email: book.sellerEmail || null,
    status: book.status || 'pending',
    rejection_reason: book.rejectionReason || null,
    featured: Boolean(book.featured),
    // Core data isolation flags
    is_demo: book.is_demo ?? book.isDemo ?? false,
    data_type: book.data_type || (book.is_demo ? 'demo' : 'real'),
    // Other College Support
    is_other_college: Boolean(book.isOtherCollege),
    other_college_name: book.otherCollegeName || null,
    other_college_city: book.otherCollegeCity || null,
    other_college_state: book.otherCollegeState || null,
  };

  if (book.id && !book.id.startsWith('book-')) {
    // If it's a valid UUID, include id; otherwise let Supabase auto-generate
    payload.id = book.id;
  }

  return payload;
}

export function mapSupabaseUserToApp(row: any): UserProfile {
  return {
    id: String(row.id),
    name: row.name || 'Student',
    email: row.email || '',
    course: row.course || 'B.Tech',
    branch: row.branch || 'Engineering',
    college: row.college || '',
    city: row.city || '',
    joined: row.created_at ? row.created_at.split('T')[0] : '2026-09-01',
    joinedDate: row.created_at ? row.created_at.split('T')[0] : '2026-09-01',
    status: row.status || 'Active',
    booksListed: Number(row.books_listed) || 0,
    is_demo: Boolean(row.is_demo),
    isDemo: Boolean(row.is_demo),
    data_type: row.data_type || (row.is_demo ? 'demo' : 'real'),
  };
}

export function mapSupabaseReportToApp(row: any): ListingReport {
  return {
    id: String(row.id),
    bookId: String(row.book_id),
    bookTitle: row.book_title || '',
    reportedBy: row.reporter_name || row.reported_by || 'Anonymous',
    reporterName: row.reporter_name || 'Anonymous',
    reporterEmail: row.reporter_email || '',
    reason: row.reason || 'Other',
    details: row.details || '',
    date: row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
    createdAt: row.created_at || new Date().toISOString(),
    status: row.status || 'pending',
  };
}

// Complete copy-paste SQL migration script for Supabase
export const SUPABASE_SETUP_SQL = `-- ===================================================
-- CAMPUS BOOK SUPABASE DATABASE SCHEMA
-- Bihar & Multi-College Second-Hand Academic Marketplace
-- ===================================================

-- 1. Create Books Table with Demo Data Safeguard
CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    publisher TEXT,
    edition TEXT,
    subject TEXT,
    description TEXT,
    course TEXT NOT NULL CHECK (course IN ('Diploma', 'B.Tech')),
    branch TEXT NOT NULL,
    semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
    condition TEXT NOT NULL,
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    college TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'Bihar',
    seller_name TEXT NOT NULL,
    seller_phone TEXT NOT NULL,
    seller_email TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'sold')),
    rejection_reason TEXT,
    featured BOOLEAN DEFAULT FALSE,
    -- CRITICAL: Demo Data Identification
    is_demo BOOLEAN DEFAULT FALSE,
    data_type TEXT DEFAULT 'real' CHECK (data_type IN ('demo', 'real')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create User Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    course TEXT,
    branch TEXT,
    college TEXT,
    city TEXT,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Suspended', 'Pending Verification')),
    books_listed INTEGER DEFAULT 0,
    is_demo BOOLEAN DEFAULT FALSE,
    data_type TEXT DEFAULT 'real',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Colleges Table
CREATE TABLE IF NOT EXISTS public.colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'Bihar',
    active_students INTEGER DEFAULT 0,
    is_demo BOOLEAN DEFAULT FALSE,
    data_type TEXT DEFAULT 'real',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create Listing Reports Table
CREATE TABLE IF NOT EXISTS public.listing_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id TEXT NOT NULL,
    book_title TEXT NOT NULL,
    reporter_name TEXT NOT NULL,
    reporter_email TEXT,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT DEFAULT 'Under Review' CHECK (status IN ('Under Review', 'resolved', 'dismissed')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_reports ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can view approved books" ON public.books
    FOR SELECT USING (status = 'approved' OR auth.role() = 'service_role');

CREATE POLICY "Anyone can insert a book" ON public.books
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update book status or report" ON public.books
    FOR UPDATE USING (true);

CREATE POLICY "Public read colleges" ON public.colleges
    FOR SELECT USING (true);

CREATE POLICY "Public read profiles" ON public.profiles
    FOR SELECT USING (true);

-- 5. Admin Safe Demo Deletion Function
-- Strictly protected: Deletes ONLY records where is_demo = TRUE
CREATE OR REPLACE FUNCTION delete_demo_data()
RETURNS JSON AS $$
DECLARE
    deleted_books_count INT;
    deleted_profiles_count INT;
BEGIN
    DELETE FROM public.books WHERE is_demo = TRUE;
    GET DIAGNOSTICS deleted_books_count = ROW_COUNT;

    DELETE FROM public.profiles WHERE is_demo = TRUE;
    GET DIAGNOSTICS deleted_profiles_count = ROW_COUNT;

    DELETE FROM public.colleges WHERE is_demo = TRUE;

    RETURN json_build_object(
        'status', 'success',
        'deleted_books', deleted_books_count,
        'deleted_profiles', deleted_profiles_count,
        'message', 'Demo data removed. All production records safely preserved.'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;
