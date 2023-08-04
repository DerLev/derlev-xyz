'use client'

import { Anchor, Group, Header as MantineHeader, Title } from '@mantine/core'
import Link from 'next/link'

const Header = () => {
  return (
    <MantineHeader height={60} px="md">
      <Group position="apart" h="100%">
        <Anchor component={Link} href="/" color="dark.0">
          <Title>derlev.xyz</Title>
        </Anchor>
        <Group position="right">{/* Content */}</Group>
      </Group>
    </MantineHeader>
  )
}

export default Header
