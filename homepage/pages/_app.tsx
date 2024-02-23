import GlobalStyles from '@/styles/GlobalStyles'
import type { AppProps } from 'next/app'
import tw from 'twin.macro'
import { DefaultSeo } from 'next-seo'
import { useRouter } from 'next/router'

const styles = {
  wrapper: tw`flex min-h-screen flex-col`,
  wrapperMobileFix: tw`[min-height: 100dvh]`,
  main: tw`relative flex grow flex-col`,
  footer: tw`flex items-center justify-center py-2 px-4 text-xs text-text-500`,
}

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter()

  return (
    <>
      <DefaultSeo
        title="DerLev"
        description="Hello, my name is DerLev! I'm a webdev and homelabber!"
        themeColor="#050505"
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: `https://derlev.xyz${router.asPath}`,
          siteName: 'DerLev',
          images: [
            {
              url: 'https://derlev.xyz/derlev-opg.webp',
              width: 1024,
              height: 1024,
              alt: 'DerLev Open Graph',
              type: 'image/webp',
            },
          ],
        }}
        twitter={{
          cardType: 'summary_large_image',
          handle: '@_derlev_',
        }}
      />
      <GlobalStyles />
      <div css={[styles.wrapper, styles.wrapperMobileFix]}>
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
