import { Loader2 } from 'lucide-react'
import { AIResultType } from '@/types'

interface AIAssistantProps {
  results: AIResultType[]
  options: { key: string; label: string }[]
  loading: boolean
  onOption: (key: string, label: string) => void
}

export default function AIAssistant({ results, options, loading, onOption }: AIAssistantProps) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
        {loading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Đang phân tích...
          </div>
        )}
        {results.map((r, i) => (
          <div key={i} className="p-3 bg-muted/50 rounded-lg border border-border">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
              {r.label}
            </p>
            <p className="text-xs text-foreground leading-relaxed">{r.content}</p>
          </div>
        ))}
      </div>

      {/* Options - fixed */}
      <div className="px-4 py-2.5 border-t border-border space-y-1.5 flex-shrink-0">
        {options.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onOption(opt.key, opt.label)}
            disabled={loading}
            className="w-full flex items-center justify-between px-3 py-2 text-xs text-foreground border border-border rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {opt.label}
            <span className="text-muted-foreground">↗</span>
          </button>
        ))}
      </div>
    </div>
  )
}