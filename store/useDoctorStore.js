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

