
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/button';
import { Printer, Save } from 'lucide-react';
import { InvoiceItem } from '../types/invoice';
import { useSettings } from '../../settings/hooks/useSettings';
import { cn } from '@/lib/utils';

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
  const { i18n } = useTranslation();
  const { settings } = useSettings(); // Directly from context for real-time reactivity

  const isDocRTL = invoiceLang === 'ar';

  // VAT Behavior flags with strict casting
  const showTVA = settings.vatBehavior === 'show';
  const isInclusive = settings.vatBehavior === 'inclusive';
  const rawVatRate = Number(settings.defaultVatRate);
  const vatRate = isNaN(rawVatRate) ? 0 : rawVatRate;

  console.log(`Preview: Logic Run - VAT: ${vatRate}, Mode: ${settings.vatBehavior}`);

  // Helper to get translation for the specific document language
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
   * CALCULATIONS (Algerian Standard)
   * We calculate HT and TTC for each row to ensure precision.
   */
  const processedItems = items.map(item => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 0;

    // Logic:
    // If Inclusive: price is TTC. HT = price / (1 + vatRate/100)
    // If Not Inclusive: price is HT. TTC = price * (1 + vatRate/100)
    const priceHT = isInclusive ? price / (1 + vatRate / 100) : price;
    const totalHT = priceHT * qty;
    const totalTTC = isInclusive ? price * qty : totalHT * (1 + vatRate / 100);
    const taxAmount = totalTTC - totalHT;

    return {
      ...item,
      priceHT,
      totalHT,
      totalTTC,
      taxAmount
    };
  });

  const subtotalHT = processedItems.reduce((sum, item) => sum + item.totalHT, 0);
  const totalVAT = processedItems.reduce((sum, item) => sum + item.taxAmount, 0);
  const grandTotalTTC = processedItems.reduce((sum, item) => sum + item.totalTTC, 0);

  const handlePrint = () => window.print();

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-DZ', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };

  const formatAmount = (amount: number) => {
    let formatted = new Intl.NumberFormat('fr-DZ', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    if (settings.numberFormat === 'comma') {
      formatted = formatted.replace(/\s/g, ',');
    } else if (settings.numberFormat === 'none') {
      formatted = formatted.replace(/\s/g, '');
    }

    const currency = getDocT('invoiceItem.currency');
    return settings.currencyPlacement === 'before' ? `${currency} ${formatted}` : `${formatted} ${currency}`;
  };

  return (
    <div
      className={cn(
        "bg-white rounded-lg p-8 invoice-paper print:shadow-none printable-invoice min-h-[1100px]",
        isDocRTL ? "rtl" : "ltr"
      )}
      dir={isDocRTL ? "rtl" : "ltr"}
    >
      {/* Branding Section */}
      {settings.logo && (
        <div className={cn(
          "mb-10 flex",
          settings.logoAlignment === 'left' ? "justify-start" :
            settings.logoAlignment === 'center' ? "justify-center" : "justify-end"
        )}>
          <img src={settings.logo} alt="Business Logo" className="h-28 w-auto object-contain" />
        </div>
      )}

      {/* Header Section */}
      <div className="flex justify-between items-start mb-12 border-b-2 border-dz-green/10 pb-8">
        <div className="text-start">
          <h1 className="text-5xl font-black text-dz-green tracking-tighter leading-none mb-4 uppercase">{getDocT('invoiceHeader.title')}</h1>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">{getDocT('invoiceHeader.number')}</span>
            <span className="text-2xl font-black text-dz-dark num-ltr">#{invoiceNumber || getDocT('invoiceHeader.unspecified')}</span>
          </div>
        </div>
        <div className="text-start flex flex-col items-start gap-1 bg-dz-neutral/30 p-5 rounded-2xl border border-dz-neutral border-dashed min-w-[180px]">
          <p className="text-[10px] font-black text-dz-green/60 uppercase tracking-[0.2em]">{getDocT('invoiceHeader.date')}</p>
          <p className="text-xl font-black text-dz-dark whitespace-nowrap num-ltr">{formatDate(invoiceDate) || getDocT('invoiceHeader.unspecified')}</p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-12 bg-gray-50/50 rounded-2xl p-8 border border-gray-100 text-start">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-1.5 w-6 bg-dz-green rounded-full"></div>
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{getDocT('customerInfo.title')}</h2>
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-bold text-dz-dark font-sans">{customerName || getDocT('invoiceHeader.unspecified')}</p>
          <p className="whitespace-pre-line text-gray-500 leading-relaxed font-sans text-lg">{customerAddress || getDocT('invoiceHeader.unspecified')}</p>
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
              <span className="num-ltr font-black text-dz-green">{formatAmount(totalVAT)}</span>
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

      <div className="print:hidden mt-20 flex flex-col md:flex-row justify-center items-center gap-6">
        <Button
          onClick={handlePrint}
          className="h-18 px-14 text-2xl font-black bg-dz-green hover:bg-dz-green/90 shadow-2xl shadow-dz-green/30 rounded-3xl gap-4 transition-all hover:scale-105 active:scale-95 w-full md:w-auto"
        >
          <Printer className="h-7 w-7" />
          {getDocT('buttons.print')}
        </Button>
      </div>
    </div>
  );
};

export default InvoicePreview;
