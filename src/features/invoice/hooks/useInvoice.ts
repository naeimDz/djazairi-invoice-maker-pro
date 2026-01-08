
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { InvoiceItem, InvoiceData } from '../types/invoice';
import { useSettings } from '../../settings/hooks/useSettings';
import { db } from '../../../core/db';

const STORAGE_KEY_PREFIX = 'invoice_draft_';

export const useInvoice = () => {
    const { i18n } = useTranslation();
    const { settings } = useSettings();
    const hasInitializedDefaults = useRef(false);
    const prevAppLang = useRef(i18n.language);

    // Session Management
    const [sessionId, setSessionId] = useState(() => {
        const active = localStorage.getItem('dz_active_session');
        return active || Date.now().toString();
    });

    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [invoiceDate, setInvoiceDate] = useState(
        new Date().toISOString().split('T')[0]
    );
    const [customerName, setCustomerName] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [invoiceLang, setInvoiceLang] = useState(i18n.language || 'ar');
    const [status, setStatus] = useState<'draft' | 'sent' | 'paid'>('draft');
    const [items, setItems] = useState<InvoiceItem[]>([
        { id: '1', description: '', quantity: 1, price: 0 },
    ]);

    // Descriptions History from DB
    const [descriptionHistory, setDescriptionHistory] = useState<string[]>([]);

    // 1. Sync Invoice Language with App Language (if not manually overridden in this session)
    useEffect(() => {
        if (i18n.language !== prevAppLang.current) {
            setInvoiceLang(i18n.language);
            prevAppLang.current = i18n.language;
        }
    }, [i18n.language]);

    // 2. Load History & Draft on Mount/Session Change
    useEffect(() => {
        const loadInitialData = async () => {
            // Load History
            const history = await db.get<string[]>('resources', 'product_history');
            if (history) setDescriptionHistory(history);

            // Load Draft
            const savedData = localStorage.getItem(`${STORAGE_KEY_PREFIX}${sessionId}`);
            if (savedData) {
                try {
                    const parsed: InvoiceData = JSON.parse(savedData);
                    setInvoiceNumber(parsed.invoiceNumber || '');
                    setInvoiceDate(parsed.invoiceDate || new Date().toISOString().split('T')[0]);
                    setCustomerName(parsed.customerName || '');
                    setCustomerAddress(parsed.customerAddress || '');
                    setInvoiceLang(parsed.invoiceLang || i18n.language);
                    setItems(parsed.items || [{ id: '1', description: '', quantity: 1, price: 0 }]);
                    setStatus(parsed.status || 'draft');
                    hasInitializedDefaults.current = true;
                } catch (e) {
                    console.error("Failed to parse draft", e);
                }
            }
            localStorage.setItem('dz_active_session', sessionId);
        };

        loadInitialData();
    }, [sessionId]);

    // 3. Apply Global Content Defaults for NEW Invoices
    useEffect(() => {
        const draftKey = `${STORAGE_KEY_PREFIX}${sessionId}`;
        if (!hasInitializedDefaults.current && !localStorage.getItem(draftKey)) {
            // Inheritance from global settings
            setInvoiceLang(settings.defaultLanguage || i18n.language);
            hasInitializedDefaults.current = true;
        }
    }, [settings.defaultLanguage, sessionId, i18n.language]);

    // 4. Auto-save session data with safety (Strip Logo from snapshot)
    useEffect(() => {
        // Strip logo to prevent LocalStorage QuotaExceededError
        const settingsSnapshot = { ...settings };
        if (settingsSnapshot.logo && settingsSnapshot.logo.length > 1000) {
            delete settingsSnapshot.logo;
        }

        const data: InvoiceData = {
            sessionId,
            invoiceNumber,
            invoiceDate,
            customerName,
            customerAddress,
            items,
            invoiceLang,
            status,
            settings: settingsSnapshot
        };

        localStorage.setItem(`${STORAGE_KEY_PREFIX}${sessionId}`, JSON.stringify(data));
        // Slow save to DB to avoid jank
        const timer = setTimeout(() => {
            db.saveInvoice(data).catch(err => console.warn("DB Background Save deferred", err));
        }, 1000);

        return () => clearTimeout(timer);
    }, [sessionId, invoiceNumber, invoiceDate, customerName, customerAddress, items, invoiceLang, status, settings]);

    // 5. Update Product Memory in DB
    useEffect(() => {
        const currentDescriptions = items
            .map(i => i.description.trim())
            .filter(d => d.length > 3);

        if (currentDescriptions.length > 0) {
            const updateHistory = async () => {
                const newHistory = Array.from(new Set([...descriptionHistory, ...currentDescriptions])).slice(0, 50);
                if (JSON.stringify(newHistory) !== JSON.stringify(descriptionHistory)) {
                    setDescriptionHistory(newHistory);
                    await db.set('resources', 'product_history', newHistory);
                }
            };
            updateHistory();
        }
    }, [items, descriptionHistory]);

    // HANDLERS (Functional Updates for thread safety)
    const addItem = useCallback(() => {
        setItems(prev => [...prev, { id: Date.now().toString(), description: '', quantity: 1, price: 0 }]);
    }, []);

    const updateItem = useCallback((id: string, field: keyof InvoiceItem, value: string | number) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    }, []);

    const removeItem = useCallback((id: string) => {
        setItems(prev => {
            if (prev.length > 1) {
                return prev.filter(item => item.id !== id);
            }
            return [{ id: Date.now().toString(), description: '', quantity: 1, price: 0 }];
        });
    }, []);

    const duplicateInvoice = useCallback(() => {
        const newId = Date.now().toString();
        setSessionId(newId);
        setInvoiceNumber(prev => prev ? `${prev}-COPY` : '');
        setStatus('draft');
    }, []);

    const clearDraft = useCallback(() => {
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}${sessionId}`);
        const newId = Date.now().toString();
        setSessionId(newId);
        setInvoiceNumber('');
        setCustomerName('');
        setCustomerAddress('');
        setItems([{ id: '1', description: '', quantity: 1, price: 0 }]);
        setStatus('draft');
        hasInitializedDefaults.current = false;
    }, [sessionId]);

    const recallLastCustomer = useCallback(async () => {
        const last = await db.get<{ name: string, address: string }>('resources', 'last_customer');
        if (last) {
            setCustomerName(last.name);
            setCustomerAddress(last.address);
        }
    }, []);

    useEffect(() => {
        if (customerName || customerAddress) {
            db.set('resources', 'last_customer', { name: customerName, address: customerAddress }).catch(console.error);
        }
    }, [customerName, customerAddress]);

    return {
        sessionId,
        setSessionId,
        invoiceNumber,
        setInvoiceNumber,
        invoiceDate,
        setInvoiceDate,
        customerName,
        setCustomerName,
        customerAddress,
        setCustomerAddress,
        invoiceLang,
        setInvoiceLang,
        status,
        setStatus,
        items,
        setItems,
        descriptionHistory,
        addItem,
        updateItem,
        removeItem,
        clearDraft,
        duplicateInvoice,
        recallLastCustomer,
    };
};
