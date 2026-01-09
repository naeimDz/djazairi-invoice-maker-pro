
import { useState, useEffect, useCallback } from 'react';
import { db } from '../../../core/db';
import { InvoiceItem } from '../types/invoice';

export interface ProductHistoryItem {
    name: string;
    price: number;
    updatedAt: number;
}

export const useProductHistory = () => {
    const [recentProducts, setRecentProducts] = useState<ProductHistoryItem[]>([]);

    const fetchRecentProducts = useCallback(async () => {
        try {
            const products = await db.getAll<ProductHistoryItem>('products');
            // Sort by recency (newest first) and take top 20
            const sorted = products
                .sort((a, b) => b.updatedAt - a.updatedAt)
                .slice(0, 20);
            setRecentProducts(sorted);
        } catch (error) {
            console.error("Failed to fetch product history", error);
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchRecentProducts();
    }, [fetchRecentProducts]);

    const saveProduct = async (item: InvoiceItem) => {
        if (!item.description || !item.description.trim()) return;

        try {
            const product: ProductHistoryItem = {
                name: item.description.trim(),
                price: item.price,
                updatedAt: Date.now()
            };
            await db.set('products', item.description.trim(), product);
            // Refresh list silently
            fetchRecentProducts();
        } catch (error) {
            console.warn("Failed to save product to history", error);
        }
    };

    /**
     * Search local history
     */
    const searchProducts = (query: string) => {
        if (!query) return recentProducts.slice(0, 5);
        const lowerQuery = query.toLowerCase();
        return recentProducts
            .filter(p => p.name.toLowerCase().includes(lowerQuery))
            .slice(0, 5);
    };

    return {
        recentProducts,
        saveProduct,
        searchProducts,
        refreshHistory: fetchRecentProducts
    };
};
