'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'zh';

export const DICTIONARY = {
    en: {
        nav: {
            dashboard: 'Dashboard',
            market: 'Market',
            portfolio: 'Portfolio',
            watchlist: 'Watchlist',
            news: 'News',
            settings: 'Settings',
            search: 'Add stock',
            logout: 'Log out',
            login: 'Login',
        },
        marketSwitcher: {
            us: 'US Market (Finnhub)',
            cn: 'A-Share (Akshare)',
        },
        search: {
            placeholder: 'Search stocks...',
            loading: 'Loading stocks...',
            empty: 'No stocks found',
            results: 'Search results',
            popular: 'Popular stocks',
        },
        common: {
            loading: 'Loading...',
            error: 'Error occurred',
        }
    },
    zh: {
        nav: {
            dashboard: '仪表盘',
            market: '市场',
            portfolio: '投资组合',
            watchlist: '自选股',
            news: '新闻',
            settings: '设置',
            search: '添加股票',
            logout: '退出登录',
            login: '登录',
        },
        marketSwitcher: {
            us: '美股市场 (Finnhub)',
            cn: 'A股市场 (Akshare)',
        },
        search: {
            placeholder: '搜索股票 (代码/名称)...',
            loading: '加载中...',
            empty: '未找到相关股票',
            results: '搜索结果',
            popular: '热门股票',
        },
        common: {
            loading: '加载中...',
            error: '发生错误',
        }
    }
}

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    useEffect(() => {
        const match = document.cookie.match(/(^| )openstock-lang=([^;]+)/);
        if (match) {
            const val = match[2];
            if (val === 'en' || val === 'zh') {
                setLanguage(val as Language);
            }
        } else {
            // Auto-detect browser language
            const browserLang = navigator.language;
            if (browserLang.includes('zh')) {
                setLanguage('zh');
            }
        }
    }, []);

    const handleSetLanguage = (l: Language) => {
        setLanguage(l);
        document.cookie = `openstock-lang=${l}; path=/; max-age=31536000`;
    };

    const t = (path: string): string => {
        const keys = path.split('.');
        let current: any = DICTIONARY[language];
        for (const key of keys) {
            if (current[key] === undefined) return path;
            current = current[key];
        }
        return typeof current === 'string' ? current : path;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
    return context;
};
