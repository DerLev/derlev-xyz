'use client'

import { useEffect, useRef } from 'react'

const useFidoSupport = () => {
  const fidoSupported = useRef(false)
  const platformAuth = useRef(false)
  const conditionalMediation = useRef(false)

  const fidoResult = {
    fido: fidoSupported.current,
    platformAuth: platformAuth.current,
    conditionalMediation: conditionalMediation.current,
  }

  if (typeof window === 'undefined') return fidoResult

  const testPlatformAuth = async () => {
    if (PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
      const res =
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
      platformAuth.current = res
    }
  }

  const testConditionalMediation = async () => {
    if (PublicKeyCredential.isConditionalMediationAvailable) {
      const res = await PublicKeyCredential.isConditionalMediationAvailable()
      conditionalMediation.current = res
    }
  }

  useEffect(() => {
    if (window) {
      if (window.PublicKeyCredential) {
        fidoSupported.current = true
        testPlatformAuth()
        testConditionalMediation()
      }
    }
  }, [])

  return fidoResult
}

export default useFidoSupport
