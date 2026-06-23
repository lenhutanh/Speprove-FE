import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Link, usePathname } from '@/i18n/navigation'
import { useLogoutMutation } from '@/queries'
import route from '@/routes'
import { useAuthStore } from '@/store'
import { getInitials } from '@/utils'
import { useTranslations } from 'next-intl'

export default function AccountDropdown() {
  const common = useTranslations('common')
  const { mutate } = useLogoutMutation()
  const { user } = useAuthStore()
  const pathname = usePathname()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='cursor-pointer self-center'>
        <div className='flex items-center gap-2'>
          <Avatar className='h-10 w-10 cursor-pointer border shadow-xs'>
            <AvatarImage src={user?.avatarUrl} alt={user?.fullName} />
            <AvatarFallback className='font-semibold'>
              {getInitials(user?.fullName || user?.email)}
            </AvatarFallback>
          </Avatar>
          <span className='hidden text-sm font-semibold lg:inline'>
            {user?.fullName || user?.email}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem asChild>
          <Link href={route.account}>
            <Avatar className='h-10 w-10 border shadow-xs'>
              <AvatarImage src={user?.avatarUrl} alt={user?.fullName} />
              <AvatarFallback className='font-semibold'>
                {getInitials(user?.fullName || user?.email)}
              </AvatarFallback>
            </Avatar>
            <span className='font-semibold'>
              {user?.fullName || user?.username}
            </span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={`${route.payment}?returnUrl=${encodeURIComponent(pathname)}`}
            className='w-full cursor-pointer font-medium'
          >
            {common('recharge')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault()
            mutate()
          }}
          className='text-destructive cursor-pointer font-medium'
        >
          {common('logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
