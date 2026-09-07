export type CourseType = 'Diploma' | 'B.Tech';

export type BookCondition = 'Like New' | 'Excellent' | 'Good' | 'Fair';

export type BookStatus = 'pending' | 'approved' | 'rejected' | 'sold' | 'archived' | 'reserved' | 'changes_requested';

export type InquiryStatus = 'pending' | 'approved' | 'rejected' | 'seller_accepted' | 'seller_rejected' | 'active' | 'closed' | 'sold' | 'cancelled';

export type ProjectStatus = 'pending' | 'approved' | 'rejected' | 'archived';

export type ProjectFileKind = 'folder' | 'code' | 'markdown' | 'json' | 'image' | 'pdf' | 'other';

export interface ProjectFileNode {
  path: string;
  name: string;
  kind: ProjectFileKind;
  size: number;
  children?: ProjectFileNode[];
  content?: string;
  mimeType?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  author: string;
  technology: string;
  category: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  status: ProjectStatus;
  fileTree: ProjectFileNode[];
  fileCount: number;
  safeFileCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  edition: string;
  subject: string;
  description: string;
  course: CourseType;
  branch: string;
  semester: number; // 1 to 8
  condition: BookCondition;
  price: number;
  originalPrice?: number;
  images: string[];
  college: string;
  city: string;
  state: string;
  sellerName: string;
  sellerEmail?: string;
  sellerPhone?: string;
  status: BookStatus;
  rejectionReason?: string;
  featured?: boolean;
  createdAt: string;
  is_demo?: boolean;
  isDemo?: boolean;
  data_type?: 'demo' | 'real';
  // Other College Support
  isOtherCollege?: boolean;
  otherCollegeName?: string;
  otherCollegeCity?: string;
  otherCollegeState?: string;
}

export interface BranchInfo {
  id: string;
  name: string;
  code: string;
  course: CourseType;
  description: string;
  bookCount: number;
  icon: string;
}

export interface CollegeInfo {
  id: string;
  name: string;
  city: string;
  state: string;
  courses: CourseType[];
  popularBranches: string[];
  bookCount: number;
  image: string;
  status?: 'active' | 'inactive';
  isOfficial?: boolean;
  isOtherRequest?: boolean;
  submittedBooksCount?: number;
  firstSubmissionDate?: string;
  latestSubmissionDate?: string;
  is_demo?: boolean;
  isDemo?: boolean;
  isActive?: boolean;
  data_type?: 'demo' | 'real';
}

export interface OtherCollegeRequest {
  id: string;
  collegeName: string;
  city: string;
  state: string;
  submittedBooksCount: number;
  firstSubmissionDate: string;
  latestSubmissionDate: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'buyer' | 'seller' | 'admin';
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatConversation {
  id: string;
  bookId: string;
  bookTitle: string;
  buyerId: string;
  buyerName: string;
  buyerEmail?: string;
  buyerPhone?: string;
  sellerId: string;
  sellerName: string;
  sellerEmail?: string;
  sellerPhone?: string;
  college: string;
  lastMessage: string;
  lastMessageAt: string;
  status: 'active' | 'flagged' | 'closed';
  messagesCount: number;
  isModerated?: boolean;
  unreadCount?: number;
  createdAt?: string;
  isDemo?: boolean;
  data_type?: 'demo' | 'real';
}

export interface BookInquiry {
  id: string;
  bookId: string;
  bookTitle: string;
  buyerId?: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string;
  sellerId?: string;
  sellerName: string;
  sellerEmail?: string;
  sellerPhone?: string;
  college: string;
  message: string;
  status: InquiryStatus;
  approvalRequired: boolean;
  createdAt: string;
}

export interface MarketplaceSettings {
  buyerMobileRequired: boolean;
  adminInquiryApproval: boolean;
  privateConversation: boolean;
  smsNotification: boolean;
  contactSharing: boolean;
  antiSpamProtection: boolean;
}

export interface StorageStats {
  databaseBytes: number;
  storageBytes: number;
  storageLimitBytes: number | null;
  books: number;
  users: number;
  messages: number;
  conversations: number;
  uploadedFiles: number;
  fileBytes: number;
  imageBytes: number;
  otherBytes: number;
  source: 'supabase' | 'local';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  course: CourseType;
  branch: string;
  college: string;
  city: string;
  joined: string;
  joinedDate?: string;
  status: 'Active' | 'Pending Verification' | 'Suspended' | 'active' | 'suspended';
  booksListed: number;
  is_demo?: boolean;
  isDemo?: boolean;
  data_type?: 'demo' | 'real';
}

export interface ListingReport {
  id: string;
  bookId: string;
  bookTitle: string;
  reportedBy: string;
  reporterName?: string;
  reporterEmail: string;
  reason: string;
  details?: string;
  date: string;
  createdAt?: string;
  status: 'pending' | 'resolved' | 'dismissed' | 'Under Review' | 'Resolved' | 'Dismissed';
}

export interface FilterState {
  searchQuery: string;
  course: '' | CourseType;
  branch: string;
  semester: string;
  condition: string;
  priceRange: string;
  state: string;
  city: string;
  college: string;
  sortBy: 'latest' | 'price-low' | 'price-high';
}
