'use client'

import { useState } from 'react'
import { Plus, Trash2, CalendarDays, Clock, ChevronDown, ChevronUp, Pencil } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { useStore } from '@/lib/store'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { formatDate, getTodayISO, cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { JournalEntry } from '@/types'

function EntryForm({ initial, onSave, onClose, mode = 'add' }: {
  initial?: Partial<JournalEntry>
  onSave: (e: Omit<JournalEntry, 'id'>) => void
  onClose: () => void
  mode?: 'add' | 'edit'
}) {
  const { t } = useI18n()
  const [date, setDate] = useState(initial?.date ?? getTodayISO())
  const [rollsText, setRollsText] = useState(initial?.rollsMade?.join(', ') ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? '')
  const [duration, setDuration] = useState<number | ''>(initial?.durationMinutes ?? '')

  const handleSave = () => {
    onSave({
      date,
      rollsMade: rollsText.split(',').map((s) => s.trim()).filter(Boolean),
      notes,
      imageUrl,
      ratings: initial?.ratings ?? [],
      durationMinutes: duration !== '' ? Number(duration) : undefined,
    })
  }

  return (
    <div className="card p-6 space-y-4 animate-slide-up">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-foreground">
          {mode === 'edit' ? t('common.edit') : t('journal.add')}
        </h3>
        <button onClick={onClose} className="btn-ghost text-xs">{t('common.cancel')}</button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">{t('journal.date')}</label>
          <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">{t('journal.duration')}</label>
          <input
            type="number"
            className="input"
            value={duration}
            onChange={(e) => setDuration(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="90"
            min={0}
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-1.5">{t('journal.rollsMade')}</label>
        <input
          className="input"
          value={rollsText}
          onChange={(e) => setRollsText(e.target.value)}
          placeholder={t('journal.rollsPlaceholder')}
        />
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-1.5">{t('journal.notes')}</label>
        <textarea
          className="textarea"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t('journal.notesPlaceholder')}
        />
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-1.5">{t('journal.imageUrl')}</label>
        <input
          className="input"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://..."
        />
      </div>

      <button onClick={handleSave} className="btn-primary w-full">
        <CalendarDays size={16} /> {mode === 'edit' ? t('common.save') : t('journal.save')}
      </button>
    </div>
  )
}

function JournalCard({ entry }: { entry: JournalEntry }) {
  const { t, language } = useI18n()
  const { deleteJournalEntry, updateJournalEntry } = useStore()
  const [expanded, setExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [editing, setEditing] = useState(false)

  const handleEdit = (e: Omit<JournalEntry, 'id'>) => {
    updateJournalEntry(entry.id, e)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="mb-6">
        <EntryForm
          initial={entry}
          onSave={handleEdit}
          onClose={() => setEditing(false)}
          mode="edit"
        />
      </div>
    )
  }

  const rollCount = entry.rollsMade.filter(Boolean).length

  return (
    <div className="relative flex gap-4">
      {/* Timeline line */}
      <div className="flex flex-col items-center shrink-0">
        <div className="h-10 w-10 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-lg shrink-0">
          🍣
        </div>
        <div className="w-0.5 flex-1 bg-border mt-2" />
      </div>

      {/* Card */}
      <div className="flex-1 card p-5 mb-6 hover:shadow-card-hover transition-all">
        {/* Image */}
        {entry.imageUrl && (
          <div className="mb-4 -mt-1 -mx-1 rounded-xl overflow-hidden">
            <img
              src={entry.imageUrl}
              alt="Sushi evening"
              className="w-full h-40 object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-bold text-foreground text-lg">{formatDate(entry.date, language)}</div>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
              {rollCount > 0 && (
                <span className="flex items-center gap-1">
                  🍱 {rollCount} {t('nav.rollGenerator').toLowerCase()}
                </span>
              )}
              {entry.durationMinutes && (
                <span className="flex items-center gap-1">
                  <Clock size={11} /> {t('journal.duration_label').replace('{n}', String(entry.durationMinutes))}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setEditing(true)}
              className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors"
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {/* Rolls */}
        {rollCount > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {entry.rollsMade.filter(Boolean).map((roll, i) => (
              <span key={i} className="bg-muted rounded-lg px-2.5 py-1 text-xs font-medium text-foreground">
                {roll}
              </span>
            ))}
          </div>
        )}

        {/* Expanded */}
        {expanded && (
          <div className="mt-4 space-y-3 animate-fade-in border-t border-border pt-4">
            {entry.notes && (
              <p className="text-sm text-muted-foreground leading-relaxed">{entry.notes}</p>
            )}

            {/* Delete */}
            <div className="flex justify-end">
              {confirmDelete ? (
                <div className="flex gap-2">
                  <button onClick={() => setConfirmDelete(false)} className="btn-ghost text-xs">{t('common.cancel')}</button>
                  <button
                    onClick={() => { deleteJournalEntry(entry.id); toast.success(t('common.delete')) }}
                    className="btn-danger text-xs"
                  >
                    {t('journal.delete')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="btn-ghost text-xs text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={12} /> {t('journal.delete')}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function JournalPage() {
  const { t } = useI18n()
  const { journal, addJournalEntry } = useStore()
  const [showForm, setShowForm] = useState(false)

  const handleSave = (entry: Omit<JournalEntry, 'id'>) => {
    addJournalEntry(entry)
    toast.success(t('journal.save'))
    setShowForm(false)
  }

  const sorted = [...journal].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        emoji="📖"
        title={t('journal.title')}
        subtitle={t('journal.subtitle')}
        action={
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            <Plus size={16} /> {t('journal.add')}
          </button>
        }
      />

      {showForm && (
        <EntryForm
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Stats */}
      {journal.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { emoji: '🌙', label: t('dashboard.evenings'), value: journal.length },
            { emoji: '🍱', label: t('dashboard.rolls'), value: journal.reduce((s, e) => s + e.rollsMade.filter(Boolean).length, 0) },
            { emoji: '⏱️', label: t('journal.totalTime'), value: `${journal.reduce((s, e) => s + (e.durationMinutes ?? 0), 0)}m` },
          ].map(({ emoji, label, value }) => (
            <div key={label} className="card p-4 text-center">
              <div className="text-2xl mb-1">{emoji}</div>
              <div className="font-bold text-xl text-foreground">{value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Timeline */}
      {sorted.length === 0 ? (
        <EmptyState
          emoji="📖"
          title={t('journal.empty')}
          action={
            <button onClick={() => setShowForm(true)} className="btn-primary">
              <Plus size={16} /> {t('journal.add')}
            </button>
          }
        />
      ) : (
        <div>
          {sorted.map((entry) => (
            <JournalCard key={entry.id} entry={entry} />
          ))}
          {/* End of timeline */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center shrink-0">
              <div className="h-8 w-8 rounded-full bg-muted border-2 border-border flex items-center justify-center text-sm">
                🌟
              </div>
            </div>
            <div className="pt-1 text-sm text-muted-foreground">
              {t('app.tagline')}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
