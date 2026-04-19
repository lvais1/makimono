'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { Shuffle, ShoppingCart, BookOpen, Star, Zap, Calculator } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { useStore } from '@/lib/store'
import { CHALLENGES } from '@/lib/data/challenges'
import { StatCard } from '@/components/shared/StatCard'
import { RatingStars } from '@/components/shared/RatingStars'
import { formatDate, greetingByHour, ratingAvg } from '@/lib/utils'

function RandomChallenge() {
  const { t } = useI18n()
  const [idx, setIdx] = useState(0)
  useEffect(() => { setIdx(Math.floor(Math.random() * CHALLENGES.length)) }, [])
  const challenge = CHALLENGES[idx]

  return (
    <div className="card p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/15">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            {t('dashboard.todayChallenge')}
          </div>
          <div className="text-3xl mb-2">{challenge.emoji}</div>
          <h3 className="font-bold text-lg text-foreground">{t(challenge.titleKey)}</h3>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{t(challenge.descriptionKey)}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className={`badge badge-${challenge.difficulty}`}>
              {t(`challenges.difficulty.${challenge.difficulty}`)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-3 mt-5">
        <button
          onClick={() => setIdx(Math.floor(Math.random() * CHALLENGES.length))}
          className="btn-secondary text-xs"
        >
          <Shuffle size={14} />
          {t('dashboard.getShuffle')}
        </button>
        <Link href="/challenges" className="btn-primary text-xs">
          <Zap size={14} />
          {t('nav.challenges')}
        </Link>
      </div>
    </div>
  )
}

function TopRatedRolls() {
  const { t, language } = useI18n()
  const ratings = useStore((s) => s.ratings)
  const settings = useStore((s) => s.settings)

  const top = useMemo(() => {
    return [...ratings]
      .map((r) => {
        const avgs = []
        if (r.user1) avgs.push(ratingAvg(r.user1))
        if (r.user2) avgs.push(ratingAvg(r.user2))
        const avg = avgs.length ? avgs.reduce((a, b) => a + b, 0) / avgs.length : 0
        return { ...r, avg }
      })
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 3)
  }, [ratings])

  if (!top.length) {
    return (
      <div className="card p-6 text-center">
        <div className="text-4xl mb-3 opacity-30">⭐</div>
        <p className="text-sm text-muted-foreground">{t('dashboard.noRatings')}</p>
        <Link href="/ratings" className="btn-primary text-xs mt-4 inline-flex">
          <Star size={14} /> {t('nav.ratings')}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {top.map((r, i) => (
        <div key={r.id} className="card p-4 flex items-center gap-4 hover:shadow-card-hover transition-all">
          <div className="text-2xl font-bold text-muted-foreground/30 w-8 text-center shrink-0">
            {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-foreground truncate">{r.rollName}</div>
            <div className="text-xs text-muted-foreground">{formatDate(r.date, language)}</div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <RatingStars value={Math.round(r.avg)} readonly size="sm" />
            <span className="text-xs text-muted-foreground">{r.avg.toFixed(1)}/5</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const { t, language } = useI18n()
  const journal = useStore((s) => s.journal)
  const ratings = useStore((s) => s.ratings)
  const completedChallenges = useStore((s) => s.completedChallenges)
  const settings = useStore((s) => s.settings)

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
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="card p-6 lg:p-8 bg-gradient-to-br from-primary/10 via-card to-accent/10 border-primary/15 relative overflow-hidden">
        <div className="absolute top-4 end-6 text-6xl opacity-10 select-none">🍣</div>
        <div className="relative">
          <div className="text-sm font-medium text-muted-foreground mb-1">{greeting} 👋</div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
            {settings.user1Name} & {settings.user2Name}
          </h1>
          <p className="text-muted-foreground text-sm">{t('app.tagline')}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard emoji="🌙" label={t('dashboard.evenings')} value={journal.length} accent />
        <StatCard emoji="🍱" label={t('dashboard.rolls')} value={totalRolls} />
        <StatCard emoji="⭐" label={t('dashboard.topScore')} value={topScore} />
        <StatCard emoji="⚡" label={t('dashboard.challenges')} value={completedChallenges.length} />
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          {t('dashboard.quickActions')}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { href: '/roll-generator', emoji: '🎲', icon: Shuffle, key: 'nav.rollGenerator', color: 'bg-primary/8 hover:bg-primary/15 text-primary' },
            { href: '/shopping-list', emoji: '🛒', icon: ShoppingCart, key: 'nav.shoppingList', color: 'bg-accent/8 hover:bg-accent/15 text-accent' },
            { href: '/calculator', emoji: '🧮', icon: Calculator, key: 'nav.calculator', color: 'bg-amber-500/8 hover:bg-amber-500/15 text-amber-600' },
            { href: '/ratings', emoji: '⭐', icon: Star, key: 'nav.ratings', color: 'bg-yellow-500/8 hover:bg-yellow-500/15 text-yellow-600' },
            { href: '/challenges', emoji: '⚡', icon: Zap, key: 'nav.challenges', color: 'bg-purple-500/8 hover:bg-purple-500/15 text-purple-600' },
            { href: '/journal', emoji: '📖', icon: BookOpen, key: 'nav.journal', color: 'bg-blue-500/8 hover:bg-blue-500/15 text-blue-600' },
          ].map(({ href, emoji, icon: Icon, key, color }) => (
            <Link
              key={href}
              href={href}
              className={`card p-4 flex items-center gap-3 font-medium text-sm transition-all hover:shadow-card-hover ${color}`}
            >
              <span className="text-2xl">{emoji}</span>
              <span>{t(key)}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Challenge + Top Rated */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <RandomChallenge />
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            {t('dashboard.topRated')}
          </h2>
          <TopRatedRolls />
        </div>
      </div>

      {/* Recent Journal */}
      {journal.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t('nav.journal')}
            </h2>
            <Link href="/journal" className="text-xs text-primary hover:underline font-medium">
              {t('journal.details')} →
            </Link>
          </div>
          <div className="space-y-3">
            {journal.slice(0, 2).map((entry) => (
              <div key={entry.id} className="card p-4 flex items-center gap-4 hover:shadow-card-hover transition-all">
                <div className="text-3xl shrink-0">📅</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground">{formatDate(entry.date, language)}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 truncate">
                    {entry.rollsMade.filter(Boolean).join(' · ')}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground shrink-0">
                  {entry.rollsMade.filter(Boolean).length} {t('journal.rolls_label').replace('{n}', '')}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
