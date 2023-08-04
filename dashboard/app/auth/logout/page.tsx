'use client'

import useLoginStatus from '@/lib/useLoginStatus'
import { useEffect } from 'react'
import { useAuth } from 'reactfire'

const Logout = () => {
  const {} = useLoginStatus({ behavior: 'onlyUser' })
  const auth = useAuth()

  useEffect(() => {
    auth.signOut()
  }, [auth])

  return <></>
}

export default Logout
