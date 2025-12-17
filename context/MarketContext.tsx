'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type MarketType = 'US' | 'CN';

interface MarketContextType {
    market: MarketType;
    setMarket: (market: MarketType) => void;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export function MarketProvider({ children }: { children: React.ReactNode }) {
    // Default to CN
    const [market, setMarket] = useState<MarketType>('CN');

    useEffect(() => {
        // Check cookie first as it is the source of truth for Server
        const match = document.cookie.match(/(^| )openstock-market=([^;]+)/);
        if (match) {
            const val = match[2];
            if (val === 'US' || val === 'CN') {
                setMarket(val as MarketType);
            }
        }
    }, []);

    const handleSetMarket = (m: MarketType) => {
        setMarket(m);
        document.cookie = `openstock-market=${m}; path=/; max-age=31536000`;
        window.location.reload(); 
    };

    return (
        <MarketContext.Provider value={{ market, setMarket: handleSetMarket }}>
            {children}
        </MarketContext.Provider>
    );
}

export const useMarket = () => {
    const context = useContext(MarketContext);
    if (!context) throw new Error('useMarket must be used within a MarketProvider');
    return context;
};
