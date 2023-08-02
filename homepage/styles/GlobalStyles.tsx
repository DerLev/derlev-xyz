import React from 'react'
import { Global } from '@emotion/react'
import tw, { css, GlobalStyles as BaseStyles } from 'twin.macro'

const customStyles = css({
  html: {
    fontSize: '112.5%',
  },

  body: {
    ...tw`bg-background text-text-100 font-body`,
    ...tw`antialiased`,
  },
})

const GlobalStyles = () => (
  <>
    <BaseStyles />
    <Global styles={customStyles} />
  </>
)

export default GlobalStyles
