"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentData) =>
      axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/appointments`, appointmentData)
        .then(res => res.data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Appointment created successfully!');
    },
    onError: (error) => {
      const message = error.response.data.message;
      toast.error(message);
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

export function useAppointmentsByPatient(patientId) {
  return useQuery({
    queryKey: ['patientData', patientId],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/appointments/patient?patientId=${patientId}`);
      return res.data.data;
    },
    enabled: Boolean(patientId),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appointmentId, updateData }) =>
      axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/appointments?appointmentId=${appointmentId}`,
        updateData
      ).then(res => res.data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patientData'] });
      toast.success('Appointment updated successfully!');
    },

    onError: (error) => {
      const message = error?.response?.data?.message || 'Failed to update appointment.';
      toast.error(message);
    }
  });
}
