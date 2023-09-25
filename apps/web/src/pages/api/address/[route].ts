import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../server/auth';
import { type NextApiRequest, type NextApiResponse } from 'next';
import { TRPCError, type inferProcedureInput } from '@trpc/server';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';

import logger from '@fmg/logger';
import { createTRPCContext } from '../../../server/context';
import { appRouter } from '../../../server/routers/_app';
import { serviceRouter } from '../../../server/routers/fmg';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  logger.info({ session });
  // Create context and caller
  const ctx = await createTRPCContext({ req, res });
  const caller = appRouter.createCaller(ctx);
  try {
    const { route, input } = req.query;

    type Input =
      | inferProcedureInput<(typeof serviceRouter.address)['lookup']>
      | inferProcedureInput<(typeof serviceRouter.address)['detail']>;
    const result = route === 'lookup' || route === 'detail' ? await caller.fmgservices.address[route](input as Input) : null;

    res.status(200).json(result);
  } catch (cause) {
    if (cause instanceof TRPCError) {
      // An error from tRPC occured
      const httpCode = getHTTPStatusCodeFromError(cause);
      return res.status(httpCode).json(cause);
    }
    // Another error occurred
    logger.error(cause);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default handler;
