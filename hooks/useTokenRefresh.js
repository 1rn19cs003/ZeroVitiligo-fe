/**
 * React hook for managing JWT token refresh
 */
"use client";

import { useEffect } from 'react';
import api from './axios.config';
import {
    initActivityTracking,
    cleanupActivityTracking,
    startTokenRefreshInterval,
    stopTokenRefreshInterval,
    refreshToken
} from '../utils/tokenRefresh';

export function useTokenRefresh() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const user = localStorage.getItem('user');
        if (!user) return;

        console.log('Initializing token refresh system');

        initActivityTracking();

        startTokenRefreshInterval(api);

        refreshToken(api).catch(err => {
            console.log('Initial token refresh failed:', err);
        });

        return () => {
            console.log('Cleaning up token refresh system');
            cleanupActivityTracking();
            stopTokenRefreshInterval();
        };
    }, []);
}
