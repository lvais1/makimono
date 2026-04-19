'use server'

import { getSupabaseAdmin } from '@/lib/supabase/server'
import { requireSpaceId } from '@/lib/session'

export async function completeChallengeAction(challengeId: string, notes?: string) {
  const spaceId = requireSpaceId()
  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from('completed_challenges')
    .upsert(
      { space_id: spaceId, challenge_id: challengeId, notes: notes ?? null },
      { onConflict: 'space_id,challenge_id' }
    )
  if (error) throw new Error(error.message)
}

export async function uncompleteChallengeAction(challengeId: string) {
  const spaceId = requireSpaceId()
  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from('completed_challenges')
    .delete()
    .eq('space_id', spaceId)
    .eq('challenge_id', challengeId)
  if (error) throw new Error(error.message)
}
