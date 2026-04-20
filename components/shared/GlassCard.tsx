'use client'

// components/shared/GlassCard.tsx
// The core card primitive for the Obsidian design.
// Wraps children in a frosted-glass panel with optional hover lift and glow.

import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
  onClick?: () => void
  style?: React.CSSProperties
  as?: 'div' | 'section' | 'article'
}

export function GlassCard({
  children,
  className,
  hover = true,
  glow = false,
  onClick,
  style,
  as: Tag = 'div',
}: GlassCardProps) {
  return (
    <Tag
      onClick={onClick}
      style={style}
      className={cn(
        'glass-card',
        hover && 'hoverable',
        glow && 'glow',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </Tag>
  )
}
