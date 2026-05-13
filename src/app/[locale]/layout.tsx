import {
  AppProvider,
  QueryProvider,
  ThemeProvider,
} from '@/components/providers'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { routing } from '@/i18n/routing'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { Geist, Geist_Mono } from 'next/font/google'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <html suppressHydrationWarning lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <ThemeProvider
              attribute='class'
              defaultTheme='light'
              enableSystem
              disableTransitionOnChange
            >
              <AppProvider>
                <TooltipProvider>
                  <Suspense>{children}</Suspense>
                  <Toaster position='bottom-right' richColors closeButton />
                </TooltipProvider>
              </AppProvider>
            </ThemeProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
