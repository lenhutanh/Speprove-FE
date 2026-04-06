'use client'
import { Col, Row } from '@/components/form'
import { BaseForm } from '@/components/form/base-form'
import Button from '@/components/form/button'
import OtpField from '@/components/form/otp-input'
import { storageKeys } from '@/constants'
import { useNavigate } from '@/hooks'
import { useVerifyOtpMutation } from '@/queries'
import route from '@/routes'
import { verifyOtpSchema } from '@/validations'
import { VerifyOtpBodyType } from '@/types'
import { getData, removeData } from '@/utils'

export default function VerifyOtpPage() {
  const verifyOtpMutation = useVerifyOtpMutation()
  const navigate = useNavigate()
  const defaultValues: VerifyOtpBodyType = {
    email: getData(storageKeys.EMAIL) ?? '',
    otp: '',
  }

  const onSubmit = async (values: VerifyOtpBodyType) => {
    await verifyOtpMutation.mutateAsync(values, {
      onSuccess: (res) => {
        if (res.success) {
          removeData(storageKeys.EMAIL)
          navigate(route.login)
        }
      },
    })
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
