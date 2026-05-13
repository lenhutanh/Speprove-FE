'use client'

import { notFound as notFoundImg } from '@/assets'
import { Header } from '@/components/app/header'
import { Container } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import route from '@/routes'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

export default function NotFoundPage() {
  const t = useTranslations('not_found')

  return (
    <>
      <Header />
      <Container contentClassName='mx-auto flex flex-col items-center min-h-[80vh] justify-center bg-white text-center'>
        <Image
          src={notFoundImg}
          width={400}
          height={100}
          alt={t('title')}
          priority
        />
        <h1 className='mt-8 text-2xl font-bold'>{t('title')}</h1>
        <p className='mt-2 mb-4 text-gray-600'>{t('description')}</p>
        <Button asChild>
          <Link href={route.home}>{t('back_home')}</Link>
        </Button>
      </Container>
    </>
  )
}
