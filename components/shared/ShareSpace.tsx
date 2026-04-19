'use client'

import { useState, useTransition } from 'react'
import { Copy, Check, LogOut, Link2 } from 'lucide-react'
import { toast } from 'sonner'
import { useStore } from '@/lib/store'
import { useI18n } from '@/lib/i18n/context'
import { leaveSpace } from '@/lib/actions/space'

export function ShareSpace() {
  const { t } = useI18n()
  const inviteToken = useStore((s) => s.inviteToken)
  const clearSpace = useStore((s) => s.clearSpace)
  const [copied, setCopied] = useState<'link' | 'token' | null>(null)
  const [confirmLeave, setConfirmLeave] = useState(false)
  const [isPending, startTransition] = useTransition()

  if (!inviteToken) return null

  const baseUrl =
    typeof window !== 'undefined' ? window.location.origin : ''
  const inviteUrl = `${baseUrl}/join/${inviteToken}`

  const copy = async (value: string, kind: 'link' | 'token') => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(kind)
      toast.success(t('share.copied'))
      setTimeout(() => setCopied(null), 2000)
    } catch {
      toast.error('Copy failed')
    }
  }

  const handleLeave = () => {
    startTransition(async () => {
      clearSpace()
      await leaveSpace()
    })
  }

  return (
    <section className="card p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Link2 size={18} className="text-primary" />
        <h2 className="font-semibold text-foreground">{t('share.title')}</h2>
      </div>
      <p className="text-xs text-muted-foreground">{t('share.desc')}</p>

      <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs break-all font-mono" dir="ltr">
        {inviteUrl}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => copy(inviteUrl, 'link')}
          className="btn-primary text-sm"
        >
          {copied === 'link' ? <Check size={14} /> : <Copy size={14} />}
          {t('share.copyLink')}
        </button>
        <button
          onClick={() => copy(inviteToken, 'token')}
          className="btn-secondary text-sm"
        >
          {copied === 'token' ? <Check size={14} /> : <Copy size={14} />}
          {t('share.copyToken')}
        </button>
      </div>

      <div className="pt-3 border-t border-border">
        {!confirmLeave ? (
          <button
            onClick={() => setConfirmLeave(true)}
            className="btn-ghost text-destructive hover:bg-destructive/10 text-sm"
          >
            <LogOut size={14} /> {t('share.leaveSpace')}
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-destructive">{t('share.leaveConfirm')}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmLeave(false)}
                className="btn-secondary text-sm flex-1"
                disabled={isPending}
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleLeave}
                className="btn-danger text-sm flex-1"
                disabled={isPending}
              >
                {t('common.yes')}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
