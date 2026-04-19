'use client'

import { useState } from 'react'
import { Minus, Plus, RotateCcw } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { PageHeader } from '@/components/shared/PageHeader'
import { calculateQuantities } from '@/lib/utils/calculations'
import { cn } from '@/lib/utils'

function Counter({ value, onChange, min = 1, max = 50, label }: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  label: string
}) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold text-foreground">{label}</label>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center hover:bg-border active:scale-95 transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Minus size={18} />
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => {
            const v = parseInt(e.target.value)
            if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v)))
          }}
          className="input w-20 text-center text-2xl font-bold py-3"
          min={min}
          max={max}
        />
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center hover:bg-border active:scale-95 transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  )
}

export default function CalculatorPage() {
  const { t } = useI18n()
  const [rolls, setRolls] = useState(6)
  const [people, setPeople] = useState(2)
  const [editId, setEditId] = useState<string | null>(null)
  const [overrides, setOverrides] = useState<Record<string, number>>({})

  const quantities = calculateQuantities(rolls, people)
  const hasOverrides = Object.keys(overrides).length > 0

  const getTotal = (item: ReturnType<typeof calculateQuantities>[number]) =>
    overrides[item.id] ?? item.total

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        emoji="🧮"
        title={t('calc.title')}
        subtitle={t('calc.subtitle')}
      />

      {/* Inputs */}
      <div className="card p-5 sm:p-6">
        <div className="grid grid-cols-2 gap-6">
          <Counter
            value={rolls}
            onChange={setRolls}
            min={1}
            max={30}
            label={t('calc.rolls')}
          />
          <Counter
            value={people}
            onChange={setPeople}
            min={1}
            max={20}
            label={t('calc.people')}
          />
        </div>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-2">
        {[
          { emoji: '🍱', label: `${rolls} rolls` },
          { emoji: '👥', label: `${people} people` },
          { emoji: '🍣', label: `~${rolls * 8} pieces` },
        ].map(({ emoji, label }) => (
          <span key={label} className="inline-flex items-center gap-1.5 bg-primary/10 text-primary rounded-full px-3 py-1.5 text-sm font-semibold">
            {emoji} {label}
          </span>
        ))}
      </div>

      {/* Results Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t('calc.results')}
          </h2>
          {hasOverrides && (
            <button
              onClick={() => setOverrides({})}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw size={12} /> Reset
            </button>
          )}
        </div>

        <div className="card overflow-hidden">
          {/* Header — hidden on very small screens */}
          <div className="hidden sm:grid grid-cols-[1fr_80px_100px] gap-2 px-5 py-3 bg-muted/50 border-b border-border text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <div>{t('calc.ingredient')}</div>
            <div className="text-end">{t('calc.perRoll')}</div>
            <div className="text-end">{t('calc.total')}</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {quantities.map((item) => {
              const isEditing = editId === item.id
              const total = getTotal(item)
              const unitLabel = item.unit === 'sheets' ? t('calc.sheets') : item.unit

              return (
                <div
                  key={item.id}
                  className="px-4 sm:px-5 py-3.5 hover:bg-muted/30 transition-colors"
                >
                  {/* Mobile: stacked layout */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl shrink-0">{item.emoji}</span>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">{t(item.labelKey)}</div>
                        {/* Per-roll shown inline on mobile */}
                        {item.perRoll > 0 && (
                          <div className="text-xs text-muted-foreground sm:hidden">
                            {item.perRoll}{item.unit === 'g' ? 'g' : item.unit === 'ml' ? 'ml' : ''} {t('calc.perRoll').toLowerCase()}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      {/* Per-roll — desktop only */}
                      <span className="hidden sm:block w-20 text-end text-sm text-muted-foreground">
                        {item.perRoll > 0 ? `${item.perRoll}${item.unit === 'g' ? 'g' : item.unit === 'ml' ? 'ml' : ''}` : '—'}
                      </span>

                      {/* Total — always visible, editable */}
                      {isEditing ? (
                        <input
                          type="number"
                          value={total}
                          onChange={(e) => {
                            const v = parseFloat(e.target.value)
                            if (!isNaN(v)) setOverrides((prev) => ({ ...prev, [item.id]: v }))
                          }}
                          onBlur={() => setEditId(null)}
                          autoFocus
                          className="input w-24 text-end text-sm py-1"
                        />
                      ) : (
                        <button
                          onClick={() => setEditId(item.id)}
                          className={cn(
                            'text-sm font-bold rounded-xl px-2.5 py-1.5 transition-all active:scale-95',
                            overrides[item.id] !== undefined
                              ? 'text-accent bg-accent/10'
                              : 'text-foreground hover:bg-muted'
                          )}
                          title="Tap to edit"
                        >
                          {total}
                          {' '}
                          <span className="font-normal text-muted-foreground text-xs">{unitLabel}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">{t('calc.note')}</p>
      </div>

      {/* Visual breakdown */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          {t('calc.breakdown')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {quantities.filter((q) => q.perRoll > 0).map((item) => (
            <div key={item.id} className="card p-4 text-center hover:shadow-card-hover transition-all">
              <div className="text-3xl mb-2">{item.emoji}</div>
              <div className="text-xl font-bold text-foreground">
                {item.perRoll}
                <span className="text-sm font-normal text-muted-foreground ms-1">
                  {item.unit === 'sheets' ? t('calc.sheets') : item.unit}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">{t(item.labelKey)}</div>
              <div className="text-xs text-primary font-medium mt-1">× {rolls} = {getTotal(item)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
