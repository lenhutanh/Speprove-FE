import { AuthStoreType } from '@/types'
import { UserResType } from '@/types/account.type'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const useAuthStore = create<AuthStoreType>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setLoading: (isLoading) => set({ isLoading }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setUser: (user: UserResType | null) => set({ user }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
