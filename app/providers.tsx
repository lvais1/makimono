'use client'

import { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { I18nProvider } from '@/lib/i18n/context'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider defaultLanguage="he">
      {children}
      <Toaster
        position="top-center"
        richColors
        closeButton
        toastOptions={{
          style: {
            borderRadius: '12px',
            fontFamily: 'inherit',
          },
        }}
      />
    </I18nProvider>
  )
}
