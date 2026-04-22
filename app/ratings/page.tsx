'use client'

import { useState, useMemo } from 'react'
import { Plus, Trash2, Star, Pencil } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { useStore } from '@/lib/store'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { RatingStars, RatingBar } from '@/components/shared/RatingStars'
import { formatDate, ratingAvg, average, getTodayISO } from '@/lib/utils'
import { toast } from 'sonner'
import type { RollRating } from '@/types'

type UserRatings = { taste: number; appearance: number; creativity: number }

function RatingForm({ onClose, initial, mode = 'add' }: {
  onClose: () => void
  initial?: RollRating
  mode?: 'add' | 'edit'
}) {
  const { t } = useI18n()
  const { addRating, updateRating, settings } = useStore()
  const [rollName, setRollName] = useState(initial?.rollName ?? '')
  const [date, setDate] = useState(initial?.date ?? getTodayISO())
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [user1, setUser1] = useState<UserRatings>(initial?.user1 ?? { taste: 0, appearance: 0, creativity: 0 })
  const [user2, setUser2] = useState<UserRatings>(initial?.user2 ?? { taste: 0, appearance: 0, creativity: 0 })

  const handleSave = () => {
    if (!rollName.trim()) { toast.error(t('ratings.rollName')); return }
    const r: Omit<RollRating, 'id'> = {
      rollName: rollName.trim(),
      date,
      notes,
      user1: user1.taste > 0 ? user1 : undefined,
      user2: user2.taste > 0 ? user2 : undefined,
    }
    if (mode === 'edit' && initial?.id) {
      updateRating(initial.id, r)
    } else {
      addRating(r)
    }
    toast.success(t('ratings.save'))
    onClose()
  }

  const RatingSection = ({ user, setUser, name }: {
    user: UserRatings
    setUser: (u: UserRatings) => void
    name: string
  }) => (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-foreground">{name}</div>
      {(['taste', 'appearance', 'creativity'] as const).map((cat) => (
        <div key={cat} className="flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground min-w-20">{t(`ratings.${cat}`)}</span>
          <RatingStars
            value={user[cat]}
            onChange={(v) => setUser({ ...user, [cat]: v })}
          />
        </div>
      ))}
    </div>
  )

  return (
    <div className="card p-6 space-y-5 animate-slide-up">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-foreground">
          {mode === 'edit' ? t('common.edit') : t('ratings.add')}
        </h3>
        <button onClick={onClose} className="btn-ghost text-xs">{t('common.cancel')}</button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">{t('ratings.rollName')}</label>
          <input className="input" value={rollName} onChange={(e) => setRollName(e.target.value)} placeholder="Spicy Tuna Roll..." />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">{t('ratings.date')}</label>
          <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 pt-2">
        <RatingSection user={user1} setUser={setUser1} name={t('ratings.user1Rating').replace('{name}', settings.user1Name)} />
        <RatingSection user={user2} setUser={setUser2} name={t('ratings.user2Rating').replace('{name}', settings.user2Name)} />
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-1.5">{t('ratings.notes')}</label>
        <textarea className="textarea" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="..." />
      </div>

      <button onClick={handleSave} className="btn-primary w-full">
        <Star size={16} /> {t('ratings.save')}
      </button>
    </div>
  )
}

function RatingCard({ rating }: { rating: RollRating }) {
  const { t, language } = useI18n()
  const { deleteRating, settings } = useStore()
  const [confirm, setConfirm] = useState(false)
  const [editing, setEditing] = useState(false)

  if (editing) {
    return (
      <RatingForm
        onClose={() => setEditing(false)}
        initial={rating}
        mode="edit"
      />
    )
  }

  const avgs: number[] = []
  if (rating.user1) avgs.push(ratingAvg(rating.user1))
  if (rating.user2) avgs.push(ratingAvg(rating.user2))
  const overallAvg = avgs.length ? average(avgs) : 0

  return (
    <div className="card p-5 space-y-4 hover:shadow-card-hover transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-foreground text-lg">{rating.rollName}</h3>
          <div className="text-xs text-muted-foreground mt-0.5">{formatDate(rating.date, language)}</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <RatingStars value={Math.round(overallAvg)} readonly size="sm" />
          <span className="text-xs font-bold text-foreground">{overallAvg.toFixed(1)}/5</span>
        </div>
      </div>

      {/* Comparison bars */}
      <div className="space-y-3">
        {(['taste', 'appearance', 'creativity'] as const).map((cat) => (
          <RatingBar
            key={cat}
            label={t(`ratings.${cat}`)}
            user1={rating.user1?.[cat]}
            user2={rating.user2?.[cat]}
            name1={settings.user1Name}
            name2={settings.user2Name}
          />
        ))}
      </div>

      {rating.notes && (
        <p className="text-sm text-muted-foreground italic border-t border-border pt-3">"{rating.notes}"</p>
      )}

      {/* Edit / Delete */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => setEditing(true)}
          className="btn-ghost text-xs text-muted-foreground"
        >
          <Pencil size={12} /> {t('common.edit')}
        </button>
        {confirm ? (
          <div className="flex gap-2">
            <button onClick={() => setConfirm(false)} className="btn-ghost text-xs">{t('common.cancel')}</button>
            <button onClick={() => { deleteRating(rating.id); toast.success(t('common.delete')) }} className="btn-danger text-xs">
              {t('common.yes')}, {t('common.delete')}
            </button>
          </div>
        ) : (
          <button onClick={() => setConfirm(true)} className="btn-ghost text-xs text-muted-foreground hover:text-destructive">
            <Trash2 size={12} /> {t('common.delete')}
          </button>
        )}
      </div>
    </div>
  )
}

export default function RatingsPage() {
  const { t } = useI18n()
  const { ratings, settings } = useStore()
  const [showForm, setShowForm] = useState(false)

  const topRated = useMemo(() => {
    return [...ratings]
      .map((r) => {
        const avgs: number[] = []
        if (r.user1) avgs.push(ratingAvg(r.user1))
        if (r.user2) avgs.push(ratingAvg(r.user2))
        return { ...r, avg: avgs.length ? average(avgs) : 0 }
      })
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 3)
  }, [ratings])

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        emoji="⭐"
        title={t('ratings.title')}
        subtitle={t('ratings.subtitle')}
        action={
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            <Plus size={16} /> {t('ratings.add')}
          </button>
        }
      />

      {showForm && <RatingForm onClose={() => setShowForm(false)} />}

      {/* Top Rated */}
      {topRated.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            {t('ratings.topRated')}
          </h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {topRated.map((r, i) => (
              <div key={r.id} className="card p-4 text-center bg-gradient-to-b from-amber-50/50 to-card">
                <div className="text-3xl mb-2">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</div>
                <div className="font-semibold text-foreground text-sm truncate">{r.rollName}</div>
                <div className="text-2xl font-bold text-amber-500 mt-1">{r.avg.toFixed(1)}</div>
                <RatingStars value={Math.round(r.avg)} readonly size="sm" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Ratings */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          {t('ratings.history')} ({ratings.length})
        </h2>
        {ratings.length === 0 ? (
          <EmptyState
            emoji="⭐"
            title={t('ratings.empty')}
            action={
              <button onClick={() => setShowForm(true)} className="btn-primary">
                <Plus size={16} /> {t('ratings.add')}
              </button>
            }
          />
        ) : (
          <div className="space-y-4">
            {ratings.map((r) => <RatingCard key={r.id} rating={r} />)}
          </div>
        )}
      </section>
    </div>
  )
}
