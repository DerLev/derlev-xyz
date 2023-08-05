'use client'

import type { PropsWithChildren } from 'react'
import { MantineProvider } from '@mantine/core'
import { useGluedEmotionCache } from '@/lib/emotionNextjsGlue'
import { ModalsProvider } from '@mantine/modals'
import { EditPasskey } from './Modals/index'
import NotificationsProvider from './NotificationsProvider'

const modals = {
  editPasskey: EditPasskey,
}

declare module '@mantine/modals' {
  export interface MantineModalsOverride {
    modals: typeof modals
  }
}

const EmotionProvider = ({ children }: PropsWithChildren) => {
  const cache = useGluedEmotionCache()

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      emotionCache={cache}
      theme={{
        colorScheme: 'dark',
      }}
    >
      <NotificationsProvider />
      <ModalsProvider modals={modals}>{children}</ModalsProvider>
    </MantineProvider>
  )
}

export default EmotionProvider
