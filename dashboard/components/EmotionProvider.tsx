'use client'

import type { PropsWithChildren } from 'react'
import { MantineProvider } from '@mantine/core'
import { useGluedEmotionCache } from '@/lib/emotionNextjsGlue'

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
      {children}
    </MantineProvider>
  )
}

export default EmotionProvider
