
import React, { useEffect, useState } from 'react';
import { syncManager } from '@/core/syncService';
import { Cloud, CloudOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils'; // Adjust path if needed

interface SyncStatusIndicatorProps {
    isRTL: boolean;
    isSidebarOpen: boolean;
}

export const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({ isRTL, isSidebarOpen }) => {
    const [status, setStatus] = useState<'idle' | 'syncing' | 'error' | 'offline'>('idle');
    const [lastSynced, setLastSynced] = useState<Date | null>(null);

    useEffect(() => {
        const unsubscribe = syncManager.subscribe((s) => {
            setStatus(s.status);
            setLastSynced(s.lastSynced);
        });
        return unsubscribe;
    }, []);

    const iconClass = "h-4 w-4 shrink-0 transition-all duration-300";

    if (!isSidebarOpen) {
        // Minimalist Dot for collapsed sidebar
        return (
            <div className="flex justify-center mb-2" title={status}>
                <div className={cn(
                    "h-2 w-2 rounded-full ring-2 ring-dz-dark transition-colors duration-500",
                    status === 'idle' && "bg-green-500",
                    status === 'syncing' && "bg-blue-500 animate-pulse",
                    (status === 'error' || status === 'offline') && "bg-red-500"
                )} />
            </div>
        );
    }

    return (
        <div className={cn(
            "flex items-center gap-3 p-3 rounded-xl border transition-all duration-500",
            status === 'idle' && "bg-green-500/10 border-green-500/20 text-green-600",
            status === 'syncing' && "bg-blue-500/10 border-blue-500/20 text-blue-600",
            status === 'error' && "bg-red-500/10 border-red-500/20 text-red-600",
            status === 'offline' && "bg-gray-500/10 border-gray-500/20 text-gray-500"
        )}>
            {status === 'idle' && <CheckCircle2 className={iconClass} />}
            {status === 'syncing' && <RefreshCw className={cn(iconClass, "animate-spin")} />}
            {status === 'error' && <CloudOff className={iconClass} />}
            {status === 'offline' && <CloudOff className={iconClass} />}

            <div className="flex flex-col text-[10px] uppercase font-black tracking-wider leading-none">
                <span>
                    {status === 'idle' && "CLOUD SAVED"}
                    {status === 'syncing' && "SYNCING..."}
                    {status === 'error' && "SYNC ERROR"}
                    {status === 'offline' && "OFFLINE"}
                </span>
                {lastSynced && status === 'idle' && (
                    <span className="opacity-50 mt-1 capitalize tracking-normal font-medium text-[9px]">
                        {lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                )}
            </div>
        </div>
    );
};
