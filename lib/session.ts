import { cookies } from 'next/headers'

const COOKIE_NAME = 'makimono_space_id'
const ONE_YEAR = 60 * 60 * 24 * 365

export function getSpaceIdFromCookie(): string | null {
  const store = cookies()
  return store.get(COOKIE_NAME)?.value ?? null
}

export function setSpaceCookie(spaceId: string) {
  cookies().set(COOKIE_NAME, spaceId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: ONE_YEAR,
    path: '/',
  })
}

export function clearSpaceCookie() {
  cookies().delete(COOKIE_NAME)
}

export function requireSpaceId(): string {
  const id = getSpaceIdFromCookie()
  if (!id) throw new Error('No space linked to this device')
  return id
}
