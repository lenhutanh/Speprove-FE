import { PAYMENT_METHOD } from '@/constants'
import { cn } from '@/lib/utils'
import { Banknote } from 'lucide-react'

interface PaymentMethodSelectorProps {
  selected: string
  onSelect: (provider: string) => void
}

const METHODS = [
  {
    id: PAYMENT_METHOD.BANK_TRANSFER,
    label: 'Chuyển khoản ngân hàng',
    description: '',
    icon: <Banknote size={20} />,
  },
]

export function PaymentMethodSelector({
  selected,
  onSelect,
}: PaymentMethodSelectorProps) {
  return (
    <div className='space-y-2'>
      {METHODS.map((method) => (
        <button
          key={method.id}
          onClick={() => onSelect(method.id)}
          className={cn(
            'flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200',
            'hover:border-primary/50 hover:bg-primary/5',
            selected === method.id
              ? 'border-primary bg-primary/5 ring-primary ring-1'
              : 'border-border bg-card',
          )}
        >
          <div
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
              selected === method.id
                ? 'bg-primary/10 text-primary'
                : 'bg-muted text-muted-foreground',
            )}
          >
            {method.icon}
          </div>
          <div className='min-w-0 flex-1'>
            <p
              className={cn(
                'text-sm font-medium',
                selected === method.id ? 'text-primary' : 'text-foreground',
              )}
            >
              {method.label}
            </p>
            <p className='text-muted-foreground mt-0.5 text-xs'>
              {method.description}
            </p>
          </div>
          <div
            className={cn(
              'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all',
              selected === method.id
                ? 'border-primary bg-primary'
                : 'border-muted-foreground/30',
            )}
          >
            {selected === method.id && (
              <div className='h-1.5 w-1.5 rounded-full bg-white' />
            )}
          </div>
        </button>
      ))}
    </div>
  )
}
