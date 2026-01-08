
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Search,
    Trash2,
    ExternalLink,
    Clock,
    FileText,
    User,
    Calendar as CalendarIcon,
    ChevronRight,
    Filter,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { db } from '@/core/db';
import { InvoiceData } from '@/features/invoice/types/invoice';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { cn } from '@/lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';

const InvoiceArchiveView: React.FC = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const isRTL = i18n.language === 'ar';
    const langPrefix = isRTL ? '/ar' : '';

    const [invoices, setInvoices] = useState<InvoiceData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'sent' | 'paid'>('all');

    const fetchInvoices = async () => {
        setIsLoading(true);
        try {
            const data = await db.getAllInvoices();
            // Sort by date (newest first)
            const sorted = (data as InvoiceData[]).sort((a, b) =>
                new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime()
            );
            setInvoices(sorted);
        } catch (e) {
            console.error("Archive: Failed to fetch invoices", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const deleteInvoice = async (sessionId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm(t('common.confirmDelete', 'Are you sure you want to delete this invoice?'))) {
            try {
                await db.delete('invoices', sessionId);
                setInvoices(prev => prev.filter(inv => inv.sessionId !== sessionId));
            } catch (err) {
                console.error("Archive: Delete failed", err);
            }
        }
    };

    const loadInvoice = (sessionId: string) => {
        localStorage.setItem('dz_active_session', sessionId);
        navigate(langPrefix || '/');
    };

    const filteredInvoices = invoices.filter(inv => {
        const matchesSearch =
            inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const statusColors = {
        draft: "bg-gray-100 text-gray-500",
        sent: "bg-blue-100 text-blue-600",
        paid: "bg-green-100 text-green-600"
    };

    if (isLoading) {
        return <div className="p-20 text-center font-black animate-pulse text-dz-green italic">RETRIEVING YOUR ARCHIVES...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-start">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black text-dz-dark tracking-tighter animate-in fade-in slide-in-from-s-4 duration-700">
                        {t('navigation.dashboard')} <span className="text-dz-green">.</span>
                    </h1>
                    <p className="text-gray-400 font-medium animate-in fade-in slide-in-from-s-4 duration-1000 delay-200">
                        {t('archive.description', 'Manage and track your issued invoices')}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto animate-in fade-in slide-in-from-e-4 duration-700">
                    <div className="relative group flex-1 sm:w-64">
                        <Search className="absolute inset-y-0 start-4 flex items-center h-full w-4 text-gray-400 group-within:text-dz-green transition-colors" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('archive.searchPlaceholder', 'Search by number or customer...')}
                            className="ps-10 h-12 bg-white border-gray-100 focus:border-dz-green focus:ring-dz-green/20 rounded-xl transition-all font-medium"
                        />
                    </div>

                    <div className="flex items-center gap-2 p-1 bg-white border border-gray-100 rounded-xl">
                        {(['all', 'draft', 'sent', 'paid'] as const).map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all whitespace-nowrap",
                                    statusFilter === s
                                        ? "bg-dz-green text-white shadow-md shadow-dz-green/20"
                                        : "text-gray-400 hover:text-dz-dark hover:bg-gray-50"
                                )}
                            >
                                {t(`settings.status${s.charAt(0).toUpperCase() + s.slice(1)}`)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {filteredInvoices.length === 0 ? (
                <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200 animate-in fade-in duration-700">
                    <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileText className="h-10 w-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-black text-dz-dark mb-2">{t('archive.emptyTitle', 'No invoices found')}</h3>
                    <p className="text-gray-400 max-w-sm mx-auto">{t('archive.emptyDesc', 'Start creating your first professional invoice today.')}</p>
                    <Button
                        onClick={() => navigate(langPrefix || '/')}
                        className="mt-8 bg-dz-green hover:bg-dz-green/90 rounded-2xl h-12 px-8 font-black"
                    >
                        {t('buttons.newInvoice', 'Create Invoice')}
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredInvoices.map((inv, idx) => (
                        <div
                            key={inv.sessionId}
                            onClick={() => loadInvoice(inv.sessionId)}
                            className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-dz-dark/5 hover:-translate-y-1 transition-all cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-500"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="h-14 w-14 bg-dz-green/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-dz-green group-hover:text-white transition-colors">
                                        <FileText className="h-7 w-7 text-dz-green group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="space-y-1 text-start">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-black text-dz-green uppercase tracking-widest num-ltr">#{inv.invoiceNumber || '---'}</span>
                                            <div className={cn("px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider", statusColors[inv.status])}>
                                                {t(`settings.status${inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}`)}
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold text-dz-dark font-sans opacity-90">{inv.customerName || t('invoiceHeader.unspecified')}</h3>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 flex-1 md:justify-end items-center">
                                    <div className="space-y-1 text-start md:text-center">
                                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest block">{t('invoiceHeader.date')}</span>
                                        <div className="flex items-center gap-2 text-dz-dark font-bold num-ltr">
                                            <CalendarIcon className="h-3.5 w-3.5 text-gray-300" />
                                            {inv.invoiceDate}
                                        </div>
                                    </div>

                                    <div className="space-y-1 text-start md:text-center">
                                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest block">{t('invoiceItem.total')}</span>
                                        <div className="text-lg font-black text-dz-dark num-ltr">
                                            {inv.items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toLocaleString('fr-DZ', { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 col-span-2 md:col-span-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => deleteInvoice(inv.sessionId, e)}
                                            className="h-10 w-10 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <div className="h-10 w-10 bg-gray-50 flex items-center justify-center rounded-xl text-gray-400 group-hover:bg-dz-green/10 group-hover:text-dz-green transition-all">
                                            <ChevronRight className={cn("h-5 w-5", isRTL && "rotate-180")} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InvoiceArchiveView;
