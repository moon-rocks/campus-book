import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  Clock,
  MessageSquare,
  Search,
  XCircle,
  Mail,
  Phone,
  User,
  BookOpen,
  ExternalLink,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminNavbar } from '../../components/admin/AdminNavbar';
import { api } from '../../services/api';
import { BookInquiry, InquiryStatus } from '../../types';
import { useMarketplace } from '../../context/MarketplaceContext';

const statusLabel: Record<InquiryStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  seller_accepted: 'Seller Accepted',
  seller_rejected: 'Seller Rejected',
  active: 'Contacted',
  closed: 'Completed',
  sold: 'Sold',
  cancelled: 'Cancelled',
};

const statusClasses: Record<InquiryStatus, string> = {
  pending: 'bg-amber-50 text-amber-800 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  rejected: 'bg-rose-50 text-rose-800 border-rose-200',
  seller_accepted: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  seller_rejected: 'bg-rose-50 text-rose-800 border-rose-200',
  active: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  closed: 'bg-slate-100 text-slate-700 border-slate-200',
  sold: 'bg-purple-50 text-purple-800 border-purple-200',
  cancelled: 'bg-slate-100 text-slate-600 border-slate-200',
};

const encode = (value: string) => encodeURIComponent(value || '');

const openContactUrl = (gmailUrl: string, mailtoUrl: string) => {
  const contactWindow = window.open(gmailUrl, '_blank', 'noopener,noreferrer');
  if (!contactWindow) {
    window.location.href = mailtoUrl;
  }
};

const buildSellerMailto = (inquiry: BookInquiry) => {
  if (!inquiry.sellerEmail?.trim()) return null;
  const subject = `Book Purchase Request – ${inquiry.bookTitle}`;
  const body = [
    `Hello ${inquiry.sellerName || 'Seller'},`,
    '',
    'A buyer is interested in purchasing your book.',
    '',
    `Book: ${inquiry.bookTitle}`,
    `College: ${inquiry.college || 'N/A'}`,
    '',
    'Buyer Details:',
    `Name: ${inquiry.buyerName}`,
    `Gmail: ${inquiry.buyerEmail || 'N/A'}`,
    `Mobile: ${inquiry.buyerPhone || 'N/A'}`,
    '',
    'Buyer Message:',
    inquiry.message,
    '',
    'Please contact the buyer directly regarding the book.',
    '',
    'Thank you.',
  ].join('\n');
  return `mailto:${inquiry.sellerEmail.trim()}?subject=${encode(subject)}&body=${encode(body)}`;
};

const buildSellerGmailUrl = (inquiry: BookInquiry) => {
  if (!inquiry.sellerEmail?.trim()) return null;
  const subject = `Book Purchase Request – ${inquiry.bookTitle}`;
  const body = [
    `Hello ${inquiry.sellerName || 'Seller'},`,
    '',
    'A buyer is interested in purchasing your book.',
    '',
    `Book: ${inquiry.bookTitle}`,
    `College: ${inquiry.college || 'N/A'}`,
    '',
    'Buyer Details:',
    `Name: ${inquiry.buyerName}`,
    `Gmail: ${inquiry.buyerEmail || 'N/A'}`,
    `Mobile: ${inquiry.buyerPhone || 'N/A'}`,
    '',
    'Buyer Message:',
    inquiry.message,
    '',
    'Please contact the buyer directly regarding the book.',
    '',
    'Thank you.',
  ].join('\n');
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encode(inquiry.sellerEmail.trim())}&su=${encode(subject)}&body=${encode(body)}`;
};

const buildBuyerMailto = (inquiry: BookInquiry) => {
  if (!inquiry.buyerEmail?.trim()) return null;
  const subject = `Regarding Your Book Request – ${inquiry.bookTitle}`;
  const body = [
    `Hello ${inquiry.buyerName || 'Buyer'},`,
    '',
    `Your request for "${inquiry.bookTitle}" has been reviewed by the admin.`,
    '',
    `Seller: ${inquiry.sellerName || 'Seller'}`,
    `Seller Gmail: ${inquiry.sellerEmail || 'N/A'}`,
    `Seller Mobile: ${inquiry.sellerPhone || 'N/A'}`,
    '',
    'You can use the seller contact details above to communicate about the book.',
    '',
    'Thank you.',
  ].join('\n');
  return `mailto:${inquiry.buyerEmail.trim()}?subject=${encode(subject)}&body=${encode(body)}`;
};

const buildBuyerGmailUrl = (inquiry: BookInquiry) => {
  if (!inquiry.buyerEmail?.trim()) return null;
  const subject = `Regarding Your Book Request – ${inquiry.bookTitle}`;
  const body = [
    `Hello ${inquiry.buyerName || 'Buyer'},`,
    '',
    `Your request for "${inquiry.bookTitle}" has been reviewed by the admin.`,
    '',
    `Seller: ${inquiry.sellerName || 'Seller'}`,
    `Seller Gmail: ${inquiry.sellerEmail || 'N/A'}`,
    `Seller Mobile: ${inquiry.sellerPhone || 'N/A'}`,
    '',
    'You can use the seller contact details above to communicate about the book.',
    '',
    'Thank you.',
  ].join('\n');
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encode(inquiry.buyerEmail.trim())}&su=${encode(subject)}&body=${encode(body)}`;
};

export const AdminInquiries: React.FC = () => {
  const { showToast } = useMarketplace();
  const [inquiries, setInquiries] = useState<BookInquiry[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<BookInquiry | null>(null);

  const load = async () => setInquiries(await api.getInquiries());
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => inquiries.filter((inquiry) => {
    const query = search.toLowerCase();
    return !query || [
      inquiry.bookTitle,
      inquiry.buyerName,
      inquiry.buyerEmail || '',
      inquiry.sellerName,
      inquiry.sellerEmail || '',
      inquiry.college,
    ].some((value) => value.toLowerCase().includes(query));
  }), [inquiries, search]);

  const updateStatus = async (inquiry: BookInquiry, status: InquiryStatus): Promise<boolean> => {
    if (!await api.updateInquiryStatus(inquiry.id, status)) {
      showToast('Unable to update request status.', 'error');
      return false;
    }
    setInquiries((items) => items.map((item) => item.id === inquiry.id ? { ...item, status } : item));
    setSelected((item) => item?.id === inquiry.id ? { ...item, status } : item);
    showToast(`Request marked ${statusLabel[status]}.`, 'success');
    return true;
  };

  const closeInquiry = async (inquiry: BookInquiry) => {
    if (await updateStatus(inquiry, 'closed')) {
      setSelected(null);
    }
  };

  const deleteInquiry = async (inquiry: BookInquiry) => {
    if (!window.confirm(`Delete the inquiry for "${inquiry.bookTitle}"? This cannot be undone.`)) return;
    if (!await api.deleteInquiry(inquiry.id)) {
      showToast('Unable to delete inquiry. Check that your admin session is active.', 'error');
      return;
    }
    setInquiries((items) => items.filter((item) => item.id !== inquiry.id));
    setSelected((item) => item?.id === inquiry.id ? null : item);
    showToast('Inquiry deleted.', 'success');
  };

  const openSellerMail = async (inquiry: BookInquiry) => {
    const mailto = buildSellerMailto(inquiry);
    const gmailUrl = buildSellerGmailUrl(inquiry);
    if (!mailto || !gmailUrl) {
      showToast('Seller email address is not available.', 'error');
      return;
    }
    if (inquiry.status === 'pending' || inquiry.status === 'approved') {
      await updateStatus(inquiry, 'active');
    }
    openContactUrl(gmailUrl, mailto);
  };

  const openBuyerMail = (inquiry: BookInquiry) => {
    const mailto = buildBuyerMailto(inquiry);
    const gmailUrl = buildBuyerGmailUrl(inquiry);
    if (!mailto || !gmailUrl) {
      showToast('Buyer email address is not available.', 'error');
      return;
    }
    openContactUrl(gmailUrl, mailto);
  };

  const callNumber = (phone?: string, label = 'Contact') => {
    if (!phone?.trim()) {
      showToast(`${label} mobile number is not available.`, 'error');
      return;
    }
    const telUrl = `tel:${phone.replace(/[^0-9+]/g, '')}`;
    const contactWindow = window.open(telUrl, '_blank', 'noopener,noreferrer');
    if (!contactWindow) window.location.href = telUrl;
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar
          title="Book Requests"
          subtitle="Review buyer requests, view seller contacts, and contact sellers through the admin's email app"
        />
        <main className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-4">
            <div className="relative max-w-xl">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search book, buyer, seller, Gmail, or college..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-5">Book</th>
                    <th className="py-3.5 px-4">Buyer</th>
                    <th className="py-3.5 px-4">Seller</th>
                    <th className="py-3.5 px-4">Created</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-5">
                        <p className="font-bold text-slate-900">{inquiry.bookTitle}</p>
                        <p className="text-[11px] text-slate-500">{inquiry.college || 'College not provided'}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-slate-800">{inquiry.buyerName}</p>
                        <p className="text-[11px] text-slate-500">{inquiry.buyerEmail || 'No Gmail'} · {inquiry.buyerPhone || 'No mobile'}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-slate-700">{inquiry.sellerName}</p>
                        <p className="text-[11px] text-slate-500">{inquiry.sellerEmail || 'No Gmail'} · {inquiry.sellerPhone || 'No mobile'}</p>
                      </td>
                      <td className="py-4 px-4 text-slate-500 whitespace-nowrap">{new Date(inquiry.createdAt).toLocaleString()}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border font-bold uppercase text-[10px] ${statusClasses[inquiry.status] || statusClasses.pending}`}>
                          <Clock className="w-3 h-3" />{statusLabel[inquiry.status] || inquiry.status}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex justify-end gap-1.5">
                          <button type="button" onClick={() => setSelected(inquiry)} className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200" title="View request details">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          {inquiry.status === 'pending' && (
                            <>
                              <button type="button" onClick={() => updateStatus(inquiry, 'approved')} className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100" title="Approve request">
                                <Check className="w-4 h-4" />
                              </button>
                              <button type="button" onClick={() => updateStatus(inquiry, 'rejected')} className="p-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100" title="Reject request">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button type="button" onClick={() => openSellerMail(inquiry)} className="p-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100" title="Contact seller by email">
                            <Mail className="w-4 h-4" />
                          </button>
                          <button type="button" onClick={() => deleteInquiry(inquiry)} className="p-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100" title="Delete inquiry">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && <tr><td colSpan={6} className="py-14 text-center text-slate-500">No book requests found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto" onClick={() => setSelected(null)}>
          <div className="max-w-3xl mx-auto my-8 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600">Book Request</p>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 mt-1">{selected.bookTitle}</h2>
                <p className="text-xs text-slate-500 mt-1">{selected.college || 'College not provided'} · {new Date(selected.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200" aria-label="Close">×</button>
            </div>

            <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-center gap-2 mb-3"><BookOpen className="w-4 h-4 text-indigo-600" /><h3 className="font-bold text-slate-900">Request</h3></div>
                <p className="text-xs text-slate-700 whitespace-pre-wrap">{selected.message}</p>
              </section>

              <section className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-3"><User className="w-4 h-4 text-emerald-600" /><h3 className="font-bold text-slate-900">Buyer Details</h3></div>
                <p className="text-sm font-bold text-slate-900">{selected.buyerName}</p>
                <p className="text-xs text-slate-600 mt-1">{selected.buyerEmail || 'Gmail unavailable'}</p>
                <p className="text-xs text-slate-600 mt-1">{selected.buyerPhone || 'Mobile unavailable'}</p>
              </section>

              <section className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4 md:col-span-2">
                <div className="flex items-center gap-2 mb-3"><Mail className="w-4 h-4 text-indigo-600" /><h3 className="font-bold text-slate-900">Seller Contact</h3></div>
                <p className="text-sm font-bold text-slate-900">{selected.sellerName || 'Seller'}</p>
                <p className="text-xs text-slate-700 mt-1">{selected.sellerEmail || 'Gmail unavailable'}</p>
                <p className="text-xs text-slate-700 mt-1">{selected.sellerPhone || 'Mobile unavailable'}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <button onClick={() => openSellerMail(selected)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-sm">
                    <Mail className="w-4 h-4" /> Contact Seller
                  </button>
                  <button onClick={() => callNumber(selected.sellerPhone, 'Seller')} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-indigo-200 text-indigo-700 text-xs font-bold hover:bg-indigo-50">
                    <Phone className="w-4 h-4" /> Call Seller
                  </button>
                  <button onClick={() => openBuyerMail(selected)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50">
                    <Mail className="w-4 h-4" /> Contact Buyer
                  </button>
                  <button onClick={() => callNumber(selected.buyerPhone, 'Buyer')} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50">
                    <Phone className="w-4 h-4" /> Call Buyer
                  </button>
                </div>
              </section>
            </div>

            <div className="p-5 sm:p-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <select
                  value={selected.status}
                  onChange={(e) => updateStatus(selected, e.target.value as InquiryStatus)}
                  className="text-xs font-bold border border-slate-200 rounded-xl px-3 py-2 bg-white"
                >
                  {(['pending','approved','rejected','active','closed','sold','cancelled'] as InquiryStatus[]).map((status) => (
                    <option key={status} value={status}>{statusLabel[status]}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                {selected.status !== 'closed' && (
                  <button
                    type="button"
                    onClick={() => closeInquiry(selected)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                    title="Close inquiry"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Close inquiry
                  </button>
                )}
                <button type="button" onClick={() => deleteInquiry(selected)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700" title="Delete inquiry">
                  <Trash2 className="w-4 h-4" />
                  Delete inquiry
                </button>
                <button type="button" onClick={() => setSelected(null)} className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800">Dismiss</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
