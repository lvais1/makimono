'use client'

// components/shared/StatCard.tsx
// Glassmorphism stat card with count-up animation and floating emoji.
// Replace the existing StatCard with this one.

import { useCountUp } from '@/lib/hooks/useCountUp'
import { GlassCard } from './GlassCard'

interface StatCardProps {
  emoji: string
  label: string
  value: number | string
  /** Animation delay in ms so cards stagger nicely */
  delay?: number
  accent?: boolean
}

export function StatCard({ emoji, label, value, delay = 0, accent = false }: StatCardProps) {
  const count = useCountUp(value, 1400, delay)

  return (
    <GlassCard className="p-5 text-center select-none" hover>
      {/* Floating emoji */}
      <div
        className="text-3xl mb-3 float"
        style={{ animationDelay: `${delay}ms` }}
      >
        {emoji}
      </div>

      {/* Animated value */}
      <div
        className="gradient-text font-display"
        style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontSize: 48,
          fontWeight: 600,
          lineHeight: 1,
        }}
      >
        {count}
      </div>

      {/* Label */}
      <div className="mt-2 text-xs font-medium tracking-widest uppercase text-muted-foreground">
        {label}
      </div>
    </GlassCard>
  )
}
