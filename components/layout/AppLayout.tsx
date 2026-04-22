'use client'

// components/layout/AppLayout.tsx — Obsidian redesign
// Adds <BgBlobs /> behind all content so the animated gradient orbs appear
// across every page. Everything else mirrors the original logic.

import { ReactNode, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from './Sidebar'
import { MobileNav, MobileHeader } from './MobileNav'
import { BgBlobs } from '@/components/shared/BgBlobs'
import { useStore } from '@/lib/store'
import { useI18n } from '@/lib/i18n/context'

export function AppLayout({
  children,
  hasSpace,
}: {
  children: ReactNode
  hasSpace: boolean
}) {
  const pathname = usePathname()
  const language = useStore((s) => s.settings.language)
  const theme = useStore((s) => s.settings.theme)
  const { setLanguage, dir } = useI18n()

  const isStandalone =
    pathname?.startsWith('/welcome') ||
    pathname?.startsWith('/join') ||
    !hasSpace

  useEffect(() => { setLanguage(language) }, [language, setLanguage])

  useEffect(() => {
    document.documentElement.dir = dir
    document.documentElement.lang =
      language === 'he' ? 'he' : language === 'ru' ? 'ru' : 'en'
  }, [dir, language])

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  if (isStandalone) {
    return (
      <div className="relative min-h-screen bg-background overflow-hidden">
        <BgBlobs />
        <main className="relative z-10 mx-auto max-w-xl px-4 py-10">{children}</main>
      </div>
    )
  }

  return (
    <div className="relative flex h-screen overflow-hidden bg-background">
      {/* Animated background — renders behind everything */}
      <BgBlobs />

      {/* Sidebar */}
      <aside className="relative z-10 hidden lg:flex lg:w-56 lg:shrink-0 lg:flex-col h-full overflow-hidden"
        style={{ borderRight: '1px solid rgba(255,255,255,0.07)' }}
      >
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="relative z-10 flex flex-1 flex-col min-w-0 overflow-hidden">
        <MobileHeader />
        <main className="flex-1 overflow-y-auto pb-24 lg:pb-0">
          {/* key on pathname triggers page-enter animation on each navigation */}
          <div
            key={pathname}
            className="page-enter mx-auto max-w-4xl px-4 py-6 lg:px-10 lg:py-10"
          >
            {children}
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  )
}
