'use client'

import { logo } from '@/assets'
import { Link } from '@/i18n/navigation'
import route from '@/routes'
import { useAuthStore } from '@/store/use-auth-store'
import Image from 'next/image'

export default function PointsBadge() {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated || user == null) return null

  const balance = user.balance ?? 0
  const formatted = balance.toLocaleString()

  return (
    <Link
      href={route.payment}
      className='bg-muted/60 hover:bg-muted border-border flex h-9 items-center gap-1.5 rounded-full border px-3 transition-colors'
    >
      <Image src={logo} alt='Points' width={14} height={14} />
      <span className='text-foreground text-sm font-semibold tabular-nums'>
        {formatted}
      </span>
    </Link>
  )
}
