
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Globe, Copy, CheckCircle2, Clock, Send } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';

interface InvoiceHeaderProps {
  invoiceNumber: string;
  setInvoiceNumber: (value: string) => void;
  invoiceDate: string;
  setInvoiceDate: (value: string) => void;
  invoiceLang: string;
  setInvoiceLang: (value: string) => void;
  status: 'draft' | 'sent' | 'paid';
  setStatus: (status: 'draft' | 'sent' | 'paid') => void;
  duplicateInvoice: () => void;
  createNewInvoice: () => void;
  isSaving: boolean;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({
  invoiceNumber,
  setInvoiceNumber,
  invoiceDate,
  setInvoiceDate,
  invoiceLang,
  setInvoiceLang,
  status,
  setStatus,
  duplicateInvoice,
  createNewInvoice,
  isSaving
}) => {
  const { t, i18n } = useTranslation();

  // UI direction follows app language, NOT the invoice document language
  const isUIRTL = i18n.language === 'ar';

  const langOptions = [
    { code: 'ar', label: 'العربية' },
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' }
  ];

  const statusColors = {
    draft: "bg-gray-100 text-gray-500",
    sent: "bg-blue-100 text-blue-600",
    paid: "bg-green-100 text-green-600"
  };

  const statusIcons = {
    draft: <Clock className="h-3 w-3" />,
    sent: <Send className="h-3 w-3" />,
    paid: <CheckCircle2 className="h-3 w-3" />
  };

  return (
    <div className="flex flex-col gap-6" dir={isUIRTL ? 'rtl' : 'ltr'}>
      {/* === Primary Toolbar: Language & Status (Compact, Top) === */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        {/* Left: Language Switcher (Minimal) */}
        <div className="flex items-center gap-1.5">
          {langOptions.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setInvoiceLang(lang.code)}
              className={cn(
                "h-8 w-8 rounded-full text-[10px] font-black uppercase transition-all flex items-center justify-center",
                invoiceLang === lang.code
                  ? "bg-dz-green text-white shadow-lg shadow-dz-green/30"
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200"
              )}
              title={lang.label}
            >
              {lang.code.substring(0, 2).toUpperCase()}
            </button>
          ))}
        </div>

        {/* Right: Status Chips (Clean, Icon-focused) */}
        <div className="flex items-center gap-1.5">
          {(['draft', 'sent', 'paid'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={cn(
                "h-8 px-3 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-all",
                status === s
                  ? statusColors[s] + " shadow-sm"
                  : "bg-gray-50 text-gray-400 hover:bg-gray-100"
              )}
            >
              {statusIcons[s]}
              <span className="hidden sm:inline">{t(`settings.status${s.charAt(0).toUpperCase() + s.slice(1)}`)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* === Hero Section: Title + Actions (Clean, Breathable) === */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-gray-100/50">
        {/* Title + Save Indicator */}
        <div className="flex items-baseline gap-4 flex-wrap">
          <h1 className="text-5xl md:text-7xl font-black font-heading text-dz-green tracking-tighter leading-none animate-in fade-in slide-in-from-s-4 duration-700">
            {t('invoiceHeader.title')}
          </h1>

          {/* Minimal Save Indicator (Inline with Title) */}
          <span className={cn(
            "text-[9px] font-bold uppercase tracking-widest transition-all",
            isSaving ? "text-gray-400 animate-pulse" : "text-gray-300"
          )}>
            {isSaving ? t('common.saving', '●') : <CheckCircle2 className="h-3 w-3 inline opacity-50" />}
          </span>
        </div>

        {/* Invoice Metadata Inputs (Number + Date) */}
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <label htmlFor="invoiceNumber" className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">
              {t('invoiceHeader.number')}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 start-3 flex items-center text-gray-400 text-sm font-bold pointer-events-none">#</span>
              <Input
                id="invoiceNumber"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="ps-8 h-11 w-28 bg-white border-gray-200 focus:border-dz-green focus:ring-dz-green/20 rounded-xl font-bold text-lg"
                placeholder="001"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="invoiceDate" className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">
              {t('invoiceHeader.date')}
            </label>
            <div className="relative">
              <Input
                id="invoiceDate"
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="h-11 w-40 bg-white border-gray-200 focus:border-dz-green focus:ring-dz-green/20 rounded-xl font-medium num-ltr"
              />
            </div>
          </div>

          {/* Quick Actions: Grouped Minimally */}
          <div className="flex items-center gap-1 ms-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={duplicateInvoice}
              className="h-10 w-10 text-gray-400 hover:text-dz-green hover:bg-dz-green/5 rounded-xl"
              title={t('settings.duplicate')}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={createNewInvoice}
              className="h-10 px-4 text-xs font-bold text-dz-green hover:bg-dz-green hover:text-white rounded-xl transition-all"
            >
              + {t('common.newInvoice', 'جديد')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeader;
