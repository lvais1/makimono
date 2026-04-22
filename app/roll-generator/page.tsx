'use client'

import { useState, useMemo } from 'react'
import { Shuffle, Bookmark, BookmarkCheck, Check } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { useStore } from '@/lib/store'
import { INGREDIENTS, INGREDIENT_BY_ID } from '@/lib/data/ingredients'
import { ROLLS } from '@/lib/data/rolls'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { generateId, cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { GeneratedRoll, RollStyle, IngredientCategory } from '@/types'

const STYLES: { key: RollStyle; emoji: string }[] = [
  { key: 'fish', emoji: '🐟' },
  { key: 'vegetarian', emoji: '🥑' },
  { key: 'indulgent', emoji: '🐉' },
  { key: 'light', emoji: '🌿' },
]

const CATEGORY_ORDER: IngredientCategory[] = ['fish', 'vegetables', 'sauces', 'dry-goods', 'toppings']

function MatchBadge({ score }: { score: number }) {
  const { t } = useI18n()
  if (score >= 0.9) return <span className="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">{t('rollGenerator.excellent')}</span>
  if (score >= 0.6) return <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">{t('rollGenerator.good')}</span>
  return <span className="badge bg-muted text-muted-foreground">{t('rollGenerator.partial')}</span>
}

function RollCard({ roll }: { roll: GeneratedRoll }) {
  const { t } = useI18n()
  const { saveRoll, removeSavedRoll, savedRolls } = useStore()
  // Match by recipeId+style because after DB save the roll's id changes to the DB UUID
  const savedEntry = savedRolls.find((r) => r.recipeId === roll.recipeId && r.style === roll.style)
  const isSaved = !!savedEntry
  const [imgError, setImgError] = useState(false)

  const toggleSave = () => {
    if (isSaved && savedEntry) {
      removeSavedRoll(savedEntry.id)
      toast(t('common.delete'))
    } else {
      saveRoll(roll)
      toast.success(t('rollGenerator.saved'))
    }
  }

  return (
    <div className="card overflow-hidden animate-slide-up">
      {/* Image */}
      {roll.imageUrl && !imgError && (
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={roll.imageUrl}
            alt={t(roll.nameKey)}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          {/* Overlay badges */}
          <div className="absolute bottom-3 start-4 flex items-center gap-2">
            <MatchBadge score={roll.score} />
            <span className="text-white/80 text-xs font-medium">
              {Math.round(roll.score * 100)}% {t('rollGenerator.match')}
            </span>
          </div>
          {/* Save button on image */}
          <button
            onClick={toggleSave}
            className={cn(
              'absolute top-3 end-3 p-2 rounded-xl backdrop-blur-sm transition-all',
              isSaved
                ? 'bg-primary/90 text-white shadow-lg'
                : 'bg-black/30 text-white hover:bg-primary/80'
            )}
          >
            {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>
        </div>
      )}

      <div className="p-5 space-y-4">
        {/* Header (when no image) */}
        {imgError && (
          <div className="flex items-start justify-between gap-3">
            <MatchBadge score={roll.score} />
            <button
              onClick={toggleSave}
              className={cn(
                'p-2 rounded-xl transition-all shrink-0',
                isSaved ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
              )}
            >
              {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>
          </div>
        )}

        {/* Name + description */}
        <div>
          <h3 className="text-xl font-bold text-foreground">{t(roll.nameKey)}</h3>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{t(roll.descriptionKey)}</p>
        </div>

        {/* Sauce & Topping row */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 bg-muted/60 rounded-lg px-3 py-1.5 text-xs">
            <span>🥢</span>
            <span className="font-medium text-foreground">{t('rollGenerator.sauce')}:</span>
            <span className="text-muted-foreground">{t(roll.sauceKey)}</span>
          </div>
          {roll.toppingKey && (
            <div className="flex items-center gap-1.5 bg-muted/60 rounded-lg px-3 py-1.5 text-xs">
              <span>✨</span>
              <span className="font-medium text-foreground">{t('rollGenerator.topping')}:</span>
              <span className="text-muted-foreground">{t(roll.toppingKey)}</span>
            </div>
          )}
        </div>

        {/* Ingredients */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
            {t('rollGenerator.ingredients')}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {roll.ingredients.map((id) => {
              const ing = INGREDIENT_BY_ID[id]
              return ing ? (
                <span key={id} className="inline-flex items-center gap-1 bg-muted rounded-lg px-2.5 py-1 text-xs font-medium">
                  <span>{ing.emoji}</span>
                  {t(ing.nameKey)}
                </span>
              ) : null
            })}
          </div>
        </div>

        {/* Missing */}
        {roll.missingIngredients.length > 0 && (
          <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 p-3">
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1.5">
              {t('rollGenerator.missing')}:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {roll.missingIngredients.map((id) => {
                const ing = INGREDIENT_BY_ID[id]
                return ing ? (
                  <span key={id} className="inline-flex items-center gap-1 bg-white dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg px-2.5 py-1 text-xs font-medium border border-red-100 dark:border-red-800/30">
                    <span>{ing.emoji}</span>
                    {t(ing.nameKey)}
                  </span>
                ) : null
              })}
            </div>
          </div>
        )}

        {/* Save button (when no image, keep it in the card) */}
        {imgError && (
          <button
            onClick={toggleSave}
            className={cn('w-full text-sm py-2', isSaved ? 'btn-secondary' : 'btn-primary')}
          >
            {isSaved ? <><BookmarkCheck size={14} /> {t('rollGenerator.saved')}</> : <><Bookmark size={14} /> {t('rollGenerator.save')}</>}
          </button>
        )}
      </div>
    </div>
  )
}

export default function RollGeneratorPage() {
  const { t } = useI18n()
  const [selectedStyle, setSelectedStyle] = useState<RollStyle | null>(null)
  const [generated, setGenerated] = useState<GeneratedRoll[]>([])
  const { availableIngredients, toggleIngredient } = useStore()

  const ingredientsByCategory = useMemo(() =>
    CATEGORY_ORDER.map((cat) => ({
      cat,
      items: INGREDIENTS.filter((i) => i.category === cat),
    })).filter((g) => g.items.length > 0),
    []
  )

  const handleGenerate = () => {
    if (!selectedStyle) {
      toast.error(t('rollGenerator.selectStyle'))
      return
    }

    if (availableIngredients.length === 0) {
      toast.info(t('rollGenerator.noResults'))
      return
    }

    const matching = ROLLS.filter((r) => r.style === selectedStyle)
      .map((recipe) => {
        const all = [...recipe.requiredIngredients, ...recipe.optionalIngredients]
        const has = all.filter((id) => availableIngredients.includes(id))
        const missing = recipe.requiredIngredients.filter((id) => !availableIngredients.includes(id))
        const score = all.length > 0 ? has.length / all.length : 1
        return { recipe, score, missing, has }
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)

    if (!matching.length) {
      toast.info(t('rollGenerator.noResults'))
      return
    }

    const results: GeneratedRoll[] = matching.map(({ recipe, score, missing, has }) => ({
      id: generateId(),
      recipeId: recipe.id,
      nameKey: recipe.nameKey,
      descriptionKey: recipe.descriptionKey,
      ingredients: has,
      missingIngredients: missing,
      sauceKey: recipe.sauceKey,
      toppingKey: recipe.toppingKey,
      style: recipe.style,
      score,
      imageUrl: recipe.imageUrl,
    }))

    setGenerated(results)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader emoji="🎲" title={t('rollGenerator.title')} subtitle={t('rollGenerator.subtitle')} />

      {/* Style Selector */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          {t('rollGenerator.selectStyle')}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {STYLES.map(({ key, emoji }) => (
            <button
              key={key}
              onClick={() => setSelectedStyle(key)}
              className={cn(
                'card p-4 text-start transition-all hover:shadow-card-hover flex flex-col gap-2',
                selectedStyle === key
                  ? 'border-primary/50 bg-primary/5 ring-2 ring-primary/20'
                  : 'hover:border-primary/30'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{emoji}</span>
                {selectedStyle === key && (
                  <span className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Check size={12} className="text-white" />
                  </span>
                )}
              </div>
              <div>
                <div className="font-semibold text-foreground">{t(`rollGenerator.styles.${key}`)}</div>
                <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{t(`rollGenerator.styles.${key}Desc`)}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Ingredient Selector */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          {t('rollGenerator.yourIngredients')}
          {availableIngredients.length > 0 && (
            <span className="ms-2 text-primary normal-case font-medium">
              ({availableIngredients.length})
            </span>
          )}
        </h2>
        <div className="space-y-5">
          {ingredientsByCategory.map(({ cat, items }) => (
            <div key={cat}>
              <div className="text-xs font-semibold text-muted-foreground mb-2.5">
                {t(`rollGenerator.ingredientCategories.${cat}`)}
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map((ing) => {
                  const active = availableIngredients.includes(ing.id)
                  return (
                    <button
                      key={ing.id}
                      onClick={() => toggleIngredient(ing.id)}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-all border',
                        active
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-card text-foreground border-border hover:border-primary/40 hover:bg-primary/5'
                      )}
                    >
                      <span>{ing.emoji}</span>
                      {t(ing.nameKey)}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Generate */}
      <button
        onClick={handleGenerate}
        disabled={!selectedStyle}
        className="btn-primary w-full py-3.5 text-base disabled:opacity-40"
      >
        <Shuffle size={18} />
        {t('rollGenerator.generate')}
      </button>

      {/* Results */}
      {generated.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            {t('rollGenerator.results')}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {generated.map((roll) => (
              <RollCard key={roll.id} roll={roll} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
