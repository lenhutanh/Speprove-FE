import { fullLogo } from '@/assets'
import { HEADER_HEIGHT } from '@/constants'
import { Link } from '@/i18n/navigation'
import route from '@/routes'
import Image from 'next/image'
import Actions from './actions'
import MobileMenu from './mobile-menu'
import NavBar from './navbar'

export default function Header() {
  return (
    <header
      className='sticky top-0 z-50 bg-white shadow-md'
      style={{ height: `${HEADER_HEIGHT}px` }}
    >
      <div className='mx-auto max-w-330'>
        <div className='flex justify-between py-5'>
          <div className='flex items-center gap-12'>
            <Link href={route.home}>
              <Image
                src={fullLogo}
                alt='Speprove Logo'
                height={32}
                width={167}
                priority
              />
            </Link>
            {/* Desktop nav */}
            <div className='hidden md:block'>
              <NavBar />
            </div>
          </div>

          <div className='flex items-center gap-3'>
            {/* Desktop actions */}
            <div className='hidden md:flex'>
              <Actions />
            </div>
            {/* Mobile hamburger */}
            <div className='md:hidden'>
              <MobileMenu />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
