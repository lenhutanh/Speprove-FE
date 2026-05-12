'use client'
import { cn } from '@/lib'
import { motion } from 'framer-motion' // Import motion
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavBar() {
  const t = useTranslations('header.nav')
  const pathName = usePathname()

  return (
    <div className='flex items-center gap-x-8'>
      {navItems.map((item) => {
        const isActive = pathName === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'hover:text-primary relative pb-1 font-medium transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground',
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
