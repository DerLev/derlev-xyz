'use client'

import useLoginStatus from '@/lib/useLoginStatus'
import { Navbar as MantineNavbar, NavLink, ScrollArea } from '@mantine/core'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HiOutlineArrowLeftOnRectangle,
  HiOutlineChevronRight,
  HiOutlineHomeModern,
  HiOutlineKey,
  HiOutlineUser,
} from 'react-icons/hi2'

interface NavbarProps {
  mobileNavOpen: boolean
}

const Navbar = ({ mobileNavOpen }: NavbarProps) => {
  const pathname = usePathname()
  const { signedIn } = useLoginStatus()

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
        <NavLink
          label="Home"
          active={pathname === '/'}
          icon={<HiOutlineHomeModern />}
          component={Link}
          href="/"
        />
        {signedIn ? (
          <>
            <NavLink
              label="Account"
              active={pathname.startsWith('/auth/user')}
              defaultOpened={pathname.startsWith('/auth/user')}
              icon={<HiOutlineUser />}
              variant="subtle"
              rightSection={<HiOutlineChevronRight />}
            >
              <NavLink
                label="Passkeys"
                icon={<HiOutlineKey />}
                active={pathname === '/auth/user/passkeys'}
                component={Link}
                href="/auth/user/passkeys"
              />
            </NavLink>
          </>
        ) : (
          <NavLink
            label="Login"
            active={pathname === '/auth/login'}
            component={Link}
            href="/auth/login"
            icon={<HiOutlineArrowLeftOnRectangle />}
          />
        )}
      </MantineNavbar.Section>
    </MantineNavbar>
  )
}

export default Navbar
