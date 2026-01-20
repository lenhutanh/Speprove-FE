'use client'
import Button from '@/components/form/button'
import { useNavigate } from '@/hooks'
import route from '@/routes'
import { useAuthStore } from '@/store/use-auth-store'
import AccountDropdown from './account-dropdown'

export default function Actions() {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  return (
    <div className='flex gap-3'>
      {isAuthenticated ? (
        <AccountDropdown />
      ) : (
        <>
          <Button variant={'outline'} onClick={() => navigate(route.login)}>
            Đăng nhập
          </Button>
          <Button onClick={() => navigate(route.register)}>Đăng ký</Button>
        </>
      )}
    </div>
  )
}
