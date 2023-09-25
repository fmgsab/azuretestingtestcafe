import type { NextApiRequest, NextApiResponse } from 'next';
import { house as model } from 'models';

const submit = (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;
  const result = model.schema.safeParse(body);
  res.statusCode = result.success ? 200 : 400;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ result }));
};

export default submit;
