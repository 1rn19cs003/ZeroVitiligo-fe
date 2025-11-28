/**
 * Token Refresh Utility
 * Handles automatic JWT token refresh during active user sessions
 */

let isRefreshing = false;
let refreshPromise = null;
let lastActivityTime = Date.now();
let refreshInterval = null;

// Track user activity
const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart'];
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; 
const REFRESH_INTERVAL = 10 * 60 * 1000; 

/**
 * Update last activity timestamp
 */
function updateActivity() {
    lastActivityTime = Date.now();
}

/**
 * Check if user is active
 */
export function isUserActive() {
    return Date.now() - lastActivityTime < INACTIVITY_TIMEOUT;
}

/**
 * Initialize activity tracking
 */
export function initActivityTracking() {
    if (typeof window === 'undefined') return;

    ACTIVITY_EVENTS.forEach(event => {
        window.addEventListener(event, updateActivity, { passive: true });
    });

    updateActivity();
}

/**
 * Cleanup activity tracking
 */
export function cleanupActivityTracking() {
    if (typeof window === 'undefined') return;

    ACTIVITY_EVENTS.forEach(event => {
        window.removeEventListener(event, updateActivity);
    });

    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
}

/**
 * Refresh the authentication token
 * @param {import('axios').AxiosInstance} api - Axios instance
 * @returns {Promise<boolean>} - Success status
 */
export async function refreshToken(api) {
    if (isRefreshing && refreshPromise) {
        return refreshPromise;
    }

    if (!isUserActive()) {
        console.log('User inactive, skipping token refresh');
        return false;
    }

    isRefreshing = true;

    refreshPromise = (async () => {
        try {
            // Try to refresh the token
            const response = await api.post(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/doctor/refresh-token`,
                {},
                {
                    withCredentials: true,
                    _skipAuthRefresh: true
                }
            );

            console.log('Token refreshed successfully');
            return true;
        } catch (error) {
            console.error('Token refresh failed:', error);

            if (error?.response?.status === 401) {
                localStorage.removeItem('user');
                window.dispatchEvent(new Event('authChanged'));
                if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                    window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/login`;
                }
            }

            return false;
        } finally {
            isRefreshing = false;
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}

/**
 * Start automatic token refresh interval
 * @param {import('axios').AxiosInstance} api - Axios instance
 */
export function startTokenRefreshInterval(api) {
    if (typeof window === 'undefined') return;

    if (refreshInterval) {
        clearInterval(refreshInterval);
    }

    refreshInterval = setInterval(() => {
        if (isUserActive()) {
            refreshToken(api);
        }
    }, REFRESH_INTERVAL);
}

/**
 * Stop automatic token refresh
 */
export function stopTokenRefreshInterval() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
}
