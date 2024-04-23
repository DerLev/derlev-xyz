import '../styles/app.scss'

import flamethrower from 'flamethrower-router'
import store, { isLoading, notLoading } from './store'

export const router = flamethrower({ prefetch: 'hover', log: false })

export * from './components/NavProgress'
export * from './components/CookieConsent'
export * from './components/CopyCode'
export * from './components/CopySectionLink'

window.addEventListener('flamethrower:router:fetch', () => {
  store.dispatch(isLoading())
})

window.addEventListener('flamethrower:router:end', () => {
  setTimeout(() => {
    store.dispatch(notLoading())
  }, 450)
})

/* Using window scroll to pop out navbar */

let navbarHeight: number

const getNavbarHeight = () => {
  const navBar = document.querySelector('nav')

  if (navBar && !navBar.classList.contains('scrolled')) {
    navbarHeight = navBar.offsetHeight
  }
}

const bodyScrollListenerCallback = () => {
  const bodyScroll = document.body.scrollTop
  const navBar = document.querySelector('nav')

  if (!navBar) return

  if (bodyScroll >= navbarHeight) navBar.classList.add('scrolled')
  else navBar.classList.remove('scrolled')
}

window.addEventListener('load', () => {
  getNavbarHeight()
  bodyScrollListenerCallback()
  document.body.addEventListener('scroll', () => {
    bodyScrollListenerCallback()
  })
})
window.addEventListener('flamethrower:router:end', () => {
  getNavbarHeight()
  bodyScrollListenerCallback()
  document.body.addEventListener('scroll', () => {
    bodyScrollListenerCallback()
  })
})
