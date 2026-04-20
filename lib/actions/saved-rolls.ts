'use server'

import { getSupabaseAdmin } from '@/lib/supabase/server'
import { requireSpaceId } from '@/lib/session'
import type { GeneratedRoll } from '@/types'

export async function saveRollAction(roll: GeneratedRoll): Promise<GeneratedRoll> {
  const spaceId = requireSpaceId()
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('saved_rolls')
    .insert({ space_id: spaceId, data: roll })
    .select('id')
    .single()
  if (error || !data) throw new Error(error?.message ?? 'insert failed')
  return { ...roll, id: data.id }
}

export async function removeSavedRollAction(id: string) {
  const spaceId = requireSpaceId()
  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from('saved_rolls')
    .delete()
    .eq('id', id)
    .eq('space_id', spaceId)
  if (error) throw new Error(error.message)
}
