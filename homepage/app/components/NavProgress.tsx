import r2wc from '@r2wc/react-to-web-component'
import { useEffect, useState } from 'react'
import store from '../store'

const NavProgress = () => {
  const [show, setShow] = useState(true)

  const dispatchCallback = () => {
    const currentStore = store.getState()
    const routeLoading = currentStore.routeLoading.value

    if (routeLoading !== show) setShow(routeLoading)
  }

  useEffect(() => {
    const currentStore = store.getState()
    const routeLoading = currentStore.routeLoading.value
    setShow(routeLoading)
    store.subscribe(dispatchCallback)
  }, [])

  return <div className={`nav-loader ${show ? 'active' : ''}`}></div>
}

export default NavProgress

const WebNavProgress = r2wc(NavProgress)
window.customElements.get('nav-progress') ||
  window.customElements.define('nav-progress', WebNavProgress)
