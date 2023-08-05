'use client'

import GoogleSvg from '@/assets/GoogleSvg'
import { signInWithOAuth, signInWithPasskey } from '@/lib/authFlows'
import useLoginStatus from '@/lib/useLoginStatus'
import {
  Alert,
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
import useFidoSupport from '@/lib/useFidoSupport'
import { HiOutlineInformationCircle } from 'react-icons/hi2'
import { useState } from 'react'

const Login = () => {
  const { status } = useLoginStatus({ behavior: 'notUser' })
  const auth = useAuth()
  const googleProvider = new GoogleAuthProvider()
  const { fido } = useFidoSupport()
  const [loading, setLoading] = useState<null | string>(null)

  const googleSignIn = async () => {
    setLoading('google')
    await signInWithOAuth(auth, googleProvider).catch(() => setLoading(null))
    setLoading(null)
  }

  const fidoSignIn = async () => {
    setLoading('fido')
    await signInWithPasskey(auth).catch(() => setLoading('null'))
    setLoading(null)
  }

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
              leftIcon={<GoogleSvg colorless={Boolean(loading)} />}
              onClick={() => googleSignIn()}
              fullWidth
              loading={loading === 'google'}
              disabled={Boolean(loading) && loading !== 'google'}
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
              onClick={() => fidoSignIn()}
              fullWidth
              loading={loading === 'fido'}
              disabled={(Boolean(loading) && loading !== 'fido') || !fido}
            >
              Signin with Passkey
            </Button>
          </Skeleton>
        </Group>
        {!fido && status === 'success' && (
          <Alert mt="md" color="gray" icon={<HiOutlineInformationCircle />}>
            <Text>Your browser does not support passkeys!</Text>
          </Alert>
        )}
      </Paper>
    </Container>
  )
}

export default Login
