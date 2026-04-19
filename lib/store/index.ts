'use client'

import { create } from 'zustand'
import type {
  AppSettings,
  JournalEntry,
  RollRating,
  ShoppingItem,
  CompletedChallenge,
  GeneratedRoll,
} from '@/types'
import type { SpaceBootstrap } from '@/lib/actions/space'
import {
  updateSettingsAction,
  resetSpaceData,
} from '@/lib/actions/space'
import {
  addJournalEntryAction,
  updateJournalEntryAction,
  deleteJournalEntryAction,
} from '@/lib/actions/journal'
import {
  addRatingAction,
  updateRatingAction,
  deleteRatingAction,
} from '@/lib/actions/ratings'
import {
  addShoppingItemAction,
  toggleShoppingItemAction,
  removeShoppingItemAction,
  clearCheckedShoppingAction,
  replaceShoppingListAction,
} from '@/lib/actions/shopping'
import {
  completeChallengeAction,
  uncompleteChallengeAction,
} from '@/lib/actions/challenges'
import {
  saveRollAction,
  removeSavedRollAction,
} from '@/lib/actions/saved-rolls'
import { toggleIngredientAction } from '@/lib/actions/ingredients'

const DEFAULT_SETTINGS: AppSettings = {
  language: 'he',
  theme: 'light',
  user1Name: 'אני',
  user2Name: 'בת הזוג',
}

interface AppStore {
  // Space identity
  spaceId: string | null
  inviteToken: string | null
  isHydrated: boolean
  isSyncing: boolean
  lastError: string | null

  hydrateFromBootstrap: (b: SpaceBootstrap) => void
  clearSpace: () => void

  // Settings
  settings: AppSettings
  updateSettings: (s: Partial<AppSettings>) => Promise<void>

  // Journal
  journal: JournalEntry[]
  addJournalEntry: (e: Omit<JournalEntry, 'id'>) => Promise<void>
  updateJournalEntry: (id: string, e: Partial<JournalEntry>) => Promise<void>
  deleteJournalEntry: (id: string) => Promise<void>

  // Ratings
  ratings: RollRating[]
  addRating: (r: Omit<RollRating, 'id'>) => Promise<void>
  updateRating: (id: string, r: Partial<RollRating>) => Promise<void>
  deleteRating: (id: string) => Promise<void>

  // Shopping List
  shopping: ShoppingItem[]
  addShoppingItem: (item: Omit<ShoppingItem, 'id'>) => Promise<void>
  toggleShoppingItem: (id: string) => Promise<void>
  removeShoppingItem: (id: string) => Promise<void>
  clearChecked: () => Promise<void>
  setShoppingList: (items: ShoppingItem[]) => Promise<void>

  // Challenges
  completedChallenges: CompletedChallenge[]
  completeChallenge: (challengeId: string, notes?: string) => Promise<void>
  uncompleteChallenge: (challengeId: string) => Promise<void>

  // Roll Generator
  availableIngredients: string[]
  toggleIngredient: (id: string) => Promise<void>

  // Saved Rolls
  savedRolls: GeneratedRoll[]
  saveRoll: (roll: GeneratedRoll) => Promise<void>
  removeSavedRoll: (id: string) => Promise<void>

  // Reset
  resetAllData: () => Promise<void>
}

const tempId = () => `tmp_${Math.random().toString(36).slice(2, 11)}`

async function withSync<T>(
  set: (fn: (s: AppStore) => Partial<AppStore>) => void,
  work: () => Promise<T>,
  rollback?: () => void
): Promise<T | undefined> {
  set(() => ({ isSyncing: true, lastError: null }))
  try {
    const result = await work()
    set(() => ({ isSyncing: false }))
    return result
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Sync failed'
    set(() => ({ isSyncing: false, lastError: msg }))
    if (rollback) rollback()
    if (typeof window !== 'undefined') {
      import('sonner').then(({ toast }) => toast.error(msg))
    }
    return undefined
  }
}

export const useStore = create<AppStore>()((set, get) => ({
  spaceId: null,
  inviteToken: null,
  isHydrated: false,
  isSyncing: false,
  lastError: null,

  hydrateFromBootstrap: (b) =>
    set(() => ({
      spaceId: b.spaceId,
      inviteToken: b.inviteToken,
      settings: b.settings,
      journal: b.journal,
      ratings: b.ratings,
      shopping: b.shopping,
      completedChallenges: b.completedChallenges,
      savedRolls: b.savedRolls,
      availableIngredients: b.availableIngredients,
      isHydrated: true,
    })),

  clearSpace: () =>
    set(() => ({
      spaceId: null,
      inviteToken: null,
      isHydrated: false,
      settings: DEFAULT_SETTINGS,
      journal: [],
      ratings: [],
      shopping: [],
      completedChallenges: [],
      savedRolls: [],
      availableIngredients: [],
    })),

  settings: DEFAULT_SETTINGS,
  updateSettings: async (s) => {
    const prev = get().settings
    set((state) => ({ settings: { ...state.settings, ...s } }))
    await withSync(
      set,
      () => updateSettingsAction(s),
      () => set(() => ({ settings: prev }))
    )
  },

  journal: [],
  addJournalEntry: async (e) => {
    const optimistic: JournalEntry = { ...e, id: tempId() }
    set((state) => ({ journal: [optimistic, ...state.journal] }))
    const saved = await withSync(set, () => addJournalEntryAction(e), () =>
      set((state) => ({ journal: state.journal.filter((j) => j.id !== optimistic.id) }))
    )
    if (saved) {
      set((state) => ({
        journal: state.journal.map((j) => (j.id === optimistic.id ? saved : j)),
      }))
    }
  },
  updateJournalEntry: async (id, patch) => {
    const prev = get().journal
    set((state) => ({
      journal: state.journal.map((j) => (j.id === id ? { ...j, ...patch } : j)),
    }))
    await withSync(set, () => updateJournalEntryAction(id, patch), () =>
      set(() => ({ journal: prev }))
    )
  },
  deleteJournalEntry: async (id) => {
    const prev = get().journal
    set((state) => ({ journal: state.journal.filter((j) => j.id !== id) }))
    await withSync(set, () => deleteJournalEntryAction(id), () =>
      set(() => ({ journal: prev }))
    )
  },

  ratings: [],
  addRating: async (r) => {
    const optimistic: RollRating = { ...r, id: tempId() }
    set((state) => ({ ratings: [optimistic, ...state.ratings] }))
    const saved = await withSync(set, () => addRatingAction(r), () =>
      set((state) => ({ ratings: state.ratings.filter((x) => x.id !== optimistic.id) }))
    )
    if (saved) {
      set((state) => ({
        ratings: state.ratings.map((x) => (x.id === optimistic.id ? saved : x)),
      }))
    }
  },
  updateRating: async (id, patch) => {
    const prev = get().ratings
    set((state) => ({
      ratings: state.ratings.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }))
    await withSync(set, () => updateRatingAction(id, patch), () =>
      set(() => ({ ratings: prev }))
    )
  },
  deleteRating: async (id) => {
    const prev = get().ratings
    set((state) => ({ ratings: state.ratings.filter((r) => r.id !== id) }))
    await withSync(set, () => deleteRatingAction(id), () =>
      set(() => ({ ratings: prev }))
    )
  },

  shopping: [],
  addShoppingItem: async (item) => {
    const optimistic: ShoppingItem = { ...item, id: tempId() }
    set((state) => ({ shopping: [...state.shopping, optimistic] }))
    const saved = await withSync(set, () => addShoppingItemAction(item), () =>
      set((state) => ({ shopping: state.shopping.filter((x) => x.id !== optimistic.id) }))
    )
    if (saved) {
      set((state) => ({
        shopping: state.shopping.map((x) => (x.id === optimistic.id ? saved : x)),
      }))
    }
  },
  toggleShoppingItem: async (id) => {
    const prev = get().shopping
    set((state) => ({
      shopping: state.shopping.map((i) =>
        i.id === id ? { ...i, checked: !i.checked } : i
      ),
    }))
    await withSync(set, () => toggleShoppingItemAction(id), () =>
      set(() => ({ shopping: prev }))
    )
  },
  removeShoppingItem: async (id) => {
    const prev = get().shopping
    set((state) => ({ shopping: state.shopping.filter((i) => i.id !== id) }))
    await withSync(set, () => removeShoppingItemAction(id), () =>
      set(() => ({ shopping: prev }))
    )
  },
  clearChecked: async () => {
    const prev = get().shopping
    set((state) => ({ shopping: state.shopping.filter((i) => !i.checked) }))
    await withSync(set, () => clearCheckedShoppingAction(), () =>
      set(() => ({ shopping: prev }))
    )
  },
  setShoppingList: async (items) => {
    const prev = get().shopping
    set(() => ({ shopping: items }))
    const saved = await withSync(
      set,
      () => replaceShoppingListAction(items.map(({ id, ...rest }) => rest)),
      () => set(() => ({ shopping: prev }))
    )
    if (saved) set(() => ({ shopping: saved }))
  },

  completedChallenges: [],
  completeChallenge: async (challengeId, notes) => {
    if (get().completedChallenges.some((c) => c.challengeId === challengeId)) return
    const entry: CompletedChallenge = {
      challengeId,
      notes,
      completedAt: new Date().toISOString(),
    }
    set((state) => ({ completedChallenges: [...state.completedChallenges, entry] }))
    await withSync(set, () => completeChallengeAction(challengeId, notes), () =>
      set((state) => ({
        completedChallenges: state.completedChallenges.filter(
          (c) => c.challengeId !== challengeId
        ),
      }))
    )
  },
  uncompleteChallenge: async (challengeId) => {
    const prev = get().completedChallenges
    set((state) => ({
      completedChallenges: state.completedChallenges.filter(
        (c) => c.challengeId !== challengeId
      ),
    }))
    await withSync(set, () => uncompleteChallengeAction(challengeId), () =>
      set(() => ({ completedChallenges: prev }))
    )
  },

  availableIngredients: [],
  toggleIngredient: async (id) => {
    const prev = get().availableIngredients
    set((state) => ({
      availableIngredients: state.availableIngredients.includes(id)
        ? state.availableIngredients.filter((i) => i !== id)
        : [...state.availableIngredients, id],
    }))
    await withSync(set, () => toggleIngredientAction(id), () =>
      set(() => ({ availableIngredients: prev }))
    )
  },

  savedRolls: [],
  saveRoll: async (roll) => {
    if (get().savedRolls.some((r) => r.id === roll.id)) return
    set((state) => ({ savedRolls: [roll, ...state.savedRolls] }))
    const saved = await withSync(set, () => saveRollAction(roll), () =>
      set((state) => ({ savedRolls: state.savedRolls.filter((r) => r.id !== roll.id) }))
    )
    if (saved) {
      set((state) => ({
        savedRolls: state.savedRolls.map((r) => (r.id === roll.id ? saved : r)),
      }))
    }
  },
  removeSavedRoll: async (id) => {
    const prev = get().savedRolls
    set((state) => ({ savedRolls: state.savedRolls.filter((r) => r.id !== id) }))
    await withSync(set, () => removeSavedRollAction(id), () =>
      set(() => ({ savedRolls: prev }))
    )
  },

  resetAllData: async () => {
    const prev = {
      journal: get().journal,
      ratings: get().ratings,
      shopping: get().shopping,
      completedChallenges: get().completedChallenges,
      savedRolls: get().savedRolls,
      availableIngredients: get().availableIngredients,
    }
    set(() => ({
      journal: [],
      ratings: [],
      shopping: [],
      completedChallenges: [],
      savedRolls: [],
      availableIngredients: [],
    }))
    await withSync(set, () => resetSpaceData(), () => set(() => prev))
  },
}))
