import { fullLogo } from '@/assets'
import { Container } from '@/components/layout'
import route from '@/routes'
import Image from 'next/image'
import Link from 'next/link'
import Actions from './actions'
import NavBar from './navbar'

export default function Header() {
  return (
    <header className='relative z-9'>
      <Container className='mx-auto max-w-330'>
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
            <NavBar />
          </div>
          <Actions />
        </div>
      </Container>
    </header>
  )
}
