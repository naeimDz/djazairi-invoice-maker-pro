
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { UserCheck } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface CustomerInfoProps {
  customerName: string;
  setCustomerName: (value: string) => void;
  customerAddress: string;
  setCustomerAddress: (value: string) => void;
  onRecallLast: () => void;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({
  customerName,
  setCustomerName,
  customerAddress,
  setCustomerAddress,
  onRecallLast
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="mb-8 border border-gray-100 rounded-2xl p-6 bg-white shadow-sm relative overflow-hidden group" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex justify-between items-start mb-6 gap-4">
        <h2 className="text-xl font-black text-dz-dark flex items-center gap-2 text-start flex-1">
          <span className="h-2 w-2 bg-dz-green rounded-full shrink-0"></span>
          {t('customerInfo.title')}
        </h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRecallLast}
          className="h-8 rounded-lg text-[10px] font-black uppercase tracking-wider border-dashed border-gray-200 text-gray-400 hover:text-dz-green hover:border-dz-green/30 hover:bg-dz-green/5 gap-1.5 transition-all opacity-0 group-hover:opacity-100 whitespace-nowrap"
        >
          <UserCheck className="h-3 w-3" />
          {t('settings.recallLast')}
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-2 text-start">
          <label htmlFor="customerName" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1 opacity-60">
            {t('customerInfo.namePlaceholder')}
          </label>
          <Input
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder={t('customerInfo.namePlaceholder')}
            className="h-14 bg-gray-50/30 border-gray-100 focus:bg-white focus:border-dz-green focus:ring-dz-green/20 transition-all rounded-xl text-start font-bold"
          />
        </div>

        <div className="flex flex-col gap-2 text-start">
          <label htmlFor="customerAddress" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1 opacity-60">
            {t('customerInfo.addressPlaceholder')}
          </label>
          <Textarea
            id="customerAddress"
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
            placeholder={t('customerInfo.addressPlaceholder')}
            className="resize-none h-32 bg-gray-50/30 border-gray-100 focus:bg-white focus:border-dz-green focus:ring-dz-green/20 transition-all rounded-xl text-start font-medium leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;
