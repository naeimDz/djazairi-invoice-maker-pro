
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { InvoiceItem as InvoiceItemType } from '../types/invoice';
import { Input } from '@/shared/ui/input';
import { ProductHistoryItem } from '../hooks/useProductHistory';

interface InvoiceItemProps {
  items: InvoiceItemType[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof InvoiceItemType, value: string | number) => void;
  onRemove: (id: string) => void;
  productSuggestions?: ProductHistoryItem[];
  invoiceLang?: string;
}

const InvoiceItem: React.FC<InvoiceItemProps> = ({
  items,
  onAdd,
  onUpdate,
  onRemove,
  productSuggestions = [],
  invoiceLang = 'ar'
}) => {
  const { t, i18n } = useTranslation();
  // UI direction should follow the APP language, not the invoice target language
  const isRTL = i18n.language === 'ar';

  const handleDescriptionChange = (id: string, value: string) => {
    onUpdate(id, 'description', value);

    // Auto-fill price if exact match found in history
    const matchedProduct = productSuggestions.find(
      p => p.name.trim().toLowerCase() === value.trim().toLowerCase()
    );

    if (matchedProduct) {
      onUpdate(id, 'price', matchedProduct.price);
    }
  };

  const handlePriceChange = (id: string, value: number) => {
    onUpdate(id, 'price', value);
  };

  return (
    <div className="mb-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-dz-green/5 text-dz-dark">
              <tr>
                <th className="px-4 py-4 text-start font-bold min-w-[200px]">{t('invoiceItem.description')}</th>
                <th className="px-4 py-4 text-center font-bold w-20 md:w-24">{t('invoiceItem.quantity')}</th>
                <th className="px-4 py-4 text-center font-bold w-28 md:w-32">{t('invoiceItem.price')}</th>
                <th className="px-4 py-4 text-end font-bold w-28 md:w-32">{t('invoiceItem.total')}</th>
                <th className="px-4 py-4 w-12 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-gray-50/50 group/row">
                  <td className="px-4 py-3 text-start">
                    <div className="relative">
                      <Input
                        value={item.description}
                        onChange={(e) => handleDescriptionChange(item.id, e.target.value)}
                        className="resize-none focus-visible:ring-dz-green border-none bg-transparent hover:bg-white focus:bg-white transition-all p-2 -ms-2 text-start font-sans h-auto min-h-[40px] w-full"
                        placeholder={t('invoiceItem.description')}
                        list={`descriptions-${item.id}`}
                      />
                      <datalist id={`descriptions-${item.id}`}>
                        {productSuggestions.map((product, idx) => (
                          <option key={idx} value={product.name} />
                        ))}
                      </datalist>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => onUpdate(item.id, 'quantity', Number(e.target.value))}
                      className="text-center focus-visible:ring-dz-green num-ltr h-10 border-gray-100 bg-gray-50/30 focus:bg-white"
                    />
                  </td>
                  <td className="px-4 py-3 align-top">
                    <Input
                      type="number"
                      min="0"
                      value={item.price}
                      onChange={(e) => handlePriceChange(item.id, Number(e.target.value))}
                      className="text-center focus-visible:ring-dz-green num-ltr h-10 border-gray-100 bg-gray-50/30 focus:bg-white"
                    />
                  </td>
                  <td className="px-4 py-4 text-end font-black whitespace-nowrap align-top opacity-80">
                    <span className="num-ltr">{(item.quantity * item.price).toFixed(2)}</span>
                  </td>
                  <td className="px-2 py-3 w-10 align-top text-center border-s border-transparent group-hover/row:border-red-50">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemove(item.id)}
                      className="h-9 w-9 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg mx-auto transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-gray-50/30 flex justify-start">
          <Button
            variant="outline"
            className="w-full md:w-auto border-dashed border-dz-green/30 text-dz-green hover:bg-dz-green/5 hover:border-dz-green font-bold px-6 h-11"
            onClick={onAdd}
          >
            + {t('invoiceItem.addItem')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceItem;
