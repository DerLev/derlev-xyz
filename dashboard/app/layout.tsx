import EmotionProvider from '@/components/EmotionProvider'
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
        <EmotionProvider>{children}</EmotionProvider>
      </body>
    </html>
  )
}
