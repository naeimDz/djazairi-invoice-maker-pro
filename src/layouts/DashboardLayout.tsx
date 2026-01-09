
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    LayoutDashboard,
    FileText,
    Settings,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    Menu,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';
import { Link } from 'react-router-dom';
import { SyncStatusIndicator } from '@/features/sync/components/SyncStatusIndicator';

interface DashboardLayoutProps {
    children: React.ReactNode;
    activeView?: 'invoices' | 'settings' | 'dashboard' | 'help';
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activeView = 'invoices' }) => {
    const { t, i18n } = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const isRTL = i18n.language === 'ar';
    const langPrefix = isRTL ? '/ar' : '';

    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: t('navigation.dashboard', 'Dashboard'), path: `${langPrefix}/dashboard` },
        { id: 'invoices', icon: FileText, label: t('navigation.invoices', 'Invoices'), path: langPrefix || '/' },
        { id: 'settings', icon: Settings, label: t('navigation.settings', 'Settings'), path: `${langPrefix}/settings` },
        { id: 'help', icon: HelpCircle, label: t('navigation.help', 'Help'), path: `${langPrefix}/help` },
    ];

    // Normalize path for invoices (could be / or /ar)
    const currentView = activeView;

    return (
        <div className="flex h-screen bg-dz-neutral/30 overflow-hidden font-sans" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Mobile Sidebar Toggle - Positioned logically */}
            <Button
                variant="ghost"
                size="icon"
                className="fixed top-4 z-50 md:hidden inset-s-4 print:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <X /> : <Menu />}
            </Button>

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 z-40 bg-white border-e border-gray-200 transition-all duration-300 ease-in-out md:relative print:hidden shrink-0",
                    isSidebarOpen ? "w-72 translate-x-0" : "w-20",
                    // Complex hide logic for mobile RTL/LTR
                    !isSidebarOpen && (isRTL ? "translate-x-full md:translate-x-0" : "-translate-x-full md:translate-x-0"),
                    // Placement
                    isRTL ? "right-0" : "left-0"
                )}
            >
                <div className="flex flex-col h-full bg-dz-dark text-white/70">
                    {/* Logo Section */}
                    <div className="p-8 flex items-center gap-4">
                        <div className="h-12 w-12 bg-dz-green rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-dz-green/40 shrink-0">
                            <FileText className="h-7 w-7" />
                        </div>
                        {isSidebarOpen && (
                            <div className="flex flex-col animate-in fade-in duration-500">
                                <span className="font-heading font-black text-2xl text-white tracking-tighter leading-none">
                                    <span className="text-dz-green">DZ</span> INVOICE
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mt-1">PRO EDITION</span>
                            </div>
                        )}
                    </div>

                    {/* Nav Items */}
                    <nav className="flex-1 px-4 space-y-2 mt-8">
                        {menuItems.map((item) => (
                            <Link
                                key={item.id}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-4 w-full p-4 rounded-2xl transition-all group relative overflow-hidden",
                                    currentView === item.id
                                        ? "bg-dz-green text-white shadow-xl shadow-dz-green/20"
                                        : "hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <item.icon className={cn("h-6 w-6 shrink-0 transition-transform duration-300",
                                    currentView === item.id ? "scale-110" : "group-hover:scale-110"
                                )} />
                                {isSidebarOpen && (
                                    <span className="font-bold text-sm tracking-tight whitespace-nowrap animate-in slide-in-from-s-2 duration-300">
                                        {item.label}
                                    </span>
                                )}

                                {/* Active indicator: Stays on the "inner" edge (touching content) */}
                                {currentView === item.id && (
                                    <div className={cn(
                                        "absolute inset-y-0 w-1 bg-white opacity-20",
                                        isRTL ? "left-0 rounded-e-full" : "right-0 rounded-s-full"
                                    )} />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-6 border-t border-white/10 space-y-4">
                        <SyncStatusIndicator isRTL={isRTL} isSidebarOpen={isSidebarOpen} />

                        <div className={cn("flex items-center justify-between", !isSidebarOpen && "flex-col gap-6")}>
                            {isRTL ? (
                                <Link
                                    to={activeView === 'invoices' ? '/' : `/${activeView}`}
                                    className="text-[10px] font-black text-white/40 hover:text-white uppercase tracking-widest transition-colors"
                                >
                                    {isSidebarOpen ? "English / Français" : "EN/FR"}
                                </Link>
                            ) : (
                                <Link
                                    to={activeView === 'invoices' ? '/ar' : `/ar/${activeView}`}
                                    className="text-xs font-black text-white/40 hover:text-white transition-colors"
                                >
                                    {isSidebarOpen ? "العربية" : "ع"}
                                </Link>
                            )}

                            <Button
                                variant="ghost"
                                size="icon"
                                className="hidden md:flex text-white/20 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            >
                                {isSidebarOpen
                                    ? <ChevronLeft className={cn("h-5 w-5 transition-transform", isRTL && "rotate-180")} />
                                    : <ChevronRight className={cn("h-5 w-5 transition-transform", isRTL && "rotate-180")} />
                                }
                            </Button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto relative bg-dz-neutral/30 custom-scrollbar">
                <div className="p-4 md:p-10 animate-in fade-in duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
