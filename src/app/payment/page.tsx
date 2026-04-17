'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { PAYMENT_METHOD } from '@/constants'
import { useCreditPackageListQuery } from '@/queries'
import { useCreatePaymentMutation } from '@/queries/payment.query'
import { CreditPackage, PaymentResponse } from '@/types'
import { useState } from 'react'
import { toast } from 'sonner'
import { PackageCard } from './_components/package-card'
import { PaymentMethodSelector } from './_components/payment-method'
import { QRModal } from './_components/qr-modal'
import { SuccessDialog } from './_components/success-dialog'

export default function PaymentPage() {
  const { data, isLoading } = useCreditPackageListQuery()
  const createPaymentMutation = useCreatePaymentMutation()
  const packages = data?.data || []
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(
    null,
  )
  const [selectedMethod, setSelectedMethod] = useState<string>(
    PAYMENT_METHOD.BANK_TRANSFER,
  )
  const [isCreating, setIsCreating] = useState(false)

  const [qrOpen, setQrOpen] = useState(false)
  const [payment, setPayment] = useState<PaymentResponse | null>(null)

  const [successOpen, setSuccessOpen] = useState(false)
  const [successData, setSuccessData] = useState({ points: 0 })

  const handleCreateQR = async () => {
    if (!selectedPackage) {
      toast.error('Vui lòng chọn gói nạp')
      return
    }

    createPaymentMutation.mutateAsync(
      {
        packageId: selectedPackage._id,
        method: selectedMethod,
      },
      {
        onSuccess: (res) => {
          if (res.success && res?.data) setPayment(res.data)
        },
      },
    )

    setIsCreating(true)
    try {
      setQrOpen(true)
    } catch (err: any) {
      toast.error(err.message ?? 'Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsCreating(false)
    }
  }

  const handleSuccess = (points: number) => {
    setQrOpen(false)
    setPayment(null)
    setSuccessData({ points })
    setSuccessOpen(true)
  }

  const handleFailed = () => {
    toast.error('Thanh toán thất bại. Vui lòng thử lại.')
  }

  const handleCloseQR = () => {
    setQrOpen(false)
    setPayment(null)
  }

  return (
    <div className='bg-background min-h-screen'>
      <div className='mx-auto max-w-lg px-4 py-6'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-foreground text-2xl font-bold'>Nạp điểm</h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            Chọn gói phù hợp để bắt đầu luyện tập
          </p>
        </div>

        <div className='bg-card space-y-5 rounded-2xl border p-5'>
          {/* Packages */}
          <div>
            <p className='text-foreground mb-3 text-sm font-medium'>
              Chọn gói nạp
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

          {/* Method */}
          <div>
            <p className='text-foreground mb-3 text-sm font-medium'>
              Phương thức thanh toán
            </p>
            <PaymentMethodSelector
              selected={selectedMethod}
              onSelect={setSelectedMethod}
            />
          </div>

          <Separator />

          {/* Summary + CTA */}
          <div className='text-muted-foreground flex items-center justify-between text-sm'>
            <span>Tổng thanh toán</span>
            <span className='text-foreground text-base font-semibold'>
              {selectedPackage?.amount.toLocaleString('vi-VN') || 0}đ
            </span>
          </div>

          <Button
            className='h-11 w-full text-sm font-medium'
            disabled={!selectedPackage || isCreating}
            onClick={handleCreateQR}
          >
            {isCreating ? 'Đang tạo mã...' : 'Tạo mã'}
          </Button>
        </div>
      </div>

      {/* QR Modal */}
      <QRModal
        open={qrOpen}
        onClose={handleCloseQR}
        payment={payment}
        onSuccess={handleSuccess}
        onFailed={handleFailed}
      />

      {/* Success Dialog */}
      <SuccessDialog
        open={successOpen}
        points={successData.points}
        onClose={() => setSuccessOpen(false)}
      />
    </div>
  )
}
