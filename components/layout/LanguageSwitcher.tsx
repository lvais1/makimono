'use client'

import { useI18n } from '@/lib/i18n/context'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import type { Language } from '@/types'

const LANGS: { code: Language; flag: string; label: string }[] = [
  { code: 'he', flag: '🇮🇱', label: 'עב' },
  { code: 'en', flag: '🇺🇸', label: 'EN' },
  { code: 'ru', flag: '🇷🇺', label: 'РУ' },
]

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useI18n()
  const updateSettings = useStore((s) => s.updateSettings)

  const handleChange = (lang: Language) => {
    setLanguage(lang)
    updateSettings({ language: lang })
  }

  return (
    <div className="flex items-center gap-1 rounded-xl bg-white/10 p-1">
      {LANGS.map(({ code, flag, label }) => (
        <button
          key={code}
          onClick={() => handleChange(code)}
          className={cn(
            'flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-all',
            language === code
              ? 'bg-white text-sidebar shadow-sm'
              : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-white/10'
          )}
          aria-label={code}
        >
          <span className="text-base leading-none">{flag}</span>
          {!compact && <span>{label}</span>}
        </button>
      ))}
    </div>
  )
}
