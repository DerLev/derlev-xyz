'use client'

import { Navbar as MantineNavbar, ScrollArea } from '@mantine/core'

const Navbar = () => {
  return (
    <MantineNavbar width={{ base: 300 }} p="xs">
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
