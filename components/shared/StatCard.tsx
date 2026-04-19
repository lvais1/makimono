import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  emoji: string
  sub?: string
  accent?: boolean
  className?: string
}

export function StatCard({ label, value, emoji, sub, accent, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'card p-5 flex flex-col gap-2 transition-all hover:shadow-card-hover',
        accent && 'border-primary/20 bg-gradient-to-br from-card to-primary/5',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl">{emoji}</span>
        {accent && (
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        )}
      </div>
      <div>
        <div className="text-3xl font-bold text-foreground leading-none">{value}</div>
        {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
      </div>
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</div>
    </div>
  )
}
