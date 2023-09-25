import { NextApiRequest, NextApiResponse } from 'next';
import { createNextApiHandler } from '@trpc/server/adapters/next';
import cors from 'nextjs-cors';
import { appRouter } from '../../../server/routers/_app';
import { createTRPCContext } from '../../../server/context';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Enable cors
  await cors(req, res);

  // Create and call the tRPC handler
  return createNextApiHandler({
    router: appRouter,
    createContext: createTRPCContext,
    onError({ error, type }) {
      // eslint-disable-next-line no-console
      console.error('Error in trpc handler: ', error, type);
      if (error.code === 'INTERNAL_SERVER_ERROR') {
        // send to bug reporting
      }
    },
  })(req, res);
};

export default handler;
