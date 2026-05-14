'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { PAYMENT_METHOD } from '@/constants'
import { useCreditPackageListQuery } from '@/queries'
import { useCreatePaymentMutation } from '@/queries/payment.query'
import { useAppLoadingStore } from '@/store'
import { CreditPackage, PaymentResponse } from '@/types'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'
import { PackageCard } from './_components/package-card'
import { PaymentMethodSelector } from './_components/payment-method'
import { QRModal } from './_components/qr-modal'
import { SuccessDialog } from './_components/success-dialog'

export default function PaymentPage() {
  const t = useTranslations('payment')
  const tCommon = useTranslations('common')
  const { data } = useCreditPackageListQuery()
  const createPaymentMutation = useCreatePaymentMutation()
  const { withLoading } = useAppLoadingStore()
  const packages = data?.data || []

  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(
    null,
  )
  const [selectedMethod, setSelectedMethod] = useState<string>(
    PAYMENT_METHOD.BANK_TRANSFER,
  )
  const [qrOpen, setQrOpen] = useState(false)
  const [payment, setPayment] = useState<PaymentResponse | null>(null)
  const [successOpen, setSuccessOpen] = useState(false)
  const [successData, setSuccessData] = useState({ points: 0 })

  const handleCreateQR = async () => {
    if (!selectedPackage) {
      toast.error(t('select_package_error'))
      return
    }

    try {
      const res = await withLoading(
        createPaymentMutation.mutateAsync({
          packageId: selectedPackage._id,
          method: selectedMethod,
        }),
      )

      if (res.success && res.data) {
        setPayment(res.data)
        setQrOpen(true)
      } else {
        toast.error(res.message ?? tCommon('generic_error'))
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : tCommon('generic_error')

      toast.error(message)
    }
  }

  const handleSuccess = (points: number) => {
    setQrOpen(false)
    setPayment(null)
    setSuccessData({ points })
    setSuccessOpen(true)
  }

  const handleFailed = () => {
    toast.error(t('payment_failed'))
  }

  const handleCloseQR = () => {
    setQrOpen(false)
    setPayment(null)
  }

  return (
    <div className='bg-background min-h-screen'>
      <div className='mx-auto max-w-lg px-4 py-6'>
        <div className='mb-8'>
          <h1 className='text-foreground text-2xl font-bold'>{t('title')}</h1>
          <p className='text-muted-foreground mt-1 text-sm'>{t('subtitle')}</p>
        </div>

        <div className='bg-card space-y-5 rounded-2xl border p-5'>
          <div>
            <p className='text-foreground mb-3 text-sm font-medium'>
              {t('select_package')}
            </p>
            <div className='grid grid-cols-3 gap-2'>
              {packages.map((pkg) => (
                <PackageCard
                  key={pkg._id}
                  pkg={pkg}
                  selected={selectedPackage?._id === pkg._id}
                  onSelect={setSelectedPackage}
                />
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <p className='text-foreground mb-3 text-sm font-medium'>
              {t('payment_method')}
            </p>
            <PaymentMethodSelector
              selected={selectedMethod}
              onSelect={setSelectedMethod}
            />
          </div>

          <Separator />

          <div className='text-muted-foreground flex items-center justify-between text-sm'>
            <span>{t('total_payment')}</span>
            <span className='text-foreground text-base font-semibold'>
              {selectedPackage?.amount.toLocaleString('vi-VN') || 0}
              &#8363;
            </span>
          </div>

          <Button
            className='h-11 w-full text-sm font-medium'
            disabled={!selectedPackage || createPaymentMutation.isPending}
            onClick={handleCreateQR}
          >
            {createPaymentMutation.isPending
              ? t('creating_qr')
              : t('create_qr')}
          </Button>
        </div>
      </div>

      <QRModal
        open={qrOpen}
        onClose={handleCloseQR}
        payment={payment}
        onSuccess={handleSuccess}
        onFailed={handleFailed}
      />

      <SuccessDialog
        open={successOpen}
        points={successData.points}
        onClose={() => setSuccessOpen(false)}
      />
    </div>
  )
}
