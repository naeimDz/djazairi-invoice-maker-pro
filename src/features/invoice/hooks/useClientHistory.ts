import { useState, useEffect, useCallback } from 'react';
import { getRecentClients } from '../../../core/localDbService';

export interface ClientHistoryItem {
    name: string;
    address?: string;
    phone?: string;
    nif?: string;
    rc?: string;
}

export const useClientHistory = () => {
    const [recentClients, setRecentClients] = useState<ClientHistoryItem[]>([]);

    const fetchRecentClients = useCallback(async () => {
        try {
            const clients = await getRecentClients(20);
            setRecentClients(clients);
        } catch (error) {
            console.error("Failed to fetch client history", error);
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchRecentClients();
    }, [fetchRecentClients]);

    /**
     * Search local history
     */
    const searchClients = (query: string) => {
        if (!query) return recentClients.slice(0, 5);
        const lowerQuery = query.toLowerCase();
        return recentClients
            .filter(c => c.name.toLowerCase().includes(lowerQuery))
            .slice(0, 5);
    };

    return {
        recentClients,
        searchClients,
        refreshHistory: fetchRecentClients
    };
};
