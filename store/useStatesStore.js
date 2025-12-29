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

  setIsLoading: (isLoading) =>
    set({ loadingCount: isLoading ? 1 : 0 }),
}));

// Not used code
export const usePatientStore = create((set, get) => ({
  selectedPatient: null,
  setSelectedPatient: (patient) => set({ selectedPatient: patient }),
  clearSelectedPatient: () => set({ selectedPatient: null }),
  updateSelectedPatient: (updates) =>
    set((state) => ({
      selectedPatient: state.selectedPatient
        ? { ...state.selectedPatient, ...updates }
        : null,
    })),

  getSelectedPatient: () => get().selectedPatient,
  hasSelectedPatient: () => get().selectedPatient !== null,
}));

export const useAuthStore = create((set, get) => {
  const getInitialUser = () => {
    if (typeof window === 'undefined') return null;
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  };

  return {
    user: getInitialUser(),
    isAuthenticated: !!getInitialUser(),

    setUser: (user) => {
      if (typeof window !== 'undefined') {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          window.dispatchEvent(new Event('authChanged'));
        } else {
          localStorage.removeItem('user');
          window.dispatchEvent(new Event('authChanged'));
        }
      }
      set({ user, isAuthenticated: !!user });
    },

    clearUser: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('authChanged'));
      }
      set({ user: null, isAuthenticated: false });
    },

    updateUser: (updates) => {
      const currentUser = get().user;
      if (currentUser) {
        const updatedUser = { ...currentUser, ...updates };
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(updatedUser));
          window.dispatchEvent(new Event('authChanged'));
        }
        set({ user: updatedUser });
      }
    },

    getUser: () => get().user,
    getUserId: () => get().user?.id || null,
    getUserRole: () => get().user?.role || null,
    syncWithLocalStorage: () => {
      const user = getInitialUser();
      set({ user, isAuthenticated: !!user });
    },
  };
});