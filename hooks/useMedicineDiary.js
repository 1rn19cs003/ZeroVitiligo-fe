import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axios.config'

/**
 * Fetch medicine diary entries for a patient
 * @param {string} patientId - Patient ID
 */
export const useMedicineDiary = (patientId) => {
    return useQuery({
        queryKey: ['medicineDiary', patientId],
        queryFn: async () => {
            const { data } = await api.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/medicine-diary/${patientId}`);
            return data.data;
        },
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        enabled: !!patientId,
    });
};

/**
 * Create a new medicine diary entry
 */
export const useCreateMedicineDiary = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (entryData) => {
            const { data } = await api.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/medicine-diary`, entryData);
            return data.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['medicineDiary', variables.patientId]);
        },
    });
};

/**
 * Delete a medicine diary entry (Admin only)
 */
export const useDeleteMedicineDiary = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, patientId }) => {
            const { data } = await api.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/medicine-diary/${id}`);
            return { data, patientId };
        },
        onSuccess: (result) => {
            queryClient.invalidateQueries(['medicineDiary', result.patientId]);
        },
    });
};
