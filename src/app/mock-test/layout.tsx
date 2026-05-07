import { Header } from '@/components/app/header'

export default function MockTestLayout({
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
