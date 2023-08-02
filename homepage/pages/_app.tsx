import GlobalStyles from '@/styles/GlobalStyles'
import type { AppProps } from 'next/app'
import tw from 'twin.macro'

const styles = {
  wrapper: tw`flex min-h-screen flex-col`,
  main: tw`relative flex grow flex-col`,
  footer: tw`flex items-center justify-center py-2 px-4 text-xs text-text-500`,
}

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <GlobalStyles />
      <div css={styles.wrapper}>
        <main css={styles.main}>
          <Component {...pageProps} />
        </main>
        <footer css={styles.footer}>
          <p>&copy; {new Date().getFullYear()} DerLev</p>
        </footer>
      </div>
    </>
  )
}

export default App
