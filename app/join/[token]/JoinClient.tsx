'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function JoinClient() {
  const { t } = useI18n()
  const router = useRouter()

  useEffect(() => {
    const id = setTimeout(() => {
      router.replace('/')
      router.refresh()
    }, 500)
    return () => clearTimeout(id)
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center animate-fade-in">
      <div className="text-5xl">💞</div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="animate-spin" size={18} />
        <span>{t('join.connecting')}</span>
      </div>
    </div>
  )
}
