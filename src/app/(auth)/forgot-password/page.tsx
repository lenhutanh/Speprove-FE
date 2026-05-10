'use client'

import { Col, InputField, Row } from '@/components/form'
import { BaseForm } from '@/components/form/base-form'
import Button from '@/components/form/button'
import { VERIFY_TARGET } from '@/constants'
import { useNavigate } from '@/hooks'
import { useForgotPasswordMutation } from '@/queries'
import route from '@/routes'
import { ForgotPasswordType } from '@/types'
import { forgotPasswordSchema } from '@/validations'

export default function ForgotPasswordPage() {
  const forgotPasswordMutation = useForgotPasswordMutation()
  const navigate = useNavigate()

  const defaultValues: ForgotPasswordType = {
    email: '',
  }
  const onSubmit = async (values: ForgotPasswordType) => {
    await forgotPasswordMutation.mutateAsync(values, {
      onSuccess: async (res) => {
        if (res.success) {
          navigate(
            `${route.verifyOtp}?email=${values.email}&target=${VERIFY_TARGET.FORGOT_PASSWORD}`,
          )
        }
      },
    })
  }

  return (
    <div className='m-auto flex max-w-md flex-col gap-5 rounded-md border border-solid p-7.5 shadow-md'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold'>Forgot your password?</h1>
        <span>Enter your email and we&apos;ll send you an OTP.</span>
      </div>
      <BaseForm
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        schema={forgotPasswordSchema}
      >
        {(form) => (
          <>
            <Row>
              <Col>
                <InputField
                  control={form.control}
                  label='Email'
                  name='email'
                  placeholder='example@gmail.com'
                  type='text'
                  required
                />
              </Col>
            </Row>
            <Button type='submit' className={'w-full'}>
              Send
            </Button>
          </>
        )}
      </BaseForm>
    </div>
  )
}
