import { create } from 'zustand'

export type AppLoadingStore = {
  loading: boolean
  loadingCount: number
  startLoading: () => void
  stopLoading: () => void
  setLoading: (loading: boolean) => void
  withLoading: <T>(promise: Promise<T>) => Promise<T>
}

export const useAppLoadingStore = create<AppLoadingStore>((set) => ({
  loading: false,
  loadingCount: 0,
  startLoading: () =>
    set((state) => {
      const loadingCount = state.loadingCount + 1

      return {
        loading: true,
        loadingCount,
      }
    }),
  stopLoading: () =>
    set((state) => {
      const loadingCount = Math.max(0, state.loadingCount - 1)

      return {
        loading: loadingCount > 0,
        loadingCount,
      }
    }),
  setLoading: (loading) =>
    set({
      loading,
      loadingCount: loading ? 1 : 0,
    }),
  withLoading: async (promise) => {
    set((state) => ({
      loading: true,
      loadingCount: state.loadingCount + 1,
    }))

    try {
      return await promise
    } finally {
      set((state) => {
        const loadingCount = Math.max(0, state.loadingCount - 1)

        return {
          loading: loadingCount > 0,
          loadingCount,
        }
      })
    }
  },
}))
