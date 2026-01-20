import { Avatar, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLogoutMutation } from '@/queries'
import route from '@/routes'
import Link from 'next/link'

export default function AccountDropdown() {
  const { mutate } = useLogoutMutation()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='self-center'>
        <Avatar className='h-10 w-10 cursor-pointer'>
          <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem asChild>
          <Link href={route.home}>
            <Avatar className='h-10 w-10'>
              <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
            </Avatar>
            <span className='font-semibold'>Lê Nhựt Anh</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault()
            mutate()
          }}
          className='cursor-pointer font-medium text-red-500'
        >
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
