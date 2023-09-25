import { inferRouterInputs } from '@trpc/server';
import { AppRouter } from '../server/routers/_app';
import { trpc } from '../utils/trpc';

import { useDeferredQuery } from './useDeferredQuery';

type RouterInput = inferRouterInputs<AppRouter>;

export function useAddressLookupQuery() {
  return useDeferredQuery<RouterInput['fmgservices']['address']['lookup']>({ router: trpc.fmgservices.address.lookup });
}
