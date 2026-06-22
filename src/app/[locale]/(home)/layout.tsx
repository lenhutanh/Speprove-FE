import { Footer } from '@/components/app/footer'
import { Header } from '@/components/app/header'

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className='flex flex-1 flex-col'>{children}</main>
      <Footer />
    </div>
  )
}
