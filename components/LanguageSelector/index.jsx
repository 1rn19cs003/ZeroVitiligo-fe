"use client";

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Globe } from 'lucide-react';
import styles from './styles.module.css';

export default function LanguageSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const { currentLanguage, changeLanguage, languages } = useLanguage();
    const dropdownRef = useRef(null);

    const currentLang = languages[currentLanguage];

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageChange = (langCode) => {
        changeLanguage(langCode);
        setIsOpen(false);
    };

    return (
        <div className={styles.languageSelector} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={styles.trigger}
                aria-label="Select language"
            >
                <Globe size={18} className={styles.icon} />
                <span className={styles.currentLang}>{currentLang?.flag} {currentLang?.nativeName}</span>
                <svg
                    className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                >
                    <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    {Object.values(languages).map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`${styles.option} ${currentLanguage === lang.code ? styles.active : ''}`}
                        >
                            <span className={styles.flag}>{lang.flag}</span>
                            <span className={styles.langName}>{lang.nativeName}</span>
                            {currentLanguage === lang.code && (
                                <svg className={styles.check} width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M13 4L6 11L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
