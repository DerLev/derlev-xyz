import '../styles/app.scss'

import flamethrower from 'flamethrower-router'

export const router = flamethrower({ prefetch: 'hover', log: false })

/* Intersection Observer for popping out navbar when scrolled */
const observerCallback: IntersectionObserverCallback = (entries) => {
  const visible = entries[0].isIntersecting
  const navBar = document.querySelector("nav")
  if(!navBar) return

  if(visible) navBar.classList.remove("scrolled")
  else navBar.classList.add("scrolled")
}

const observer = new IntersectionObserver(observerCallback, {
  root: document.body,
  rootMargin: '0px',
  threshold: 1,
})

/* Add observer when HTML has loaded */
window.addEventListener("load", () => {
  const contentBegin = document.querySelector("div#content-begin")

  if(contentBegin) {
    observer.observe(contentBegin)
  }
})
