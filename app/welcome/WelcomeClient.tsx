'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Heart, Link2, Plus, Loader2 } from 'lucide-react'
import { createSpace, joinSpaceByToken } from '@/lib/actions/space'
import { useI18n } from '@/lib/i18n/context'

const TOKEN_REGEX = /[A-Za-z0-9]{20,64}/

function extractToken(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null
  const match = trimmed.match(TOKEN_REGEX)
  return match?.[0] ?? null
}

export function WelcomeClient({ initialError }: { initialError?: string }) {
  const { t } = useI18n()
  const router = useRouter()
  const [mode, setMode] = useState<'choose' | 'join'>('choose')
  const [joinInput, setJoinInput] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>(initialError)

  const handleCreate = () => {
    setError(undefined)
    startTransition(async () => {
      try {
        await createSpace()
        toast.success(t('welcome.spaceCreated'))
        router.push('/')
        router.refresh()
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'error'
        setError(msg)
        toast.error(msg)
      }
    })
  }

  const handleJoin = () => {
    setError(undefined)
    const token = extractToken(joinInput)
    if (!token) {
      setError(t('welcome.invalidLink'))
      return
    }
    startTransition(async () => {
      try {
        const res = await joinSpaceByToken(token)
        if (!res) {
          setError(t('welcome.linkNotFound'))
          return
        }
        toast.success(t('welcome.joinedSpace'))
        router.push('/')
        router.refresh()
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'error'
        setError(msg)
        toast.error(msg)
      }
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="text-6xl">🍣</div>
        <h1 className="text-3xl font-bold">{t('welcome.title')}</h1>
        <p className="text-muted-foreground text-sm">{t('welcome.subtitle')}</p>
      </div>

      {mode === 'choose' && (
        <div className="space-y-3">
          <button
            onClick={handleCreate}
            disabled={isPending}
            className="card w-full p-5 text-start flex items-center gap-4 hover:shadow-card-hover transition-all disabled:opacity-60"
          >
            <div className="text-2xl">
              {isPending ? <Loader2 className="animate-spin" /> : <Plus />}
            </div>
            <div className="flex-1">
              <div className="font-semibold">{t('welcome.createTitle')}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {t('welcome.createDesc')}
              </div>
            </div>
          </button>

          <button
            onClick={() => setMode('join')}
            disabled={isPending}
            className="card w-full p-5 text-start flex items-center gap-4 hover:shadow-card-hover transition-all disabled:opacity-60"
          >
            <div className="text-2xl">
              <Link2 />
            </div>
            <div className="flex-1">
              <div className="font-semibold">{t('welcome.joinTitle')}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {t('welcome.joinDesc')}
              </div>
            </div>
          </button>
        </div>
      )}

      {mode === 'join' && (
        <div className="space-y-4">
          <div className="card p-5 space-y-3">
            <label className="block">
              <span className="text-sm font-medium">{t('welcome.pasteLink')}</span>
              <input
                type="text"
                value={joinInput}
                onChange={(e) => setJoinInput(e.target.value)}
                placeholder="https://.../join/..."
                autoFocus
                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                dir="ltr"
              />
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleJoin}
                disabled={isPending || !joinInput.trim()}
                className="btn-primary text-sm flex-1 justify-center disabled:opacity-60"
              >
                {isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Heart size={14} />
                )}
                {t('welcome.join')}
              </button>
              <button
                onClick={() => {
                  setMode('choose')
                  setJoinInput('')
                  setError(undefined)
                }}
                disabled={isPending}
                className="btn-secondary text-sm"
              >
                {t('welcome.back')}
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="card p-3 border-red-300 bg-red-50 text-red-700 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  )
}
