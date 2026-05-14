'use client'
import { Col, Row } from '@/components/form'
import { BaseForm } from '@/components/form/base-form'
import Button from '@/components/form/button'
import OtpField from '@/components/form/otp-input'
import { VERIFY_TARGET } from '@/constants'
import { useNavigate } from '@/hooks'
import {
  useVerifyForgotPasswordMutation,
  useVerifyRegisterMutation,
} from '@/queries'
import route from '@/routes'
import { useAppLoadingStore } from '@/store'
import { VerifyOtpBodyType } from '@/types'
import { verifyOtpSchema } from '@/validations'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

export default function VerifyOtpPage() {
  const t = useTranslations('auth.verify_otp')
  const common = useTranslations('common')
  const verifyRegisterMutation = useVerifyRegisterMutation()
  const verifyForgotPasswordMutation = useVerifyForgotPasswordMutation()
  const { withLoading } = useAppLoadingStore()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const target = searchParams.get('target')

  const navigate = useNavigate()

  useEffect(() => {
    if (!email || !target) {
      navigate(route.forgotPassword)
    }
  }, [email, target])

  const defaultValues: VerifyOtpBodyType = {
    email: email ?? '',
    otp: '',
  }

  const onSubmit = async (values: VerifyOtpBodyType) => {
    switch (target) {
      case VERIFY_TARGET.REGISTER:
        await withLoading(
          verifyRegisterMutation.mutateAsync(values, {
            onSuccess: (res) => {
              if (res.success) {
                navigate(route.login)
                toast.success(res.message)
              } else {
                toast.error(res.message)
              }
            },
          }),
        )
        break
      case VERIFY_TARGET.FORGOT_PASSWORD:
        await withLoading(
          verifyForgotPasswordMutation.mutateAsync(values, {
            onSuccess: (res) => {
              if (res.success && res.data.resetToken) {
                toast.success(res.message)
                navigate(`${route.resetPassword}?token=${res.data.resetToken}`)
              } else {
                toast.error(res.message)
              }
            },
          }),
        )
        break
      default:
        toast.error(t('invalid_target'))
        return
    }
  }

  return (
    <div className='m-auto flex max-w-md flex-col gap-5 rounded-md border border-solid p-7.5 shadow-md'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold'>{t('title')}</h1>
        <span>{t('description')}</span>
      </div>
      <BaseForm
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        schema={verifyOtpSchema}
      >
        {(form) => (
          <>
            <Row className='mb-5'>
              <Col>
                <OtpField
                  control={form.control}
                  name='otp'
                  required
                  className='w-full'
                />
              </Col>
            </Row>
            <Button type='submit' className={'w-full'}>
              {common('verify')}
            </Button>
          </>
        )}
      </BaseForm>
      <div className='text-center'>
        <span>{t('didnt_receive_code')} </span>
        <Button className='p-0 underline' variant={'ghost'}>
          {common('resend')}
        </Button>
      </div>
    </div>
  )
}
