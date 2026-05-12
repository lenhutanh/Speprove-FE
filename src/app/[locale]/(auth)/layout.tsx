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
        {children}
      </Container>
    </div>
  )
}
