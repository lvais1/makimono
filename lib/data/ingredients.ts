import type { Ingredient } from '@/types'

export const INGREDIENTS: Ingredient[] = [
  // Fish & Protein
  { id: 'salmon', nameKey: 'ingredients.salmon', category: 'fish', emoji: '🐟' },
  { id: 'tuna', nameKey: 'ingredients.tuna', category: 'fish', emoji: '🐠' },
  { id: 'shrimp', nameKey: 'ingredients.shrimp', category: 'fish', emoji: '🦐' },
  { id: 'eel', nameKey: 'ingredients.eel', category: 'fish', emoji: '🐍' },
  { id: 'crab', nameKey: 'ingredients.crab', category: 'fish', emoji: '🦀' },
  { id: 'scallop', nameKey: 'ingredients.scallop', category: 'fish', emoji: '🦪' },
  { id: 'imitation_crab', nameKey: 'ingredients.imitation_crab', category: 'fish', emoji: '🦑' },

  // Vegetables & Extras
  { id: 'cucumber', nameKey: 'ingredients.cucumber', category: 'vegetables', emoji: '🥒' },
  { id: 'avocado', nameKey: 'ingredients.avocado', category: 'vegetables', emoji: '🥑' },
  { id: 'carrot', nameKey: 'ingredients.carrot', category: 'vegetables', emoji: '🥕' },
  { id: 'asparagus', nameKey: 'ingredients.asparagus', category: 'vegetables', emoji: '🌿' },
  { id: 'sweet_potato', nameKey: 'ingredients.sweet_potato', category: 'vegetables', emoji: '🍠' },
  { id: 'mango', nameKey: 'ingredients.mango', category: 'vegetables', emoji: '🥭' },
  { id: 'cream_cheese', nameKey: 'ingredients.cream_cheese', category: 'vegetables', emoji: '🧀' },
  { id: 'green_onion', nameKey: 'ingredients.green_onion', category: 'vegetables', emoji: '🧅' },
  { id: 'jalapeno', nameKey: 'ingredients.jalapeno', category: 'vegetables', emoji: '🌶️' },
  { id: 'edamame', nameKey: 'ingredients.edamame', category: 'vegetables', emoji: '🫘' },
  { id: 'spinach', nameKey: 'ingredients.spinach', category: 'vegetables', emoji: '🥬' },

  // Dry Goods
  { id: 'nori', nameKey: 'ingredients.nori', category: 'dry-goods', emoji: '🌊' },
  { id: 'rice', nameKey: 'ingredients.rice', category: 'dry-goods', emoji: '🍚' },
  { id: 'sesame', nameKey: 'ingredients.sesame', category: 'dry-goods', emoji: '⚪' },
  { id: 'panko', nameKey: 'ingredients.panko', category: 'dry-goods', emoji: '🍞' },

  // Toppings
  { id: 'tobiko', nameKey: 'ingredients.tobiko', category: 'toppings', emoji: '🔴' },
  { id: 'masago', nameKey: 'ingredients.masago', category: 'toppings', emoji: '🟠' },

  // Sauces
  { id: 'soy_sauce', nameKey: 'ingredients.soy_sauce', category: 'sauces', emoji: '🥢' },
  { id: 'sriracha', nameKey: 'ingredients.sriracha', category: 'sauces', emoji: '🌶️' },
  { id: 'mayo', nameKey: 'ingredients.mayo', category: 'sauces', emoji: '🫙' },
  { id: 'eel_sauce', nameKey: 'ingredients.eel_sauce', category: 'sauces', emoji: '🍯' },
  { id: 'ponzu', nameKey: 'ingredients.ponzu', category: 'sauces', emoji: '🍋' },
  { id: 'spicy_mayo', nameKey: 'ingredients.spicy_mayo', category: 'sauces', emoji: '🔥' },
]

export const INGREDIENT_BY_ID: Record<string, Ingredient> = Object.fromEntries(
  INGREDIENTS.map((i) => [i.id, i])
)
