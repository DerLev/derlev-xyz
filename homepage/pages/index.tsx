import Image from 'next/image'
import tw from 'twin.macro'
import DerLevProfile from '@/assets/derlev-profile.webp'

const styles = {
  wrapper: tw`flex grow flex-col items-center justify-center gap-4`,
  profile: tw`rounded-full shadow-lg`,
  title: tw`font-semibold text-3xl`,
  derlev: [
    tw`[--tw-gradient-from-position: 25%] [--tw-gradient-to-position: 70%]`,
    tw`bg-gradient-to-tr from-primary-400 to-accent-500`,
    tw`bg-clip-text text-transparent`,
  ],
  socialsStack: tw`flex w-full flex-col items-center gap-2`,
  socialsButton: tw`flex w-full max-w-xs items-center justify-center gap-2 rounded-md border-2 border-primary-400 py-0.5 px-2 transition hover:border-primary-500 active:(translate-y-0.5 transform)`,
}

const Index = () => {
  return (
    <div css={styles.wrapper}>
      <Image
        src={DerLevProfile}
        alt={'DerLev Profile'}
        width={128}
        css={styles.profile}
        placeholder="blur"
        quality={80}
        loading="lazy"
      />
      <h1 css={styles.title}>
        Hi, my name is <span css={styles.derlev}>DerLev</span>!
      </h1>
      {/* <div css={styles.socialsStack}>
        <button css={styles.socialsButton}>
          <FaSpotify />
          <span>Spotify</span>
        </button>
        <button css={styles.socialsButton}>
          <FaSpotify />
          <span>Spotify</span>
        </button>
      </div> */}
    </div>
  )
}

export default Index
