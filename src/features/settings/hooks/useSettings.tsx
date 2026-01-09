
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppSettings, DEFAULT_SETTINGS } from '../types/settings';
import { db } from '../../../core/db';
import { syncManager } from '../../../core/syncService';

/**
 * Persitence Keys - V7 (Fresh Start)
 * Standardizing on a single versioned key for both storage types.
 */
const STORAGE_KEY = 'dz_settings_v7';
const DB_VERSION_KEY = 'v7';

interface SettingsContextType {
    settings: AppSettings;
    updateSettings: (updates: Partial<AppSettings>) => void;
    isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // 1. Synchronous startup from LocalStorage
    const [settings, setSettings] = useState<AppSettings>(() => {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                console.log("Settings: V7 Boot - Found Cache", parsed.defaultVatRate);
                return { ...DEFAULT_SETTINGS, ...parsed };
            } catch (e) {
                console.error("Settings: Cache corrupted", e);
            }
        }
        return DEFAULT_SETTINGS;
    });

    const [isLoading, setIsLoading] = useState(true);

    // 2. Hydrate from Source of Truth (IndexedDB) + Cross-tab sync
    useEffect(() => {
        const hydrate = async () => {
            try {
                const dbData = await db.get<AppSettings>('settings', DB_VERSION_KEY);
                if (dbData) {
                    console.log("Settings: V7 Sync - Found DB Data", dbData.defaultVatRate);
                    setSettings(prev => ({
                        ...DEFAULT_SETTINGS,
                        ...dbData,
                        ...prev,
                        logo: dbData.logo || prev.logo
                    }));
                }
            } catch (e) {
                console.error("Settings: DB Hydration failed", e);
            } finally {
                setIsLoading(false);
            }
        };

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY && e.newValue) {
                try {
                    const next = JSON.parse(e.newValue);
                    console.log("Settings: External Tab sync", next.defaultVatRate);
                    setSettings(prev => ({ ...prev, ...next }));
                } catch (err) {
                    console.error("Settings: Cross-tab sync error", err);
                }
            }
        };

        hydrate();
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // 3. Centralized Update (Atomic)
    const updateSettings = useCallback((updates: Partial<AppSettings>) => {
        setSettings(prev => {
            const next = { ...prev, ...updates };
            console.log("Settings: PERSISTING V7 UPDATE", updates);

            // a. LocalStorage (Primary for simple values)
            try {
                const cacheable = { ...next };
                if (next.logo && next.logo.length > 50000) { delete cacheable.logo; }
                localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheable));
            } catch (e) {
                console.warn("Settings: LS save failed", e);
            }

            // b. IndexedDB (Robust storage for everything)
            db.set('settings', DB_VERSION_KEY, next).catch(console.error);

            // c. Cloud Sync
            syncManager.syncSettings(next);

            return next;
        });
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
