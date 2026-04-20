'use server'

import { getSupabaseAdmin } from '@/lib/supabase/server'
import { requireSpaceId } from '@/lib/session'

export async function toggleIngredientAction(ingredientId: string) {
  const spaceId = requireSpaceId()
  const supabase = getSupabaseAdmin()

  const { data: existing } = await supabase
    .from('available_ingredients')
    .select('ingredient_id')
    .eq('space_id', spaceId)
    .eq('ingredient_id', ingredientId)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from('available_ingredients')
      .delete()
      .eq('space_id', spaceId)
      .eq('ingredient_id', ingredientId)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase
      .from('available_ingredients')
      .insert({ space_id: spaceId, ingredient_id: ingredientId })
    if (error) throw new Error(error.message)
  }
}
