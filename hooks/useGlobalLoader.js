import { useCallback, useRef, useEffect } from 'react';
import { useStateLoadingStore } from '@/store/useStatesStore';

/**
 * Custom hook for managing global loading state
 * @returns {Object} Loading control methods
 */
export function useGlobalLoader() {
    const { startLoading, stopLoading } = useStateLoadingStore();
    const loadingCountRef = useRef(0);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // Stop all loading states initiated by this component
            for (let i = 0; i < loadingCountRef.current; i++) {
                stopLoading();
            }
        };
    }, [stopLoading]);

    /**
     * Show the global loader with an optional message
     * @param {string} message - Loading message to display
     */
    const showLoader = useCallback((message = 'Loading...') => {
        loadingCountRef.current++;
        startLoading(message);
    }, [startLoading]);

    /**
     * Hide the global loader
     */
    const hideLoader = useCallback(() => {
        if (loadingCountRef.current > 0) {
            loadingCountRef.current--;
            stopLoading();
        }
    }, [stopLoading]);

    /**
     * Wrap an async function with automatic loader management
     * @param {Function} asyncFn - Async function to wrap
     * @param {string} message - Loading message to display
     * @returns {Function} Wrapped function
     */
    const withLoader = useCallback((asyncFn, message = 'Loading...') => {
        return async (...args) => {
            showLoader(message);
            try {
                const result = await asyncFn(...args);
                return result;
            } finally {
                hideLoader();
            }
        };
    }, [showLoader, hideLoader]);

    return {
        showLoader,
        hideLoader,
        withLoader,
    };
}
