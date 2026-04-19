import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { generateId } from '@/lib/utils'
import type {
  AppSettings,
  JournalEntry,
  RollRating,
  ShoppingItem,
  CompletedChallenge,
  GeneratedRoll,
} from '@/types'

interface AppStore {
  // Settings
  settings: AppSettings
  updateSettings: (s: Partial<AppSettings>) => void

  // Journal
  journal: JournalEntry[]
  addJournalEntry: (e: Omit<JournalEntry, 'id'>) => void
  updateJournalEntry: (id: string, e: Partial<JournalEntry>) => void
  deleteJournalEntry: (id: string) => void

  // Ratings
  ratings: RollRating[]
  addRating: (r: Omit<RollRating, 'id'>) => void
  updateRating: (id: string, r: Partial<RollRating>) => void
  deleteRating: (id: string) => void

  // Shopping List
  shopping: ShoppingItem[]
  addShoppingItem: (item: Omit<ShoppingItem, 'id'>) => void
  toggleShoppingItem: (id: string) => void
  removeShoppingItem: (id: string) => void
  clearChecked: () => void
  setShoppingList: (items: ShoppingItem[]) => void

  // Challenges
  completedChallenges: CompletedChallenge[]
  completeChallenge: (challengeId: string, notes?: string) => void
  uncompleteChallenge: (challengeId: string) => void

  // Roll Generator
  availableIngredients: string[]
  toggleIngredient: (id: string) => void

  // Saved Rolls
  savedRolls: GeneratedRoll[]
  saveRoll: (roll: GeneratedRoll) => void
  removeSavedRoll: (id: string) => void

  // Reset
  resetAllData: () => void
}

const DEFAULT_SETTINGS: AppSettings = {
  language: 'he',
  theme: 'light',
  user1Name: 'אני',
  user2Name: 'בת הזוג',
}

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      updateSettings: (s) =>
        set((state) => ({ settings: { ...state.settings, ...s } })),

      journal: [],
      addJournalEntry: (e) =>
        set((state) => ({
          journal: [{ ...e, id: generateId() }, ...state.journal],
        })),
      updateJournalEntry: (id, e) =>
        set((state) => ({
          journal: state.journal.map((j) => (j.id === id ? { ...j, ...e } : j)),
        })),
      deleteJournalEntry: (id) =>
        set((state) => ({ journal: state.journal.filter((j) => j.id !== id) })),

      ratings: [],
      addRating: (r) =>
        set((state) => ({
          ratings: [{ ...r, id: generateId() }, ...state.ratings],
        })),
      updateRating: (id, r) =>
        set((state) => ({
          ratings: state.ratings.map((rt) => (rt.id === id ? { ...rt, ...r } : rt)),
        })),
      deleteRating: (id) =>
        set((state) => ({ ratings: state.ratings.filter((r) => r.id !== id) })),

      shopping: [],
      addShoppingItem: (item) =>
        set((state) => ({
          shopping: [...state.shopping, { ...item, id: generateId() }],
        })),
      toggleShoppingItem: (id) =>
        set((state) => ({
          shopping: state.shopping.map((i) =>
            i.id === id ? { ...i, checked: !i.checked } : i
          ),
        })),
      removeShoppingItem: (id) =>
        set((state) => ({ shopping: state.shopping.filter((i) => i.id !== id) })),
      clearChecked: () =>
        set((state) => ({ shopping: state.shopping.filter((i) => !i.checked) })),
      setShoppingList: (items) => set({ shopping: items }),

      completedChallenges: [],
      completeChallenge: (challengeId, notes) =>
        set((state) => {
          if (state.completedChallenges.some((c) => c.challengeId === challengeId))
            return state
          return {
            completedChallenges: [
              ...state.completedChallenges,
              { challengeId, notes, completedAt: new Date().toISOString() },
            ],
          }
        }),
      uncompleteChallenge: (challengeId) =>
        set((state) => ({
          completedChallenges: state.completedChallenges.filter(
            (c) => c.challengeId !== challengeId
          ),
        })),

      availableIngredients: [],
      toggleIngredient: (id) =>
        set((state) => ({
          availableIngredients: state.availableIngredients.includes(id)
            ? state.availableIngredients.filter((i) => i !== id)
            : [...state.availableIngredients, id],
        })),

      savedRolls: [],
      saveRoll: (roll) =>
        set((state) => {
          if (state.savedRolls.some((r) => r.id === roll.id)) return state
          return { savedRolls: [roll, ...state.savedRolls] }
        }),
      removeSavedRoll: (id) =>
        set((state) => ({ savedRolls: state.savedRolls.filter((r) => r.id !== id) })),

      resetAllData: () =>
        set({
          journal: [],
          ratings: [],
          shopping: [],
          completedChallenges: [],
          savedRolls: [],
          availableIngredients: [],
        }),
    }),
    {
      name: 'makimono-v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
