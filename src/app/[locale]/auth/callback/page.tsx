'use client'

import { accountApiRequest } from '@/api-requests'
import { FullPageLoading } from '@/components/loading'
import { ErrorCodes } from '@/constants'
import { useNavigate } from '@/hooks'
import route from '@/routes'
import { useAuthStore } from '@/store'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

const oauthErrorCodes: string[] = [
  ErrorCodes.OAUTH_STATE_INVALID,
  ErrorCodes.GOOGLE_EMAIL_NOT_VERIFIED,
  ErrorCodes.GOOGLE_ACCOUNT_CONFLICT,
  ErrorCodes.GOOGLE_ACCOUNT_MISMATCH,
  ErrorCodes.GOOGLE_TOKEN_INVALID,
]

export default function AuthCallbackPage() {
  const searchParams = useSearchParams()
  const navigate = useNavigate(false)
  const hasHandled = useRef(false)
  const { setUser, setAuthenticated, logout } = useAuthStore()

  useEffect(() => {
    if (hasHandled.current) return

    hasHandled.current = true

    const syncProfile = async () => {
      const errorCode = searchParams.get('errorCode')

      if (errorCode && oauthErrorCodes.includes(errorCode)) {
        logout()
        navigate(`${route.login}?errorCode=${encodeURIComponent(errorCode)}`, {
          replace: true,
        })
        return
      }

      try {
        const profileRes = await accountApiRequest.getMe()

        if (profileRes.success && profileRes.data) {
          setUser(profileRes.data)
          setAuthenticated(true)
          navigate(route.home, {
            replace: true,
          })
          return
        }
      } catch {
        // Fall through to the shared failure redirect below.
      }

      logout()
      navigate(route.login, {
        replace: true,
      })
    }

    syncProfile()
  }, [logout, navigate, searchParams, setAuthenticated, setUser])

  return <FullPageLoading show />
}
