'use client'

import { FullPageLoading } from '@/components/loading'
import { useDefaultVoiceQuery, useProfileQuery } from '@/queries'
import { useAppLoadingStore, useAppPreference, useAuthStore } from '@/store'
import { useEffect } from 'react'

export default function AppProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const {
    setUser,
    setLoading,
    setAuthenticated,
    logout,
    isAuthenticated,
    user,
    loading: authLoading,
  } = useAuthStore()
  const { loading: appLoading } = useAppLoadingStore()
  const { voiceId, setVoiceId } = useAppPreference()

  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useProfileQuery(isAuthenticated)

  const { data: defaultVoiceData } = useDefaultVoiceQuery()

  useEffect(() => {
    setLoading(isProfileLoading)

    if (profileData?.data) {
      setUser(profileData.data)
      setAuthenticated(true)
    } else if (!isProfileLoading && isProfileError) {
      logout()
    }
  }, [
    profileData,
    isProfileLoading,
    isProfileError,
    setUser,
    setAuthenticated,
    logout,
    setLoading,
  ])

  useEffect(() => {
    if (isAuthenticated && user?.selectedVoiceId) {
      if (voiceId !== user.selectedVoiceId) {
        setVoiceId(user.selectedVoiceId)
      }
      return
    }

    if (!voiceId && defaultVoiceData?.data) {
      setVoiceId(defaultVoiceData.data.id || defaultVoiceData.data.id)
    }
  }, [isAuthenticated, user, voiceId, defaultVoiceData, setVoiceId])

  return (
    <>
      {children}
      <FullPageLoading show={authLoading || appLoading} />
    </>
  )
}
