import React from 'react';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export const Toast: React.FC = () => {
  const { toast } = useMarketplace();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-500 shrink-0" />,
    error: <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />,
  };

  const borderColors = {
    success: 'border-emerald-200 bg-white text-slate-800 shadow-emerald-500/10',
    info: 'border-indigo-200 bg-white text-slate-800 shadow-indigo-500/10',
    error: 'border-rose-200 bg-white text-slate-800 shadow-rose-500/10',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div
        className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-xl ${
          borderColors[toast.type]
        } transition-all`}
      >
        {icons[toast.type]}
        <p className="text-sm font-semibold">{toast.message}</p>
      </div>
    </div>
  );
};
