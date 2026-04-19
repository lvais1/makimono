'use client'

import { ReactNode, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from './Sidebar'
import { MobileNav, MobileHeader } from './MobileNav'
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
    pathname?.startsWith('/welcome') || pathname?.startsWith('/join') || !hasSpace

  useEffect(() => {
    setLanguage(language)
  }, [language, setLanguage])

  useEffect(() => {
    document.documentElement.dir = dir
    document.documentElement.lang =
      language === 'he' ? 'he' : language === 'ru' ? 'ru' : 'en'
  }, [dir, language])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  if (isStandalone) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-xl px-4 py-10">{children}</main>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="hidden lg:flex lg:w-64 lg:flex-shrink-0 lg:flex-col h-full overflow-hidden">
        <Sidebar />
      </aside>

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <MobileHeader />
        <main className="flex-1 overflow-y-auto pb-24 lg:pb-0">
          <div className="mx-auto max-w-4xl px-4 py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  )
}
