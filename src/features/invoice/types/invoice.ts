
import { AppSettings } from '../../settings/types/settings';

export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    price: number;
}

export interface InvoiceData {
    sessionId: string;
    invoiceNumber: string;
    invoiceDate: string;
    customerName: string;
    customerAddress: string;
    items: InvoiceItem[];
    invoiceLang: string;
    status: 'draft' | 'sent' | 'paid';
    settings?: AppSettings;
}
