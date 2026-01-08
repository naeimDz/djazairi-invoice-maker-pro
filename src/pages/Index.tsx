
import React from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import InvoiceForm from '@/features/invoice/components/InvoiceForm';
import InvoiceArchiveView from '@/features/invoice/components/InvoiceArchiveView';
import SettingsView from '@/features/settings/components/SettingsView';

interface IndexProps {
  view?: 'invoices' | 'settings' | 'dashboard' | 'help';
}

const Index: React.FC<IndexProps> = ({ view = 'invoices' }) => {
  return (
    <DashboardLayout activeView={view}>
      <div className="max-w-7xl mx-auto">
        {view === 'invoices' && <InvoiceForm />}
        {view === 'settings' && <SettingsView />}
        {view === 'dashboard' && <InvoiceArchiveView />}
        {view === 'help' && <div className="p-20 text-center"><h2 className="text-4xl font-black text-dz-dark opacity-10 uppercase tracking-tighter">Help & Support Coming Soon</h2></div>}
      </div>
    </DashboardLayout>
  );
};

export default Index;
