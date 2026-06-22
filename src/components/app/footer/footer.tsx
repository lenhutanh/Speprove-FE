'use client'

import { fullLogo, fullLogoDark } from '@/assets'
import { Container } from '@/components/layout'
import { Link } from '@/i18n/navigation'
import route from '@/routes'
import { Globe, Heart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

export default function Footer() {
  const t = useTranslations('footer')
  const currentYear = new Date().getFullYear()

  return (
    <footer className='bg-card border-border/40 text-foreground w-full border-t py-12 md:py-16'>
      <Container>
        <div className='grid grid-cols-1 gap-8 pb-12 md:grid-cols-12 md:gap-12'>
          {/* Logo and Brand Description Column */}
          <div className='col-span-1 space-y-4 md:col-span-5'>
            <Link href={route.home} className='inline-block'>
              <Image
                src={fullLogo}
                alt='Speprove Logo'
                height={32}
                width={167}
                className='dark:hidden'
              />
              <Image
                src={fullLogoDark}
                alt='Speprove Logo'
                height={32}
                width={167}
                className='hidden dark:block'
              />
            </Link>
            <p className='text-muted-foreground max-w-sm text-sm leading-relaxed'>
              {t('about')}
            </p>
          </div>

          {/* Nav Links Column 1: Products */}
          <div className='col-span-1 space-y-3.5 md:col-span-2'>
            <h4 className='text-foreground/70 text-xs font-semibold tracking-wider uppercase'>
              {t('product')}
            </h4>
            <ul className='space-y-2.5 text-sm'>
              <li>
                <Link
                  href={route.forecast}
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Forecast
                </Link>
              </li>
              <li>
                <Link
                  href={route.mockTest}
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Mock Test
                </Link>
              </li>
              <li>
                <Link
                  href={route.payment}
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  {useTranslations('payment')('title')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Links Column 2: Support */}
          <div className='col-span-1 space-y-3.5 md:col-span-2'>
            <h4 className='text-foreground/70 text-xs font-semibold tracking-wider uppercase'>
              {t('support')}
            </h4>
            <ul className='space-y-2.5 text-sm'>
              <li>
                <Link
                  href='#'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  {t('instructions')}
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Links Column 3: Legal */}
          <div className='col-span-1 space-y-3.5 md:col-span-3'>
            <h4 className='text-foreground/70 text-xs font-semibold tracking-wider uppercase'>
              {t('legal')}
            </h4>
            <ul className='space-y-2.5 text-sm'>
              <li>
                <Link
                  href='#'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  {t('terms')}
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  {t('privacy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Section */}
        <div className='border-border/30 text-muted-foreground flex flex-col items-center justify-between gap-4 border-t pt-8 text-xs sm:flex-row'>
          <p>{t('copyright', { year: currentYear.toString() })}</p>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-1'>
              <Globe className='h-3.5 w-3.5' />
              <span>Tiếng Việt</span>
            </div>
            <div className='flex items-center gap-1'>
              <span>Made with</span>
              <Heart className='h-3 w-3 fill-red-500 text-red-500' />
              <span>by Speprove</span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
