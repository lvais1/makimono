import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { AppLayout } from '@/components/layout/AppLayout'
import { SpaceGate } from '@/components/layout/SpaceGate'
import { loadSpaceBootstrap } from '@/lib/actions/space'

export const metadata: Metadata = {
  title: 'Makimono | מאקימונו',
  description: 'Your perfect sushi night companion',
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍣</text></svg>" },
}

export const dynamic = 'force-dynamic'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const bootstrap = await loadSpaceBootstrap()

  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>
        <Providers>
          <SpaceGate bootstrap={bootstrap}>
            <AppLayout hasSpace={!!bootstrap}>{children}</AppLayout>
          </SpaceGate>
        </Providers>
      </body>
    </html>
  )
}
