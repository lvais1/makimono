'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Shuffle, ShoppingCart, Calculator,
  Star, Zap, BookOpen, Settings, Moon, Sun,
} from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { useStore } from '@/lib/store'
import { LanguageSwitcher } from './LanguageSwitcher'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/', icon: LayoutDashboard, key: 'nav.dashboard' },
  { href: '/roll-generator', icon: Shuffle, key: 'nav.rollGenerator' },
  { href: '/shopping-list', icon: ShoppingCart, key: 'nav.shoppingList' },
  { href: '/calculator', icon: Calculator, key: 'nav.calculator' },
  { href: '/ratings', icon: Star, key: 'nav.ratings' },
  { href: '/challenges', icon: Zap, key: 'nav.challenges' },
  { href: '/journal', icon: BookOpen, key: 'nav.journal' },
  { href: '/settings', icon: Settings, key: 'nav.settings' },
]

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const { t } = useI18n()
  const { settings, updateSettings } = useStore()
  const isDark = settings.theme === 'dark'

  const toggleTheme = () => {
    updateSettings({ theme: isDark ? 'light' : 'dark' })
  }

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo + theme toggle */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border/50">
        <span className="text-3xl">🍣</span>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-lg text-white leading-tight truncate">{t('app.name')}</div>
          <div className="text-xs text-sidebar-foreground/50 truncate">{t('app.tagline')}</div>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-white/10 transition-colors shrink-0 text-sidebar-foreground/70 hover:text-white"
          title={isDark ? t('settings.themeLight') : t('settings.themeDark')}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ href, icon: Icon, key }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn('sidebar-link', isActive && 'sidebar-link-active')}
            >
              <Icon size={18} className={isActive ? 'text-primary' : 'opacity-60'} />
              <span>{t(key)}</span>
              {isActive && <span className="ms-auto h-1.5 w-1.5 rounded-full bg-primary" />}
            </Link>
          )
        })}
      </nav>

      {/* Language switcher */}
      <div className="px-4 py-4 border-t border-sidebar-border/50">
        <LanguageSwitcher />
      </div>
    </div>
  )
}
