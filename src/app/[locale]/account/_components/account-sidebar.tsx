'use client'

import { Button } from '@/components/ui/button'
import type { AccountTabKey } from '@/constants'
import { CircleUserRound, LockKeyhole, type LucideIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

export type AccountTabLabels = {
  profile: string
  changePassword: string
  setPassword: string
}

type AccountSidebarProps = {
  activeTab: AccountTabKey
  hasPassword: boolean
  onChangeTab: (tab: AccountTabKey) => void
}

type AccountTabItem = {
  key: AccountTabKey
  label: string
  icon: LucideIcon
}

export const getAccountTabs = (
  hasPassword: boolean,
  labels: AccountTabLabels,
): AccountTabItem[] => [
  {
    key: 'profile',
    label: labels.profile,
    icon: CircleUserRound,
  },
  {
    key: hasPassword ? 'change-password' : 'set-password',
    label: hasPassword ? labels.changePassword : labels.setPassword,
    icon: LockKeyhole,
  },
]

export default function AccountSidebar({
  activeTab,
  hasPassword,
  onChangeTab,
}: AccountSidebarProps) {
  const t = useTranslations('account.tabs')
  const accountTabs = getAccountTabs(hasPassword, {
    profile: t('profile'),
    changePassword: t('change_password'),
    setPassword: t('set_password'),
  })

  return (
    <aside className='h-fit w-full shrink-0 rounded-2xl bg-white p-3 shadow-sm lg:w-72'>
      <nav className='flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible'>
        {accountTabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key

          return (
            <Button
              key={tab.key}
              type='button'
              variant={isActive ? 'default' : 'ghost'}
              onClick={() => onChangeTab(tab.key)}
              className='h-12 min-w-fit flex-1 justify-start gap-3 rounded-xl px-4 text-base font-medium whitespace-nowrap lg:flex-none'
            >
              <Icon className='size-5' />
              {tab.label}
            </Button>
          )
        })}
      </nav>
    </aside>
  )
}
