import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLogoutMutation } from '@/queries'
import route from '@/routes'
import { useAuthStore } from '@/store'
import { getInitials } from '@/utils'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function AccountDropdown() {
  const common = useTranslations('common')
  const { mutate } = useLogoutMutation()
  const { user } = useAuthStore()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='self-center'>
        <Avatar className='h-10 w-10 cursor-pointer'>
          <AvatarImage src={user?.avatarUrl} alt={user?.fullName} />
          <AvatarFallback className='font-semibold'>
            {getInitials(user?.fullName || user?.email)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem asChild>
          <Link href={route.home}>
            <Avatar className='h-10 w-10'>
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
        <DropdownMenuItem>
          <Link href={route.payment} className='font-medium'>
            {common('recharge')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault()
            mutate()
          }}
          className='cursor-pointer font-medium text-red-500'
        >
          {common('logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
