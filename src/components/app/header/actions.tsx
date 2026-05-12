'use client'
import Button from '@/components/form/button'
import route from '@/routes'
import { useAuthStore } from '@/store/use-auth-store'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AccountDropdown from './account-dropdown'

export default function Actions() {
  const common = useTranslations('common')
  const { isAuthenticated } = useAuthStore()
  const pathname = usePathname()

  return (
    <div className='flex gap-3'>
      {isAuthenticated ? (
        <AccountDropdown />
      ) : (
        <>
          <Button variant={'outline'} asChild>
            <Link
              href={`${route.login}?callbackUrl=${encodeURIComponent(pathname)}`}
            >
              {common('login')}
            </Link>
          </Button>
          <Button asChild>
            <Link href={route.register}>{common('sign_up')}</Link>
          </Button>
        </>
      )}
    </div>
  )
}
