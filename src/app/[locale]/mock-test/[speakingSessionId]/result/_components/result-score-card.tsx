'use client'

import { BAND_SCORE_TEXT_VARIANTS } from '@/constants'
import { cn, getBandScoreMeta } from '@/lib'
import { SpeakingSessionResponseDto, VoiceType } from '@/types'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Calendar, ListTodo, User } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface ResultScoreCardProps {
  session: SpeakingSessionResponseDto
  examinerVoice?: VoiceType
}

const getAccentLabel = (localeCode: string) => {
  const lower = localeCode.toLowerCase()
  if (lower.includes('gb') || lower.includes('uk')) return 'Giọng Anh-Anh'
  if (lower.includes('us')) return 'Giọng Anh-Mỹ'
  if (lower.includes('au')) return 'Giọng Anh-Úc'
  if (lower.includes('in')) return 'Giọng Anh-Ấn'
  return localeCode
}

export function ResultScoreCard({
  session,
  examinerVoice,
}: ResultScoreCardProps) {
  const t = useTranslations('mock_test.result')
  const tSetup = useTranslations('mock_test.setup')

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'mock_p1':
        return tSetup('modes.mock_p1.label')
      case 'mock_p2':
        return tSetup('modes.mock_p2.label')
      case 'mock_p3':
        return tSetup('modes.mock_p3.label')
      case 'full_test':
        return tSetup('modes.full_test.label')
      default:
        return type
    }
  }

  const finishedDate = session.finishedAt ? new Date(session.finishedAt) : null
  const formattedDate =
    finishedDate && !isNaN(finishedDate.getTime())
      ? format(finishedDate, 'dd MMM yyyy • HH:mm', { locale: vi })
      : 'N/A'

  const examinerName = examinerVoice
    ? `${examinerVoice.name} (${getAccentLabel(examinerVoice.locale)})`
    : 'AI Examiner'

  const overallScore = session.result?.overall ?? 0
  const fluencyScore = session.result?.fluency ?? 0
  const pronunciationScore = session.result?.pronunciation ?? 0
  const lexicalScore = session.result?.lexical ?? 0
  const grammarScore = session.result?.grammar ?? 0

  const overallMeta = getBandScoreMeta(overallScore)
  const fluencyMeta = getBandScoreMeta(fluencyScore)
  const pronunciationMeta = getBandScoreMeta(pronunciationScore)
  const lexicalMeta = getBandScoreMeta(lexicalScore)
  const grammarMeta = getBandScoreMeta(grammarScore)

  const totalQuestions = session.attempts?.length ?? 0

  return (
    <div className='bg-card border-border rounded-xl border p-5 transition-all sm:p-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-1.5'>
          <h1 className='text-muted-foreground text-xs font-semibold tracking-wide uppercase sm:text-sm'>
            {getTypeLabel(session.type)}
          </h1>
          <div className='flex items-baseline gap-2.5'>
            <span
              className={cn(
                'text-4xl font-extrabold tracking-tight sm:text-5xl',
                BAND_SCORE_TEXT_VARIANTS[overallMeta.variant],
              )}
            >
              {overallScore > 0 ? overallScore.toFixed(1) : '—'}
            </span>
            <span className='text-muted-foreground text-sm font-medium'>
              {t('overall_band')}
            </span>
          </div>
        </div>
      </div>

      <div className='my-5 grid grid-cols-2 gap-3 sm:grid-cols-4'>
        <div className='bg-muted/30 border-border/50 hover:bg-muted/40 dark:border-border/40 flex flex-col items-center justify-center rounded-xl border p-3.5 text-center transition-all'>
          <span className='text-muted-foreground mb-1 text-xs font-semibold'>
            {t('criteria.fluency')}
          </span>
          <span
            className={cn(
              'text-2xl font-bold tracking-tight',
              BAND_SCORE_TEXT_VARIANTS[fluencyMeta.variant],
            )}
          >
            {fluencyScore > 0 ? fluencyScore.toFixed(1) : '—'}
          </span>
        </div>
        <div className='bg-muted/30 border-border/50 hover:bg-muted/40 dark:border-border/40 flex flex-col items-center justify-center rounded-xl border p-3.5 text-center transition-all'>
          <span className='text-muted-foreground mb-1 text-xs font-semibold'>
            {t('criteria.pronunciation')}
          </span>
          <span
            className={cn(
              'text-2xl font-bold tracking-tight',
              BAND_SCORE_TEXT_VARIANTS[pronunciationMeta.variant],
            )}
          >
            {pronunciationScore > 0 ? pronunciationScore.toFixed(1) : '—'}
          </span>
        </div>
        <div className='bg-muted/30 border-border/50 hover:bg-muted/40 dark:border-border/40 flex flex-col items-center justify-center rounded-xl border p-3.5 text-center transition-all'>
          <span className='text-muted-foreground mb-1 text-xs font-semibold'>
            {t('criteria.lexical')}
          </span>
          <span
            className={cn(
              'text-2xl font-bold tracking-tight',
              BAND_SCORE_TEXT_VARIANTS[lexicalMeta.variant],
            )}
          >
            {lexicalScore > 0 ? lexicalScore.toFixed(1) : '—'}
          </span>
        </div>
        <div className='bg-muted/30 border-border/50 hover:bg-muted/40 dark:border-border/40 flex flex-col items-center justify-center rounded-xl border p-3.5 text-center transition-all'>
          <span className='text-muted-foreground mb-1 text-xs font-semibold'>
            {t('criteria.grammar')}
          </span>
          <span
            className={cn(
              'text-2xl font-bold tracking-tight',
              BAND_SCORE_TEXT_VARIANTS[grammarMeta.variant],
            )}
          >
            {grammarScore > 0 ? grammarScore.toFixed(1) : '—'}
          </span>
        </div>
      </div>

      <div className='text-muted-foreground flex flex-col flex-wrap gap-4 text-xs sm:flex-row sm:items-center sm:gap-6 sm:text-sm'>
        <div className='flex items-center gap-1.5'>
          <Calendar className='text-muted-foreground/85 size-4' />
          <span>{t('completed_on', { date: formattedDate })}</span>
        </div>
        <div className='flex items-center gap-1.5'>
          <User className='text-muted-foreground/85 size-4' />
          <span>{t('examiner', { name: examinerName })}</span>
        </div>
        <div className='flex items-center gap-1.5'>
          <ListTodo className='text-muted-foreground/85 size-4' />
          <span>{t('total_questions', { count: String(totalQuestions) })}</span>
        </div>
      </div>
    </div>
  )
}
