import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { BANK_BIN_MAP, PAYMENT_STATUS } from '@/constants'
import { useCountDown } from '@/hooks'
import { cn } from '@/lib/utils'
import { usePaymentQuery } from '@/queries'
import { PaymentResponse } from '@/types'
import { Clock, Copy } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect } from 'react'
import { toast } from 'sonner'

interface QRModalProps {
  open: boolean
  onClose: () => void
  payment: PaymentResponse | null
  onSuccess: (points: number) => void
  onFailed: () => void
}

const PAYMENT_EXPIRE_SECONDS = 15 * 60

export function QRModal({
  open,
  onClose,
  payment,
  onSuccess,
  onFailed,
}: QRModalProps) {
  const { display, isExpired } = useCountDown(open ? PAYMENT_EXPIRE_SECONDS : 0)

  const paymentQuery = usePaymentQuery(payment?.id, {
    enabled: !!payment?.id && open && !isExpired,
    refetchInterval: 2000,
  })

  useEffect(() => {
    const paymentDetail = paymentQuery.data?.data

    if (paymentDetail && paymentDetail.status === PAYMENT_STATUS.SUCCESS) {
      onSuccess(paymentDetail.points)
    }

    if (
      paymentDetail &&
      (paymentDetail.status === PAYMENT_STATUS.CANCELED ||
        paymentDetail.status === PAYMENT_STATUS.EXPIRED)
    ) {
      onFailed()
      onClose()
    }
  }, [paymentQuery.data, onSuccess, onFailed, onClose])

  useEffect(() => {
    if (!payment) return

    if (isExpired) {
      onFailed()
      onClose()
      toast.error('Mã QR đã hết hạn. Vui lòng tạo mã mới.')
    }
  }, [isExpired, payment, onFailed, onClose])

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`Đã sao chép ${label}`)
  }

  if (!payment) return null

  const bankName = BANK_BIN_MAP[payment.bin] ?? 'Ngân hàng'

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className='w-full gap-0 overflow-hidden p-0 sm:max-w-md'>
        <DialogHeader className='border-b px-5 pt-5 pb-4'>
          <DialogTitle className='text-base font-semibold'>
            Thanh toán
          </DialogTitle>
          <p className='text-muted-foreground mt-1 text-sm'>
            {payment.amount.toLocaleString('vi-VN')}đ
            <span className='text-muted-foreground/40 mx-1.5'>·</span>
            {payment.description}
          </p>
        </DialogHeader>

        <div className='space-y-4 px-5 py-4'>
          {/* QR Code */}
          <div className='flex flex-col items-center gap-3'>
            <div className='rounded-2xl border bg-white p-3'>
              <QRCodeSVG value={payment.qrCode} size={180} level='H' />
            </div>

            {/* Countdown */}
            <div
              className={cn(
                'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium',
                isExpired
                  ? 'bg-destructive/10 text-destructive'
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
              )}
            >
              <Clock className='h-3.5 w-3.5' />
              {isExpired ? 'Đã hết hạn' : `Hết hạn sau ${display}`}
            </div>
          </div>

          <Separator />

          {/* Bank info */}
          <div className='space-y-1'>
            <p className='text-muted-foreground mb-2 text-xs font-medium'>
              Thông tin chuyển khoản
            </p>
            <InfoRow label='Ngân hàng' value={bankName} />
            <InfoRow label='Chủ tài khoản' value={payment.accountName} />
            <InfoRow
              label='Số tài khoản'
              value={payment.accountNumber}
              onCopy={() =>
                copyToClipboard(payment.accountNumber, 'số tài khoản')
              }
            />
            <InfoRow
              label='Số tiền'
              value={`${payment.amount.toLocaleString('vi-VN')}đ`}
              valueClassName='text-primary font-semibold'
            />
            <InfoRow
              label='Nội dung CK'
              value={payment.description}
              onCopy={() =>
                copyToClipboard(payment.description, 'nội dung chuyển khoản')
              }
            />
          </div>

          <p className='text-muted-foreground pb-1 text-center text-xs'>
            Đang chờ xác nhận thanh toán...
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface InfoRowProps {
  label: string
  value: string
  onCopy?: () => void
  valueClassName?: string
}

function InfoRow({ label, value, onCopy, valueClassName }: InfoRowProps) {
  return (
    <div className='flex items-center justify-between border-b py-2 last:border-0'>
      <span className='text-muted-foreground text-xs'>{label}</span>
      <div className='flex items-center gap-1.5'>
        <span className={cn('text-xs font-medium', valueClassName)}>
          {value}
        </span>
        {onCopy && (
          <button
            onClick={onCopy}
            className='hover:bg-muted text-muted-foreground hover:text-foreground rounded p-1 transition-colors'
          >
            <Copy className='h-3 w-3' />
          </button>
        )}
      </div>
    </div>
  )
}
