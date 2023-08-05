'use client'

import { Button, Group, Stack, TextInput } from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'
import { ContextModalProps } from '@mantine/modals'
import { useState } from 'react'
import { HiOutlineHashtag, HiOutlinePencil } from 'react-icons/hi2'

const EditPasskey = ({
  context,
  id,
  innerProps,
}: ContextModalProps<{
  currentData: { name: string }
  sendNewData: (name: string) => Promise<void>
}>) => {
  const [loading, setLoading] = useState(false)

  const form = useForm({
    initialValues: {
      name: innerProps.currentData.name,
    },

    validate: {
      name: isNotEmpty('Cannot be empty'),
    },
  })

  const onSubmit = async (values: { name: string }) => {
    setLoading(true)
    await innerProps
      .sendNewData(values.name)
      .then(() => {
        context.closeModal(id)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <TextInput
          label={'Name'}
          placeholder={'Passkey'}
          disabled={loading}
          icon={<HiOutlineHashtag />}
          {...form.getInputProps('name')}
        />
        <Group position="right" mt="xl">
          <Button
            leftIcon={<HiOutlinePencil />}
            loading={loading}
            type="submit"
          >
            Save changes
          </Button>
        </Group>
      </Stack>
    </form>
  )
}

export default EditPasskey
