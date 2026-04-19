'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import type { SpaceBootstrap } from '@/lib/actions/space'

interface SpaceGateProps {
  bootstrap: SpaceBootstrap | null
  children: ReactNode
}

export function SpaceGate({ bootstrap, children }: SpaceGateProps) {
  const router = useRouter()
  const pathname = usePathname()
  const hydrateFromBootstrap = useStore((s) => s.hydrateFromBootstrap)
  const clearSpace = useStore((s) => s.clearSpace)
  const hydrated = useRef(false)

  useEffect(() => {
    if (hydrated.current) return
    hydrated.current = true
    if (bootstrap) {
      hydrateFromBootstrap(bootstrap)
    } else {
      clearSpace()
      if (!pathname.startsWith('/welcome') && !pathname.startsWith('/join')) {
        router.replace('/welcome')
      }
    }
  }, [bootstrap, hydrateFromBootstrap, clearSpace, pathname, router])

  // Revalidate on window focus for cross-device sync
  useEffect(() => {
    if (!bootstrap) return
    const handler = () => {
      if (document.visibilityState === 'visible') router.refresh()
    }
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [bootstrap, router])

  // Re-hydrate when a new bootstrap arrives from a server refresh
  useEffect(() => {
    if (bootstrap) hydrateFromBootstrap(bootstrap)
  }, [bootstrap, hydrateFromBootstrap])

  return <>{children}</>
}
