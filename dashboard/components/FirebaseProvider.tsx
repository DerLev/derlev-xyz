'use client'

import type { PropsWithChildren } from 'react'
import {
  AuthProvider,
  FirebaseAppProvider,
  FirestoreProvider,
  useFirebaseApp,
} from 'reactfire'
import firebaseConfig from '@/lib/firebaseConfig'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const FirebaseComponents = ({ children }: PropsWithChildren) => {
  const app = useFirebaseApp()
  const auth = getAuth(app)
  const firestore = getFirestore(app)

  return (
    <AuthProvider sdk={auth}>
      <FirestoreProvider sdk={firestore}>{children}</FirestoreProvider>
    </AuthProvider>
  )
}

const FirebaseProvider = ({ children }: PropsWithChildren) => (
  <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <FirebaseComponents>{children}</FirebaseComponents>
  </FirebaseAppProvider>
)

export default FirebaseProvider
