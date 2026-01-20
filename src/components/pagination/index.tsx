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

type PaginationProps = {
  totalPages: number
}

export function AppPagination({ totalPages }: PaginationProps) {
  const { paramsObj, createQueryString } = useQueryParams()
  const currentPage = Number(paramsObj.page ?? 1)
  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages]
    if (currentPage >= totalPages - 3)
      return [
        1,
        '...',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ]
    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages,
    ]
  }

  const pages = getVisiblePages()

  return (
    <div className='mt-5 w-full'>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={createQueryString(
                { page: (currentPage - 1) as any },
                { keepPage: true },
              )}
              aria-disabled={currentPage <= 1}
              className={
                currentPage <= 1
                  ? 'pointer-events-none cursor-not-allowed opacity-50'
                  : ''
              }
              tabIndex={currentPage <= 1 ? -1 : 0}
            />
          </PaginationItem>
          {pages.map((p, index) => (
            <PaginationItem key={index}>
              {p === '...' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href={createQueryString({ page: p }, { keepPage: true })}
                  isActive={p === currentPage}
                  className={p === currentPage ? 'pointer-events-none' : ''}
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
              href={createQueryString(
                { page: (currentPage + 1) as any },
                { keepPage: true },
              )}
              aria-disabled={currentPage >= totalPages}
              className={
                currentPage >= totalPages
                  ? 'pointer-events-none opacity-50'
                  : ''
              }
              tabIndex={currentPage >= totalPages ? -1 : 0}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
