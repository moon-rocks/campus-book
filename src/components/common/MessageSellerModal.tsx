import React, { useState } from 'react';
import { X, MessageSquare, ShieldCheck, Send, CheckCircle2 } from 'lucide-react';
import { Book } from '../../types';
import { api } from '../../services/api';
import { useMarketplace } from '../../context/MarketplaceContext';

interface MessageSellerModalProps {
  book: Book | null;
  onClose: () => void;
}

export const MessageSellerModal: React.FC<MessageSellerModalProps> = ({ book, onClose }) => {
  const { showToast } = useMarketplace();
  const [buyerName, setBuyerName] = useState('');
  const [buyerContact, setBuyerContact] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerMessage, setBuyerMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (!book) return null;

  const handleSubmitInquiry = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!buyerName.trim() || !buyerEmail.trim() || !buyerContact.trim() || !buyerMessage.trim()) return;
    setIsSending(true);
    try {
      await api.createInquiry(book, { name: buyerName.trim(), email: buyerEmail.trim(), phone: buyerContact.trim() }, buyerMessage.trim());
      setIsSubmitted(true);
      showToast('Your request was sent to the admin for review.', 'success');
    } catch (error) {
      console.error('Unable to send inquiry:', error);
      const message = error instanceof Error && error.message.includes('already have')
        ? error.message
        : 'Unable to send the inquiry. Please try again.';
      showToast(message, 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm overflow-y-auto animate-fadeIn" onClick={onClose}>
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 my-8" onClick={(event) => event.stopPropagation()}>
        <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors" aria-label="Close modal">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-5 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner shrink-0"><MessageSquare className="w-6 h-6" /></div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 leading-tight">Send Message</h3>
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{book.title} • ₹{book.price}</p>
          </div>
        </div>

        <div className="mb-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 p-4 text-xs text-indigo-950 flex gap-2.5">
          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <p>Your contact details are saved with the request. The admin will review your request and can contact the seller by email.</p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmitInquiry} className="space-y-3.5 bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Your Name</label>
                <input type="text" required value={buyerName} onChange={(event) => setBuyerName(event.target.value)} placeholder="e.g. Rahul Kumar" className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Your Gmail *</label>
                <input type="email" required value={buyerEmail} onChange={(event) => setBuyerEmail(event.target.value)} placeholder="yourname@gmail.com" className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Mobile Number *</label>
                <input type="tel" required inputMode="tel" pattern="[0-9+() -]{7,}" value={buyerContact} onChange={(event) => setBuyerContact(event.target.value)} placeholder="e.g. 9876543210" className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Message</label>
              <textarea required rows={4} value={buyerMessage} onChange={(event) => setBuyerMessage(event.target.value)} placeholder={`Hi, I am interested in "${book.title}".`} className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none" />
            </div>
            <button type="submit" disabled={isSending} className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-wait">
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'Sending...' : 'Send Message'}</span>
            </button>
          </form>
        ) : (
          <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 text-center space-y-3 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center"><CheckCircle2 className="w-6 h-6" /></div>
            <h4 className="font-display font-bold text-base text-emerald-950">Message Sent</h4>
            <p className="text-xs text-emerald-800">Your request has been recorded. The admin can now contact the seller using the seller's Gmail.</p>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />Admin-reviewed request</span>
          <button onClick={onClose} className="font-bold text-slate-700 hover:text-slate-900">Close</button>
        </div>
      </div>
    </div>
  );
};
