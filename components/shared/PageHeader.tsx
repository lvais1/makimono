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
    <div className="mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {emoji && <span className="text-3xl">{emoji}</span>}
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  )
}
