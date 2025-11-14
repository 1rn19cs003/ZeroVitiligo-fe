import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation(
    (appointmentData) =>axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/appointments`, appointmentData).then(res => res.data),
    {
      onSuccess: (response) => {
        // Invalidate or refetch any queries related to appointments so cache stays fresh
        console.log({response})
        console.log("Data Inserted successfully")
        queryClient.invalidateQueries('appointments');  // Or other related keys
      },
      onError: (error) => {
        console.error('Create Appointment failed:', error);
      },
    }
  );
}


export const getAppointmentStatus = () => {
  const response = useQuery('appointmentStatus', () =>
    axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/status/appointment`).then(res => {
      const data = res.data.data;
      return data;
    })
    , {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });
  return response;
};
