"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentData) =>
      axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/appointments`, appointmentData)
           .then(res => res.data),

    onSuccess: () => {
      console.log("Appointment created successfully");
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },

    onError: (error) => {
      console.error("Create Appointment failed:", error);
    }
  });
}

export function useAppointmentStatus() {
  return useQuery({
    queryKey: ['appointmentStatus'],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/status/appointment`);
      return res.data.data;
    },

    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
