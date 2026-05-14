import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useCountDown, useNavigate } from '@/hooks'
import route from '@/routes'
import { CheckCircle2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'

interface SuccessDialogProps {
  open: boolean
  points: number
  onClose: () => void
}

const AUTO_REDIRECT_SECONDS = 5

export function SuccessDialog({ open, points, onClose }: SuccessDialogProps) {
  const t = useTranslations('payment')
  const navigate = useNavigate()

  const { remaining, isExpired } = useCountDown(
    open ? AUTO_REDIRECT_SECONDS : 0,
  )

  useEffect(() => {
    if (open && isExpired) {
      onClose()
      navigate(route.forecast)
    }
  }, [open, isExpired])

  const handlePractice = () => {
    onClose()
    navigate(route.forecast)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className='w-full p-6 text-center sm:max-w-sm'>
        <div className='flex flex-col items-center gap-4'>
          <div className='flex h-14 w-14 items-center justify-center rounded-full bg-green-50 dark:bg-green-950/30'>
            <CheckCircle2 className='h-7 w-7 text-green-600 dark:text-green-400' />
          </div>

          <div>
            <h2 className='text-foreground text-lg font-semibold'>
              {t('success_title')}
            </h2>
            <p className='text-muted-foreground mt-1 text-sm'>
              {t('success_message', { points: String(points) })}
            </p>
          </div>

          <div className='w-full space-y-2'>
            <Button className='w-full' onClick={handlePractice}>
              {t('start_practice')}
            </Button>
            <p className='text-muted-foreground text-xs'>
              {t('auto_redirect', { remaining: String(remaining) })}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
