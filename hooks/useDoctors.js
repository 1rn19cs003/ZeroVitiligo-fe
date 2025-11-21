"use client";

import { useQuery } from '@tanstack/react-query';
import api from './axios.config'

export function useDoctors() {
  return useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const res = await api.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/doctor`);
      return res.data.data;
    },

    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
