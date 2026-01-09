
import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Upload,
    X,
    Check,
    Globe,
    CreditCard,
    Palette,
    Brain,
    Building2,
    Calculator,
    FileText,
    Settings as SettingsIcon,
    Leaf
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui/select';
import { useSettings } from '../hooks/useSettings';
import { cn } from '@/lib/utils';
import { AppSettings } from '../types/settings';
import { getRecentProductServices, getRecentClients } from '@/core/localDbService';

const SettingsView: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { settings, updateSettings, isLoading } = useSettings();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isRTL = i18n.language === 'ar';

    useEffect(() => {
        const loadRecentItems = async () => {
            const recentProducts = await getRecentProductServices();
            const recentClients = await getRecentClients();
            updateSettings({ recentProductServices: recentProducts as any, recentClients: recentClients as any });
        };
        loadRecentItems();
    }, []);

    // Reload when window regains focus
    useEffect(() => {
        const handleFocus = async () => {
            const recentProducts = await getRecentProductServices();
            const recentClients = await getRecentClients();
            updateSettings({ recentProductServices: recentProducts as any, recentClients: recentClients as any });
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [updateSettings]);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateSettings({ logo: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const removeLogo = () => {
        updateSettings({ logo: null });
    };

    const updateField = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
        updateSettings({ [key]: value });
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center text-dz-green font-bold animate-pulse">Loading...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto pb-20 px-4 pt-6" dir={isRTL ? 'rtl' : 'ltr'}>

            {/* Page Header */}
            <div className="flex flex-col gap-3 mb-12">
                <div className="flex items-center gap-3 text-dz-green/60 font-bold uppercase tracking-widest text-[10px]">
                    <SettingsIcon className="h-4 w-4" />
                    <span>{t('navigation.settings', 'Settings')}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-dz-dark tracking-tighter">
                    {t('settings.title', 'Control Center')} <span className="text-dz-green">.</span>
                </h1>
                <p className="text-gray-400 font-medium max-w-xl text-lg leading-relaxed">
                    {t('settings.description')}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* === LEFT COLUMN: IDENTITY (Span 4) === */}
                <div className="lg:col-span-4 space-y-8">

                    {/* Brand Identity Card */}
                    <div className="bg-white rounded-[2rem] p-1 shadow-xl shadow-dz-dark/5 border border-gray-100/60 overflow-hidden group hover:shadow-2xl hover:shadow-dz-green/5 transition-all duration-500">
                        <div className="p-7 space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-dz-green/10 flex items-center justify-center text-dz-green shrink-0">
                                    <Palette className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-lg text-dz-dark leading-tight">{t('settings.branding')}</h3>
                                    <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">{t('settings.brandingIdentity', 'Visual Identity')}</p>
                                </div>
                            </div>

                            {/* Circular Logo Upload */}
                            <div className="flex justify-center py-4">
                                <div className="relative group/logo">
                                    <div
                                        onClick={() => !settings.logo && fileInputRef.current?.click()}
                                        className={cn(
                                            "w-48 h-48 rounded-full border-4 flex items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden relative",
                                            settings.logo
                                                ? "border-white shadow-2xl shadow-dz-dark/10 bg-white"
                                                : "border-dashed border-gray-200 bg-gray-50/50 hover:border-dz-green/30 hover:bg-dz-green/5"
                                        )}
                                    >
                                        {settings.logo ? (
                                            <img src={settings.logo} alt="Logo" className="w-full h-full object-contain p-6" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-gray-300 group-hover/logo:text-dz-green transition-colors">
                                                <Upload className="h-8 w-8" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{t('settings.uploadLogo')}</span>
                                            </div>
                                        )}

                                        {/* Actions Overlay */}
                                        {settings.logo && (
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/logo:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                                    className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-dz-dark hover:scale-110 transition-transform shadow-lg"
                                                >
                                                    <Upload className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); removeLogo(); }}
                                                    className="h-10 w-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Business Info Card */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-dz-dark/5 border border-gray-100/60 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                                <Building2 className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-lg text-dz-dark leading-tight">{t('settings.businessInfo', 'Company Profile')}</h3>
                                <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">{t('settings.details', 'Details')}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ps-1">{t('settings.businessName')}</Label>
                                <Input
                                    value={settings.businessName}
                                    onChange={(e) => updateField('businessName', e.target.value)}
                                    className="h-12 bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500/10 rounded-xl font-bold"
                                    placeholder={t('settings.businessNamePlaceholder', 'Business Name')}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ps-1">{t('settings.businessAddress')}</Label>
                                <Textarea
                                    value={settings.businessAddress}
                                    onChange={(e) => updateField('businessAddress', e.target.value)}
                                    className="resize-none h-24 bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500/10 rounded-xl font-medium leading-relaxed"
                                    placeholder={t('settings.businessAddressPlaceholder', 'Full Address')}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ps-1">{t('settings.businessPhone')}</Label>
                                <Input
                                    value={settings.businessPhone}
                                    onChange={(e) => updateField('businessPhone', e.target.value)}
                                    className="h-12 bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500/10 rounded-xl font-bold num-ltr"
                                    placeholder="+213 555 00 00 00"
                                    dir="ltr"
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-50 grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-[9px] font-black text-gray-400 uppercase tracking-wider ps-1">NIF</Label>
                                    <Input
                                        value={settings.businessNIF}
                                        onChange={(e) => updateField('businessNIF', e.target.value)}
                                        className="h-10 bg-white border-dashed border-gray-200 focus:border-blue-500 focus:ring-0 rounded-lg font-mono text-xs"
                                        placeholder="000...000"
                                        dir="ltr"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[9px] font-black text-gray-400 uppercase tracking-wider ps-1">RC</Label>
                                    <Input
                                        value={settings.businessRC}
                                        onChange={(e) => updateField('businessRC', e.target.value)}
                                        className="h-10 bg-white border-dashed border-gray-200 focus:border-blue-500 focus:ring-0 rounded-lg font-mono text-xs"
                                        placeholder="00/...-..."
                                        dir="ltr"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5 pt-2">
                                <Label className="text-[9px] font-black text-gray-400 uppercase tracking-wider ps-1">{t('settings.businessBank')}</Label>
                                <Input
                                    value={settings.businessBank}
                                    onChange={(e) => updateField('businessBank', e.target.value)}
                                    className="h-10 bg-white border-dashed border-gray-200 focus:border-blue-500 focus:ring-0 rounded-lg font-mono text-xs"
                                    placeholder="RIP / RIB"
                                    dir="ltr"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* === RIGHT COLUMN: CONFIGURATION (Span 8) === */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Settings & Defaults */}
                    <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-dz-dark/5 border border-gray-100/60">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="h-10 w-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
                                <SettingsIcon className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-lg text-dz-dark leading-tight">{t('settings.defaults')} & {t('settings.behavior')}</h3>
                                <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">{t('settings.kpi', 'Configuration')}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">

                            {/* Generic Settings */}
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('settings.documentLanguage')}</Label>
                                    <Select
                                        value={settings.defaultLanguage}
                                        onValueChange={(val: any) => updateField('defaultLanguage', val)}
                                    >
                                        <SelectTrigger className="h-14 w-full bg-white border-gray-200 rounded-xl font-bold hover:border-purple-300 transition-colors focus:ring-4 focus:ring-purple-500/10">
                                            <div className="flex items-center gap-3">
                                                <Globe className="h-4 w-4 text-purple-500" />
                                                <SelectValue />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                                            <SelectItem value="ar" className="font-bold">العربية (Algeria)</SelectItem>
                                            <SelectItem value="fr" className="font-bold">Français</SelectItem>
                                            <SelectItem value="en" className="font-bold">English</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('settings.numberSpacing')}</Label>
                                    <div className="flex flex-col gap-2">
                                        {[
                                            { id: 'space', label: '95 000.00' },
                                            { id: 'comma', label: '95,000.00' },
                                            { id: 'none', label: '95000.00' }
                                        ].map((opt) => (
                                            <button
                                                key={opt.id}
                                                onClick={() => updateField('numberFormat', opt.id as any)}
                                                className={cn(
                                                    "h-12 w-full px-4 rounded-xl font-bold transition-all flex items-center justify-between border-2",
                                                    settings.numberFormat === opt.id
                                                        ? "border-purple-500 bg-purple-50 text-purple-700"
                                                        : "border-transparent bg-gray-50 text-gray-400 hover:bg-gray-100"
                                                )}
                                            >
                                                <span className="num-ltr text-sm">{opt.label}</span>
                                                {settings.numberFormat === opt.id && <Check className="h-4 w-4" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* VAT Settings */}
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('settings.vatBehavior')}</Label>
                                    <Select
                                        value={settings.vatBehavior}
                                        onValueChange={(val: any) => updateField('vatBehavior', val)}
                                    >
                                        <SelectTrigger className="h-14 w-full bg-white border-gray-200 rounded-xl font-bold hover:border-purple-300 transition-colors focus:ring-4 focus:ring-purple-500/10">
                                            <div className="flex items-center gap-3">
                                                <Calculator className="h-4 w-4 text-purple-500" />
                                                <SelectValue />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                                            <SelectItem value="show" className="font-bold">{t('settings.vatShow')}</SelectItem>
                                            <SelectItem value="hide" className="font-bold">{t('settings.vatHide')}</SelectItem>
                                            <SelectItem value="inclusive" className="font-bold">{t('settings.vatInclusive')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('settings.defaultVatRate')}</Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[0, 9, 19].map((rate) => (
                                            <button
                                                key={rate}
                                                onClick={() => updateField('defaultVatRate', rate)}
                                                className={cn(
                                                    "aspect-square rounded-2xl font-black transition-all flex flex-col items-center justify-center border-2",
                                                    settings.defaultVatRate === rate
                                                        ? "border-dz-green bg-dz-green text-white shadow-lg shadow-dz-green/20"
                                                        : "border-transparent bg-gray-50 text-gray-400 hover:bg-gray-100"
                                                )}
                                            >
                                                <span className="text-xl">{rate}</span>
                                                <span className="text-[9px] opacity-60">%</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 space-y-3">
                            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('settings.defaultFooter')}</Label>
                            <div className="relative">
                                <FileText className="absolute start-4 top-4 h-5 w-5 text-gray-300" />
                                <Textarea
                                    value={settings.defaultFooter}
                                    onChange={(e) => updateField('defaultFooter', e.target.value)}
                                    className="resize-none h-32 w-full ps-12 bg-white border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 rounded-2xl font-medium leading-relaxed"
                                    placeholder={t('settings.defaultFooterPlaceholder', '...payment terms, bank details, or thank you note')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="rounded-3xl p-6 border border-gray-100 bg-gradient-to-br from-gray-50 to-white flex items-center justify-between gap-4 opacity-70 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <Leaf className="h-4 w-4" />
                            </div>
                            <p className="text-xs font-medium text-gray-500 leading-relaxed max-w-md">
                                {t('settings.safetyDesc')}
                            </p>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-50 px-2 py-1 rounded-md">
                            {t('settings.autoSaved')}
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SettingsView;
