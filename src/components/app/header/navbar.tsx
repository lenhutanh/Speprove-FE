'use client'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib'
import route from '@/routes'
import { motion } from 'framer-motion' // Import motion
import { useTranslations } from 'next-intl'

export default function NavBar() {
  const t = useTranslations('header.nav')
  const pathName = usePathname()

  const navItems = [
    { name: t('home'), href: route.home },
    { name: t('forecast'), href: route.forecast },
    { name: t('mock_test'), href: route.mockTest },
  ]

  return (
    <div className='flex items-center gap-x-8'>
      {navItems.map((item) => {
        const isActive = pathName === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'text-muted-foreground hover:text-foreground relative pb-1.5 text-base font-medium transition-colors',
              isActive && 'text-foreground',
            )}
          >
            {item.name}

            {isActive && (
              <motion.div
                layoutId='activeUnderline'
                className='bg-primary absolute right-0 bottom-0 left-0 h-0.5'
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        )
      })}
    </div>
  )
}
