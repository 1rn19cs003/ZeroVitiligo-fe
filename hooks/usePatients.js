"use client";

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// ------------------------------------
// ✔ Get All Patients (v5 syntax)
// ------------------------------------
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

// ------------------------------------
// ✔ Get Status (v5 syntax)
// ------------------------------------
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

// ------------------------------------
// ✔ Get Single Patient by ID (v5 syntax)
// ------------------------------------
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
