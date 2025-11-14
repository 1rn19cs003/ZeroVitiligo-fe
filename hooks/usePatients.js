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

export function getPatientData(id) {
  return useQuery(['patient', id], () =>
    axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/patients/${id}`, {
      headers: {
        'Cache-Control': 'max-age=300',
      },
    })
      .then(res => {
        const responseObject = res.data.data || res.data || null;

        if (!responseObject || typeof responseObject !== 'object') {
          console.warn('No valid patient data found');
          return null;
        }
        const excludeFields = ['createdAt', 'assistantId', 'doctorId', 'id'];
        const filteredData = { ...responseObject };

        excludeFields.forEach(field => {
          if (field in filteredData) {
            delete filteredData[field];
          }
        });

        return filteredData;
      }),
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      enabled: !!id,
    }
  );
}
