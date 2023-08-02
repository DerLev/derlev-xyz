import Image from 'next/image'
import tw from 'twin.macro'
import DerLevProfile from '@/assets/derlev-profile.webp'
import { FaTwitter, FaDiscord, FaGithub } from 'react-icons/fa'
import { NextSeo, SocialProfileJsonLd } from 'next-seo'

const styles = {
  wrapper: tw`flex grow flex-col items-center justify-center gap-4`,
  profile: tw`rounded-full shadow-lg`,
  title: tw`text-center font-semibold text-3xl`,
  derlev: [
    tw`[--tw-gradient-from-position: 25%] [--tw-gradient-to-position: 70%]`,
    tw`bg-gradient-to-tr from-primary-400 to-accent-500`,
    tw`bg-clip-text text-transparent`,
  ],
  socialsStack: tw`flex w-full flex-col items-center gap-2 px-4`,
  socialsButton: [
    tw`flex w-full max-w-xs items-center justify-center gap-2 rounded-md`,
    tw`border-2 border-primary-400 py-0.5 px-2 transition`,
    tw`hover:border-primary-500 active:(translate-y-0.5 transform)`,
  ],
}

const Index = () => {
  return (
    <>
      <NextSeo
        openGraph={{
          type: 'profile',
          profile: {
            gender: 'male',
            username: 'DerLev',
          },
        }}
      />
      <SocialProfileJsonLd
        type="Person"
        name="DerLev"
        url="https://derlev.xyz/"
        sameAs={[
          'https://github.com/DerLev',
          'https://discord.com/users/377103974081495042',
          'https://twitter.com/_derlev_',
          'https://instagram.com/_derlev_',
          'https://www.youtube.com/channel/UCpEdoioUxagDLt56nT1WWaw',
        ]}
      />
      <div css={styles.wrapper}>
        <Image
          src={DerLevProfile}
          alt={'DerLev Profile'}
          width={128}
          css={styles.profile}
          quality={80}
          priority
        />
        <h1 css={styles.title}>
          Hi, my name is <span css={styles.derlev}>DerLev</span>!
        </h1>
        <div css={styles.socialsStack}>
          <a
            css={styles.socialsButton}
            href="https://github.com/DerLev"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
            <span>GitHub</span>
          </a>
          <a
            css={styles.socialsButton}
            href="https://discord.com/users/377103974081495042"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaDiscord />
            <span>Discord</span>
          </a>
          <a
            css={styles.socialsButton}
            href="https://twitter.com/_derlev_"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter />
            <span>Twitter</span>
          </a>
        </div>
      </div>
    </>
  )
}

export default Index
