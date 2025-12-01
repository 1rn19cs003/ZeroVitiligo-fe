"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './axios.config'
import toast from 'react-hot-toast';

export function useDoctors() {
  return useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const res = await api.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/doctor`);
      return res.data.data;
    },

    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useDeleteDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doctorId) =>
      api.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/doctor/${doctorId}`)
        .then(res => res.data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast.success('Assistant deleted successfully!');
    },

    onError: (error) => {
      const message = error?.response?.data?.message || 'Failed to delete assistant.';
      toast.error(message);
    },
  });
}
