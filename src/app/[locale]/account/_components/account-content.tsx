'use client'

import { Separator } from '@/components/ui/separator'
import { AccountTabKey } from '@/constants'
import { useTranslations } from 'next-intl'
import { getAccountTabs } from './account-sidebar'
import ChangePasswordTab from './change-password-tab'
import ProfileTab from './profile-tab'
import SetPasswordTab from './set-password'

type AccountContentProps = {
  activeTab: AccountTabKey
  hasPassword: boolean
}

export default function AccountContent({
  activeTab,
  hasPassword,
}: AccountContentProps) {
  const t = useTranslations('account.tabs')
  const accountTabs = getAccountTabs(hasPassword, {
    profile: t('profile'),
    changePassword: t('change_password'),
    setPassword: t('set_password'),
  })
  const currentTab = accountTabs.find((tab) => tab.key === activeTab)

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />

      case 'change-password':
        return <ChangePasswordTab />

      case 'set-password':
        return <SetPasswordTab />

      default:
        return null
    }
  }

  return (
    <div className='w-full flex-1 rounded-xl bg-white'>
      <div className='px-4 py-4 sm:px-6'>
        <h1 className='text-xl font-semibold sm:text-2xl'>
          {currentTab?.label}
        </h1>
      </div>

      <Separator />

      <div className='p-4 sm:p-6'>{renderContent()}</div>
    </div>
  )
}
