'use client'

import { cn } from '@/lib/utils'

interface RatingStarsProps {
  value: number
  onChange?: (v: number) => void
  readonly?: boolean
  max?: number
  size?: 'sm' | 'md' | 'lg'
}

export function RatingStars({ value, onChange, readonly = false, max = 5, size = 'md' }: RatingStarsProps) {
  const sizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-3xl' }

  return (
    <div className="flex gap-0.5" role={readonly ? 'img' : 'radiogroup'} aria-label={`${value} of ${max}`}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < value
        return (
          <button
            key={i}
            type="button"
            onClick={() => !readonly && onChange?.(i + 1)}
            className={cn(
              'transition-all leading-none',
              sizes[size],
              filled ? 'text-amber-400' : 'text-gray-200',
              !readonly && 'cursor-pointer hover:scale-125 hover:text-amber-300',
              readonly && 'cursor-default'
            )}
            aria-label={`${i + 1}`}
            disabled={readonly}
          >
            ★
          </button>
        )
      })}
    </div>
  )
}

export function RatingBar({ label, user1, user2, name1, name2 }: {
  label: string
  user1?: number
  user2?: number
  name1: string
  name2: string
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-medium text-muted-foreground">
        <span>{label}</span>
        <span className="flex gap-3">
          {user1 !== undefined && <span className="text-primary">{name1}: {user1}/5</span>}
          {user2 !== undefined && <span className="text-accent">{name2}: {user2}/5</span>}
        </span>
      </div>
      <div className="flex gap-1.5">
        {user1 !== undefined && (
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${(user1 / 5) * 100}%` }}
            />
          </div>
        )}
        {user2 !== undefined && (
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all"
              style={{ width: `${(user2 / 5) * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
