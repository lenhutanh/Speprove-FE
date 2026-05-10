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
import { VerifyOtpBodyType } from '@/types'
import { verifyOtpSchema } from '@/validations'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

export default function VerifyOtpPage() {
  const verifyRegisterMutation = useVerifyRegisterMutation()
  const verifyForgotPasswordMutation = useVerifyForgotPasswordMutation()
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
        await verifyRegisterMutation.mutateAsync(values, {
          onSuccess: (res) => {
            if (res.success) {
              navigate(route.login)
            } else {
              toast.error(res.message)
            }
          },
        })
        break
      case VERIFY_TARGET.FORGOT_PASSWORD:
        await verifyForgotPasswordMutation.mutateAsync(values, {
          onSuccess: (res) => {
            if (res.success && res.data.resetToken) {
              navigate(`${route.resetPassword}?token=${res.data.resetToken}`)
            } else {
              toast.error(res.message)
            }
          },
        })
        break
      default:
        toast.error('Invalid verify target')
        return
    }
  }

  return (
    <div className='m-auto flex max-w-md flex-col gap-5 rounded-md border border-solid p-7.5 shadow-md'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold'>Enter verification code</h1>
        <span>We sent a 6-digit code to your email.</span>
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
              Verify
            </Button>
          </>
        )}
      </BaseForm>
      <div className='text-center'>
        <span>Didn&apos;t receive the code? </span>
        <Button className='p-0 underline' variant={'ghost'}>
          Resend
        </Button>
      </div>
    </div>
  )
}
