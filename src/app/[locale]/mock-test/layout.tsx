'use client'

import { Header } from '@/components/app/header'

export default function MockTestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const pathname = usePathname()
  // const isTestRoom = pathname.match(/\/mock-test\/[^/]+$/)

  return (
    <>
      <Header />
      {children}
    </>
  )
}
