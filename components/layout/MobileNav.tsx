'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Shuffle, ShoppingCart, BookOpen, MoreHorizontal, Moon, Sun } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Sidebar } from './Sidebar'

const BOTTOM_NAV = [
  { href: '/', icon: LayoutDashboard, key: 'nav.dashboard' },
  { href: '/roll-generator', icon: Shuffle, key: 'nav.rollGenerator' },
  { href: '/shopping-list', icon: ShoppingCart, key: 'nav.shoppingList' },
  { href: '/journal', icon: BookOpen, key: 'nav.journal' },
]

export function MobileNav() {
  const pathname = usePathname()
  const { t } = useI18n()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <nav className="fixed bottom-0 inset-x-0 z-40 flex h-16 items-stretch bg-card border-t border-border shadow-lg lg:hidden">
        {BOTTOM_NAV.map(({ href, icon: Icon, key }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon size={20} />
              <span className="text-[10px]">{t(key)}</span>
            </Link>
          )
        })}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <MoreHorizontal size={20} />
          <span className="text-[10px]">{t('common.more')}</span>
        </button>
      </nav>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="absolute inset-y-0 start-0 w-72 shadow-xl animate-slide-in">
            <Sidebar onClose={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}

export function MobileHeader() {
  const { t } = useI18n()
  const { settings, updateSettings } = useStore()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const pathname = usePathname()
  const isDark = settings.theme === 'dark'

  const routeTitles: Record<string, string> = {
    '/': 'nav.dashboard',
    '/roll-generator': 'nav.rollGenerator',
    '/shopping-list': 'nav.shoppingList',
    '/calculator': 'nav.calculator',
    '/ratings': 'nav.ratings',
    '/challenges': 'nav.challenges',
    '/journal': 'nav.journal',
    '/settings': 'nav.settings',
  }

  const titleKey = routeTitles[pathname] ?? 'app.name'

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between px-4 bg-card/90 backdrop-blur-md border-b border-border lg:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 rounded-xl hover:bg-muted transition-colors"
          aria-label="Menu"
        >
          <span className="block w-5 h-0.5 bg-foreground mb-1 rounded" />
          <span className="block w-4 h-0.5 bg-foreground mb-1 rounded" />
          <span className="block w-5 h-0.5 bg-foreground rounded" />
        </button>

        <div className="flex items-center gap-2 font-semibold text-base">
          <span>🍣</span>
          <span>{t(titleKey)}</span>
        </div>

        <button
          onClick={() => updateSettings({ theme: isDark ? 'light' : 'dark' })}
          className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="absolute inset-y-0 start-0 w-72 shadow-xl">
            <Sidebar onClose={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
