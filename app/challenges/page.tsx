'use client'

import { useState, useMemo, useEffect } from 'react'
import { Shuffle, Check, Undo2, Filter } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { useStore } from '@/lib/store'
import { CHALLENGES } from '@/lib/data/challenges'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { formatDate, cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { Difficulty } from '@/types'

type Filter = 'all' | 'pending' | 'completed'

function ChallengeCard({
  challenge,
  completed,
  completedDate,
}: {
  challenge: (typeof CHALLENGES)[number]
  completed: boolean
  completedDate?: string
}) {
  const { t, language } = useI18n()
  const { completeChallenge, uncompleteChallenge } = useStore()

  const difficultyColor: Record<Difficulty, string> = {
    easy: 'badge-easy',
    medium: 'badge-medium',
    hard: 'badge-hard',
  }

  const handleToggle = () => {
    if (completed) {
      uncompleteChallenge(challenge.id)
      toast.info(t('challenges.undone'))
    } else {
      completeChallenge(challenge.id)
      toast.success('🎉 ' + t('challenges.markDone'))
    }
  }

  return (
    <div
      className={cn(
        'card p-5 flex gap-4 transition-all hover:shadow-card-hover',
        completed && 'opacity-70 bg-muted/30'
      )}
    >
      <div className="text-3xl shrink-0 mt-0.5">{challenge.emoji}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <h3 className={cn('font-bold text-foreground', completed && 'line-through')}>{t(challenge.titleKey)}</h3>
          <span className={difficultyColor[challenge.difficulty]}>
            {t(`challenges.difficulty.${challenge.difficulty}`)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{t(challenge.descriptionKey)}</p>
        {completed && completedDate && (
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 font-medium">
            <Check size={12} />
            {t('challenges.completedOn')} {formatDate(completedDate, language)}
          </div>
        )}
        <button
          onClick={handleToggle}
          className={cn(
            'mt-3 text-xs font-medium transition-all',
            completed
              ? 'text-muted-foreground hover:text-destructive flex items-center gap-1'
              : 'btn-primary text-xs py-1.5 px-3'
          )}
        >
          {completed ? (
            <><Undo2 size={12} /> {t('challenges.undone')}</>
          ) : (
            <><Check size={12} /> {t('challenges.markDone')}</>
          )}
        </button>
      </div>
    </div>
  )
}

function FeaturedChallenge({ idx, onShuffle }: { idx: number; onShuffle: () => void }) {
  const { t } = useI18n()
  const { completeChallenge, completedChallenges } = useStore()
  const challenge = CHALLENGES[idx]
  const completed = completedChallenges.some((c) => c.challengeId === challenge.id)

  const difficultyColor: Record<Difficulty, string> = {
    easy: 'text-emerald-600 bg-emerald-50',
    medium: 'text-amber-600 bg-amber-50',
    hard: 'text-red-600 bg-red-50',
  }

  return (
    <div className="card p-6 bg-gradient-to-br from-primary/8 to-accent/8 border-primary/15">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t('challenges.featured')}
        </div>
        <button onClick={onShuffle} className="btn-ghost text-xs">
          <Shuffle size={14} /> {t('challenges.shuffle')}
        </button>
      </div>
      <div className="flex gap-4">
        <div className="text-5xl shrink-0">{challenge.emoji}</div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={cn('badge text-xs', difficultyColor[challenge.difficulty])}>
              {t(`challenges.difficulty.${challenge.difficulty}`)}
            </span>
          </div>
          <h2 className="text-xl font-bold text-foreground">{t(challenge.titleKey)}</h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{t(challenge.descriptionKey)}</p>
          {!completed && (
            <button
              onClick={() => { completeChallenge(challenge.id); toast.success('🎉 ' + t('challenges.markDone')) }}
              className="btn-primary text-sm mt-4"
            >
              <Check size={16} /> {t('challenges.markDone')}
            </button>
          )}
          {completed && (
            <div className="flex items-center gap-1.5 mt-4 text-sm text-emerald-600 font-semibold">
              <Check size={16} /> {t('challenges.completedOn')} ✓
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ChallengesPage() {
  const { t } = useI18n()
  const { completedChallenges } = useStore()
  const [featuredIdx, setFeaturedIdx] = useState(0)
  useEffect(() => { setFeaturedIdx(Math.floor(Math.random() * CHALLENGES.length)) }, [])
  const [filter, setFilter] = useState<Filter>('all')

  const completedIds = new Set(completedChallenges.map((c) => c.challengeId))

  const filtered = useMemo(() => {
    if (filter === 'all') return CHALLENGES
    if (filter === 'completed') return CHALLENGES.filter((c) => completedIds.has(c.id))
    return CHALLENGES.filter((c) => !completedIds.has(c.id))
  }, [filter, completedIds])

  const shuffle = () => {
    const newIdx = Math.floor(Math.random() * CHALLENGES.length)
    setFeaturedIdx(newIdx)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        emoji="⚡"
        title={t('challenges.title')}
        subtitle={t('challenges.subtitle')}
      />

      <FeaturedChallenge idx={featuredIdx} onShuffle={shuffle} />

      {/* Filter */}
      <div className="flex gap-2">
        {(['all', 'pending', 'completed'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'text-sm font-medium rounded-xl px-4 py-2 transition-all',
              filter === f
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-border'
            )}
          >
            {t(`challenges.${f}`)}
            {f === 'completed' && (
              <span className="ms-1.5 bg-white/20 rounded-full px-1.5 py-0.5 text-xs">
                {completedIds.size}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Challenge Grid */}
      {filtered.length === 0 ? (
        <EmptyState emoji="⚡" title={t('challenges.empty')} />
      ) : (
        <div className="space-y-3">
          {filtered.map((challenge) => {
            const c = completedChallenges.find((x) => x.challengeId === challenge.id)
            return (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                completed={!!c}
                completedDate={c?.completedAt}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
