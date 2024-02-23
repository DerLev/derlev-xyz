import type { NextApiHandler } from 'next'

const handler: NextApiHandler = (req, res) => {
  res.status(200).send('OK')
}

export default handler
