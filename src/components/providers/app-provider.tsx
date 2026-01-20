'use client'

import { useProfileQuery } from '@/queries'
import { useAuthStore } from '@/store'
import { setData } from '@/utils'
import { useEffect } from 'react'

export default function AppProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { setUser, setLoading, setAuthenticated, logout } = useAuthStore()

  // React Query sẽ tự động fetch khi component mount
  const { data, isLoading, isError } = useProfileQuery()

  // Set theme một lần duy nhất
  useEffect(() => {
    setData('theme', 'light')
  }, [])

  useEffect(() => {
    setLoading(isLoading)

    if (data?.data) {
      setUser(data.data)
      setAuthenticated(true)
    } else if (!isLoading && isError) {
      logout()
    }
  }, [data, isLoading, isError, setUser, setAuthenticated, logout, setLoading])

  return <>{children}</>
}
