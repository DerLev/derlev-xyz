'use client'

import { notifications } from '@mantine/notifications'
import { Auth, AuthProvider, signInWithPopup } from 'firebase/auth'
import { greenCheck, redX } from './notificationStyles'

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

export { signInWithOAuth }
