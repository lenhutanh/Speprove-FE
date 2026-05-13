'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Link } from '@/i18n/navigation'
import route from '@/routes'
import { WalletMinimal } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface InsufficientBalanceDialogProps {
  open: boolean
  callbackUrl: string
  onClose: () => void
}

export function InsufficientBalanceDialog({
  open,
  callbackUrl,
  onClose,
}: InsufficientBalanceDialogProps) {
  const t = useTranslations('balance')

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className='sm:max-w-sm'>
        <DialogHeader>
          <div className='mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100'>
            <WalletMinimal className='h-6 w-6 text-amber-600' />
          </div>
          <DialogTitle className='text-center'>
            {t('insufficient_title')}
          </DialogTitle>
          <DialogDescription className='text-center'>
            {t('insufficient_desc')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex-col gap-2 sm:flex-col'>
          <Button asChild>
            <Link
              href={`${route.payment}?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              onClick={onClose}
            >
              {t('recharge_now')}
            </Link>
          </Button>
          <Button variant='ghost' onClick={onClose}>
            {t('later')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
