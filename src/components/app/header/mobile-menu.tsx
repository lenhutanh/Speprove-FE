'use client'

import Button from '@/components/form/button'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { useNavigate } from '@/hooks'
import { usePathname } from '@/i18n/navigation'
import { cn } from '@/lib'
import { useLogoutMutation } from '@/queries'
import route from '@/routes'
import { useAuthStore } from '@/store/use-auth-store'
import { Menu } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

export default function MobileMenu() {
  const t = useTranslations('header.nav')
  const common = useTranslations('common')
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const { mutate: logout } = useLogoutMutation()

  const navItems = [
    { name: t('home'), href: route.home },
    { name: t('forecast'), href: route.forecast },
    { name: t('mock_test'), href: route.mockTest },
    { name: t('flashcards'), href: '/flashcards' },
  ]

  function handleNav(href: string) {
    setOpen(false)
    navigate(`${href}?callbackUrl=${encodeURIComponent(pathname)}`)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button className='text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-md transition-colors'>
          <Menu className='h-5 w-5' />
        </button>
      </DrawerTrigger>

      <DrawerContent className='px-4 pb-8'>
        <div className='mt-4 flex flex-col gap-1'>
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNav(item.href)}
              className={cn(
                'rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors',
                pathname === item.href
                  ? 'text-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted',
              )}
            >
              {item.name}
            </button>
          ))}

          <div className='border-border mt-2 flex flex-col gap-2 border-t pt-3'>
            {isAuthenticated ? (
              <Button
                onClick={() => {
                  logout()
                  setOpen(false)
                }}
                variant={'destructive'}
              >
                {common('logout')}
              </Button>
            ) : (
              <>
                <Button
                  variant='outline'
                  onClick={() => handleNav(route.login)}
                >
                  {common('login')}
                </Button>
                <Button onClick={() => handleNav(route.register)}>
                  {common('sign_up')}
                </Button>
              </>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
