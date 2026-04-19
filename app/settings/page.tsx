'use client'

import { useState, useEffect } from 'react'
import { Save, AlertTriangle, Moon, Sun } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { useStore } from '@/lib/store'
import { PageHeader } from '@/components/shared/PageHeader'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { Language, Theme } from '@/types'

const LANGUAGES: { code: Language; flag: string; label: string; nativeName: string }[] = [
  { code: 'he', flag: '🇮🇱', label: 'Hebrew', nativeName: 'עברית' },
  { code: 'en', flag: '🇺🇸', label: 'English', nativeName: 'English' },
  { code: 'ru', flag: '🇷🇺', label: 'Russian', nativeName: 'Русский' },
]

export default function SettingsPage() {
  const { t, language, setLanguage } = useI18n()
  const { settings, updateSettings, resetAllData } = useStore()

  const [user1, setUser1] = useState(settings.user1Name)
  const [user2, setUser2] = useState(settings.user2Name)
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    setUser1(settings.user1Name)
    setUser2(settings.user2Name)
  }, [settings.user1Name, settings.user2Name])

  const handleSave = () => {
    updateSettings({ user1Name: user1.trim() || 'User 1', user2Name: user2.trim() || 'User 2' })
    toast.success(t('settings.saved'))
  }

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    updateSettings({ language: lang })
  }

  const handleThemeChange = (theme: Theme) => {
    updateSettings({ theme })
  }

  const handleReset = () => {
    resetAllData()
    setConfirmReset(false)
    toast.success(t('settings.saved'))
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-xl">
      <PageHeader emoji="⚙️" title={t('settings.title')} />

      {/* User Names */}
      <section className="card p-6 space-y-5">
        <div>
          <h2 className="font-semibold text-foreground">{t('settings.users')}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Used in ratings and comparisons</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">🧑 {t('settings.user1')}</label>
            <input className="input" value={user1} onChange={(e) => setUser1(e.target.value)} maxLength={30} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">🧑‍🤝‍🧑 {t('settings.user2')}</label>
            <input className="input" value={user2} onChange={(e) => setUser2(e.target.value)} maxLength={30} />
          </div>
        </div>
        <button onClick={handleSave} className="btn-primary">
          <Save size={16} /> {t('settings.save')}
        </button>
      </section>

      {/* Language */}
      <section className="card p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-foreground">{t('settings.language')}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Interface language and text direction</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {LANGUAGES.map(({ code, flag, label, nativeName }) => (
            <button
              key={code}
              onClick={() => handleLanguageChange(code)}
              className={cn(
                'rounded-2xl p-4 text-center border-2 transition-all',
                language === code
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30 hover:bg-muted'
              )}
            >
              <div className="text-3xl mb-2">{flag}</div>
              <div className="text-sm font-bold text-foreground">{nativeName}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
              {language === code && (
                <div className="h-1.5 w-1.5 rounded-full bg-primary mx-auto mt-2" />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Theme */}
      <section className="card p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-foreground">{t('settings.themeTitle')}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Choose your preferred appearance</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {([
            { key: 'light' as Theme, icon: Sun, emoji: '☀️', labelKey: 'settings.themeLight' },
            { key: 'dark' as Theme, icon: Moon, emoji: '🌙', labelKey: 'settings.themeDark' },
          ]).map(({ key, icon: Icon, emoji, labelKey }) => (
            <button
              key={key}
              onClick={() => handleThemeChange(key)}
              className={cn(
                'rounded-2xl p-4 text-center border-2 transition-all flex flex-col items-center gap-2',
                settings.theme === key
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30 hover:bg-muted'
              )}
            >
              <span className="text-3xl">{emoji}</span>
              <div className="flex items-center gap-1.5">
                <Icon size={14} className="text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">{t(labelKey)}</span>
              </div>
              {settings.theme === key && (
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Data */}
      <section className="card p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-foreground">{t('settings.data')}</h2>
        </div>
        {!confirmReset ? (
          <button onClick={() => setConfirmReset(true)} className="btn-ghost text-destructive hover:bg-destructive/10 text-sm">
            <AlertTriangle size={16} /> {t('settings.resetData')}
          </button>
        ) : (
          <div className="rounded-2xl bg-destructive/8 border border-destructive/20 p-4 space-y-3">
            <p className="text-sm text-destructive">{t('settings.resetConfirm')}</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmReset(false)} className="btn-secondary text-sm flex-1">{t('common.cancel')}</button>
              <button onClick={handleReset} className="btn-danger text-sm flex-1">{t('common.yes')}</button>
            </div>
          </div>
        )}
      </section>

      {/* About */}
      <section className="card p-6 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍣</span>
          <h2 className="font-semibold text-foreground">{t('settings.about')}</h2>
        </div>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>{t('settings.version')}</p>
          <p>{t('settings.madeWith')}</p>
        </div>
      </section>
    </div>
  )
}
