"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import axios from 'axios';
import toast from 'react-hot-toast';

export function usePatients() {
  return useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/patients/`
      );
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,  // 5 min
    gcTime: 10 * 60 * 1000,    // replaces cacheTime
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useStatus() {
  return useQuery({
    queryKey: ['status'],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/status`
      );
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function usePatientData(id) {
  return useQuery({
    queryKey: ['patient', id],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/patients/${id}`,
        {
          headers: {
            'Cache-Control': 'max-age=300',
          },
        }
      );

      const responseObject = res.data.data || res.data || null;

      if (!responseObject || typeof responseObject !== 'object') {
        console.warn('No valid patient data found');
        return null;
      }

      const excludeFields = ['createdAt', 'assistantId', 'doctorId'];
      const filteredData = { ...responseObject };

      excludeFields.forEach(field => {
        delete filteredData[field];
      });

      return filteredData;
    },

    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!id,
  });
}

export function useUpdatePatient(patientId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updateData) =>
      axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/patients/${patientId}`, updateData)
        .then(res => res.data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient', patientId] });
      toast.success('Patient data updated successfully!');
    },

    onError: (error) => {
      const message = error?.response?.data?.message || 'Failed to update patient data.';
      toast.error(message);
    },
  });
}
