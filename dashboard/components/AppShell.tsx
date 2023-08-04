'use client'

import { AppShell as MantineAppShell } from '@mantine/core'
import type { PropsWithChildren } from 'react'
import Header from './AppShellComponents/Header'
import Navbar from './AppShellComponents/Navbar'

const AppShell = ({ children }: PropsWithChildren) => {
  return (
    <MantineAppShell
      padding="md"
      styles={(theme) => ({
        main: {
          backgroundColor: theme.colors.dark[8],
          position: 'relative',
          display: 'grid',
        },
      })}
      header={<Header />}
      navbar={<Navbar />}
    >
      {children}
    </MantineAppShell>
  )
}

export default AppShell
