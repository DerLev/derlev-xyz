'use client'

import { useMantineTheme } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { useMediaQuery } from '@mantine/hooks'

const NotificationsProvider = () => {
  const theme = useMantineTheme()
  const mediaQuery = useMediaQuery(`(min-width: ${theme.breakpoints.sm})`)

  return (
    <Notifications
      position={mediaQuery ? 'top-center' : 'bottom-center'}
      limit={3}
      autoClose={3000}
    />
  )
}

export default NotificationsProvider
