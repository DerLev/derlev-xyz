import tw from 'twin.macro'

const styles = {
  wrapper: tw`flex grow flex-col items-center justify-center`,
}

const Index = () => {
  return (
    <div css={styles.wrapper}>
      <p>Hello World!</p>
    </div>
  )
}

export default Index
