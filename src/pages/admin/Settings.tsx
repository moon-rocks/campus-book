import React, { useEffect, useState } from 'react';
import { Settings as SettingsIcon, ShieldCheck, Save } from 'lucide-react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminNavbar } from '../../components/admin/AdminNavbar';
import { api } from '../../services/api';
import { MarketplaceSettings } from '../../types';

const labels: Array<{ key: keyof MarketplaceSettings; title: string; description: string }> = [
  { key: 'buyerMobileRequired', title: 'Buyer Mobile Required', description: 'Require a valid-looking mobile number on every inquiry. No OTP is used.' },
  { key: 'adminInquiryApproval', title: 'Admin Inquiry Approval', description: 'Hold new inquiries for moderation before notifying the seller.' },
  { key: 'privateConversation', title: 'Private Conversation', description: 'Enable buyer-seller conversations only after the inquiry workflow allows them.' },
  { key: 'smsNotification', title: 'SMS Notification', description: 'Use an SMS provider only when credentials are configured.' },
  { key: 'contactSharing', title: 'Contact Sharing', description: 'Keep buyer and seller phone numbers private from public listings.' },
  { key: 'antiSpamProtection', title: 'Anti-Spam Protection', description: 'Apply duplicate inquiry and lightweight rate-limit safeguards.' },
];

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<MarketplaceSettings | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getMarketplaceSettings().then(setSettings);
  }, []);

  const toggle = async (key: keyof MarketplaceSettings) => {
    if (!settings) return;
    const value = !settings[key];
    setSaving(key);
    await api.updateMarketplaceSetting(key, value);
    setSettings({ ...settings, [key]: value });
    setSaving(null);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar title="Marketplace Settings" subtitle="Configure inquiry privacy, moderation, and communication behavior" />
        <main className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto">
          <div className="bg-indigo-50 border border-indigo-200 rounded-3xl p-5 flex items-start gap-3 text-xs text-indigo-950">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
            <p>These settings are stored in the backend when Supabase is configured. Contact sharing defaults to off. OTP and commission settings are intentionally not available.</p>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center"><SettingsIcon className="w-5 h-5" /></div><div><h2 className="font-display font-bold text-lg text-slate-900">Inquiry & Communication</h2><p className="text-xs text-slate-500 mt-1">Recommended defaults protect contact information while keeping the flow simple.</p></div></div>
            <div className="divide-y divide-slate-100">
              {labels.map((item) => (
                <div key={item.key} className="p-5 flex items-center justify-between gap-5">
                  <div><h3 className="text-sm font-bold text-slate-900">{item.title}</h3><p className="text-xs text-slate-500 mt-1 max-w-2xl">{item.description}</p></div>
                  <button type="button" role="switch" aria-checked={Boolean(settings?.[item.key])} onClick={() => toggle(item.key)} disabled={!settings || saving === item.key} className={`relative shrink-0 w-12 h-7 rounded-full transition-colors ${settings?.[item.key] ? 'bg-indigo-600' : 'bg-slate-300'} disabled:opacity-60`}>
                    <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${settings?.[item.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              ))}
            </div>
            {saved && <div className="p-4 border-t border-emerald-100 bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2"><Save className="w-4 h-4" />Setting saved.</div>}
          </div>
        </main>
      </div>
    </div>
  );
};
