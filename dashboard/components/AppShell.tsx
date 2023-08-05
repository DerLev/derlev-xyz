'use client'

import { AppShell as MantineAppShell } from '@mantine/core'
import { useEffect, type PropsWithChildren, useState } from 'react'
import Header from './AppShellComponents/Header'
import Navbar from './AppShellComponents/Navbar'
import { usePathname, useSearchParams } from 'next/navigation'

const AppShell = ({ children }: PropsWithChildren) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [currentLocation, setCurrentLocation] = useState('')

  useEffect(() => {
    const location = pathname + JSON.stringify(searchParams?.toString()) || ''
    if (location !== currentLocation) {
      setCurrentLocation(location)
      setMobileNavOpen(false)
    }
  }, [pathname, searchParams, setMobileNavOpen, currentLocation])

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
      header={
        <Header
          mobileNavOpen={mobileNavOpen}
          toggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)}
        />
      }
      navbar={<Navbar mobileNavOpen={mobileNavOpen} />}
    >
      {children}
    </MantineAppShell>
  )
}

export default AppShell
