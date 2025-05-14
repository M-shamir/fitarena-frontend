// ~/Documents/fitarena/frontend/fitarena/src/store/authStore.ts
'use client'

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types';

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  role: 'user' | 'trainer' | 'stadium_owner' | 'admin' | null;
  loading: boolean;
  error: string | null;
};

type AuthActions = {
  login: (user: User) => void; // Changed to accept the whole user object
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      role: null,
      loading: false,
      error: null,
      
      login: (user) => set({
        user,
        isAuthenticated: true,
        role: user.role as AuthState['role'], // Get role from user object
        loading: false,
        error: null
      }),
      
      logout: () => set({
        user: null,
        isAuthenticated: false,
        role: null,
        loading: false,
        error: null
      }),
      
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        role: state.role
      }),
    }
  )
);

export default useAuthStore;