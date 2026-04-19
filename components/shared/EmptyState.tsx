import { ReactNode } from 'react'

interface EmptyStateProps {
  emoji?: string
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ emoji = '🍣', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 animate-fade-in">
      <div className="text-6xl mb-5 opacity-30">{emoji}</div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-xs mb-6">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  )
}
