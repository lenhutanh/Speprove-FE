import { AuthStoreType } from '@/types'
import { UserResType } from '@/types/account.type'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const useAuthStore = create<AuthStoreType>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: true,

      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setLoading: (loading) => set({ loading }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          loading: false,
        }),

      setUser: (user: UserResType | null) => set({ user }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
