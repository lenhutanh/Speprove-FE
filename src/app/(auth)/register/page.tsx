'use client'
import { googleIcon } from '@/assets/images'
import { Col, InputField, Row } from '@/components/form'
import { BaseForm } from '@/components/form/base-form'
import Button from '@/components/form/button'
import { Separator } from '@/components/ui/separator'
import { storageKeys } from '@/constants'
import { useNavigate } from '@/hooks'
import { useRegisterMutation } from '@/queries'
import route from '@/routes'
import { registerSchema } from '@/validations'
import { RegisterBodyType } from '@/types'
import { setData } from '@/utils'
import Image from 'next/image'
import Link from 'next/link'

export default function RegisterPage() {
  const registerMutation = useRegisterMutation()
  const navigate = useNavigate()
  const defaultValues: RegisterBodyType = {
    email: '',
    password: '',
    confirmedPassword: '',
  }
  const onSubmit = async (values: RegisterBodyType) => {
    await registerMutation.mutateAsync(values, {
      onSuccess: (res) => {
        if (res.success) {
          setData(storageKeys.EMAIL, values.email)
          navigate(route.verifyOtp)
        }
      },
    })
  }
  return (
    <div className='m-auto flex max-w-md flex-col gap-5 rounded-md border border-solid p-7.5 shadow-md'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold'>Create your account</h1>
        <span>Fill the form below to create your account</span>
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
                <InputField
                  control={form.control}
                  label='Confirm Password'
                  name='confirmedPassword'
                  placeholder='••••••••'
                  type='password'
                  required
                />
              </Col>
            </Row>
            <Button type='submit' className={'w-full'}>
              Sign up
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
        Sign up with Google
      </Button>
      <div className='text-center'>
        <span>Already have an account? </span>
        <Link href={route.login} className='underline'>
          Sign in
        </Link>
      </div>
    </div>
  )
}
