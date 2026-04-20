'use client'

import { ReactNode } from 'react'

interface PageHeaderProps {
  emoji?: string
  title: string
  subtitle?: string
  action?: ReactNode
}

export function PageHeader({ emoji, title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="mb-9">
      {emoji && (
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-sm"
          style={{ background: 'rgba(204,88,62,0.14)', color: 'hsl(var(--primary))' }}
        >
          {emoji}
        </div>
      )}

      <div className="flex items-end justify-between gap-4">
        <h1
          style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: 48,
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: '-0.01em',
          }}
          className="gradient-text"
        >
          {title}
        </h1>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      {subtitle && (
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-md">
          {subtitle}
        </p>
      )}
    </div>
  )
}
