import { create } from "zustand";

export const useDoctorStore = create((set) => ({
  data: [],
  columns: [],
  filters: {},

  setData: (data) => set({ data }),
  setColumns: (columns) => set({ columns }),
  setFilters: (filters) => set({ filters }),

  updateFilter: (col, value) =>
    set((state) => ({
      filters: { ...state.filters, [col]: value },
    })),
}));

export const useUserStore = create((set) => ({
  data: {},
  role: '',

  setData: (data) => set({ data }),
  setRole: (role) => set({ role }),
}));

export const useStateLoadingStore = create((set, get) => ({
  loadingCount: 0,
  loadingMessage: 'Loading...',

  startLoading: (message = 'Loading...') =>
    set((state) => ({
      loadingCount: state.loadingCount + 1,
      loadingMessage: message,
    })),

  stopLoading: () =>
    set((state) => ({
      loadingCount: Math.max(0, state.loadingCount - 1),
    })),

  isLoading: () => get().loadingCount > 0,

  // Legacy support - keeping for backward compatibility
  setIsLoading: (isLoading) =>
    set({ loadingCount: isLoading ? 1 : 0 }),
}));