import { useTranslations } from 'next-intl'

export default function LandingPage() {
  const t = useTranslations('home')
  return (
    <div className='flex min-h-[60vh] flex-col items-center justify-center text-center'>
      <h1 className='text-4xl font-bold'>{t('title')}</h1>
      <p className='text-muted-foreground mt-4 text-xl'>{t('description')}</p>
    </div>
  )
}
