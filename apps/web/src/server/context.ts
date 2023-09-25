import { CreateNextContextOptions } from '@trpc/server/dist/adapters/next';
import { type Session } from 'next-auth';

import logger from '@fmg/logger';
import { getServerAuthSession } from './auth';
import { serviceClient, tableClient } from '../remote-services/azure-tables';
import fmgServiceClient from '../remote-services/fmg-services';

type CreateContextOptions = {
  session: Session | null;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createInnerTRPCContext = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    serviceClient,
    tableClient,
    fmgServiceClient,
  };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;
  logger.info({ opts });

  // Get the session from the server using the getServerSession wrapper function
  const session = await getServerAuthSession({ req, res });

  return await createInnerTRPCContext({ session });
};
