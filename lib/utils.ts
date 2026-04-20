import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function formatDate(dateStr: string, locale: string = 'en'): string {
  try {
    const date = new Date(dateStr)
    const localeMap: Record<string, string> = { he: 'he-IL', en: 'en-US', ru: 'ru-RU' }
    return date.toLocaleDateString(localeMap[locale] ?? 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export function average(nums: number[]): number {
  if (nums.length === 0) return 0
  return nums.reduce((a, b) => a + b, 0) / nums.length
}

export function ratingAvg(r: { taste: number; appearance: number; creativity: number }): number {
  return Math.round((average([r.taste, r.appearance, r.creativity]) * 10)) / 10
}

export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0]
}

export function greetingByHour(lang: string): string {
  const hour = new Date().getHours()
  if (lang === 'he') {
    if (hour < 12) return 'בוקר טוב'
    if (hour < 17) return 'צהריים טובים'
    if (hour < 21) return 'ערב טוב'
    return 'לילה טוב'
  }
  if (lang === 'ru') {
    if (hour < 12) return 'Доброе утро'
    if (hour < 17) return 'Добрый день'
    if (hour < 21) return 'Добрый вечер'
    return 'Спокойной ночи'
  }
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  if (hour < 21) return 'Good evening'
  return 'Good night'
}
