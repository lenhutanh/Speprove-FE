'use client'
import { googleIcon } from '@/assets'
import { Col, InputField, Row } from '@/components/form'
import { BaseForm } from '@/components/form/base-form'
import Button from '@/components/form/button'
import { Separator } from '@/components/ui/separator'
import { useNavigate } from '@/hooks'
import { useLoginMutation, useProfileQuery } from '@/queries'
import route from '@/routes'
import { useAuthStore } from '@/store/use-auth-store'
import { LoginBodyType } from '@/types'
import { loginSchema } from '@/validations'
import Image from 'next/image'
import Link from 'next/link'

export default function LoginPage() {
  const loginMutation = useLoginMutation()
  const profileQuery = useProfileQuery(false)
  const { setUser, setAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const defaultValues: LoginBodyType = {
    email: '',
    password: '',
  }
  const onSubmit = async (values: LoginBodyType) => {
    await loginMutation.mutateAsync(values, {
      onSuccess: async (res) => {
        if (res.success) {
          const { data: profileRes } = await profileQuery.refetch()
          if (profileRes?.data) {
            setUser(profileRes.data)
            setAuthenticated(true)
            navigate(route.home)
          }
        }
      },
    })
  }

  return (
    <div className='m-auto flex max-w-md flex-col gap-5 rounded-md border border-solid p-7.5 shadow-md'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold'>Login to your account</h1>
        <span>Enter your email below to login to your account</span>
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
                  label='Email'
                  name='email'
                  placeholder='example@gmail.com'
                  type='text'
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <InputField
                  control={form.control}
                  label='Password'
                  name='password'
                  placeholder='••••••••'
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
                  Forgot your password?
                </Link>
              </Col>
            </Row>
            <Button type='submit' className={'w-full'}>
              Login
            </Button>
          </>
        )}
      </BaseForm>
      <div className='flex items-center gap-2'>
        <Separator className='flex-1' />
        <span>Or continue with</span>
        <Separator className='flex-1' />
      </div>
      <Button type='button' variant={'outline'} className='w-full'>
        <Image src={googleIcon} alt='Google Icon' width={20} height={20} />
        Login with Google
      </Button>
      <div className='text-center'>
        <span>Don&apos;t have an account?</span>
        <Link href={route.register} className='underline'>
          Sign up
        </Link>
      </div>
    </div>
  )
}
