"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './axios.config'
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useStateLoadingStore } from '@/store/useStatesStore';

export function useCreateAppointment() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { startLoading, stopLoading } = useStateLoadingStore();

  return useMutation({
    mutationFn: (appointmentData) =>
      api.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/appointments`, appointmentData)
        .then(res => res.data),

    onMutate: () => {
      startLoading('Creating appointment...');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient'] });
      queryClient.invalidateQueries({ queryKey: ['patientData'] });
      queryClient.invalidateQueries({ queryKey: ['appointmentStatus'] });
      toast.success('Appointment created successfully!');
      router.back();
    },
    onError: (error) => {
      const message = error.response.data.message;
      toast.error(message);
    },
    onSettled: () => {
      stopLoading();
    }
  });
}

export function useAppointmentStatus() {
  return useQuery({
    queryKey: ['appointmentStatus'],
    queryFn: async () => {
      const res = await api.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/status/appointment`);
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
      const res = await api.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/appointments/patient?patientId=${patientId}`);
      return res.data.data;
    },
    enabled: Boolean(patientId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  const { startLoading, stopLoading } = useStateLoadingStore();

  return useMutation({
    mutationFn: ({ appointmentId, updateData }) =>
      api.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/appointments?appointmentId=${appointmentId}`,
        updateData
      ).then(res => res.data),

    onMutate: () => {
      startLoading('Updating appointment...');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patientData'] });
      toast.success('Appointment updated successfully!');
    },
    onError: (error) => {
      const message = error?.response?.data?.message || 'Failed to update appointment.';
      toast.error(message);
    },
    onSettled: () => {
      stopLoading();
    }
  });
}

export function useRescheduleAppointment() {
  const queryClient = useQueryClient();
  const { startLoading, stopLoading } = useStateLoadingStore();

  return useMutation({
    mutationFn: ({ appointmentId, newDate, reason, medication, notes }) =>
      api.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/appointments/${appointmentId}/reschedule`, { appointmentDate: newDate, reason, medication, notes })
        .then(res => res.data),

    onMutate: () => {
      startLoading('Rescheduling appointment...');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient'] });
      queryClient.invalidateQueries({ queryKey: ['patientData'] });
      queryClient.invalidateQueries({ queryKey: ['appointmentStatus'] });
      toast.success('Appointment rescheduled successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to reschedule appointment';
      toast.error(message);
    },
    onSettled: () => {
      stopLoading();
    }
  });
}
