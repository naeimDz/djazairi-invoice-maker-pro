import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'invoiceMakerProDB';
const DB_VERSION = 1;

interface ProductService {
  id?: number;
  name: string;
  price: number;
}

interface Client {
  id?: number;
  name: string;
  address?: string;
  phone?: string;
  nif?: string;
  rc?: string;
}

let db: IDBPDatabase;

async function initDB() {
  db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('products')) {
        db.createObjectStore('products', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('clients')) {
        db.createObjectStore('clients', { keyPath: 'id', autoIncrement: true });
      }
    },
  });
}

export async function addProductService(item: ProductService) {
  if (!db) await initDB();
  return db.add('products', item);
}

export async function getRecentProductServices(limit = 10): Promise<ProductService[]> {
  if (!db) await initDB();
  try {
    const allProducts = await db.getAll('products');
    console.log("All products from DB:", allProducts);
    return allProducts.slice(-limit).reverse();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function addClient(client: Client) {
  if (!db) await initDB();
  return db.add('clients', client);
}

export async function getRecentClients(limit = 10): Promise<Client[]> {
  if (!db) await initDB();
  try {
    const allClients = await db.getAll('clients');
    console.log("All clients from DB:", allClients);
    return allClients.slice(-limit).reverse();
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
}
