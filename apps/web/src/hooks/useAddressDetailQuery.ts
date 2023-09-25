import { inferRouterInputs } from '@trpc/server';
import { AppRouter } from '../server/routers/_app';
import { trpc } from '../utils/trpc';

import { useDeferredQuery } from './useDeferredQuery';

type RouterInput = inferRouterInputs<AppRouter>;

export function useAddressDetailQuery() {
  return useDeferredQuery<RouterInput['fmgservices']['address']['detail']>({ router: trpc.fmgservices.address.detail });
}
