export interface QuantityResult {
  id: string
  labelKey: string
  emoji: string
  perRoll: number
  total: number
  unit: string
}

export function calculateQuantities(rolls: number, people: number): QuantityResult[] {
  return [
    {
      id: 'rice',
      labelKey: 'calc.rice',
      emoji: '🍚',
      perRoll: 80,
      total: rolls * 80,
      unit: 'g',
    },
    {
      id: 'nori',
      labelKey: 'calc.nori',
      emoji: '🌊',
      perRoll: 1,
      total: rolls,
      unit: 'sheets',
    },
    {
      id: 'protein',
      labelKey: 'calc.protein',
      emoji: '🐟',
      perRoll: 70,
      total: rolls * 70,
      unit: 'g',
    },
    {
      id: 'vegetables',
      labelKey: 'calc.vegetables',
      emoji: '🥒',
      perRoll: 40,
      total: rolls * 40,
      unit: 'g',
    },
    {
      id: 'rice_vinegar',
      labelKey: 'calc.rice_vinegar',
      emoji: '🍶',
      perRoll: 15,
      total: rolls * 15,
      unit: 'ml',
    },
    {
      id: 'soy_sauce',
      labelKey: 'calc.soy_sauce',
      emoji: '🥢',
      perRoll: 0,
      total: people * 30,
      unit: 'ml',
    },
    {
      id: 'wasabi',
      labelKey: 'calc.wasabi',
      emoji: '💚',
      perRoll: 0,
      total: people * 5,
      unit: 'g',
    },
    {
      id: 'ginger',
      labelKey: 'calc.ginger',
      emoji: '🫚',
      perRoll: 0,
      total: people * 20,
      unit: 'g',
    },
    {
      id: 'sesame',
      labelKey: 'calc.sesame',
      emoji: '⚪',
      perRoll: 5,
      total: rolls * 5,
      unit: 'g',
    },
  ]
}
