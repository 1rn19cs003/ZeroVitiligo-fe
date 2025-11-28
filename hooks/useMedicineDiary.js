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
            const { data } = await api.get(`/medicine-diary/${patientId}`);
            return data.data;
        },
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
            const { data } = await api.post('/medicine-diary', entryData);
            return data.data;
        },
        onSuccess: (_, variables) => {
            // Invalidate and refetch medicine diary for this patient
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
            const { data } = await api.delete(`/medicine-diary/${id}`);
            return { data, patientId };
        },
        onSuccess: (result) => {
            // Invalidate and refetch medicine diary for this patient
            queryClient.invalidateQueries(['medicineDiary', result.patientId]);
        },
    });
};
