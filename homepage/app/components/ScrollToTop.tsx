import r2wc from '@r2wc/react-to-web-component'

const ScrollToTop = () => {
  const scrollToTop = () => {
    document.body.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  return (
    <button
      className="scroll-to-top-button hidden"
      onClick={scrollToTop}
      aria-label="Scroll To Top"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="icon"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m4.5 18.75 7.5-7.5 7.5 7.5"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m4.5 12.75 7.5-7.5 7.5 7.5"
        />
      </svg>
    </button>
  )
}

export default ScrollToTop

const WebScrollToTop = r2wc(ScrollToTop)
window.customElements.get('scroll-to-top') ||
  window.customElements.define('scroll-to-top', WebScrollToTop)
