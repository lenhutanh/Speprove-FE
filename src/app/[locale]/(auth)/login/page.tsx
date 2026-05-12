'use client'
import { googleIcon } from '@/assets'
import { Col, InputField, Row } from '@/components/form'
import { BaseForm } from '@/components/form/base-form'
import Button from '@/components/form/button'
import { Separator } from '@/components/ui/separator'
import { ErrorCodes } from '@/constants'
import { useNavigate } from '@/hooks'
import { useLoginMutation, useProfileQuery } from '@/queries'
import route from '@/routes'
import { useAuthStore } from '@/store/use-auth-store'
import { LoginBodyType } from '@/types'
import { loginSchema } from '@/validations'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

export default function LoginPage() {
  const t = useTranslations('auth.login')
  const common = useTranslations('common')
  const loginMutation = useLoginMutation()
  const profileQuery = useProfileQuery(false)
  const { setUser, setAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const searchParams = useSearchParams()

  const defaultValues: LoginBodyType = {
    email: '',
    password: '',
  }

  const onSubmit = async (values: LoginBodyType) => {
    const res = await loginMutation.mutateAsync(values)

    if (res.success) {
      const { data: profileRes } = await profileQuery.refetch()
      if (profileRes?.data) {
        setUser(profileRes.data)
        setAuthenticated(true)
        const callbackUrl = searchParams.get('callbackUrl')
        navigate(callbackUrl || route.home)
      }
    } else {
      if (res.errorCode === ErrorCodes.INVALID_CREDENTIALS) {
        toast.error(res.message)
        return
      }
    }

    return res
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
        schema={loginSchema}
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
                <Link
                  href={route.forgotPassword}
                  className='ml-auto text-sm underline-offset-4 hover:underline'
                >
                  {t('forgot_password')}
                </Link>
              </Col>
            </Row>
            <Button type='submit' className={'w-full'}>
              {common('login')}
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
        {t('login_with', { name: 'Google' })}
      </Button>
      <div className='text-center'>
        <span>{t('dont_have_account')} </span>
        <Link href={route.register} className='underline'>
          {common('sign_up')}
        </Link>
      </div>
    </div>
  )
}
