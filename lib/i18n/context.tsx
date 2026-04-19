'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { Language } from '@/types'
import enMessages from '@/messages/en.json'
import heMessages from '@/messages/he.json'
import ruMessages from '@/messages/ru.json'

type Messages = typeof enMessages

const messagesMap: Record<Language, Messages> = {
  en: enMessages,
  he: heMessages,
  ru: ruMessages,
}

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const parts = path.split('.')
  let current: unknown = obj
  for (const part of parts) {
    if (current && typeof current === 'object' && part in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[part]
    } else {
      return path
    }
  }
  return typeof current === 'string' ? current : path
}

interface I18nContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, vars?: Record<string, string>) => string
  dir: 'rtl' | 'ltr'
  isRtl: boolean
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({
  children,
  defaultLanguage = 'he',
}: {
  children: ReactNode
  defaultLanguage?: Language
}) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage)

  const dir = language === 'he' ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.lang = language === 'he' ? 'he' : language === 'ru' ? 'ru' : 'en'
    document.documentElement.dir = dir
  }, [language, dir])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
  }

  const t = (key: string, vars?: Record<string, string>): string => {
    const messages = messagesMap[language] as Record<string, unknown>
    let value = getNestedValue(messages, key)
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        value = value.replace(`{${k}}`, v)
      })
    }
    return value
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, dir, isRtl: dir === 'rtl' }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
