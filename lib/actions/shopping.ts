'use server'

import { getSupabaseAdmin } from '@/lib/supabase/server'
import { requireSpaceId } from '@/lib/session'
import type { ShoppingItem } from '@/types'

export async function addShoppingItemAction(
  item: Omit<ShoppingItem, 'id'>
): Promise<ShoppingItem> {
  const spaceId = requireSpaceId()
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('shopping_items')
    .insert({ space_id: spaceId, data: item })
    .select('id')
    .single()
  if (error || !data) throw new Error(error?.message ?? 'insert failed')
  return { ...item, id: data.id }
}

export async function toggleShoppingItemAction(id: string) {
  const spaceId = requireSpaceId()
  const supabase = getSupabaseAdmin()
  const { data: current } = await supabase
    .from('shopping_items')
    .select('data')
    .eq('id', id)
    .eq('space_id', spaceId)
    .single()
  if (!current) throw new Error('item not found')
  const item = current.data as ShoppingItem
  const merged = { ...item, checked: !item.checked }
  const { error } = await supabase
    .from('shopping_items')
    .update({ data: merged })
    .eq('id', id)
    .eq('space_id', spaceId)
  if (error) throw new Error(error.message)
}

export async function removeShoppingItemAction(id: string) {
  const spaceId = requireSpaceId()
  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from('shopping_items')
    .delete()
    .eq('id', id)
    .eq('space_id', spaceId)
  if (error) throw new Error(error.message)
}

export async function clearCheckedShoppingAction() {
  const spaceId = requireSpaceId()
  const supabase = getSupabaseAdmin()
  const { data } = await supabase
    .from('shopping_items')
    .select('id, data')
    .eq('space_id', spaceId)
  const toDelete = (data ?? [])
    .filter((r) => (r.data as ShoppingItem)?.checked)
    .map((r) => r.id)
  if (toDelete.length) {
    await supabase
      .from('shopping_items')
      .delete()
      .in('id', toDelete)
      .eq('space_id', spaceId)
  }
}

export async function replaceShoppingListAction(items: Omit<ShoppingItem, 'id'>[]) {
  const spaceId = requireSpaceId()
  const supabase = getSupabaseAdmin()
  await supabase.from('shopping_items').delete().eq('space_id', spaceId)
  if (items.length === 0) return [] as ShoppingItem[]
  const rows = items.map((item) => ({ space_id: spaceId, data: item }))
  const { data, error } = await supabase
    .from('shopping_items')
    .insert(rows)
    .select('id, data, created_at')
    .order('created_at', { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []).map((r) => ({ ...(r.data as ShoppingItem), id: r.id }))
}
