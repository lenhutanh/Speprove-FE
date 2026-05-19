'use client'

import { Container } from '@/components/layout'
import type { AccountTabKey } from '@/constants'
import { HEADER_HEIGHT } from '@/constants'
import { useQueryParams, useValidatedParams } from '@/hooks'
import { useAuthStore } from '@/store'
import { accountPageSchema } from '@/validations/account.schema'
import { useEffect } from 'react'
import AccountContent from './_components/account-content'
import AccountSidebar from './_components/account-sidebar'

export default function AccountPage() {
  const { tab } = useValidatedParams(accountPageSchema)
  const { user } = useAuthStore()
  const { setQueryParams } = useQueryParams<{ tab: AccountTabKey }>()

  const hasPassword = user?.hasPassword ?? false

  const activeTab =
    tab === 'change-password' && !hasPassword
      ? 'set-password'
      : tab === 'set-password' && hasPassword
        ? 'change-password'
        : tab

  useEffect(() => {
    if (!user) return
    if (activeTab === tab) return

    setQueryParams(
      {
        tab: activeTab === 'profile' ? undefined : activeTab,
      },
      { replace: true },
    )
  }, [activeTab, tab, setQueryParams, user])

  const handleChangeTab = (nextTab: AccountTabKey) => {
    setQueryParams(
      { tab: nextTab === 'profile' ? undefined : nextTab },
      { replace: true },
    )
  }

  if (!user) return null

  return (
    <Container
      style={{ minHeight: `calc(100vh - ${HEADER_HEIGHT}px)` }}
      className='bg-gray-100 py-4 sm:py-8'
    >
      <div className='flex flex-col gap-4 lg:flex-row lg:gap-8'>
        <AccountSidebar
          activeTab={activeTab}
          hasPassword={hasPassword}
          onChangeTab={handleChangeTab}
        />
        <AccountContent activeTab={activeTab} hasPassword={hasPassword} />
      </div>
    </Container>
  )
}
