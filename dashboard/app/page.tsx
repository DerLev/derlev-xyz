'use client'

import { useSigninCheck } from 'reactfire'

export default function Home() {
  const { data } = useSigninCheck()

  return (
    <pre style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  )
}
