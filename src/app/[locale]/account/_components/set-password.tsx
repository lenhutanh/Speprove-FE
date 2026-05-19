import { Col, InputField, Row } from '@/components/form'
import { BaseForm } from '@/components/form/base-form'
import Button from '@/components/form/button'
import { useSetPasswordMutation } from '@/queries'
import { useAppLoadingStore, useAuthStore } from '@/store'
import { SetPasswordType } from '@/types'
import { setPasswordSchema } from '@/validations'
import { useTranslations } from 'next-intl'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

export default function SetPasswordTab() {
  const common = useTranslations('common')
  const setPasswordMutation = useSetPasswordMutation()
  const { withLoading } = useAppLoadingStore()
  const { user, setUser } = useAuthStore()

  const defaultValues: SetPasswordType = {
    password: '',
    confirmPassword: '',
  }

  const onSubmit = async (
    values: SetPasswordType,
    form: UseFormReturn<SetPasswordType>,
  ) => {
    await withLoading(
      setPasswordMutation.mutateAsync(values, {
        onSuccess: (res) => {
          if (res.success) {
            toast.success(res.message)
            if (user) {
              setUser({ ...user, hasPassword: true })
            }
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
        schema={setPasswordSchema}
      >
        {(form) => (
          <>
            <Row>
              <Col>
                <InputField
                  control={form.control}
                  label={common('password')}
                  name='password'
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
