import { type NextApiRequest, type NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json('Ok');
};

export default handler;
