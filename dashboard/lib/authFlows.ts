'use client'

import { notifications } from '@mantine/notifications'
import {
  Auth,
  AuthProvider,
  signInWithCustomToken,
  signInWithPopup,
} from 'firebase/auth'
import { greenCheck, redX } from './notificationStyles'
import { startAuthentication } from '@simplewebauthn/browser'

/**
 * Signin a user with an auth provider (OAuth)
 * @param {Auth} auth The auth instance
 * @param {AuthProvider} provider The auth provider to signin to
 * @returns {Promise<void>}
 */
const signInWithOAuth = async (auth: Auth, provider: AuthProvider) => {
  signInWithPopup(auth, provider)
    .then(() => {
      notifications.show({
        message: 'Logged in successfully!',
        title: 'Logged In',
        id: 'login-success',
        ...greenCheck,
      })
    })
    .catch((err) => {
      if (err.code === 'auth/user-disabled')
        return notifications.show({
          message: 'User account is disabled. Ask an admin for help!',
          title: 'Login failed!',
          id: 'login-fail',
          ...redX,
        })

      notifications.show({
        message: 'An unknown error occurred. Ask an admin for help!',
        title: 'An error occurred',
        id: 'login-fail',
        ...redX,
      })

      /* eslint-disable no-console */
      console.group('login-error')
      console.error(err.code)
      console.error(err)
      console.groupEnd()
      /* eslint-enable */
    })
}

/**
 * Sign a user in with a Passkey
 * @param auth The auth instance
 */
const signInWithPasskey = async (auth: Auth) => {
  try {
    notifications.show({
      id: 'fido-loading',
      loading: true,
      title: 'Authorizing with Passkey',
      message: 'Loading Passkey challenge...',
      autoClose: false,
      withCloseButton: false,
    })

    const res = await fetch(
      'https://europe-west1-derlev-xyz.cloudfunctions.net/signinRequest',
      { method: 'POST' },
    ).then((res) => res.json())

    notifications.update({
      id: 'fido-loading',
      loading: true,
      title: 'Authorizing with Passkey',
      message: 'Displaying Passkey challenge...',
      autoClose: false,
      withCloseButton: false,
    })

    const authentication = await startAuthentication(res.authentication)

    notifications.update({
      id: 'fido-loading',
      loading: true,
      title: 'Authorizing with Passkey',
      message: 'Sending result to server...',
      autoClose: false,
      withCloseButton: false,
    })

    const credAuth = await fetch(
      `https://europe-west1-derlev-xyz.cloudfunctions.net/signinResponse?docId=${res.docId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authentication),
      },
    )
      .then((res) => res.json())
      .catch((err) => {
        throw err
      })

    notifications.update({
      id: 'fido-loading',
      loading: true,
      title: 'Authorizing with Passkey',
      message: 'Authenticating with token...',
      autoClose: false,
      withCloseButton: false,
    })

    await signInWithCustomToken(auth, credAuth.cred)

    notifications.update({
      id: 'fido-loading',
      message: 'Successfully logged in!',
      title: 'Logged In',
      autoClose: true,
      ...greenCheck,
    })
  } catch (err: any) {
    /* eslint-disable-next-line no-console */
    console.error(err)
    notifications.hide('fido-loading')
    if (err.name !== 'NotAllowedError') {
      notifications.show({
        id: 'fido-error',
        message: 'There was an error authenticating with Passkey',
        title: 'An error occurred',
        autoClose: true,
        ...redX,
      })
    }
  }
}

export { signInWithOAuth, signInWithPasskey }
