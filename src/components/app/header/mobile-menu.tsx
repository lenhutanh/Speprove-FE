'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib'
import route from '@/routes'
import { useAuthStore } from '@/store/use-auth-store'
import { useNavigate } from '@/hooks'
import Button from '@/components/form/button'
import { useLogoutMutation } from '@/queries'
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from '@/components/ui/drawer'

export default function MobileMenu() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const { mutate: logout } = useLogoutMutation()

  const navItems = [
    { name: 'Trang chủ', href: route.home },
    { name: 'Forecast', href: '/forecast' },
    { name: 'Thi thử', href: '/test' },
    { name: 'Flashcards', href: '/flashcards' },
  ]

  function handleNav(href: string) {
    setOpen(false)
    navigate(href)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button className='flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors'>
          <Menu className='w-5 h-5' />
        </button>
      </DrawerTrigger>

      <DrawerContent className='px-4 pb-8'>
        <div className='flex flex-col gap-1 mt-4'>
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNav(item.href)}
              className={cn(
                'text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                pathname === item.href
                  ? 'text-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {item.name}
            </button>
          ))}

          <div className='border-t border-border mt-2 pt-3 flex flex-col gap-2'>
            {isAuthenticated ? (
              <Button
                onClick={() => { logout(); setOpen(false) }}
                variant={'destructive'}
              >
                Đăng xuất
              </Button>
            ) : (
              <>
                <Button variant='outline' onClick={() => handleNav(route.login)}>
                  Đăng nhập
                </Button>
                <Button onClick={() => handleNav(route.register)}>
                  Đăng ký
                </Button>
              </>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}