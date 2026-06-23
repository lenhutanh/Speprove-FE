import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useNavigate } from '@/hooks'
import { CheckCircle2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface SuccessDialogProps {
  open: boolean
  points: number
  onClose: () => void
  returnUrl: string
}

export function SuccessDialog({
  open,
  points,
  onClose,
  returnUrl,
}: SuccessDialogProps) {
  const t = useTranslations('payment')
  const navigate = useNavigate()

  const handleContinue = () => {
    onClose()
    navigate(returnUrl)
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
            <Button className='w-full' onClick={handleContinue}>
              {t('continue_experience')}
            </Button>
            <Button variant='outline' className='w-full' onClick={onClose}>
              {t('close')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
