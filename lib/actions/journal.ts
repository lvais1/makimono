'use server'

import { getSupabaseAdmin } from '@/lib/supabase/server'
import { requireSpaceId } from '@/lib/session'
import type { JournalEntry } from '@/types'

export async function addJournalEntryAction(
  entry: Omit<JournalEntry, 'id'>
): Promise<JournalEntry> {
  const spaceId = requireSpaceId()
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('journal_entries')
    .insert({ space_id: spaceId, data: entry })
    .select('id')
    .single()
  if (error || !data) throw new Error(error?.message ?? 'insert failed')
  return { ...entry, id: data.id }
}

export async function updateJournalEntryAction(id: string, patch: Partial<JournalEntry>) {
  const spaceId = requireSpaceId()
  const supabase = getSupabaseAdmin()
  const { data: current } = await supabase
    .from('journal_entries')
    .select('data')
    .eq('id', id)
    .eq('space_id', spaceId)
    .single()
  if (!current) throw new Error('entry not found')

  const merged = { ...(current.data as JournalEntry), ...patch }
  const { error } = await supabase
    .from('journal_entries')
    .update({ data: merged })
    .eq('id', id)
    .eq('space_id', spaceId)
  if (error) throw new Error(error.message)
}

export async function deleteJournalEntryAction(id: string) {
  const spaceId = requireSpaceId()
  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', id)
    .eq('space_id', spaceId)
  if (error) throw new Error(error.message)
}
