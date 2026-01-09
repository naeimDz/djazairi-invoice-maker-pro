
import { useState, useEffect, useCallback } from 'react';
import { getRecentProductServices } from '../../../core/localDbService';
import { InvoiceItem } from '../types/invoice';

export interface ProductHistoryItem {
    name: string;
    price: number;
}

export const useProductHistory = () => {
    const [recentProducts, setRecentProducts] = useState<ProductHistoryItem[]>([]);

    const fetchRecentProducts = useCallback(async () => {
        try {
            const products = await getRecentProductServices(20);
            setRecentProducts(products);
        } catch (error) {
            console.error("Failed to fetch product history", error);
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchRecentProducts();
    }, [fetchRecentProducts]);

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
        searchProducts,
        refreshHistory: fetchRecentProducts
    };
};
