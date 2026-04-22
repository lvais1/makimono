'use client'

import Link from 'next/link'
import { BookmarkX, ShoppingCart, Shuffle } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { useStore } from '@/lib/store'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { GlassCard } from '@/components/shared/GlassCard'
import { INGREDIENT_BY_ID } from '@/lib/data/ingredients'
import { toast } from 'sonner'
import type { GeneratedRoll } from '@/types'

function SavedRollCard({ roll }: { roll: GeneratedRoll }) {
  const { t } = useI18n()
  const { removeSavedRoll } = useStore()
  const [imgError, setImgError] = useState(false)

  return (
    <GlassCard hover={false} className="overflow-hidden p-0">
      {roll.imageUrl && !imgError && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={roll.imageUrl}
            alt={t(roll.nameKey)}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <button
            onClick={() => { removeSavedRoll(roll.id); toast(t('common.delete')) }}
            className="absolute top-2 end-2 p-1.5 rounded-xl bg-black/40 text-white hover:bg-red-500/80 transition-colors"
            title={t('common.delete')}
          >
            <BookmarkX size={15} />
          </button>
          <div className="absolute bottom-2 start-3">
            <span className="text-[11px] text-white/80 bg-black/35 rounded-full px-2 py-0.5">
              {Math.round(roll.score * 100)}% {t('rollGenerator.match')}
            </span>
          </div>
        </div>
      )}

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground truncate">{t(roll.nameKey)}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
              {t(roll.descriptionKey)}
            </p>
          </div>
          {(imgError || !roll.imageUrl) && (
            <button
              onClick={() => { removeSavedRoll(roll.id); toast(t('common.delete')) }}
              className="p-1.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
              title={t('common.delete')}
            >
              <BookmarkX size={15} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {roll.ingredients.map((id) => {
            const ing = INGREDIENT_BY_ID[id]
            return ing ? (
              <span key={id} className="inline-flex items-center gap-1 bg-muted rounded-lg px-2 py-0.5 text-xs text-foreground">
                {ing.emoji} {t(ing.nameKey)}
              </span>
            ) : null
          })}
        </div>

        {roll.missingIngredients.length > 0 && (
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">{t('rollGenerator.missing')}:</span>{' '}
            {roll.missingIngredients.map((id) => {
              const ing = INGREDIENT_BY_ID[id]
              return ing ? `${ing.emoji} ${t(ing.nameKey)}` : null
            }).filter(Boolean).join(', ')}
          </div>
        )}
      </div>
    </GlassCard>
  )
}

import { useState } from 'react'

export default function SavedRollsPage() {
  const { t } = useI18n()
  const { savedRolls } = useStore()

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        emoji="🔖"
        title={t('savedRolls.title')}
        subtitle={t('savedRolls.subtitle')}
        action={
          savedRolls.length > 0 ? (
            <Link href="/shopping-list" className="btn-secondary text-sm">
              <ShoppingCart size={15} /> {t('savedRolls.toShopping')}
            </Link>
          ) : undefined
        }
      />

      {savedRolls.length === 0 ? (
        <EmptyState
          emoji="🔖"
          title={t('savedRolls.empty')}
          action={
            <Link href="/roll-generator" className="btn-primary inline-flex items-center gap-2">
              <Shuffle size={15} /> {t('savedRolls.goGenerate')}
            </Link>
          }
        />
      ) : (
        <>
          <p className="text-xs text-muted-foreground">
            {savedRolls.length} {t('savedRolls.count')}
          </p>
          <div className="grid sm:grid-cols-2 gap-4 list-stagger">
            {savedRolls.map((roll) => (
              <SavedRollCard key={roll.id} roll={roll} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
