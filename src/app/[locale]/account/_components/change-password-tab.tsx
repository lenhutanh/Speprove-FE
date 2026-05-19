import { Col, InputField, Row } from '@/components/form'
import { BaseForm } from '@/components/form/base-form'
import Button from '@/components/form/button'
import { useChangePasswordMutation } from '@/queries'
import { useAppLoadingStore } from '@/store'
import { ChangePasswordType } from '@/types'
import { changePasswordSchema } from '@/validations'
import { useTranslations } from 'next-intl'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

export default function ChangePasswordTab() {
  const common = useTranslations('common')
  const changePasswordMutation = useChangePasswordMutation()
  const { withLoading } = useAppLoadingStore()

  const defaultValues: ChangePasswordType = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }

  const onSubmit = async (
    values: ChangePasswordType,
    form: UseFormReturn<ChangePasswordType>,
  ) => {
    await withLoading(
      changePasswordMutation.mutateAsync(values, {
        onSuccess: (res) => {
          if (res.success) {
            toast.success(res.message)
            form.reset(defaultValues)
          } else {
            toast.error(res.message)
          }
        },
      }),
    )
  }

  return (
    <div className='mx-auto w-full max-w-md'>
      <BaseForm
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        schema={changePasswordSchema}
      >
        {(form) => (
          <>
            <Row>
              <Col>
                <InputField
                  control={form.control}
                  label={common('current_password')}
                  name='currentPassword'
                  placeholder={common('password_placeholder')}
                  type='password'
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <InputField
                  control={form.control}
                  label={common('new_password')}
                  name='newPassword'
                  placeholder={common('password_placeholder')}
                  type='password'
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <InputField
                  control={form.control}
                  label={common('confirm_password')}
                  name='confirmPassword'
                  placeholder={common('password_placeholder')}
                  type='password'
                  required
                />
              </Col>
            </Row>
            <Button type='submit' className={'w-full'} size={'lg'}>
              {common('save')}
            </Button>
          </>
        )}
      </BaseForm>
    </div>
  )
}
