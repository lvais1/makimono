import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
  emoji?: string
}

export function PageHeader({ title, subtitle, action, emoji }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
          {emoji && <span className="text-3xl">{emoji}</span>}
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 text-muted-foreground text-sm lg:text-base">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0 mt-1">{action}</div>}
    </div>
  )
}
