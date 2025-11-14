import { useQuery } from 'react-query';
import axios from 'axios';

export function getPatients() {
  const response = useQuery('patients', () =>
    axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/patients/`).then(res => {
      return res.data.data;
    }),
    {
      staleTime: 5 * 60 * 1000, // cache valid for 5 minutes
      cacheTime: 10 * 60 * 1000, // keep cache for 10 minutes
      refetchOnWindowFocus: false, // do not refetch on window focus
      refetchOnReconnect: false,  // do not refetch on reconnect
    });
  return response;
}


export const getStatus = () => {
  const response = useQuery('status', () =>
    axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/status`).then(res => {
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
