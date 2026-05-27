import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        const res = await api.post('/auth/login', { email, password });
        const { accessToken, refreshToken, user } = res.data.data;
        set({ token: accessToken, refreshToken, user, isAuthenticated: true, isLoading: false });
        return user;
      },

      register: async (data) => {
        set({ isLoading: true });
        const res = await api.post('/auth/register', data);
        const { accessToken, refreshToken, user } = res.data.data;
        set({ token: accessToken, refreshToken, user, isAuthenticated: true, isLoading: false });
        return user;
      },

      logout: () => {
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
      },

      updateUser: (updates) => {
        set(state => ({ user: { ...state.user, ...updates } }));
      },

      refreshSession: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return;
        try {
          const res = await api.post(`/auth/refresh?refreshToken=${refreshToken}`);
          const { accessToken, refreshToken: newRefresh, user } = res.data.data;
          set({ token: accessToken, refreshToken: newRefresh, user, isAuthenticated: true });
        } catch {
          get().logout();
        }
      },
    }),
    {
      name: 'voro-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const useThemeStore = create(
  persist(
    (set, get) => ({
      isDark: false,
      toggle: () => {
        const newVal = !get().isDark;
        set({ isDark: newVal });
        document.documentElement.classList.toggle('dark', newVal);
      },
      init: () => {
        const { isDark } = get();
        document.documentElement.classList.toggle('dark', isDark);
      },
    }),
    { name: 'voro-theme' }
  )
);
