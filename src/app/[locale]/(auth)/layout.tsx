import { Header } from '@/components/app/header'
import { Container } from '@/components/layout'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header />

      <Container className='flex flex-1 items-center justify-center'>
        <div className='sm:bg-card m-auto flex w-full max-w-md flex-col gap-5 px-4 py-6 sm:rounded-md sm:border sm:p-7.5 sm:shadow-md'>
          {children}
        </div>
      </Container>
    </div>
  )
}
