'use client'

import GoogleSvg from '@/assets/GoogleSvg'
import { signInWithOAuth, signInWithPasskey } from '@/lib/authFlows'
import useLoginStatus from '@/lib/useLoginStatus'
import {
  Button,
  Container,
  Divider,
  Group,
  Paper,
  Skeleton,
  Text,
} from '@mantine/core'
import { GoogleAuthProvider } from 'firebase/auth'
import { useAuth } from 'reactfire'
import { GoPasskeyFill } from 'react-icons/go'

const Login = () => {
  const { status } = useLoginStatus({ behavior: 'notUser' })
  const auth = useAuth()
  const googleProvider = new GoogleAuthProvider()

  return (
    <Container maw={420} w="100%">
      <Paper radius="md" p="xl" withBorder>
        <Text size="lg" weight={500}>
          Welcome to derlev.xyz, login with
        </Text>
        <Group grow mt="md" mb="lg" noWrap>
          <Skeleton visible={status !== 'success'} w="100%" radius="xl">
            <Button
              radius="xl"
              variant="default"
              leftIcon={<GoogleSvg />}
              onClick={() => signInWithOAuth(auth, googleProvider)}
              fullWidth
            >
              Google
            </Button>
          </Skeleton>
        </Group>
        <Divider label="OR" labelPosition="center" />
        <Group grow mt="lg" noWrap>
          <Skeleton visible={status !== 'success'} w="100%" radius="xl">
            <Button
              radius="xl"
              variant="default"
              leftIcon={<GoPasskeyFill />}
              onClick={() => signInWithPasskey(auth)}
              fullWidth
            >
              Signin with Passkey
            </Button>
          </Skeleton>
        </Group>
      </Paper>
    </Container>
  )
}

export default Login
