import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Breadcrumb as OriginBreadcrumb,
} from '@/components/ui/breadcrumb'
import { Link } from '@/i18n/navigation'
import { Fragment } from 'react'

type BreadcrumbItemType = {
  label: React.ReactNode
  href?: string
}

export function Breadcrumb({ items }: { items: BreadcrumbItemType[] }) {
  return (
    <OriginBreadcrumb className='hidden pt-0 pb-4 md:block'>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <Fragment key={index}>
              <BreadcrumbItem>
                {item.href && !isLast ? (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className='truncate'>
                    {item.label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </OriginBreadcrumb>
  )
}
