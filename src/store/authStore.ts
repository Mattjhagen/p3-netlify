import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, WalletConnection } from '@/types';

interface AuthState {
  // State
  isAuthenticated: boolean;
  user: User | null;
  walletConnection: WalletConnection | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setAuthenticated: (authenticated: boolean) => void;
  setUser: (user: User | null) => void;
  setWalletConnection: (connection: WalletConnection | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User, walletConnection: WalletConnection) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      user: null,
      walletConnection: null,
      isLoading: false,
      error: null,

      // Actions
      setAuthenticated: (authenticated: boolean) => {
        set({ isAuthenticated: authenticated });
      },

      setUser: (user: User | null) => {
        set({ user });
      },

      setWalletConnection: (connection: WalletConnection | null) => {
        set({ walletConnection: connection });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      login: (user: User, walletConnection: WalletConnection) => {
        set({
          isAuthenticated: true,
          user,
          walletConnection,
          error: null,
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          walletConnection: null,
          error: null,
        });
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              ...updates,
              updatedAt: new Date(),
            },
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'p3-auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        walletConnection: state.walletConnection,
      }),
    }
  )
);
