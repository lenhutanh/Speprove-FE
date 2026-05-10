'use client'

import { Col, InputField, Row } from '@/components/form'
import { BaseForm } from '@/components/form/base-form'
import Button from '@/components/form/button'
import { useNavigate } from '@/hooks'
import { useResetPasswordMutation } from '@/queries'
import route from '@/routes'
import { ResetPasswordType } from '@/types'
import { resetPasswordSchema } from '@/validations'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

export default function ResetPasswordPage() {
  const resetPasswordMutation = useResetPasswordMutation()
  const navigate = useNavigate()
  const searchParams = useSearchParams()
  const resetToken = searchParams.get('token')

  useEffect(() => {
    if (!resetToken) {
      navigate(route.forgotPassword)
    }
  }, [resetToken])

  const defaultValues: ResetPasswordType = {
    resetToken: resetToken || '',
    newPassword: '',
    confirmPassword: '',
  }

  const onSubmit = async (values: ResetPasswordType) => {
    await resetPasswordMutation.mutateAsync(values, {
      onSuccess: (res) => {
        if (res.success) {
          toast.success('Thay đổi mật khẩu thành công')
          navigate(route.login)
        } else {
          toast.error(res.message)
        }
      },
    })
  }

  return (
    <div className='m-auto flex max-w-md flex-col gap-5 rounded-md border border-solid p-7.5 shadow-md'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold'>Reset your password</h1>
        <span>Fill the form below to reset your password</span>
      </div>
      <BaseForm
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        schema={resetPasswordSchema}
      >
        {(form) => (
          <>
            <Row>
              <Col>
                <InputField
                  control={form.control}
                  label='New password'
                  name='newPassword'
                  placeholder='••••••••'
                  type='password'
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <InputField
                  control={form.control}
                  label='Confirm Password'
                  name='confirmPassword'
                  placeholder='••••••••'
                  type='password'
                  required
                />
              </Col>
            </Row>
            <Button type='submit' className={'w-full'}>
              Xác nhận
            </Button>
          </>
        )}
      </BaseForm>
    </div>
  )
}
