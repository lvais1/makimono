'use server'

import { getSupabaseAdmin } from '@/lib/supabase/server'
import { requireSpaceId } from '@/lib/session'
import type { RollRating } from '@/types'

export async function addRatingAction(
  rating: Omit<RollRating, 'id'>
): Promise<RollRating> {
  const spaceId = requireSpaceId()
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('ratings')
    .insert({ space_id: spaceId, data: rating })
    .select('id')
    .single()
  if (error || !data) throw new Error(error?.message ?? 'insert failed')
  return { ...rating, id: data.id }
}

export async function updateRatingAction(id: string, patch: Partial<RollRating>) {
  const spaceId = requireSpaceId()
  const supabase = getSupabaseAdmin()
  const { data: current } = await supabase
    .from('ratings')
    .select('data')
    .eq('id', id)
    .eq('space_id', spaceId)
    .single()
  if (!current) throw new Error('rating not found')

  const merged = { ...(current.data as RollRating), ...patch }
  const { error } = await supabase
    .from('ratings')
    .update({ data: merged })
    .eq('id', id)
    .eq('space_id', spaceId)
  if (error) throw new Error(error.message)
}

export async function deleteRatingAction(id: string) {
  const spaceId = requireSpaceId()
  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from('ratings')
    .delete()
    .eq('id', id)
    .eq('space_id', spaceId)
  if (error) throw new Error(error.message)
}
