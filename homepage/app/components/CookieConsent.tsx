import r2wc from '@r2wc/react-to-web-component'
import { useEffect, useState } from 'react'

const ccSeenLocalStorage = 'd_CookieConsent'
const ccSettingLocalStorage = 'd_CookieSetting'
const ccVersion = 'v1'

const CookieConsent = () => {
  const [show, setShow] = useState(false)

  const acceptFunctionalCookies = () => {
    setShow(false)
    localStorage.setItem(ccSeenLocalStorage, `seen:${ccVersion}`)
    localStorage.setItem(ccSettingLocalStorage, 'functional')
  }

  useEffect(() => {
    const consentLocalStorage = localStorage.getItem(ccSeenLocalStorage)
    const consetShown = consentLocalStorage === `seen:${ccVersion}`
    if (!consentLocalStorage) localStorage.setItem(ccSeenLocalStorage, 'none')
    setShow(!consetShown)

    if (!localStorage.getItem(ccSettingLocalStorage))
      localStorage.setItem(ccSettingLocalStorage, 'functional')
  }, [])

  return show ? (
    <div className="cookies">
      <div className="cc-content-wrapper">
        <span className="cc-title">Cookies on this website</span>
        <p className="cc-text">
          This website does not make use of any cookies, tracking, or
          advertising.
        </p>
        <button
          className="cc-button cc-only-functional"
          onClick={acceptFunctionalCookies}
        >
          Continue
        </button>
      </div>
    </div>
  ) : null
}

export default CookieConsent

const WebCookieConsent = r2wc(CookieConsent)
window.customElements.get('cookie-consent') ||
  window.customElements.define('cookie-consent', WebCookieConsent)
