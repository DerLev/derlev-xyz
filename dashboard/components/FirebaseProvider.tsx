'use client'

import type { PropsWithChildren } from 'react'
import { AuthProvider, FirebaseAppProvider, useFirebaseApp } from 'reactfire'
import firebaseConfig from '@/lib/firebaseConfig'
import { getAuth } from 'firebase/auth'

const FirebaseComponents = ({ children }: PropsWithChildren) => {
  const app = useFirebaseApp()
  const auth = getAuth(app)

  return <AuthProvider sdk={auth}>{children}</AuthProvider>
}

const FirebaseProvider = ({ children }: PropsWithChildren) => (
  <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <FirebaseComponents>{children}</FirebaseComponents>
  </FirebaseAppProvider>
)

export default FirebaseProvider
