
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { useTranslation } from 'react-i18next';
import InvoiceHeader from './InvoiceHeader';
import CustomerInfo from './CustomerInfo';
import InvoiceItem from './InvoiceItem';
import InvoicePreview from './InvoicePreview';
import { Button } from '@/shared/ui/button';
import { useInvoice } from '../hooks/useInvoice';
import { useProductHistory } from '../hooks/useProductHistory';
import { useSettings } from '../../settings/hooks/useSettings';
import { addProductService } from '@/core/localDbService';
import { cn } from '@/lib/utils';
import { InvoiceItem as InvoiceItemType } from '../types/invoice';

const InvoiceForm: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { recentProducts, saveProduct } = useProductHistory();
  const {
    invoiceNumber,
    setInvoiceNumber,
    invoiceDate,
    setInvoiceDate,
    customerName,
    setCustomerName,
    customerAddress,
    setCustomerAddress,
    invoiceLang,
    setInvoiceLang,
    items,
    status,
    setStatus,
    addItem,
    updateItem,
    removeItem,
    duplicateInvoice,
    recallLastCustomer,
    createNewInvoice,
    isSaving
  } = useInvoice();

  const [activeTab, setActiveTab] = React.useState('edit');

  // UI direction follows APP language (from URL), NOT invoice document language
  const isAppRTL = i18n.language === 'ar';

  return (
    <div className="min-h-screen pt-4 pb-20" dir={isAppRTL ? 'rtl' : 'ltr'}>
      {/* Page Header */}
      <div className="max-w-5xl mx-auto mb-10 px-4 print:hidden">
        <div className="flex flex-col items-center justify-center text-center space-y-4 pb-8 border-b border-gray-100/50">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dz-green/10 text-dz-green text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-dz-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-dz-green"></span>
              </span>
              {t('appTitle')}
            </div>
            <div className="inline-flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
              <div className="h-1 w-1 bg-gray-300 rounded-full animate-pulse"></div>
              {t('common.autoSaved', 'Auto-saved')}
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-dz-dark tracking-tighter leading-tight">
            {activeTab === 'edit' ? t('tabs.edit') : t('tabs.preview')} <span className="text-dz-green">.</span>
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-100 p-1 mb-8 shadow-sm rounded-xl max-w-sm mx-auto print:hidden">
            <TabsTrigger value="edit" className="rounded-lg py-2.5 font-bold data-[state=active]:bg-dz-green data-[state=active]:text-white transition-all">
              {t('tabs.edit')}
            </TabsTrigger>
            <TabsTrigger value="preview" className="rounded-lg py-2.5 font-bold data-[state=active]:bg-dz-green data-[state=active]:text-white transition-all">
              {t('tabs.preview')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="mt-0 ring-0 focus-visible:ring-0">
            <FormContent
              invoiceNumber={invoiceNumber} setInvoiceNumber={setInvoiceNumber}
              invoiceDate={invoiceDate} setInvoiceDate={setInvoiceDate}
              customerName={customerName} setCustomerName={setCustomerName}
              customerAddress={customerAddress} setCustomerAddress={setCustomerAddress}
              items={items}
              addItem={addItem}
              updateItem={updateItem}
              removeItem={removeItem}
              invoiceLang={invoiceLang} setInvoiceLang={setInvoiceLang}
              status={status} setStatus={setStatus}
              duplicateInvoice={duplicateInvoice}
              recallLastCustomer={recallLastCustomer}
              recentProducts={recentProducts.map(p => p.name)}
              onContinue={() => {
                items.forEach(item => saveProduct(item));
                setActiveTab('preview');
              }}
              createNewInvoice={createNewInvoice}
              isSaving={isSaving}
            />
          </TabsContent>

          <TabsContent value="preview" className="mt-0 ring-0 focus-visible:ring-0 px-4">
            <div className="bg-dz-pattern rounded-2xl overflow-hidden shadow-2xl border border-gray-100 max-w-4xl mx-auto">
              <InvoicePreview
                invoiceNumber={invoiceNumber}
                invoiceDate={invoiceDate}
                customerName={customerName}
                customerAddress={customerAddress}
                items={items}
                invoiceLang={invoiceLang}
              />
            </div>

            <div className="mt-8 flex justify-center print:hidden">
              <Button
                variant="ghost"
                onClick={() => setActiveTab('edit')}
                className="text-gray-400 hover:text-dz-dark font-bold gap-2 items-center"
              >
                <span className={isAppRTL ? "rotate-180" : ""}>←</span> {t('common.backToEdit', 'Back to Editing')}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="hidden print:block printable-invoice">
        <InvoicePreview
          invoiceNumber={invoiceNumber}
          invoiceDate={invoiceDate}
          customerName={customerName}
          customerAddress={customerAddress}
          items={items}
          invoiceLang={invoiceLang}
        />
      </div>
    </div>
  );
};

interface FormContentProps {
  invoiceNumber: string;
  setInvoiceNumber: (v: string) => void;
  invoiceDate: string;
  setInvoiceDate: (v: string) => void;
  customerName: string;
  setCustomerName: (v: string) => void;
  customerAddress: string;
  setCustomerAddress: (v: string) => void;
  items: InvoiceItemType[];
  addItem: () => void;
  updateItem: (id: string, field: keyof InvoiceItemType, value: string | number) => void;
  removeItem: (id: string) => void;
  invoiceLang: string;
  setInvoiceLang: (v: string) => void;
  status: 'draft' | 'sent' | 'paid';
  setStatus: (s: 'draft' | 'sent' | 'paid') => void;
  duplicateInvoice: () => void;
  recallLastCustomer: () => void;
  recentProducts: string[];
  onContinue: () => void;
  createNewInvoice: () => void;
  isSaving: boolean;
}

const FormContent: React.FC<FormContentProps> = ({
  invoiceNumber, setInvoiceNumber,
  invoiceDate, setInvoiceDate,
  customerName, setCustomerName,
  customerAddress, setCustomerAddress,
  items, addItem, updateItem, removeItem,
  invoiceLang, setInvoiceLang,
  status, setStatus,
  duplicateInvoice,
  recallLastCustomer,
  descriptionHistory,
  onContinue,
  createNewInvoice,
  isSaving
}) => {
  const { t, i18n } = useTranslation();
  // UI direction (arrows) follows APP language
  const isAppRTL = i18n.language === 'ar';

  const handleSaveProducts = async (itemsToSave: InvoiceItemType[]) => {
    // Save all products to IndexedDB
    for (const item of itemsToSave) {
      if (item.description && item.price > 0) {
        await addProductService({ name: item.description, price: item.price });
      }
    }
  };

  const handleContinueAndSave = async () => {
    // Save all products before continuing to preview
    await handleSaveProducts(items);
    onContinue();
  };

  return (
    <div className="space-y-8 pb-12 px-4">
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl shadow-dz-dark/5 border border-gray-100 space-y-10">
        <InvoiceHeader
          invoiceNumber={invoiceNumber}
          setInvoiceNumber={setInvoiceNumber}
          invoiceDate={invoiceDate}
          setInvoiceDate={setInvoiceDate}
          invoiceLang={invoiceLang}
          setInvoiceLang={setInvoiceLang}
          status={status}
          setStatus={setStatus}
          duplicateInvoice={duplicateInvoice}
          createNewInvoice={async () => {
            // Save all products before creating new invoice
            await handleSaveProducts(items);
            createNewInvoice();
          }}
          isSaving={isSaving}
        />

        <CustomerInfo
          customerName={customerName}
          setCustomerName={setCustomerName}
          customerAddress={customerAddress}
          setCustomerAddress={setCustomerAddress}
          onRecallLast={recallLastCustomer}
        />

        <div className="space-y-6">
          <h2 className="text-2xl font-black text-dz-dark flex items-center gap-3 text-start">
            <span className="h-3 w-3 bg-dz-green rounded-full shadow-lg shadow-dz-green/40"></span>
            {t('invoiceItem.description', 'Items & Services')}
          </h2>
          <InvoiceItem
            items={items}
            onAdd={addItem}
            onUpdate={updateItem}
            onRemove={removeItem}
            descriptionHistory={descriptionHistory}
            invoiceLang={invoiceLang}
            onSaveProducts={handleSaveProducts}
          />
        </div>

        <div className="pt-10 border-t border-gray-50 flex justify-center md:justify-end">
          <Button
            onClick={handleContinueAndSave}
            className="h-14 px-10 text-lg font-black bg-dz-green hover:bg-dz-green/90 shadow-2xl shadow-dz-green/20 rounded-2xl group transition-all hover:scale-105 active:scale-95"
          >
            {t('buttons.previewInvoice')}
            <span className={cn(
              "ms-2 opacity-30 transition-transform",
              isAppRTL ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"
            )}>
              {isAppRTL ? "←" : "→"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default InvoiceForm;
