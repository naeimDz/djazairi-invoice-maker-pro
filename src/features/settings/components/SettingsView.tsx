
import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Upload,
    X,
    Check,
    Globe,
    CreditCard,
    Palette,
    Brain
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
        console.log("SettingsView RENDER: current VAT is", settings.defaultVatRate);
        const loadRecentItems = async () => {
            const recentProducts = await getRecentProductServices();
            const recentClients = await getRecentClients();
            console.log("Loaded products:", recentProducts);
            console.log("Loaded clients:", recentClients);
            updateSettings({ recentProductServices: recentProducts as any, recentClients: recentClients as any });
        };
        loadRecentItems();
    }, []); // Empty dependency to run once on mount

    // Reload when window regains focus (user switches back to Settings)
    useEffect(() => {
        const handleFocus = async () => {
            console.log("Window focus: reloading products/clients");
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
        console.log(`SettingsView: Setting ${key} to`, value);
        updateSettings({ [key]: value });
    };

    if (isLoading) {
        return <div className="p-20 text-center font-black animate-pulse text-dz-green italic">LOADING MERCHANT PREFERENCES...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20 px-4" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="flex flex-col gap-2 text-start">
                <h1 className="text-4xl md:text-5xl font-black text-dz-dark tracking-tighter animate-in fade-in slide-in-from-s-4 duration-700">
                    {t('navigation.settings')} <span className="text-dz-green">.</span>
                </h1>
                <p className="text-gray-400 font-medium animate-in fade-in slide-in-from-s-4 duration-1000延迟-200">{t('settings.description')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Branding/Identity (Logo Column) */}
                <div className="md:col-span-1 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-dz-dark/5 border border-gray-100 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-dz-green/10 rounded-xl">
                                <Palette className="h-5 w-5 text-dz-green" />
                            </div>
                            <h3 className="font-black text-lg text-dz-dark">{t('settings.branding')}</h3>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block px-1">
                                {t('settings.branding.logo')}
                            </Label>
                            <div className="relative group">
                                {settings.logo ? (
                                    <div className="relative bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-100 flex items-center justify-center min-h-[160px]">
                                        <img src={settings.logo} alt="Logo" className="max-h-24 w-auto object-contain" />
                                        <button
                                            onClick={removeLogo}
                                            className="absolute -top-3 -end-3 bg-red-500 text-white rounded-full p-2 shadow-xl hover:scale-110 transition-transform z-10"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="cursor-pointer flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50 hover:bg-dz-green/5 hover:border-dz-green/20 transition-all min-h-[160px] group"
                                    >
                                        <div className="h-14 w-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                            <Upload className="h-6 w-6 text-gray-400 group-hover:text-dz-green" />
                                        </div>
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('settings.uploadLogo')}</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleLogoUpload}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Business Info Card */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-dz-dark/5 border border-gray-100 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-50 rounded-xl">
                                <CreditCard className="h-5 w-5 text-blue-500" />
                            </div>
                            <h3 className="font-black text-lg text-dz-dark">{t('settings.businessInfo', 'معلومات المؤسسة')}</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">
                                    {t('settings.businessName', 'اسم المؤسسة')}
                                </Label>
                                <Input
                                    value={settings.businessName}
                                    onChange={(e) => updateField('businessName', e.target.value)}
                                    className="h-11 rounded-xl border-gray-100 bg-gray-50/30 focus:bg-white font-bold"
                                    placeholder="مؤسسة السلام للتجارة"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">
                                    {t('settings.businessAddress', 'العنوان')}
                                </Label>
                                <Input
                                    value={settings.businessAddress}
                                    onChange={(e) => updateField('businessAddress', e.target.value)}
                                    className="h-11 rounded-xl border-gray-100 bg-gray-50/30 focus:bg-white font-medium"
                                    placeholder="شارع الاستقلال، الجزائر العاصمة"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">
                                    {t('settings.businessPhone', 'الهاتف')}
                                </Label>
                                <Input
                                    value={settings.businessPhone}
                                    onChange={(e) => updateField('businessPhone', e.target.value)}
                                    className="h-11 rounded-xl border-gray-100 bg-gray-50/30 focus:bg-white font-medium num-ltr"
                                    placeholder="0555 00 00 00"
                                    dir="ltr"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">
                                        NIF {t('settings.taxId', '(الرقم الجبائي)')}
                                    </Label>
                                    <Input
                                        value={settings.businessNIF}
                                        onChange={(e) => updateField('businessNIF', e.target.value)}
                                        className="h-11 rounded-xl border-gray-100 bg-gray-50/30 focus:bg-white font-mono text-sm"
                                        placeholder="000000000000000"
                                        dir="ltr"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">
                                        RC {t('settings.commercialReg', '(السجل التجاري)')}
                                    </Label>
                                    <Input
                                        value={settings.businessRC}
                                        onChange={(e) => updateField('businessRC', e.target.value)}
                                        className="h-11 rounded-xl border-gray-100 bg-gray-50/30 focus:bg-white font-mono text-sm"
                                        placeholder="00/00-0000000B00"
                                        dir="ltr"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">
                                    {t('settings.businessBank', 'الحساب البنكي (اختياري)')}
                                </Label>
                                <Input
                                    value={settings.businessBank}
                                    onChange={(e) => updateField('businessBank', e.target.value)}
                                    className="h-11 rounded-xl border-gray-100 bg-gray-50/30 focus:bg-white font-mono text-sm"
                                    placeholder="CPA / 00000 00000 00000000000 00"
                                    dir="ltr"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Product/Service Management Card */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-dz-dark/5 border border-gray-100 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-50 rounded-xl">
                                <Brain className="h-5 w-5 text-purple-500" />
                            </div>
                            <h3 className="font-black text-lg text-dz-dark">{t('settings.productServiceManagement', 'إدارة المنتجات والخدمات')}</h3>
                        </div>
                        
                        <p className="text-gray-500 text-sm">
                            {t('settings.suggestedProducts', 'المنتجات والخدمات التي استخدمتها مؤخرا')}
                        </p>

                        {/* Recent Products/Services List */}
                        <div className="space-y-2">
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {settings.recentProductServices && settings.recentProductServices.length > 0 ? (
                                    settings.recentProductServices.map((product, idx) => (
                                        <div key={idx} className="p-3 bg-purple-50 rounded-lg flex justify-between items-center">
                                            <span className="text-sm font-medium">{product.name}</span>
                                            <span className="text-sm font-bold text-purple-600">{product.price.toFixed(2)} د.ج</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-gray-400 text-sm">
                                        {t('settings.noProducts', 'سيظهر هنا المنتجات عند إضافتها في الفواتير')}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Client Management Card */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-dz-dark/5 border border-gray-100 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-pink-50 rounded-xl">
                                <Brain className="h-5 w-5 text-pink-500" />
                            </div>
                            <h3 className="font-black text-lg text-dz-dark">{t('settings.clientManagement', 'إدارة العملاء')}</h3>
                        </div>

                        <p className="text-gray-500 text-sm">
                            {t('settings.suggestedClients', 'العملاء الذين تعاملت معهم مؤخرا')}
                        </p>

                        {/* Recent Clients List */}
                        <div className="space-y-2">
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {settings.recentClients && settings.recentClients.length > 0 ? (
                                    settings.recentClients.map((client, idx) => (
                                        <div key={idx} className="p-3 bg-pink-50 rounded-lg flex flex-col gap-1">
                                            <span className="text-sm font-medium">{client.name}</span>
                                            {client.phone && <span className="text-xs text-gray-500">{client.phone}</span>}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-gray-400 text-sm">
                                        {t('settings.noClients', 'سيظهر هنا العملاء عند إضافتهم في الفواتير')}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Defaults & Behavior (Main Config Column) */}
                <div className="md:col-span-2 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700延迟-150">
                    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-dz-dark/5 border border-gray-100">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-blue-50 rounded-xl">
                                <Brain className="h-5 w-5 text-blue-500" />
                            </div>
                            <h3 className="font-black text-lg text-dz-dark">{t('settings.defaults')} & {t('settings.behavior')}</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="space-y-3 text-start">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block px-1">
                                        {t('settings.documentLanguage')}
                                    </Label>
                                    <Select
                                        value={settings.defaultLanguage}
                                        onValueChange={(val: any) => updateField('defaultLanguage', val)}
                                    >
                                        <SelectTrigger className="h-14 rounded-2xl border-gray-100 bg-gray-50/30 font-bold focus:bg-white transition-all text-start">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-gray-100">
                                            <SelectItem value="ar" className="font-bold font-sans">العربية (Algeria)</SelectItem>
                                            <SelectItem value="fr" className="font-bold">Français</SelectItem>
                                            <SelectItem value="en" className="font-bold">English</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3 text-start">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block px-1">
                                        {t('settings.defaultVatRate')}
                                    </Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[0, 9, 19].map((rate) => (
                                            <Button
                                                key={rate}
                                                variant="ghost"
                                                className={cn(
                                                    "h-14 rounded-2xl font-black transition-all border border-transparent num-ltr",
                                                    settings.defaultVatRate === rate
                                                        ? "bg-dz-green text-white shadow-lg shadow-dz-green/20"
                                                        : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                                                )}
                                                onClick={() => updateField('defaultVatRate', rate)}
                                            >
                                                {rate}%
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3 text-start">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block px-1">
                                        {t('settings.vatBehavior')}
                                    </Label>
                                    <Select
                                        value={settings.vatBehavior}
                                        onValueChange={(val: any) => updateField('vatBehavior', val)}
                                    >
                                        <SelectTrigger className="h-14 rounded-2xl border-gray-100 bg-gray-50/30 font-bold focus:bg-white transition-all text-start">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-gray-100">
                                            <SelectItem value="show" className="font-bold">{t('settings.vatShow')}</SelectItem>
                                            <SelectItem value="hide" className="font-bold">{t('settings.vatHide')}</SelectItem>
                                            <SelectItem value="inclusive" className="font-bold">{t('settings.vatInclusive')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3 text-start">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block px-1">
                                        {t('settings.numberSpacing')}
                                    </Label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {[
                                            { id: 'space', label: '95 000.00' },
                                            { id: 'comma', label: '95,000.00' },
                                            { id: 'none', label: '95000.00' }
                                        ].map((opt) => (
                                            <Button
                                                key={opt.id}
                                                variant="ghost"
                                                className={cn(
                                                    "h-12 justify-start px-4 rounded-xl font-bold transition-all border border-transparent",
                                                    settings.numberFormat === opt.id
                                                        ? "bg-dz-green/10 text-dz-green"
                                                        : "bg-gray-50/50 text-gray-500 hover:bg-gray-50"
                                                )}
                                                onClick={() => updateField('numberFormat', opt.id as any)}
                                            >
                                                <span className="num-ltr">{opt.label}</span>
                                                {settings.numberFormat === opt.id && <Check className="h-4 w-4 ms-auto" />}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 space-y-3 text-start">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block px-1">
                                {t('settings.defaultFooter')}
                            </Label>
                            <Textarea
                                value={settings.defaultFooter}
                                onChange={(e) => updateField('defaultFooter', e.target.value)}
                                className="resize-none h-32 rounded-2xl border-gray-100 bg-gray-50/30 focus:bg-white transition-all p-6 font-medium leading-relaxed text-start"
                                placeholder="...e.g. Terms, Bank details, or warm thank you message"
                            />
                        </div>
                    </div>

                    <div className="bg-dz-dark rounded-3xl p-8 border border-white/5 flex flex-col md:flex-row items-start gap-6 shadow-2xl text-start">
                        <div className="p-3 bg-white/5 rounded-2xl shrink-0">
                            <Brain className="h-6 w-6 text-dz-green" />
                        </div>
                        <div className="space-y-2 flex-1">
                            <h4 className="text-white font-black uppercase tracking-widest text-xs">{t('settings.safetyTitle')}</h4>
                            <p className="text-white/40 text-[11px] leading-relaxed max-w-lg">
                                {t('settings.safetyDesc')}
                            </p>
                        </div>
                        <div className="ms-auto flex items-center gap-2 px-3 py-1.5 bg-dz-green/10 rounded-full shrink-0">
                            <Check className="h-3 w-3 text-dz-green" />
                            <span className="text-[10px] font-black text-dz-green uppercase tracking-widest">{t('settings.autoSaved')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;
