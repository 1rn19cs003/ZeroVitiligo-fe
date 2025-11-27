"use client";

import { createContext, useState, useEffect, useContext } from 'react';

const LanguageContext = createContext();

export const SUPPORTED_LANGUAGES = {
    en: {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        flag: '🇬🇧'
    },
    hi: {
        code: 'hi',
        name: 'Hindi',
        nativeName: 'हिंदी',
        flag: '🇮🇳'
    }
};

export function LanguageProvider({ children }) {
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Load saved language preference from localStorage
        const savedLanguage = localStorage.getItem('preferredLanguage');

        if (savedLanguage && SUPPORTED_LANGUAGES[savedLanguage]) {
            setCurrentLanguage(savedLanguage);
        } else {
            // Try to detect browser language
            const browserLang = navigator.language.split('-')[0];
            if (SUPPORTED_LANGUAGES[browserLang]) {
                setCurrentLanguage(browserLang);
            }
        }

        setIsLoaded(true);
    }, []);

    const changeLanguage = (langCode) => {
        if (SUPPORTED_LANGUAGES[langCode]) {
            setCurrentLanguage(langCode);
            localStorage.setItem('preferredLanguage', langCode);
        }
    };

    const value = {
        currentLanguage,
        changeLanguage,
        languages: SUPPORTED_LANGUAGES,
        isLoaded
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguageContext() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguageContext must be used within a LanguageProvider');
    }
    return context;
}
