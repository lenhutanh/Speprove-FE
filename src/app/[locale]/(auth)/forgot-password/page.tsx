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
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const t = useTranslations('auth.forgot_password')
  const common = useTranslations('common')
  const forgotPasswordMutation = useForgotPasswordMutation()
  const navigate = useNavigate()

  const defaultValues: ForgotPasswordType = {
    email: '',
  }

  const onSubmit = async (values: ForgotPasswordType) => {
    await forgotPasswordMutation.mutateAsync(values, {
      onSuccess: async (res) => {
        if (res.success) {
          toast.success(res.message)
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
        <h1 className='text-2xl font-bold'>{t('title')}</h1>
        <span>{t('description')}</span>
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
                  label={common('email')}
                  name='email'
                  placeholder={common('email_placeholder')}
                  type='text'
                  required
                />
              </Col>
            </Row>
            <Button type='submit' className={'w-full'}>
              {common('send')}
            </Button>
          </>
        )}
      </BaseForm>
    </div>
  )
}
