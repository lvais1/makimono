export type Language = 'he' | 'en' | 'ru'
export type Theme = 'light' | 'dark'
export type RollStyle = 'fish' | 'vegetarian' | 'indulgent' | 'light'
export type IngredientCategory = 'fish' | 'vegetables' | 'sauces' | 'dry-goods' | 'toppings' | 'other'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Ingredient {
  id: string
  nameKey: string
  category: IngredientCategory
  emoji: string
}

export interface RollRecipe {
  id: string
  nameKey: string
  style: RollStyle
  requiredIngredients: string[]
  optionalIngredients: string[]
  sauceKey: string
  toppingKey?: string
  descriptionKey: string
  imageUrl: string
}

export interface GeneratedRoll {
  id: string
  recipeId: string
  nameKey: string
  descriptionKey: string
  ingredients: string[]
  missingIngredients: string[]
  sauceKey: string
  toppingKey?: string
  style: RollStyle
  score: number
  imageUrl: string
}

export interface ShoppingItem {
  id: string
  name: string
  nameKey?: string
  category: IngredientCategory
  quantity: string
  unit: string
  checked: boolean
  isCustom?: boolean
}

export interface RollRating {
  id: string
  rollName: string
  date: string
  user1?: { taste: number; appearance: number; creativity: number }
  user2?: { taste: number; appearance: number; creativity: number }
  notes: string
}

export interface JournalEntry {
  id: string
  date: string
  rollsMade: string[]
  notes: string
  imageUrl: string
  ratings: RollRating[]
  challengeId?: string
  durationMinutes?: number
}

export interface Challenge {
  id: string
  titleKey: string
  descriptionKey: string
  difficulty: Difficulty
  emoji: string
}

export interface CompletedChallenge {
  challengeId: string
  completedAt: string
  notes?: string
}

export interface AppSettings {
  language: Language
  theme: Theme
  user1Name: string
  user2Name: string
}
