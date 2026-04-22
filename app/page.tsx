'use client'

// app/page.tsx — Dashboard (Obsidian redesign)
// Preserves all existing store / i18n / data logic.
// Replace your current app/page.tsx with this file.

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { Shuffle, ShoppingCart, BookOpen, Star, Zap, Calculator } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { useStore } from '@/lib/store'
import { CHALLENGES } from '@/lib/data/challenges'
import { StatCard } from '@/components/shared/StatCard'
import { GlassCard } from '@/components/shared/GlassCard'
import { RatingStars } from '@/components/shared/RatingStars'
import { formatDate, greetingByHour, ratingAvg } from '@/lib/utils'

/* ── Today's challenge widget ─────────────────────── */
function RandomChallenge() {
  const { t } = useI18n()
  const [idx, setIdx] = useState(0)
  useEffect(() => { setIdx(Math.floor(Math.random() * CHALLENGES.length)) }, [])
  const challenge = CHALLENGES[idx]

  return (
    <GlassCard glow className="p-6 h-full">
      {/* Icon */}
      <div
        className="mb-4 flex items-center justify-center rounded-xl text-xl"
        style={{
          width: 44, height: 44,
          background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(20 60% 40%))',
          boxShadow: '0 4px 16px rgba(204,88,62,0.35)',
        }}
      >
        {challenge.emoji}
      </div>

      <div className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-3">
        {t('dashboard.todayChallenge')}
      </div>

      <h3
        className="font-semibold text-foreground mb-2 leading-snug"
        style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 22 }}
      >
        {t(challenge.titleKey)}
      </h3>

      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        {t(challenge.descriptionKey)}
      </p>

      <div className="flex items-center gap-3">
        <span className={`badge badge-${challenge.difficulty}`}>
          {t(`challenges.difficulty.${challenge.difficulty}`)}
        </span>
        <button
          onClick={() => setIdx(Math.floor(Math.random() * CHALLENGES.length))}
          className="btn-ghost text-xs"
        >
          <Shuffle size={13} /> {t('dashboard.getShuffle')}
        </button>
      </div>
    </GlassCard>
  )
}

/* ── Top-rated rolls widget ───────────────────────── */
function TopRatedRolls() {
  const { t, language } = useI18n()
  const ratings = useStore((s) => s.ratings)

  const top = useMemo(() =>
    [...ratings]
      .map((r) => {
        const avgs = []
        if (r.user1) avgs.push(ratingAvg(r.user1))
        if (r.user2) avgs.push(ratingAvg(r.user2))
        const avg = avgs.length ? avgs.reduce((a, b) => a + b, 0) / avgs.length : 0
        return { ...r, avg }
      })
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 3),
    [ratings]
  )

  if (!top.length) {
    return (
      <GlassCard className="p-6 text-center">
        <div className="text-4xl mb-3 opacity-20">⭐</div>
        <p className="text-sm text-muted-foreground">{t('dashboard.noRatings')}</p>
        <Link href="/ratings" className="btn-primary text-xs mt-4 inline-flex">
          <Star size={14} /> {t('nav.ratings')}
        </Link>
      </GlassCard>
    )
  }

  return (
    <div className="list-stagger flex flex-col gap-3">
      {top.map((r, i) => (
        <GlassCard key={r.id} className="p-4 flex items-center gap-4">
          <div className="text-2xl shrink-0">{['🥇', '🥈', '🥉'][i]}</div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-foreground truncate">{r.rollName}</div>
            <div className="text-xs text-muted-foreground">{formatDate(r.date, language)}</div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <RatingStars value={Math.round(r.avg)} readonly size="sm" />
            <span
              className="gradient-text font-semibold"
              style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 22 }}
            >
              {r.avg.toFixed(1)}
            </span>
          </div>
        </GlassCard>
      ))}
    </div>
  )
}

/* ── Dashboard page ───────────────────────────────── */
export default function Dashboard() {
  const { t, language } = useI18n()
  const journal              = useStore((s) => s.journal)
  const ratings              = useStore((s) => s.ratings)
  const completedChallenges  = useStore((s) => s.completedChallenges)
  const settings             = useStore((s) => s.settings)

  const totalRolls = useMemo(() =>
    journal.reduce((sum, e) => sum + e.rollsMade.filter(Boolean).length, 0),
    [journal]
  )

  const topScore = useMemo(() => {
    if (!ratings.length) return '—'
    const avgs = ratings.map((r) => {
      const parts: number[] = []
      if (r.user1) parts.push(ratingAvg(r.user1))
      if (r.user2) parts.push(ratingAvg(r.user2))
      return parts.length ? parts.reduce((a, b) => a + b) / parts.length : 0
    })
    return Math.max(...avgs).toFixed(1)
  }, [ratings])

  const greeting = greetingByHour(language)

  return (
    <div className="space-y-7">

      {/* ── Hero ─────────────────────────────────────── */}
      <GlassCard hover={false} className="relative overflow-hidden p-10 lg:p-12">
        {/* Subtle gradient overlay */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, rgba(204,88,62,0.10) 0%, transparent 55%, rgba(196,168,90,0.08) 100%)',
          }}
        />
        {/* Large watermark emoji */}
        <div
          className="absolute pointer-events-none select-none float opacity-[0.04]"
          style={{ fontSize: 160, lineHeight: 1, right: -16, top: -24 }}
        >
          🍣
        </div>

        <div className="relative">
          {/* Live pill */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5 text-xs font-semibold tracking-widest uppercase"
            style={{ background: 'rgba(204,88,62,0.14)', color: 'hsl(var(--primary))' }}
          >
            <span
              className="inline-block rounded-full"
              style={{ width: 6, height: 6, background: 'hsl(var(--primary))' }}
            />
            {greeting}
          </div>

          {/* Names */}
          <h1
            className="mb-3 leading-none"
            style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: 'clamp(48px, 6vw, 80px)',
              fontWeight: 600,
              letterSpacing: '-0.01em',
            }}
          >
            <span className="gradient-text">
              {settings.user1Name} &amp; {settings.user2Name}
            </span>
          </h1>

          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            {t('app.tagline')}
          </p>
        </div>
      </GlassCard>

      {/* ── Stats ────────────────────────────────────── */}
      <div className="stagger-children grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard emoji="🌙" label={t('dashboard.evenings')}   value={journal.length}              delay={0}   />
        <StatCard emoji="🍱" label={t('dashboard.rolls')}      value={totalRolls}                  delay={100} />
        <StatCard emoji="⭐" label={t('dashboard.topScore')}   value={topScore === '—' ? 0 : topScore} delay={200} />
        <StatCard emoji="⚡" label={t('dashboard.challenges')} value={completedChallenges.length}  delay={300} />
      </div>

      {/* ── Challenge + Top Rated ─────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <RandomChallenge />
        </div>
        <div>
          <div className="text-[10px] font-semibold tracking-widest uppercase mb-4"
            style={{ color: 'hsl(var(--primary))' }}>
            {t('dashboard.topRated')}
          </div>
          <TopRatedRolls />
        </div>
      </div>

      {/* ── Recent Journal ────────────────────────────── */}
      {journal.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] font-semibold tracking-widest uppercase"
              style={{ color: 'hsl(var(--primary))' }}>
              {t('nav.journal')}
            </div>
            <Link href="/journal" className="text-xs text-primary hover:underline font-medium">
              {t('journal.details')} →
            </Link>
          </div>

          <div className="list-stagger grid sm:grid-cols-2 gap-4">
            {journal.slice(0, 2).map((entry) => (
              <GlassCard key={entry.id} className="p-4">
                <div className="text-xs text-muted-foreground mb-1">{formatDate(entry.date, language)}</div>
                <div
                  className="font-semibold text-foreground mb-2"
                  style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 18 }}
                >
                  {entry.rollsMade.filter(Boolean).length} rolls · {entry.durationMinutes ?? '?'}min
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {entry.rollsMade.filter(Boolean).map((roll) => (
                    <span
                      key={roll}
                      className="text-[11px] px-2.5 py-1 rounded-full text-foreground/80 border border-white/10"
                      style={{ background: 'rgba(255,255,255,0.13)' }}
                    >
                      {roll}
                    </span>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
