import { Header } from '@/components/app/header'

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
