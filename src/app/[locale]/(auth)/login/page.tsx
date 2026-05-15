'use client'
import { googleIcon } from '@/assets'
import { Col, InputField, Row } from '@/components/form'
import { BaseForm } from '@/components/form/base-form'
import Button from '@/components/form/button'
import { Separator } from '@/components/ui/separator'
import { ErrorCodes } from '@/constants'
import envConfig from '@/envConfig'
import { useNavigate } from '@/hooks'
import { Link } from '@/i18n/navigation'
import { useLoginMutation, useProfileQuery } from '@/queries'
import route from '@/routes'
import { useAppLoadingStore } from '@/store'
import { useAuthStore } from '@/store/use-auth-store'
import { LoginBodyType } from '@/types'
import { loginSchema } from '@/validations'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

const oauthErrorCodes: string[] = [
  ErrorCodes.OAUTH_STATE_INVALID,
  ErrorCodes.GOOGLE_EMAIL_NOT_VERIFIED,
  ErrorCodes.GOOGLE_ACCOUNT_CONFLICT,
  ErrorCodes.GOOGLE_ACCOUNT_MISMATCH,
  ErrorCodes.GOOGLE_TOKEN_INVALID,
]

export default function LoginPage() {
  const t = useTranslations('auth.login')
  const common = useTranslations('common')
  const loginMutation = useLoginMutation()
  const profileQuery = useProfileQuery(false)
  const { setUser, setAuthenticated } = useAuthStore()
  const { withLoading } = useAppLoadingStore()
  const navigate = useNavigate()
  const replaceNavigate = useNavigate(false)
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('returnUrl')
  const errorCode = searchParams.get('errorCode')

  const defaultValues: LoginBodyType = {
    email: '',
    password: '',
  }

  const onSubmit = async (values: LoginBodyType) => {
    return withLoading(
      (async () => {
        const res = await loginMutation.mutateAsync(values)

        if (res.success) {
          const { data: profileRes } = await profileQuery.refetch()
          if (profileRes?.data) {
            setUser(profileRes.data)
            setAuthenticated(true)
            navigate(returnUrl || route.home)
          }
        } else {
          if (res.errorCode === ErrorCodes.INVALID_CREDENTIALS) {
            toast.error(res.message)
            return
          }
        }

        return res
      })(),
    )
  }

  const handleGoogleLogin = () => {
    const googleLoginUrl = new URL(
      `${envConfig.NEXT_PUBLIC_API_ENDPOINT_URL}/api/v1/auth/google`,
    )

    window.location.href = googleLoginUrl.toString()
  }

  useEffect(() => {
    if (!errorCode || !oauthErrorCodes.includes(errorCode)) return

    toast.error(common('generic_error'))
    replaceNavigate(route.login, { replace: true })
  }, [errorCode])

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
                  {common('forgot_password')}
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
      <Button
        variant={'outline'}
        className='w-full'
        onClick={handleGoogleLogin}
      >
        <Image src={googleIcon} alt='Google Icon' width={20} height={20} />
        {t('login_with', { name: 'Google' })}
      </Button>
      <div className='text-center'>
        <span>{common('dont_have_account')} </span>
        <Link href={route.register} className='underline'>
          {common('sign_up')}
        </Link>
      </div>
    </div>
  )
}
