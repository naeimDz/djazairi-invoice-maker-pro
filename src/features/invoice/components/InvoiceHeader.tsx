
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Globe, Copy, CheckCircle2, Clock, Send } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { useState } from 'react';

interface InvoiceHeaderProps {
  invoiceNumber: string;
  setInvoiceNumber: (value: string) => void;
  customerName: string;
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
  customerName,
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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // UI direction follows app language
  const isUIRTL = i18n.language === 'ar';

  const langOptions = [
    { code: 'ar', label: 'العربية' },
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' }
  ];

  const statusOptions = ['draft', 'sent', 'paid'] as const;

  const checkIfEmpty = () => {
    return !invoiceNumber && !customerName && (!invoiceDate || invoiceDate === new Date().toISOString().split('T')[0]);
  };

  const handleNewInvoiceClick = () => {
    if (checkIfEmpty()) {
      // It's already empty, no need to do anything
      return;
    }
    setShowConfirmDialog(true);
  };

  return (
    <div className="flex flex-col gap-8" dir={isUIRTL ? 'rtl' : 'ltr'}>
      {/* === Top Toolbar: Actions & Language === */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden border-b border-gray-100 pb-4">

        {/* Left: Global Actions (New / Duplicate) - High Priority */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handleNewInvoiceClick}
            className="h-9 px-4 text-xs font-bold bg-dz-green text-white hover:bg-dz-green/90 rounded-full shadow-sm shadow-dz-green/20 transition-all hover:scale-105 active:scale-95 gap-2"
          >
            <span>+</span> {t('common.newInvoice', 'New Invoice')}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={duplicateInvoice}
            className="h-9 w-9 text-gray-400 hover:text-dz-dark hover:bg-gray-100 rounded-full transition-all"
            title={t('settings.duplicate')}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        {/* Right: Language Switcher */}
        <div className="flex items-center bg-gray-50/80 p-1 rounded-full border border-gray-100/50">
          {langOptions.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setInvoiceLang(lang.code)}
              className={cn(
                "h-7 px-3 rounded-full text-[10px] font-black uppercase transition-all flex items-center justify-center relative z-10",
                invoiceLang === lang.code
                  ? "bg-white text-dz-green shadow-sm ring-1 ring-gray-200/50"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              {lang.code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* === Main Header Area === */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">

        {/* Title Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-5xl md:text-6xl font-black text-dz-dark tracking-tighter leading-none">
              {t('invoiceHeader.title')} <span className="text-dz-green">.</span>
            </h1>

            {/* Save Indicator */}
            <span className={cn(
              "text-[9px] font-bold uppercase tracking-widest mt-4 transition-all",
              isSaving ? "text-dz-green animate-pulse" : "text-gray-300"
            )}>
              {isSaving ? t('common.saving', 'SAVING...') : <CheckCircle2 className="h-4 w-4" />}
            </span>
          </div>

          {/* Segmented Status Control */}
          <div className="flex items-center bg-gray-50 border border-gray-100 p-1 rounded-xl w-fit">
            {statusOptions.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={cn(
                  "h-8 px-4 rounded-lg text-xs font-bold transition-all relative",
                  status === s
                    ? "bg-white text-dz-dark shadow-sm ring-1 ring-black/5"
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                {/* Status Dot */}
                {status === s && (
                  <span className={cn(
                    "inline-block w-1.5 h-1.5 rounded-full me-2 mb-0.5",
                    s === 'paid' ? "bg-green-500" : s === 'sent' ? "bg-blue-500" : "bg-gray-400"
                  )} />
                )}
                {t(`settings.status${s.charAt(0).toUpperCase() + s.slice(1)}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs (Number & Date) */}
        <div className="flex items-end gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
          <div className="space-y-1">
            <label htmlFor="invoiceNumber" className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block px-1">
              {t('invoiceHeader.number')}
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 start-3 flex items-center text-gray-300 group-focus-within:text-dz-green text-sm font-bold pointer-events-none transition-colors">#</span>
              <Input
                id="invoiceNumber"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="ps-7 h-10 w-24 bg-gray-50/50 border-gray-100 focus:bg-white focus:border-dz-green focus:ring-dz-green/20 rounded-xl font-bold text-base transition-all"
                placeholder="001"
              />
            </div>
          </div>

          <div className="w-px h-10 bg-gray-100 mx-1 self-center"></div>

          <div className="space-y-1">
            <label htmlFor="invoiceDate" className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block px-1">
              {t('invoiceHeader.date')}
            </label>
            <Input
              id="invoiceDate"
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="h-10 w-36 bg-gray-50/50 border-gray-100 focus:bg-white focus:border-dz-green focus:ring-dz-green/20 rounded-xl font-medium text-sm num-ltr transition-all"
            />
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black tracking-tight">{t('common.confirmNewInvoice', 'Start New Invoice?')}</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500">
              {t('common.confirmNewInvoiceDesc', 'This will clear all current details. Make sure you have finished with this invoice.')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl border-gray-100 font-bold hover:bg-gray-50">{t('common.cancel', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                createNewInvoice();
                setShowConfirmDialog(false);
              }}
              className="bg-dz-green hover:bg-dz-green/90 rounded-xl font-bold text-white shadow-lg shadow-dz-green/20"
            >
              {t('common.confirm', 'Yes, Continue')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InvoiceHeader;
