'use client'

import { ReactNode, useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { MobileNav, MobileHeader } from './MobileNav'
import { useStore } from '@/lib/store'
import { useI18n } from '@/lib/i18n/context'

export function AppLayout({ children }: { children: ReactNode }) {
  const language = useStore((s) => s.settings.language)
  const theme = useStore((s) => s.settings.theme)
  const { setLanguage, dir } = useI18n()

  // Sync language from store → i18n context
  useEffect(() => {
    setLanguage(language)
  }, [language, setLanguage])

  // Sync direction
  useEffect(() => {
    document.documentElement.dir = dir
    document.documentElement.lang =
      language === 'he' ? 'he' : language === 'ru' ? 'ru' : 'en'
  }, [dir, language])

  // Apply dark mode class
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-shrink-0 lg:flex-col h-full overflow-hidden">
        <Sidebar />
      </aside>

      {/* Main Area */}
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
