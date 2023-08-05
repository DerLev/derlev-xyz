'use client'

import useLoginStatus from '@/lib/useLoginStatus'
import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Container,
  Group,
  Paper,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { useState } from 'react'
import { startRegistration } from '@simplewebauthn/browser'
import { GoPasskeyFill } from 'react-icons/go'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import {
  collection,
  deleteDoc,
  doc,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { PasskeyCredentialsCollection } from '@/types/firestore'
import {
  HiOutlineExclamationTriangle,
  HiOutlineInformationCircle,
  HiOutlineKey,
  HiOutlinePencilSquare,
  HiOutlineTrash,
} from 'react-icons/hi2'
import { dateTimeFormatter } from '@/lib/formatters'
import { openConfirmModal, openContextModal } from '@mantine/modals'
import firestoreConverter from '@/lib/firestoreConverter'
import useFidoSupport from '@/lib/useFidoSupport'

const User = () => {
  const { user } = useLoginStatus({ behavior: 'onlyUser' })
  const { fido, platformAuth } = useFidoSupport()
  const [loading, setLoading] = useState(false)

  const firestore = useFirestore()
  const passkeyCredentialsCollection = collection(
    firestore,
    'passkeyCredentials',
  )
  const passkeyCredentialsQuery = query(
    passkeyCredentialsCollection,
    where('uid', '==', user?.uid || ''),
    orderBy('timestamp', 'asc'),
  )
  const { data, status } = useFirestoreCollectionData(
    passkeyCredentialsQuery,
    {},
  )
  const passkeyCredentialsData = (data as PasskeyCredentialsCollection[]) || []

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

  const updatePasskey = async (docId: string, name: string) =>
    openContextModal({
      modal: 'editPasskey',
      innerProps: {
        currentData: {
          name,
        },
        sendNewData: async (name: string) => {
          const collectionWithTypes =
            passkeyCredentialsCollection.withConverter(
              firestoreConverter<PasskeyCredentialsCollection>(),
            )
          const credentialDoc = doc(collectionWithTypes, docId)
          await updateDoc(credentialDoc, { name })
        },
      },
      title: `Edit ${name}`,
    })

  const deletePasskey = async (docId: string, name: string) =>
    openConfirmModal({
      modalId: 'delete-passkey',
      title: `Delete ${name}?`,
      labels: { confirm: 'Yes, delete this Passkey', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      children: (
        <Text size="sm">
          You are about to delete this Passkey. Deleting a Passkey does not
          delete it on the device but stops it from successfully authenticating.
          Deleting a Passkey <strong>cannot be undone</strong>. Do you want to
          continue?
        </Text>
      ),
      onConfirm: async () => {
        const docRef = doc(passkeyCredentialsCollection, docId)
        await deleteDoc(docRef)
      },
    })

  return (
    <Container maw={420} w="100%">
      <Skeleton visible={status !== 'success'}>
        <Paper radius="md" p="xl" withBorder>
          <Stack spacing="sm">
            <Title order={3}>Your Passkeys:</Title>
            <Stack p="xs">
              {passkeyCredentialsData.map((cred) => (
                <Group key={cred.credId} noWrap>
                  <HiOutlineKey size="1.5em" />
                  <Box
                    sx={() => ({
                      flexGrow: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    })}
                  >
                    <Text>{cred.name}</Text>
                    <Text size="sm" color="dimmed">
                      Created:{' '}
                      {dateTimeFormatter.format(cred.timestamp.toDate())}
                    </Text>
                  </Box>
                  <Group spacing={4} noWrap>
                    <ActionIcon
                      color="blue"
                      onClick={() => updatePasskey(cred.credId, cred.name)}
                    >
                      <HiOutlinePencilSquare />
                    </ActionIcon>
                    <ActionIcon
                      color="red"
                      onClick={() => deletePasskey(cred.credId, cred.name)}
                    >
                      <HiOutlineTrash />
                    </ActionIcon>
                  </Group>
                </Group>
              ))}
              {!passkeyCredentialsData.length && (
                <Group position="center">
                  <Text color="dimmed" size="sm">
                    You have no Passkeys
                  </Text>
                </Group>
              )}
            </Stack>
            <Button
              onClick={() => registerFidoCredential()}
              loading={loading}
              leftIcon={<GoPasskeyFill />}
              disabled={!fido}
            >
              Register new Passkey
            </Button>
            {!fido && status === 'success' && (
              <Alert color="red" icon={<HiOutlineExclamationTriangle />}>
                <Text>
                  Your browser does not support the FIDO standard used by
                  Passkeys. To register a Passkey use a different browser or a
                  newer version!
                </Text>
              </Alert>
            )}
            {!platformAuth && fido && status === 'success' && (
              <Alert color="blue" icon={<HiOutlineInformationCircle />}>
                <Text>
                  Your device does not have the Passkey functionality built-in.
                  You can still register a cross-platform Passkey (e.g.
                  Yubikey).
                </Text>
              </Alert>
            )}
          </Stack>
        </Paper>
      </Skeleton>
    </Container>
  )
}

export default User
