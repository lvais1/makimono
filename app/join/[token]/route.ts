import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSupabaseAdmin } from '@/lib/supabase/server'

const COOKIE_NAME = 'makimono_space_id'
const ONE_YEAR = 60 * 60 * 24 * 365

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  const { token } = params
  const base = new URL(request.url).origin

  if (!token || !/^[A-Za-z0-9]{20,64}$/.test(token)) {
    return NextResponse.redirect(`${base}/welcome?error=invalid`)
  }

  const supabase = getSupabaseAdmin()
  const { data } = await supabase
    .from('spaces')
    .select('id')
    .eq('invite_token', token)
    .maybeSingle()

  if (!data) {
    return NextResponse.redirect(`${base}/welcome?error=notfound`)
  }

  cookies().set(COOKIE_NAME, data.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: ONE_YEAR,
    path: '/',
  })

  return NextResponse.redirect(`${base}/`)
}
