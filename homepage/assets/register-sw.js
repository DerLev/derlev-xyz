import { dev } from '@params'

if ('serviceWorker' in navigator) {
  window.addEventListener("load", () => {
    if(dev) {
      navigator.serviceWorker.getRegistration("/sw.js")
        .then((registration) => {
          if(!registration) return
          registration.unregister()
        })
    } else {
      navigator.serviceWorker.register("/sw.js", { scope: "/" })
    }
  })
}
