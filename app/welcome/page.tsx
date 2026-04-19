import { redirect } from 'next/navigation'
import { getSpaceIdFromCookie } from '@/lib/session'
import { WelcomeClient } from './WelcomeClient'

export const dynamic = 'force-dynamic'

export default function WelcomePage({
  searchParams,
}: {
  searchParams?: { error?: string }
}) {
  const existingSpaceId = getSpaceIdFromCookie()
  if (existingSpaceId) redirect('/')

  return <WelcomeClient initialError={searchParams?.error} />
}
