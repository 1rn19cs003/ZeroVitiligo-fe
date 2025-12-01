import { useLanguageContext } from '@/contexts/LanguageContext';
import translations from '@/locales';

export function useLanguage() {
    const { currentLanguage, changeLanguage, languages, isLoaded } = useLanguageContext();

    // Translation function
    const t = (key) => {
        const keys = key.split('.');
        let value = translations[currentLanguage];

        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                // Return key if translation not found
                console.warn(`Translation not found for key: ${key} in language: ${currentLanguage}`);
                return key;
            }
        }

        return value || key;
    };

    return {
        t,
        currentLanguage,
        changeLanguage,
        languages,
        isLoaded
    };
}
