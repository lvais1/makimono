'use client'

// components/layout/Sidebar.tsx — Obsidian redesign
// Keeps all existing i18n / store / routing logic.
// Visual changes: dark sidebar, gradient active state, floating logo, glow.

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Shuffle, Bookmark, ShoppingCart, Calculator,
  Star, Zap, BookOpen, Settings,
} from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { useStore } from '@/lib/store'
import { LanguageSwitcher } from './LanguageSwitcher'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/',               icon: LayoutDashboard, key: 'nav.dashboard' },
  { href: '/roll-generator', icon: Shuffle,          key: 'nav.rollGenerator' },
  { href: '/saved-rolls',    icon: Bookmark,         key: 'nav.savedRolls' },
  { href: '/shopping-list',  icon: ShoppingCart,     key: 'nav.shoppingList' },
  { href: '/calculator',     icon: Calculator,       key: 'nav.calculator' },
  { href: '/ratings',        icon: Star,             key: 'nav.ratings' },
  { href: '/challenges',     icon: Zap,              key: 'nav.challenges' },
  { href: '/journal',        icon: BookOpen,         key: 'nav.journal' },
  { href: '/settings',       icon: Settings,         key: 'nav.settings' },
]

function SidebarFooterStats() {
  const journal = useStore((s) => s.journal)
  const totalRolls = journal.reduce((sum, e) => sum + e.rollsMade.filter(Boolean).length, 0)
  if (!journal.length) return null
  return (
    <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.22)', lineHeight: 1.8 }}>
      {journal.length} evenings · {totalRolls} rolls
    </div>
  )
}

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const { t } = useI18n()
  const { settings } = useStore()

  return (
    <div
      className="flex h-full flex-col"
      style={{
        background: 'hsl(var(--sidebar-bg))',
        color: 'hsl(var(--sidebar-fg))',
      }}
    >
      {/* ── Logo ── */}
      <div
        className="flex items-center gap-3 px-5 py-5 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        {/* Sushi icon with gradient bg + float animation */}
        <div
          className="float shrink-0 flex items-center justify-center text-xl rounded-[10px]"
          style={{
            width: 38, height: 38,
            background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(50 58% 70%))',
            boxShadow: '0 4px 16px rgba(204,88,62,0.35)',
          }}
        >
          🍣
        </div>

        <div className="min-w-0">
          <div
            className="font-bold leading-tight truncate text-white"
            style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 19 }}
          >
            {t('app.name')}
          </div>
          <div className="text-xs mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {settings.user1Name} &amp; {settings.user2Name}
          </div>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-0.5">
        {NAV_ITEMS.map(({ href, icon: Icon, key }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn('sidebar-link', isActive && 'sidebar-link-active')}
            >
              <Icon
                size={16}
                className={cn('shrink-0', isActive ? 'opacity-100' : 'opacity-60')}
              />
              <span>{t(key)}</span>
              {isActive && (
                <span
                  className="ms-auto shrink-0 rounded-full"
                  style={{ width: 5, height: 5, background: 'rgba(255,255,255,0.8)' }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* ── Footer: language + session stats ── */}
      <div
        className="px-4 pt-3 pb-4 shrink-0 space-y-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
      >
        <LanguageSwitcher />
        <SidebarFooterStats />
      </div>
    </div>
  )
}
