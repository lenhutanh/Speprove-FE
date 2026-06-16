import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type AppPreferenceStoreType = {
  voiceId: string | null
  setVoiceId: (id: string) => void
  deviceId: string | null
  setDeviceId: (id: string | null) => void
}

export const useAppPreference = create<AppPreferenceStoreType>()(
  persist(
    (set) => ({
      voiceId: null,
      setVoiceId: (id) => set({ voiceId: id }),
      deviceId: null,
      setDeviceId: (id) => set({ deviceId: id }),
    }),
    {
      name: 'app-preference',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
