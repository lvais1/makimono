import { redirect } from 'next/navigation'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { setSpaceCookie } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import { JoinClient } from './JoinClient'

export const dynamic = 'force-dynamic'

export default async function JoinPage({ params }: { params: { token: string } }) {
  const token = params.token

  if (!token || !/^[A-Za-z0-9]{20,64}$/.test(token)) {
    redirect('/welcome?error=invalid')
  }

  const supabase = getSupabaseAdmin()
  const { data } = await supabase
    .from('spaces')
    .select('id')
    .eq('invite_token', token)
    .maybeSingle()

  if (!data) {
    redirect('/welcome?error=notfound')
  }

  setSpaceCookie(data.id)
  revalidatePath('/', 'layout')

  return <JoinClient />
}
