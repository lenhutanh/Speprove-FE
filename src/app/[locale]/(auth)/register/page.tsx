'use client'
import { googleIcon } from '@/assets/images'
import { Col, InputField, Row } from '@/components/form'
import { BaseForm } from '@/components/form/base-form'
import Button from '@/components/form/button'
import { Separator } from '@/components/ui/separator'
import { VERIFY_TARGET } from '@/constants'
import { useNavigate } from '@/hooks'
import { Link } from '@/i18n/navigation'
import { useRegisterMutation } from '@/queries'
import route from '@/routes'
import { useAppLoadingStore } from '@/store'
import { RegisterBodyType } from '@/types'
import { registerSchema } from '@/validations'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { toast } from 'sonner'

export default function RegisterPage() {
  const t = useTranslations('auth.register')
  const common = useTranslations('common')
  const registerMutation = useRegisterMutation()
  const { withLoading } = useAppLoadingStore()
  const navigate = useNavigate()

  const defaultValues: RegisterBodyType = {
    email: '',
    password: '',
    confirmPassword: '',
  }

  const onSubmit = async (values: RegisterBodyType) => {
    await withLoading(
      registerMutation.mutateAsync(values, {
        onSuccess: (res) => {
          if (res.success) {
            toast.success(res.message)
            navigate(
              `${route.verifyOtp}?email=${values.email}&target=${VERIFY_TARGET.REGISTER}`,
            )
          } else {
            toast.error(res.message)
          }
        },
      }),
    )
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
        schema={registerSchema}
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
            <Button type='submit' className={'w-full'}>
              {common('sign_up')}
            </Button>
          </>
        )}
      </BaseForm>
      <div className='flex items-center gap-2'>
        <Separator className='flex-1' />
        <span>{common('or_continue_with')}</span>
        <Separator className='flex-1' />
      </div>
      <Button type='button' variant={'outline'} className='w-full'>
        <Image src={googleIcon} alt='Google Icon' width={20} height={20} />
        {t('sign_up_with', { name: 'Google' })}
      </Button>
      <div className='text-center'>
        <span>{common('already_have_account')} </span>
        <Link href={route.login} className='underline'>
          {common('login')}
        </Link>
      </div>
    </div>
  )
}
