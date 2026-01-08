
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
  duplicateInvoice
}) => {
  const { t } = useTranslation();
  const isRTL = invoiceLang === 'ar';

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
    <div className="flex flex-col gap-10" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header & Controls Integration */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 pb-10 border-b border-gray-100/50">
        <div className="space-y-6 flex-1 w-full">
          <div className="flex flex-wrap items-center gap-3 print:hidden">
            {/* Discrete Language Picker */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl w-fit">
              <Globe className="h-3.5 w-3.5 text-dz-green" />
              <div className="flex gap-1.5">
                {langOptions.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setInvoiceLang(lang.code)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all",
                      invoiceLang === lang.code
                        ? "bg-dz-green text-white shadow-md shadow-dz-green/20"
                        : "text-gray-400 hover:text-dz-dark"
                    )}
                  >
                    {lang.code}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-8 w-[1px] bg-gray-100 hidden sm:block"></div>

            {/* Status Toggle */}
            <div className="flex items-center gap-1.5 p-1 bg-gray-50 border border-gray-100 rounded-xl">
              {(['draft', 'sent', 'paid'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all",
                    status === s
                      ? statusColors[s] + " shadow-sm"
                      : "text-gray-400 hover:bg-gray-100"
                  )}
                >
                  {statusIcons[s]}
                  {t(`settings.status${s.charAt(0).toUpperCase() + s.slice(1)}`)}
                </button>
              ))}
            </div>

            <div className="h-8 w-[1px] bg-gray-100 hidden sm:block"></div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={duplicateInvoice}
                className="text-gray-400 hover:text-dz-green hover:bg-dz-green/5 transition-all outline-none focus:ring-0"
                title={t('settings.duplicate')}
              >
                <Copy className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-black font-heading text-dz-green tracking-tighter leading-none text-start animate-in fade-in slide-in-from-s-4 duration-700">
            {t('invoiceHeader.title')}
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto mt-4 lg:mt-0 animate-in fade-in slide-in-from-e-4 duration-700">
          <div className="space-y-1.5 text-start">
            <label htmlFor="invoiceNumber" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1 block opacity-60">
              {t('invoiceHeader.number')}
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 start-4 flex items-center text-gray-400 font-bold pointer-events-none transition-colors group-within:text-dz-green">#</span>
              <Input
                id="invoiceNumber"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="ps-10 h-14 bg-white border-gray-200 focus:border-dz-green focus:ring-dz-green/20 transition-all font-black text-xl rounded-2xl w-full sm:w-40 text-start"
                placeholder="001"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-start">
            <label htmlFor="invoiceDate" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1 block opacity-60">
              {t('invoiceHeader.date')}
            </label>
            <div className="relative group">
              <Calendar className="absolute top-1/2 transform -translate-y-1/2 end-4 h-5 w-5 text-gray-400 group-hover:text-dz-green group-focus-within:text-dz-green transition-colors pointer-events-none" />
              <Input
                id="invoiceDate"
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="pe-12 h-14 w-full sm:w-52 bg-white border-gray-200 focus:border-dz-green focus:ring-dz-green/20 transition-all num-ltr font-bold text-lg rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeader;
