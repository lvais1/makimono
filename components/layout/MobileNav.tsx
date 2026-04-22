'use client'

// components/layout/MobileNav.tsx — Obsidian redesign
// Bottom tab bar + slide-down hamburger sheet. Matches the dark glass aesthetic.

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Shuffle, Bookmark, ShoppingCart, Calculator,
  Star, Zap, BookOpen, Settings, Menu, X,
} from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { cn } from '@/lib/utils'
import { Sidebar } from './Sidebar'

const BOTTOM_NAV = [
  { href: '/',               icon: LayoutDashboard, key: 'nav.dashboard' },
  { href: '/roll-generator', icon: Shuffle,          key: 'nav.rollGenerator' },
  { href: '/saved-rolls',    icon: Bookmark,         key: 'nav.savedRolls' },
  { href: '/ratings',        icon: Star,             key: 'nav.ratings' },
  { href: '/journal',        icon: BookOpen,         key: 'nav.journal' },
]

export function MobileHeader() {
  const [open, setOpen] = useState(false)
  const { t } = useI18n()

  return (
    <>
      {/* Top bar */}
      <header
        className="flex lg:hidden items-center justify-between px-4 py-3 shrink-0"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div
          className="flex items-center gap-2.5"
          style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
        >
          <span className="text-xl float">🍣</span>
          <span className="text-lg font-bold text-white">{t('app.name')}</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-xl text-muted-foreground"
          style={{ background: 'rgba(255,255,255,0.07)' }}
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Slide-in drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          {/* Panel */}
          <div
            className="absolute start-0 top-0 bottom-0 w-64 z-10"
            style={{ background: 'hsl(var(--sidebar-bg))' }}
          >
            <div className="flex justify-end p-4">
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-xl text-muted-foreground"
                style={{ background: 'rgba(255,255,255,0.07)' }}
              >
                <X size={18} />
              </button>
            </div>
            <div className="h-[calc(100%-60px)]">
              <Sidebar onClose={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export function MobileNav() {
  const pathname = usePathname()
  const { t } = useI18n()

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 flex lg:hidden items-center justify-around px-2 pb-safe"
      style={{
        background: 'rgba(10,9,18,0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingTop: 8, paddingBottom: 'max(env(safe-area-inset-bottom), 12px)',
      }}
    >
      {BOTTOM_NAV.map(({ href, icon: Icon, key }) => {
        const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all',
              isActive ? 'text-white' : 'text-muted-foreground'
            )}
            style={{
              background: isActive
                ? 'linear-gradient(135deg, hsl(var(--primary)), hsl(20 60% 44%))'
                : 'transparent',
              boxShadow: isActive ? '0 4px 14px rgba(204,88,62,0.35)' : 'none',
            }}
          >
            <Icon size={18} />
            <span className="text-[10px] font-medium leading-none">{t(key)}</span>
          </Link>
        )
      })}
    </nav>
  )
}
