'use client'

import { useState } from 'react'
import { Plus, Trash2, CheckSquare, Square, Wand2, X } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { useStore } from '@/lib/store'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { IngredientCategory, ShoppingItem } from '@/types'
import { INGREDIENT_BY_ID } from '@/lib/data/ingredients'

const CATEGORIES: IngredientCategory[] = ['fish', 'vegetables', 'sauces', 'dry-goods', 'toppings', 'other']

function AddItemForm({ onAdd }: { onAdd: (item: Omit<ShoppingItem, 'id' | 'checked'>) => void }) {
  const { t } = useI18n()
  const [name, setName] = useState('')
  const [qty, setQty] = useState('')
  const [unit, setUnit] = useState('g')
  const [cat, setCat] = useState<IngredientCategory>('other')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onAdd({ name: name.trim(), quantity: qty, unit, category: cat, isCustom: true })
    setName('')
    setQty('')
  }

  return (
    <form onSubmit={submit} className="card p-4 space-y-3">
      <div className="flex gap-2">
        <input
          className="input flex-1"
          placeholder={t('shopping.itemName')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="input w-20"
          placeholder={t('shopping.quantity')}
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />
        <input
          className="input w-16"
          placeholder={t('shopping.unit')}
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <select
          className="select flex-1"
          value={cat}
          onChange={(e) => setCat(e.target.value as IngredientCategory)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{t(`shopping.categories.${c}`)}</option>
          ))}
        </select>
        <button type="submit" className="btn-primary shrink-0">
          <Plus size={16} /> {t('common.add')}
        </button>
      </div>
    </form>
  )
}

function ItemRow({ item }: { item: ShoppingItem }) {
  const { t } = useI18n()
  const { toggleShoppingItem, removeShoppingItem } = useStore()

  // Resolve display name: if nameKey exists translate it, otherwise show the stored name
  const displayName = item.nameKey ? t(item.nameKey) : item.name

  return (
    <div className={cn('flex items-center gap-3 py-2.5 px-1 rounded-xl group transition-all', item.checked && 'opacity-50')}>
      <button
        onClick={() => toggleShoppingItem(item.id)}
        className="shrink-0 text-foreground/40 hover:text-primary transition-colors"
      >
        {item.checked
          ? <CheckSquare size={20} className="text-primary" />
          : <Square size={20} />}
      </button>
      <span className={cn('flex-1 text-sm capitalize', item.checked && 'line-through text-muted-foreground')}>
        {displayName}
      </span>
      {(item.quantity || item.unit) && (
        <span className="text-xs text-muted-foreground shrink-0">
          {item.quantity} {item.unit}
        </span>
      )}
      <button
        onClick={() => removeShoppingItem(item.id)}
        className="opacity-30 sm:opacity-0 sm:group-hover:opacity-100 hover:opacity-100 text-muted-foreground hover:text-destructive transition-all shrink-0"
      >
        <X size={16} />
      </button>
    </div>
  )
}

export default function ShoppingListPage() {
  const { t } = useI18n()
  const { shopping, addShoppingItem, clearChecked, savedRolls } = useStore()
  const [showAdd, setShowAdd] = useState(false)

  const checkedCount = shopping.filter((i) => i.checked).length
  const progress = shopping.length > 0 ? (checkedCount / shopping.length) * 100 : 0

  const itemsByCategory = CATEGORIES.map((cat) => ({
    cat,
    items: shopping.filter((i) => i.category === cat),
  })).filter((g) => g.items.length > 0)

  const handleAdd = (item: Omit<ShoppingItem, 'id' | 'checked'>) => {
    addShoppingItem({ ...item, checked: false })
    toast.success(t('shopping.add'))
    setShowAdd(false)
  }

  const handleGenerateFromRolls = () => {
    if (!savedRolls.length) {
      toast.error(t('rollGenerator.noResults'))
      return
    }
    const existing = new Set(shopping.map((i) => i.name.toLowerCase()))
    let added = 0
    savedRolls.forEach((roll) => {
      ;[...roll.ingredients, ...roll.missingIngredients].forEach((id) => {
        const ing = INGREDIENT_BY_ID[id]
        const normalizedId = id.toLowerCase()
        if (ing && !existing.has(normalizedId)) {
          addShoppingItem({
            name: id,
            nameKey: ing.nameKey, // store translation key → UI always shows correct language
            category: ing.category,
            quantity: '',
            unit: '',
            checked: false,
          })
          existing.add(normalizedId)
          added++
        }
      })
    })
    toast.success(added > 0 ? `+${added}` : t('shopping.allDone'))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        emoji="🛒"
        title={t('shopping.title')}
        subtitle={t('shopping.subtitle')}
        action={
          <button onClick={() => setShowAdd(!showAdd)} className="btn-primary">
            <Plus size={16} /> {t('shopping.add')}
          </button>
        }
      />

      {showAdd && <AddItemForm onAdd={handleAdd} />}

      {/* Progress */}
      {shopping.length > 0 && (
        <div className="card p-4">
          <div className="flex justify-between text-sm mb-2.5">
            <span className="font-medium text-foreground">
              {progress === 100
                ? t('shopping.allDone')
                : t('shopping.progress')
                    .replace('{done}', String(checkedCount))
                    .replace('{total}', String(shopping.length))}
            </span>
            <span className="text-muted-foreground font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button onClick={handleGenerateFromRolls} className="btn-secondary text-sm">
          <Wand2 size={14} /> {t('shopping.generateFromRolls')}
        </button>
        {checkedCount > 0 && (
          <button
            onClick={() => { clearChecked(); toast.success(t('shopping.clearChecked')) }}
            className="btn-ghost text-sm text-destructive hover:bg-destructive/10"
          >
            <Trash2 size={14} /> {t('shopping.clearChecked')}
          </button>
        )}
      </div>

      {/* Items */}
      {shopping.length === 0 ? (
        <EmptyState
          emoji="🛒"
          title={t('shopping.empty')}
          action={
            <button onClick={() => setShowAdd(true)} className="btn-primary">
              <Plus size={16} /> {t('shopping.add')}
            </button>
          }
        />
      ) : (
        <div className="space-y-6">
          {itemsByCategory.map(({ cat, items }) => (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2">
                  {t(`shopping.categories.${cat}`)} ({items.length})
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="card px-4 divide-y divide-border">
                {items.map((item) => (
                  <ItemRow key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
