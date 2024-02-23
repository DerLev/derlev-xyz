import Link from 'next/link'
import tw from 'twin.macro'
import { HiOutlineHomeModern } from 'react-icons/hi2'
import { NextSeo } from 'next-seo'

const styles = {
  wrapper: tw`flex grow flex-col items-center justify-center gap-4 px-4`,
  title: tw`text-center font-semibold text-3xl`,
  subtitle: tw`text-center text-sm text-text-300`,
  button: [
    tw`relative flex items-center justify-center gap-2 overflow-hidden px-0.5`,
    tw`transition-transform active:(translate-y-0.5 transform before:bg-primary-500/50)`,
    tw`before:([z-index: -1] absolute inset-0 translate-y-3/4 transform bg-primary-400/30 transition)`,
    tw`hover:before:translate-y-0`,
  ],
  error: tw`font-bold text-9xl text-text-500`,
}

const PageNotFound = () => (
  <>
    <NextSeo title="Page Not Found" />
    <div css={styles.wrapper}>
      <h1 css={styles.error}>404</h1>
      <h2 css={styles.title}>Page Not Found</h2>
      <p css={styles.subtitle}>
        The page you were looking for could not be found on this server
      </p>
      <Link href="/" css={styles.button}>
        <HiOutlineHomeModern />
        <span>Return to Home</span>
      </Link>
    </div>
  </>
)

export default PageNotFound
