
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
    logoAlignment: 'left' | 'center' | 'right';

    // Behavior (TVA Psychology)
    vatBehavior: 'show' | 'hide' | 'inclusive';
}

export const DEFAULT_SETTINGS: AppSettings = {
    defaultLanguage: 'ar',
    defaultVatRate: 19,
    defaultFooter: '',
    numberFormat: 'space',
    currencyPlacement: 'after',
    logo: null,
    logoAlignment: 'right',
    vatBehavior: 'show'
};
