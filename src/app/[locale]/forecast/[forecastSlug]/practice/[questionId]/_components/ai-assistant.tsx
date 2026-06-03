import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface AIAssistantProps {
  options: { key: string; label: string }[]
  loading: boolean
  onOption: (key: string, label: string) => void
}

export default function AIAssistant({
  options,
  loading,
  onOption,
}: AIAssistantProps) {
  const t = useTranslations('practice.ai')

  return (
    <div className='flex flex-1 flex-col overflow-hidden'>
      <div className='flex-1 space-y-2.5 overflow-y-auto px-4 py-3'>
        {loading && (
          <div className='text-muted-foreground flex items-center gap-2 text-xs'>
            <Loader2 className='h-3.5 w-3.5 animate-spin' />
            {t('analyzing')}
          </div>
        )}
      </div>

      <div className='border-border flex-shrink-0 space-y-1.5 border-t px-4 py-2.5'>
        {options.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onOption(opt.key, opt.label)}
            disabled={loading}
            className='text-foreground border-border hover:bg-muted/50 flex w-full items-center justify-between rounded-lg border px-3 py-2 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50'
          >
            {opt.label}
            <span className='text-muted-foreground'>↗</span>
          </button>
        ))}
      </div>
    </div>
  )
}
