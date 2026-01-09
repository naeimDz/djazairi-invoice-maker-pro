
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { UserCheck, ChevronDown } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { addClient } from '@/core/localDbService';
import { useClientHistory } from '../hooks/useClientHistory';

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
  const { recentClients, searchClients } = useClientHistory();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<typeof recentClients>([]);

  // Auto-save client when name changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (customerName && customerName.trim()) {
        addClient({
          name: customerName,
          address: customerAddress || undefined
        });
      }
    }, 1000); // Debounce by 1 second
    return () => clearTimeout(timer);
  }, [customerName, customerAddress]);

  // Update suggestions based on input
  useEffect(() => {
    if (customerName) {
      setSuggestions(searchClients(customerName));
    } else {
      setSuggestions(recentClients.slice(0, 5));
    }
  }, [customerName, recentClients, searchClients]);

  const handleSelectSuggestion = (client: typeof recentClients[0]) => {
    setCustomerName(client.name);
    setCustomerAddress(client.address || '');
    setShowSuggestions(false);
  };

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
        <div className="flex flex-col gap-2 text-start relative">
          <label htmlFor="customerName" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1 opacity-60">
            {t('customerInfo.namePlaceholder')}
          </label>
          <div className="relative">
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder={t('customerInfo.namePlaceholder')}
              className="h-14 bg-gray-50/30 border-gray-100 focus:bg-white focus:border-dz-green focus:ring-dz-green/20 transition-all rounded-xl text-start font-bold"
              list={showSuggestions ? undefined : 'clientSuggestions'}
            />

            {/* Autocomplete Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-100 rounded-lg shadow-lg z-50 overflow-hidden">
                {suggestions.map((client, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSuggestion(client)}
                    className="w-full text-start px-4 py-2.5 hover:bg-dz-green/5 transition-colors border-b border-gray-100 last:border-b-0 flex items-center justify-between group"
                  >
                    <div className="flex-1">
                      <div className="font-bold text-sm text-dz-dark">{client.name}</div>
                      {client.phone && <div className="text-xs text-gray-400">{client.phone}</div>}
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-300 group-hover:text-dz-green transform -rotate-90" />
                  </button>
                ))}
              </div>
            )}
          </div>
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
