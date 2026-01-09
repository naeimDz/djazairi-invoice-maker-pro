
/**
 * Simple IndexedDB wrapper for "Peace of Mind" local storage.
 * Designed to handle larger data sets like high-res logos and invoice history.
 */

const DB_NAME = 'dz_invoice_maker_db';
const DB_VERSION = 2;

export class DzDB {
    private db: IDBDatabase | null = null;
    private initPromise: Promise<IDBDatabase> | null = null;

    async init(): Promise<IDBDatabase> {
        if (this.db) return this.db;
        if (this.initPromise) return this.initPromise;

        this.initPromise = new Promise((resolve, reject) => {
            console.log("DzDB: Initializing Database...");
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = (event: any) => {
                const db = event.target.result;
                console.log("DzDB: Upgrading Database schema...");

                // v1 Stores
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings');
                }
                if (!db.objectStoreNames.contains('invoices')) {
                    db.createObjectStore('invoices', { keyPath: 'sessionId' });
                }
                if (!db.objectStoreNames.contains('resources')) {
                    db.createObjectStore('resources');
                }

                // v2 Stores: Products Cache
                if (!db.objectStoreNames.contains('products')) {
                    const productStore = db.createObjectStore('products', { keyPath: 'name' });
                    productStore.createIndex('updatedAt', 'updatedAt', { unique: false });
                }
            };

            request.onsuccess = (event: any) => {
                this.db = event.target.result;
                console.log("DzDB: Database connected successfully.");
                resolve(this.db!);
            };

            request.onerror = (event: any) => {
                console.error("DzDB: Database connection error", event.target.error);
                reject(event.target.error);
            };
        });

        return this.initPromise;
    }

    async get<T>(storeName: string, key: string): Promise<T | null> {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            try {
                const transaction = db.transaction(storeName, 'readonly');
                const store = transaction.objectStore(storeName);
                const request = store.get(key);

                request.onsuccess = () => resolve(request.result || null);
                request.onerror = () => reject(request.error);
            } catch (e) {
                console.error(`DzDB: Failed to get key ${key} from ${storeName}`, e);
                resolve(null);
            }
        });
    }

    async set<T>(storeName: string, key: string, value: T): Promise<void> {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            try {
                const transaction = db.transaction(storeName, 'readwrite');
                const store = transaction.objectStore(storeName);

                // Check if store has keyPath
                const isKeyPath = store.keyPath !== null;
                const putRequest = isKeyPath ? store.put(value) : store.put(value, key);

                putRequest.onsuccess = () => resolve();
                putRequest.onerror = () => reject(putRequest.error);

                transaction.oncomplete = () => {
                    // Success
                };
                transaction.onerror = (e) => {
                    console.error("DzDB: Transaction error during set", e);
                    reject(e);
                };
            } catch (e) {
                console.error(`DzDB: Failed to set key ${key} in ${storeName}`, e);
                reject(e);
            }
        });
    }

    async saveInvoice(invoice: any): Promise<void> {
        return this.set('invoices', '', invoice);
    }

    async getAll<T>(storeName: string): Promise<T[]> {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            try {
                const transaction = db.transaction(storeName, 'readonly');
                const store = transaction.objectStore(storeName);
                const request = store.getAll();
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            } catch (e) {
                console.error(`DzDB: Failed to getAll from ${storeName}`, e);
                resolve([]);
            }
        });
    }

    async delete(storeName: string, key: string): Promise<void> {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            try {
                const transaction = db.transaction(storeName, 'readwrite');
                const store = transaction.objectStore(storeName);
                const request = store.delete(key);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            } catch (e) {
                console.error(`DzDB: Failed to delete key ${key} from ${storeName}`, e);
                reject(e);
            }
        });
    }

    async getAllInvoices(): Promise<any[]> {
        return this.getAll('invoices');
    }
}

export const db = new DzDB();
