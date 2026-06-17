'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { Tabs as TabsPrimitive } from 'radix-ui'
import * as React from 'react'

import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function Tabs({
  className,
  orientation = 'horizontal',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot='tabs'
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        'group/tabs flex gap-2 data-[orientation=horizontal]:flex-col',
        className,
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  'group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-[orientation=horizontal]/tabs:h-9 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col data-[variant=line]:rounded-none',
  {
    variants: {
      variant: {
        default: 'bg-muted',
        line: 'gap-1 bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function TabsList({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot='tabs-list'
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot='tabs-trigger'
      className={cn(
        "text-foreground/60 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:text-muted-foreground dark:hover:text-foreground relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-all group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        'group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent',
        'data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground',
        'after:bg-foreground after:absolute after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100',
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot='tabs-content'
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  )
}

interface ScrollableTabsListProps
  extends
    React.ComponentProps<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {
  containerClassName?: string
}

const ScrollableTabsList = React.forwardRef<
  HTMLDivElement,
  ScrollableTabsListProps
>(
  (
    { className, variant = 'default', containerClassName, children, ...props },
    _ref,
  ) => {
    const localRef = React.useRef<HTMLDivElement>(null)
    const [showLeftArrow, setShowLeftArrow] = React.useState(false)
    const [showRightArrow, setShowRightArrow] = React.useState(false)

    const checkScroll = () => {
      const el = localRef.current
      if (!el) return
      setShowLeftArrow(el.scrollLeft > 5)
      setShowRightArrow(el.scrollLeft + el.clientWidth < el.scrollWidth - 5)
    }

    React.useEffect(() => {
      checkScroll()
      const timer = setTimeout(checkScroll, 100)
      window.addEventListener('resize', checkScroll)
      return () => {
        clearTimeout(timer)
        window.removeEventListener('resize', checkScroll)
      }
    }, [children])

    return (
      <div
        className={cn('group relative w-fit max-w-full', containerClassName)}
      >
        {showLeftArrow && (
          <button
            onClick={() =>
              localRef.current?.scrollBy({ left: -100, behavior: 'smooth' })
            }
            className='bg-background hover:bg-accent absolute top-1/2 left-1 z-10 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border shadow-md transition-all'
            type='button'
            aria-label='Scroll left'
          >
            <ChevronLeft className='size-3.5' />
          </button>
        )}

        <div
          ref={localRef}
          onScroll={checkScroll}
          className='scrollbar-none w-full overflow-x-auto'
        >
          <TabsList
            variant={variant}
            className={cn('w-max justify-start gap-1 p-[3px]', className)}
            {...props}
          >
            {children}
          </TabsList>
        </div>

        {showRightArrow && (
          <button
            onClick={() =>
              localRef.current?.scrollBy({ left: 100, behavior: 'smooth' })
            }
            className='bg-background hover:bg-accent absolute top-1/2 right-1 z-10 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border shadow-md transition-all'
            type='button'
            aria-label='Scroll right'
          >
            <ChevronRight className='size-3.5' />
          </button>
        )}
      </div>
    )
  },
)
ScrollableTabsList.displayName = 'ScrollableTabsList'

export {
  ScrollableTabsList,
  Tabs,
  TabsContent,
  TabsList,
  tabsListVariants,
  TabsTrigger,
}
