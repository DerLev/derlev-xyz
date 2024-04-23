import r2wc from '@r2wc/react-to-web-component'
import { useState } from 'react'

const CopySectionLink = ({ url }: { url: string }) => {
  const [copied, setCopied] = useState(false)

  const copyUrlToClipboard = () => {
    if (copied) return

    setCopied(true)
    navigator.clipboard.writeText(url)
    setTimeout(() => {
      setCopied(false)
    }, 1500)
  }

  return (
    <button
      className={`copy-url-button ${copied ? 'copied' : ''}`}
      onClick={() => copyUrlToClipboard()}
      aria-label="Copy Section URL"
    >
      {copied ? (
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
            d="m4.5 12.75 6 6 9-13.5"
          />
        </svg>
      ) : (
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
            d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
          />
        </svg>
      )}
    </button>
  )
}

export default CopySectionLink

const WebCopySectionLink = r2wc(CopySectionLink, { props: { url: 'string' } })
window.customElements.get('copy-section-link') ||
  window.customElements.define('copy-section-link', WebCopySectionLink)
