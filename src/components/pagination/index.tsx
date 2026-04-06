import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useQueryParams } from '@/hooks'
import { useRouter } from 'next/navigation'

type PaginationProps = {
  meta?: {
    page: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export function AppPagination({ meta }: PaginationProps) {
  const { createQueryString } = useQueryParams()
  const router = useRouter()

  const currentPage = meta?.page ?? 1
  const totalPages = meta?.totalPages ?? 1
  const hasNext = meta?.hasNext ?? false
  const hasPrev = meta?.hasPrev ?? false

  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages]
    if (currentPage >= totalPages - 3)
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
  }

  function goTo(page: number) {
    router.push(createQueryString({ page }, { keepPage: true }), { scroll: false })
  }

  const pages = getVisiblePages()

  return (
    <div className='mt-5 w-full'>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => hasPrev && goTo(currentPage - 1)}
              aria-disabled={!hasPrev}
              className={!hasPrev ? 'pointer-events-none cursor-not-allowed opacity-50' : 'cursor-pointer'}
              tabIndex={!hasPrev ? -1 : 0}
            />
          </PaginationItem>

          {pages.map((p, index) => (
            <PaginationItem key={index}>
              {p === '...' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => p !== currentPage && goTo(p as number)}
                  isActive={p === currentPage}
                  className={p === currentPage ? 'pointer-events-none' : 'cursor-pointer'}
                  tabIndex={p === currentPage ? -1 : 0}
                  aria-disabled={p === currentPage}
                >
                  {p}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => hasNext && goTo(currentPage + 1)}
              aria-disabled={!hasNext}
              className={!hasNext ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              tabIndex={!hasNext ? -1 : 0}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}