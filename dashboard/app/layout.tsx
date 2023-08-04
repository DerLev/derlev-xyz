import AppShell from '@/components/AppShell'
import EmotionProvider from '@/components/EmotionProvider'
import FirebaseProvider from '@/components/FirebaseProvider'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard - derlev.xyz',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <FirebaseProvider>
          <EmotionProvider>
            <AppShell>{children}</AppShell>
          </EmotionProvider>
        </FirebaseProvider>
      </body>
    </html>
  )
}
