'use server'

import { customAlphabet } from 'nanoid'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import {
  clearSpaceCookie,
  getSpaceIdFromCookie,
  requireSpaceId,
  setSpaceCookie,
} from '@/lib/session'
import type {
  AppSettings,
  CompletedChallenge,
  GeneratedRoll,
  JournalEntry,
  RollRating,
  ShoppingItem,
} from '@/types'

const tokenGen = customAlphabet(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  32
)

const DEFAULT_SETTINGS: AppSettings = {
  language: 'he',
  theme: 'light',
  user1Name: 'אני',
  user2Name: 'בת הזוג',
}

export interface SpaceBootstrap {
  spaceId: string
  inviteToken: string
  settings: AppSettings
  journal: JournalEntry[]
  ratings: RollRating[]
  shopping: ShoppingItem[]
  completedChallenges: CompletedChallenge[]
  savedRolls: GeneratedRoll[]
  availableIngredients: string[]
}

export async function createSpace(): Promise<{ inviteToken: string; spaceId: string }> {
  const supabase = getSupabaseAdmin()
  const inviteToken = tokenGen()

  const { data, error } = await supabase
    .from('spaces')
    .insert({ invite_token: inviteToken, settings: DEFAULT_SETTINGS })
    .select('id, invite_token')
    .single()

  if (error || !data) {
    throw new Error(`Failed to create space: ${error?.message ?? 'unknown'}`)
  }

  setSpaceCookie(data.id)
  revalidatePath('/', 'layout')
  return { inviteToken: data.invite_token, spaceId: data.id }
}

export async function joinSpaceByToken(token: string): Promise<{ spaceId: string } | null> {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('spaces')
    .select('id')
    .eq('invite_token', token)
    .maybeSingle()

  if (error || !data) return null

  setSpaceCookie(data.id)
  revalidatePath('/', 'layout')
  return { spaceId: data.id }
}

export async function leaveSpace() {
  clearSpaceCookie()
  revalidatePath('/', 'layout')
  redirect('/welcome')
}

export async function getCurrentSpace(): Promise<{
  id: string
  inviteToken: string
  settings: AppSettings
} | null> {
  const spaceId = getSpaceIdFromCookie()
  if (!spaceId) return null

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('spaces')
    .select('id, invite_token, settings')
    .eq('id', spaceId)
    .maybeSingle()

  if (error || !data) return null

  return {
    id: data.id,
    inviteToken: data.invite_token,
    settings: { ...DEFAULT_SETTINGS, ...(data.settings ?? {}) } as AppSettings,
  }
}

export async function loadSpaceBootstrap(): Promise<SpaceBootstrap | null> {
  const spaceId = getSpaceIdFromCookie()
  if (!spaceId) return null

  const supabase = getSupabaseAdmin()

  const [
    spaceRes,
    journalRes,
    ratingsRes,
    shoppingRes,
    challengesRes,
    savedRollsRes,
    ingredientsRes,
  ] = await Promise.all([
    supabase.from('spaces').select('id, invite_token, settings').eq('id', spaceId).maybeSingle(),
    supabase.from('journal_entries').select('id, data').eq('space_id', spaceId).order('created_at', { ascending: false }),
    supabase.from('ratings').select('id, data').eq('space_id', spaceId).order('created_at', { ascending: false }),
    supabase.from('shopping_items').select('id, data').eq('space_id', spaceId).order('created_at', { ascending: true }),
    supabase.from('completed_challenges').select('challenge_id, notes, completed_at').eq('space_id', spaceId),
    supabase.from('saved_rolls').select('id, data').eq('space_id', spaceId).order('created_at', { ascending: false }),
    supabase.from('available_ingredients').select('ingredient_id').eq('space_id', spaceId),
  ])

  if (!spaceRes.data) {
    clearSpaceCookie()
    return null
  }

  return {
    spaceId: spaceRes.data.id,
    inviteToken: spaceRes.data.invite_token,
    settings: { ...DEFAULT_SETTINGS, ...(spaceRes.data.settings ?? {}) } as AppSettings,
    journal: (journalRes.data ?? []).map((r) => ({ ...(r.data as JournalEntry), id: r.id })),
    ratings: (ratingsRes.data ?? []).map((r) => ({ ...(r.data as RollRating), id: r.id })),
    shopping: (shoppingRes.data ?? []).map((r) => ({ ...(r.data as ShoppingItem), id: r.id })),
    completedChallenges: (challengesRes.data ?? []).map((r) => ({
      challengeId: r.challenge_id,
      notes: r.notes ?? undefined,
      completedAt: r.completed_at,
    })),
    savedRolls: (savedRollsRes.data ?? []).map((r) => ({ ...(r.data as GeneratedRoll), id: r.id })),
    availableIngredients: (ingredientsRes.data ?? []).map((r) => r.ingredient_id),
  }
}

export async function updateSettingsAction(patch: Partial<AppSettings>) {
  const spaceId = requireSpaceId()
  const supabase = getSupabaseAdmin()

  const { data: current } = await supabase
    .from('spaces')
    .select('settings')
    .eq('id', spaceId)
    .single()

  const merged = { ...DEFAULT_SETTINGS, ...(current?.settings ?? {}), ...patch }

  const { error } = await supabase
    .from('spaces')
    .update({ settings: merged })
    .eq('id', spaceId)

  if (error) throw new Error(error.message)
}

export async function resetSpaceData() {
  const spaceId = requireSpaceId()
  const supabase = getSupabaseAdmin()
  await Promise.all([
    supabase.from('journal_entries').delete().eq('space_id', spaceId),
    supabase.from('ratings').delete().eq('space_id', spaceId),
    supabase.from('shopping_items').delete().eq('space_id', spaceId),
    supabase.from('completed_challenges').delete().eq('space_id', spaceId),
    supabase.from('saved_rolls').delete().eq('space_id', spaceId),
    supabase.from('available_ingredients').delete().eq('space_id', spaceId),
  ])
}
