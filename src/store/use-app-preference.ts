import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type AppPreferenceType = {
  voiceId: string | null
  setVoiceId: (id: string) => void
}

export const useAppPreference = create<AppPreferenceType>()(
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
