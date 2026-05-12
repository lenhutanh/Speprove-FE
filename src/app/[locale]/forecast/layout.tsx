import { Header } from '@/components/app/header'

export default function ForecastLayout({
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
