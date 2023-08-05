'use client'

import useLoginStatus from '@/lib/useLoginStatus'
import { Button, Container, Paper, Stack, Title } from '@mantine/core'
import { useState } from 'react'
import { startRegistration } from '@simplewebauthn/browser'
import { GoPasskeyFill } from 'react-icons/go'

const User = () => {
  const { user } = useLoginStatus({ behavior: 'onlyUser' })
  const [loading, setLoading] = useState(false)

  const registerFidoCredential = async () => {
    if (!user) return

    setLoading(true)

    const token = await user.getIdToken()

    const res = await fetch(
      'https://europe-west1-derlev-xyz.cloudfunctions.net/registerRequest',
      { method: 'POST', headers: { Authorization: `Bearer ${token}` } },
    ).then((res) => res.json())

    const registration = await startRegistration(res.registration)

    await fetch(
      `https://europe-west1-derlev-xyz.cloudfunctions.net/registerResponse?docId=${res.docId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registration),
      },
    ).then((res) => res.json())

    setLoading(false)
  }

  return (
    <Container maw={420} w="100%">
      <Paper radius="md" p="xl" withBorder>
        <Stack spacing="sm">
          <Title order={3}>Your Passkeys:</Title>
          <Button
            onClick={() => registerFidoCredential()}
            loading={loading}
            leftIcon={<GoPasskeyFill />}
          >
            Register new Passkey
          </Button>
        </Stack>
      </Paper>
    </Container>
  )
}

export default User
