"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './axios.config'
import toast from 'react-hot-toast';

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userData) => {
      const res = await api.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/doctor/register`,
        userData,
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Registration successful!");
      queryClient.invalidateQueries(["doctors"]);
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Registration failed.";
      toast.error(message);
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials) => {
      const res = await api.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/doctor/login`,
        credentials,
        { withCredentials: true }
      );

      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        window.dispatchEvent(new Event("authChanged"));
      }
      return res.data.user;
    },
    onSuccess: () => {
      toast.success("Login successful!");
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Login failed.";
      toast.error(message);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        await api.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/doctor/logout`,
          {},
          { withCredentials: true }
        );
      } catch (e) {
        console.log("Logout error:", e);
      }

      // Clear local storage
      localStorage.removeItem("user");

      // Dispatch auth changed event
      window.dispatchEvent(new Event("authChanged"));

      return true;
    },
    onSuccess: () => {
      // Invalidate all queries
      queryClient.clear();

      toast.success("Logged out successfully");

      // Redirect to home page
      setTimeout(() => {
        window.location.href = process.env.NEXT_PUBLIC_BASE_URL || "/";
      }, 500);
    },
    onError: (error) => {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  });
}


export function useGetProfile() {
  return useQuery({
    queryKey: ['doctorProfile'],
    queryFn: async () => {
      const res = await api.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/doctor/profile`);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useGetProfileById(profileId) {
  return useQuery({
    queryKey: ['doctorProfileById', profileId],
    queryFn: async () => {
      if (!profileId) {
        throw new Error('Doctor ID is required');
      }
      const res = await api.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/doctor/profileId?profileId=${profileId}`);
      return res.data;
    },
    enabled: !!profileId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData) => {
      const res = await api.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/doctor/profile`, profileData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctorProfile', 'doctorProfileById'] });
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      console.log(error?.response?.data?.message);
      toast.error("Failed to update profile.");
    }
  });
}

export function useIsAuthenticated() {
  return () => {
    if (typeof window === "undefined") return false;
    const user = localStorage.getItem("user");
    return !!user;
  };
}


export function useGetCurrentUser() {
  return () => {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  };
}

export const useGetVisitorCount = () => {
  return useQuery({
    queryKey: ['visitorCount'],
    queryFn: async () => {
      const res = await api.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/visitor/count`);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export const useIncrementVisitorCount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await api.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/visitor/increment`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitorCount'] });
    },
    onError: (error) => {
      console.log(error?.response?.data?.message);
      toast.error("Failed to increment visitor count.");
    }
  });
}