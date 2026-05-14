import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type AppPreferenceStoreType = {
  voiceId: string | null
  setVoiceId: (id: string) => void
}

export const useAppPreference = create<AppPreferenceStoreType>()(
  persist(
    (set) => ({
      voiceId: null,
      setVoiceId: (id) => set({ voiceId: id }),
    }),
    {
      name: 'app-preference',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
