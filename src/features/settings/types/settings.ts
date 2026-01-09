
export interface AppSettings {
    // Defaults
    defaultLanguage: 'ar' | 'fr' | 'en';
    defaultVatRate: number;
    defaultFooter: string;

    // Formatting
    numberFormat: 'space' | 'comma' | 'none'; // 95 000 vs 95,000 vs 95000
    currencyPlacement: 'before' | 'after';

    // Branding
    logo: string | null; // Base64 supported for offline reliability

    // Behavior (TVA Psychology)
    vatBehavior: 'show' | 'hide' | 'inclusive';

    // Business Owner Info (Essential for Algerian invoices)
    businessName: string;
    businessAddress: string;
    businessPhone: string;
    businessNIF: string;       // Numéro d'Identification Fiscale
    businessRC: string;        // Registre de Commerce
    businessBank: string;      // Bank account info (optional)
    recentProductServices: { name: string; price: number; }[];
    recentClients: { name: string; address?: string; phone?: string; nif?: string; rc?: string; }[];
}

export const DEFAULT_SETTINGS: AppSettings = {
    defaultLanguage: 'ar',
    defaultVatRate: 19,
    defaultFooter: '',
    numberFormat: 'space',
    currencyPlacement: 'after',
    logo: null,
    vatBehavior: 'show',
    // Business Info Defaults (empty, user fills in)
    businessName: '',
    businessAddress: '',
    businessPhone: '',
    businessNIF: '',
    businessRC: '',
    businessBank: '',
    recentProductServices: [],
    recentClients: []
};
