import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/button';
import { Printer, Save, MessageSquare, Copy, Check, Download } from 'lucide-react';
import { InvoiceItem } from '../types/invoice';
import { useSettings } from '../../settings/hooks/useSettings';
import { cn } from '@/lib/utils';
import { toast } from 'sonner'; // Assuming sonner is available or use a simple alert/toast logic

interface InvoicePreviewProps {
  invoiceNumber: string;
  invoiceDate: string;
  customerName: string;
  customerAddress: string;
  items: InvoiceItem[];
  invoiceLang?: string;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  invoiceNumber,
  invoiceDate,
  customerName,
  customerAddress,
  items,
  invoiceLang = 'ar'
}) => {
  const { i18n, t } = useTranslation();
  const { settings } = useSettings();
  const [copied, setCopied] = useState(false);

  const isDocRTL = invoiceLang === 'ar';

  // VAT Behavior flags
  const showTVA = settings.vatBehavior === 'show';
  const isInclusive = settings.vatBehavior === 'inclusive';
  const rawVatRate = Number(settings.defaultVatRate);
  const vatRate = isNaN(rawVatRate) ? 0 : rawVatRate;

  // Helper to get translation
  const getDocT = (path: string, defaultValue?: string) => {
    const keys = path.split('.');
    let result: any = i18n.getResourceBundle(invoiceLang, 'translation');
    for (const key of keys) {
      if (!result) break;
      result = result[key];
    }
    return result || defaultValue || path;
  };

  /**
   * CALCULATIONS
   */
  const processedItems = items.map(item => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 0;
    const priceHT = isInclusive ? price / (1 + vatRate / 100) : price;
    const totalHT = priceHT * qty;
    const totalTTC = isInclusive ? price * qty : totalHT * (1 + vatRate / 100);
    const taxAmount = totalTTC - totalHT;

    return { ...item, priceHT, totalHT, totalTTC, taxAmount };
  });

  const subtotalHT = processedItems.reduce((sum, item) => sum + item.totalHT, 0);
  const grandTotalTTC = processedItems.reduce((sum, item) => sum + item.totalTTC, 0);

  const formatAmount = (amount: number) => {
    let formatted = new Intl.NumberFormat('fr-DZ', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    if (settings.numberFormat === 'comma') formatted = formatted.replace(/\s/g, ',');
    else if (settings.numberFormat === 'none') formatted = formatted.replace(/\s/g, '');

    const currency = getDocT('invoiceItem.currency');
    return settings.currencyPlacement === 'before' ? `${currency} ${formatted}` : `${formatted} ${currency}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Intl.DateTimeFormat('fr-DZ', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(dateString));
  };

  // --- SMART FEATURES ---

  // 1. Smart Filename
  useEffect(() => {
    const originalTitle = document.title;
    const cleanCustomer = customerName ? customerName.replace(/[^a-z0-9\u0600-\u06FF]/gi, '_') : 'Client';
    const smartName = `Invoice-${invoiceNumber || 'Draft'}-${cleanCustomer}`;
    document.title = smartName;
    return () => { document.title = originalTitle; };
  }, [invoiceNumber, customerName]);

  const handlePrint = () => window.print();

  // 2. WhatsApp Share
  const handleShareWhatsApp = () => {
    const text = `*Invoice #${invoiceNumber}*\nDate: ${formatDate(invoiceDate)}\nClient: ${customerName}\n\n*Total: ${formatAmount(grandTotalTTC)}*\n\nThank you for your business!`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // 3. Copy Summary
  const handleCopySummary = () => {
    const text = `Invoice #${invoiceNumber}\nDate: ${formatDate(invoiceDate)}\nClient: ${customerName}\nTotal: ${formatAmount(grandTotalTTC)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("bg-white rounded-lg p-8 invoice-paper print:shadow-none printable-invoice min-h-[1100px]", isDocRTL ? "rtl" : "ltr")} dir={isDocRTL ? "rtl" : "ltr"}>
      {/* ... (Header Content - Unchanged mostly) ... */}

      {/* === HEADER ROW: Logo + Invoice Title/Number/Date === */}
      <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-dz-green/20">
        {/* Left: Logo (if exists) */}
        <div className="flex-shrink-0">
          {settings.logo ? (
            <img
              src={settings.logo}
              alt="Logo"
              className="h-16 w-auto object-contain print:h-14"
              style={{ maxWidth: '150px' }}
            />
          ) : (
            settings.businessName && (
              <p className="text-xl font-black text-dz-dark">{settings.businessName}</p>
            )
          )}
        </div>

        {/* Right: Invoice Title + Number + Date */}
        <div className="text-end">
          <h1 className="text-3xl font-black text-dz-green tracking-tight leading-none uppercase">
            {getDocT('invoiceHeader.title')}
          </h1>
          <div className="flex items-center justify-end gap-3 mt-2">
            <span className="text-xs text-gray-400">{getDocT('invoiceHeader.number')}</span>
            <span className="text-lg font-black text-dz-dark num-ltr">#{invoiceNumber || '---'}</span>
          </div>
          <p className="text-sm text-gray-500 num-ltr mt-1">{formatDate(invoiceDate)}</p>
        </div>
      </div>

      {/* === TWO-COLUMN: Business Info (FROM) | Customer Info (TO) === */}
      <div className={cn("grid grid-cols-2 gap-6 mb-6", isDocRTL ? "text-right" : "text-left")}>
        {/* Column 1: Issuer/Business Info */}
        <div className="space-y-1.5 border-e border-gray-200 pe-4">
          <p className="text-xs font-bold text-dz-green uppercase tracking-widest mb-3">
            {getDocT('preview.issuer', 'المُصدر')}
          </p>
          {settings.businessName && (
            <p className="text-base font-black text-dz-dark">{settings.businessName}</p>
          )}
          {settings.businessAddress && (
            <p className="text-sm text-gray-600">{settings.businessAddress}</p>
          )}
          {settings.businessPhone && (
            <p className="text-sm text-gray-600 num-ltr" dir="ltr">{settings.businessPhone}</p>
          )}
          <div className="flex flex-wrap gap-x-4 mt-2 text-xs font-mono text-gray-500">
            {settings.businessNIF && <span dir="ltr">NIF: {settings.businessNIF}</span>}
            {settings.businessRC && <span dir="ltr">RC: {settings.businessRC}</span>}
          </div>
        </div>

        {/* Column 2: Customer Info */}
        <div className="space-y-1.5 ps-4">
          <p className="text-xs font-bold text-dz-green uppercase tracking-widest mb-3">
            {getDocT('customerInfo.title')}
          </p>
          <p className="text-base font-black text-dz-dark">{customerName || getDocT('invoiceHeader.unspecified')}</p>
          <p className="text-sm text-gray-600 whitespace-pre-line">{customerAddress}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-10 overflow-hidden rounded-2xl border border-gray-100 shadow-sm shadow-dz-dark/5">
        <table className="w-full text-sm">
          <thead className="bg-dz-green/5 text-dz-dark">
            <tr>
              <th className="text-start py-5 px-6 font-black uppercase tracking-widest text-[11px] border-b border-gray-100">{getDocT('invoiceItem.description')}</th>
              <th className="text-center py-5 px-6 font-black uppercase tracking-widest text-[11px] border-b border-gray-100">{getDocT('invoiceItem.quantity')}</th>
              <th className="text-center py-5 px-6 font-black uppercase tracking-widest text-[11px] border-b border-gray-100">
                {getDocT('invoiceItem.price')} <span className="text-dz-green opacity-60">({isInclusive ? 'TTC' : 'HT'})</span>
              </th>
              <th className="text-end py-5 px-6 font-black uppercase tracking-widest text-[11px] border-b border-gray-100">{getDocT('invoiceItem.total')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/50">
            {processedItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/30 transition-colors">
                <td className="py-5 px-6 text-start text-gray-700 whitespace-pre-line font-sans leading-relaxed">{item.description || getDocT('invoiceHeader.unspecified')}</td>
                <td className="py-5 px-6 text-center text-dz-dark font-bold">
                  <span className="num-ltr">{item.quantity}</span>
                </td>
                <td className="py-5 px-6 text-center text-gray-600 font-medium whitespace-nowrap">
                  <span className="num-ltr">{formatAmount(item.price)}</span>
                </td>
                <td className="py-5 px-6 text-end font-black text-dz-dark whitespace-nowrap">
                  <span className="num-ltr">{formatAmount(item.totalTTC)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div className="flex justify-end mb-12">
        <div className="w-80 space-y-3">
          {/* Subtotal row (only if we have tax details to show) */}
          {(showTVA || isInclusive) && vatRate > 0 && (
            <div className="flex justify-between items-center px-4 py-2 bg-gray-50/50 rounded-xl">
              <span className="text-gray-400 font-black text-[10px] uppercase tracking-widest">{getDocT('invoiceItem.subtotal')} (HT)</span>
              <span className="num-ltr font-bold text-gray-700">{formatAmount(subtotalHT)}</span>
            </div>
          )}

          {/* VAT row (hidden if 0%) */}
          {(showTVA || isInclusive) && vatRate > 0 && (
            <div className="flex justify-between items-center px-4 py-2 bg-dz-green/10 rounded-xl">
              <span className="text-dz-green/60 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                {getDocT('invoiceItem.tax')}
                <span className="bg-dz-green text-white px-1.5 py-0.5 rounded text-[9px]">{vatRate}%</span>
              </span>
              <span className="num-ltr font-black text-dz-green">{formatAmount(processedItems.reduce((sum, item) => sum + item.taxAmount, 0))}</span>
            </div>
          )}

          {/* Grand Total */}
          <div className="pt-4 relative">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-dz-dark font-black uppercase tracking-tighter text-xs">{getDocT('invoiceItem.grandTotal')} (TTC)</span>
              <span className="text-dz-green num-ltr text-4xl md:text-5xl font-black tracking-tighter">{formatAmount(grandTotalTTC)}</span>
            </div>
            <div className="h-1 w-full bg-dz-green/20 rounded-full mt-2"></div>
          </div>
        </div>
      </div>

      {/* Footer / Notes */}
      {settings.defaultFooter && (
        <div className="mb-16 p-8 bg-gray-50/80 border-s-4 border-dz-green rounded-r-2xl text-start relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-5">
            <Printer className="h-12 w-12" />
          </div>
          <p className="whitespace-pre-line text-sm text-gray-600 font-medium italic leading-loose">
            {settings.defaultFooter}
          </p>
        </div>
      )}

      {/* Final Branding & Print Control (Hidden when printing) */}
      <div className="border-t border-dashed border-gray-200 pt-10 text-center text-gray-400 print:mb-10">
        <p className="mb-4 font-bold text-dz-dark/40 uppercase tracking-widest text-xs">{getDocT('preview.thankYou')}</p>
        <div className="text-[10px] flex justify-center items-center gap-4 opacity-40 font-black uppercase tracking-[0.3em]">
          <span>{getDocT('appTitle')}</span>
          <div className="h-1.5 w-1.5 bg-gray-300 rounded-full"></div>
          <span className="num-ltr">© {new Date().getFullYear()}</span>
        </div>
      </div>

      {/* === ACTION BUTTONS (Hidden in Print) === */}
      <div className="print:hidden mt-20 flex flex-wrap justify-center items-center gap-4">
        {/* WhatsApp */}
        <Button
          onClick={handleShareWhatsApp}
          variant="outline"
          className="h-16 px-8 rounded-2xl gap-3 border-gray-200 text-gray-500 hover:text-green-600 hover:border-green-200 hover:bg-green-50"
          title="Share on WhatsApp"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="hidden md:inline font-bold">WhatsApp</span>
        </Button>

        {/* Copy */}
        <Button
          onClick={handleCopySummary}
          variant="outline"
          className="h-16 px-8 rounded-2xl gap-3 border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50"
          title="Copy Summary"
        >
          {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
          <span className="hidden md:inline font-bold">{copied ? 'Copied' : 'Copy'}</span>
        </Button>

        {/* Print / Save PDF */}
        <div className="flex gap-2 bg-dz-green p-1.5 rounded-[1.5rem] shadow-2xl shadow-dz-green/30 hover:scale-105 transition-transform">
          <Button
            onClick={handlePrint}
            className="h-14 px-8 text-lg font-black bg-transparent hover:bg-white/10 text-white rounded-2xl gap-3"
          >
            <Download className="h-5 w-5" />
            {t('buttons.savePdf', 'Save PDF')}
          </Button>
          <div className="w-px bg-white/20 my-2"></div>
          <Button
            onClick={handlePrint}
            className="h-14 px-6 bg-transparent hover:bg-white/10 text-white rounded-2xl"
            title={getDocT('buttons.print')}
          >
            <Printer className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
