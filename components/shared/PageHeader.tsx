'use client'

// components/shared/PageHeader.tsx
// Standard page header used across all Obsidian pages.
// Renders a pill badge, large serif gradient title, optional subtitle and action button.

import { ReactNode } from 'react'

interface PageHeaderProps {
  /** Short all-caps label shown in the pill above the title */
  badge: string
  /** First line of the heading (plain colour) */
  title: string
  /** Second line — rendered with the coral→gold gradient */
  titleAccent: string
  /** Optional paragraph below the heading */
  subtitle?: string
  /** Optional action button / element aligned right */
  action?: ReactNode
}

export function PageHeader({ badge, title, titleAccent, subtitle, action }: PageHeaderProps) {
  return (
    <div className="mb-9">
      {/* Pill badge */}
      <div
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs font-semibold tracking-widest uppercase"
        style={{ background: 'rgba(204,88,62,0.14)', color: 'hsl(var(--primary))' }}
      >
        {badge}
      </div>

      {/* Title row */}
      <div className="flex items-end justify-between gap-4">
        <h1
          style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: 56,
            fontWeight: 600,
            lineHeight: 0.95,
            letterSpacing: '-0.01em',
          }}
        >
          {title}
          <br />
          <span className="gradient-text">{titleAccent}</span>
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
