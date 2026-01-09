
import { db } from './db';
import { authenticateSilently, dbStore } from './firebase';
import { doc, setDoc, getDoc, collection, getDocs, Timestamp, writeBatch } from "firebase/firestore";

interface SyncStatus {
    lastSynced: Date | null;
    status: 'idle' | 'syncing' | 'error' | 'offline';
    error?: string;
}

class SyncManager {
    private userId: string | null = null;
    private listeners: ((status: SyncStatus) => void)[] = [];
    private _status: SyncStatus = { lastSynced: null, status: 'idle' };
    private syncDebounceTimer: NodeJS.Timeout | null = null;

    constructor() {
        this.init();
    }

    private async init() {
        try {
            const user = await authenticateSilently();
            this.userId = user.uid;
            this.updateStatus('idle');
            // Check for initial pull if needed? For now, we assume local first.
        } catch (e) {
            console.error("SyncManager: Auth failed", e);
            this.updateStatus('error', "Authentication failed");
        }
    }

    public subscribe(callback: (status: SyncStatus) => void) {
        this.listeners.push(callback);
        callback(this._status);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    private updateStatus(status: SyncStatus['status'], error?: string) {
        this._status = {
            ...this._status,
            status,
            error,
            lastSynced: status === 'idle' ? new Date() : this._status.lastSynced
        };
        this.listeners.forEach(cb => cb(this._status));
    }

    /**
     * Pushes a specific invoice to the cloud.
     * Use debounce to avoid spamming writes during typing.
     */
    public requestInvoiceSync(invoiceData: any) {
        if (!this.userId) return;

        if (this.syncDebounceTimer) clearTimeout(this.syncDebounceTimer);

        this.updateStatus('syncing');

        this.syncDebounceTimer = setTimeout(async () => {
            try {
                if (!invoiceData.sessionId) throw new Error("No Session ID");

                // 1. Save to Firestore under users/{uid}/invoices/{sessionId}
                const docRef = doc(dbStore, 'users', this.userId!, 'invoices', invoiceData.sessionId);

                // Add metadata
                const payload = {
                    ...invoiceData,
                    updatedAt: Timestamp.now(),
                    _syncedFrom: 'web-client'
                };

                await setDoc(docRef, payload, { merge: true });
                console.log("SyncManager: Invoice synced", invoiceData.sessionId);
                this.updateStatus('idle');
            } catch (e: any) {
                console.error("SyncManager: Sync failed", e);
                this.updateStatus('error', e.message);
            }
        }, 2000); // 2 second debounce
    }

    /**
     * Sync Global Settings (less frequent)
     */
    public async syncSettings(settings: any) {
        if (!this.userId) return;
        try {
            this.updateStatus('syncing');
            const docRef = doc(dbStore, 'users', this.userId!, 'settings', 'global');
            await setDoc(docRef, { ...settings, updatedAt: Timestamp.now() }, { merge: true });
            this.updateStatus('idle');
        } catch (e: any) {
            console.error("SyncSettings: Failed", e);
            this.updateStatus('error', e.message);
        }
    }

    // Force one-way backup: Local -> Cloud
    public async forceBackupAll() {
        if (!this.userId) return;
        try {
            this.updateStatus('syncing');
            const invoices = await db.getAllInvoices();

            const batch = writeBatch(dbStore);
            let count = 0;

            for (const inv of invoices) {
                const ref = doc(dbStore, 'users', this.userId!, 'invoices', inv.sessionId);
                batch.set(ref, { ...inv, updatedAt: Timestamp.now() }, { merge: true });
                count++;
                // Batches limit is 500
                if (count >= 400) break;
            }

            await batch.commit();
            console.log(`SyncManager: Backed up ${count} invoices.`);
            this.updateStatus('idle');
        } catch (e: any) {
            this.updateStatus('error', e.message);
        }
    }
}

export const syncManager = new SyncManager();
