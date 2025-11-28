import axios from "axios";
import { refreshToken } from "../Utils/tokenRefresh";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  withCredentials: true
});

// Request interceptor - attempt token refresh before request if needed
api.interceptors.request.use(
  async (config) => {
    // Skip refresh for the refresh endpoint itself
    if (config._skipAuthRefresh) {
      return config;
    }

    // Check if user is authenticated
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');

      // If authenticated, try to refresh token proactively
      if (user) {
        try {
          await refreshToken(api);
        } catch (error) {
          // If refresh fails, let the request proceed
          // The response interceptor will handle auth errors
          console.log('Proactive token refresh failed, continuing with request');
        }
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const message = error?.response?.data?.message;

    // Handle token expiration
    if (
      error?.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest._skipAuthRefresh
    ) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const refreshed = await refreshToken(api);

        if (refreshed) {
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, proceed with logout
        console.error('Token refresh failed:', refreshError);
      }

      // If we get here, refresh failed - clear auth and redirect
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("authChanged"));

      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/login`;
      }
    }

    // Handle other auth errors
    if (
      error?.response?.status === 401 ||
      message === "Invalid access token" ||
      message === "Token expired"
    ) {
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("authChanged"));

      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/login`;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
