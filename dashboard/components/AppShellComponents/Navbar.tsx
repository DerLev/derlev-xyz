'use client'

import { Navbar as MantineNavbar, ScrollArea } from '@mantine/core'

interface NavbarProps {
  mobileNavOpen: boolean
}

const Navbar = ({ mobileNavOpen }: NavbarProps) => {
  return (
    <MantineNavbar
      width={{ sm: 300 }}
      p="xs"
      display={{ base: mobileNavOpen ? 'block' : 'none', sm: 'block' }}
    >
      <MantineNavbar.Section
        grow
        component={ScrollArea}
        scrollbarSize={6}
        h="100%"
      >
        {/* Content */}
      </MantineNavbar.Section>
    </MantineNavbar>
  )
}

export default Navbar
