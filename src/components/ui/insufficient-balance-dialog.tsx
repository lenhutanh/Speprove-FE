'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { WalletMinimal } from 'lucide-react'
import Link from 'next/link'
import route from '@/routes'

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
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className='sm:max-w-sm'>
        <DialogHeader>
          <div className='mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100'>
            <WalletMinimal className='h-6 w-6 text-amber-600' />
          </div>
          <DialogTitle className='text-center'>Không đủ số dư</DialogTitle>
          <DialogDescription className='text-center'>
            Số dư của bạn không đủ số dư để thực hiện chấm điểm. Vui lòng nạp
            thêm để tiếp tục.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex-col gap-2 sm:flex-col'>
          <Button asChild>
            <Link
              href={`${route.payment}?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              onClick={onClose}
            >
              Nạp điểm ngay
            </Link>
          </Button>
          <Button variant='ghost' onClick={onClose}>
            Để sau
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
