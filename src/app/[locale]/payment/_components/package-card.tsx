import { logo } from '@/assets'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { CreditPackage } from '@/types'
import Image from 'next/image'

interface PackageCardProps {
  pkg: CreditPackage
  selected: boolean
  onSelect: (pkg: CreditPackage) => void
}

export function PackageCard({ pkg, selected, onSelect }: PackageCardProps) {
  return (
    <button
      onClick={() => onSelect(pkg)}
      className={cn(
        'relative flex w-full flex-col items-start rounded-xl border p-4 text-left transition-all duration-200',
        'hover:border-primary/50 hover:bg-primary/5',
        selected
          ? 'border-primary bg-primary/5 ring-primary ring-1'
          : 'border-border bg-card',
      )}
    >
      {pkg.badge && (
        <Badge
          variant='secondary'
          className='bg-primary/10 text-primary mb-2 border-0 text-xs font-medium'
        >
          {pkg.badge}
        </Badge>
      )}
      <span
        className={cn(
          'text-base font-semibold',
          selected ? 'text-primary' : 'text-foreground',
        )}
      >
        {pkg.amount.toLocaleString('vi-VN')}đ
      </span>
      <span
        className={cn(
          'mt-1.5 flex items-center gap-1.5 text-sm',
          selected ? 'text-primary/80' : 'text-muted-foreground',
        )}
      >
        <Image src={logo} alt='Points' width={14} height={14} />
        <span className='font-medium'>{pkg.points}</span>
      </span>
    </button>
  )
}
