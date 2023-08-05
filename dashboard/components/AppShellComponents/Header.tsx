'use client'

import useLoginStatus from '@/lib/useLoginStatus'
import {
  Anchor,
  Burger,
  Button,
  Group,
  Header as MantineHeader,
  Title,
} from '@mantine/core'
import Link from 'next/link'
import {
  HiOutlineArrowLeftOnRectangle,
  HiOutlineArrowRightOnRectangle,
} from 'react-icons/hi2'

interface HeaderProps {
  mobileNavOpen: boolean
  toggleMobileNav: () => void
}

const Header = ({ mobileNavOpen, toggleMobileNav }: HeaderProps) => {
  const { signedIn } = useLoginStatus()

  return (
    <MantineHeader height={60} px="md">
      <Group position="apart" h="100%">
        <Group spacing="xs">
          <Burger
            opened={mobileNavOpen}
            onClick={() => toggleMobileNav()}
            size="sm"
            display={{ base: 'block', sm: 'none' }}
          />
          <Anchor component={Link} href="/" color="dark.0">
            <Title size="h2">derlev.xyz</Title>
          </Anchor>
        </Group>
        <Group position="right">
          {signedIn === true ? (
            <Button
              component={Link}
              href="/auth/logout"
              variant="light"
              leftIcon={<HiOutlineArrowRightOnRectangle />}
            >
              Logout
            </Button>
          ) : (
            <Button
              component={Link}
              href="/auth/login"
              variant="light"
              leftIcon={<HiOutlineArrowLeftOnRectangle />}
            >
              Login
            </Button>
          )}
        </Group>
      </Group>
    </MantineHeader>
  )
}

export default Header
