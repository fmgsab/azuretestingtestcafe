import { inferRouterInputs } from '@trpc/server';
import { AppRouter } from '../server/routers/_app';
import { trpc } from '../utils/trpc';

import { useDeferredQuery } from './useDeferredQuery';

type RouterInput = inferRouterInputs<AppRouter>;

export function useVehicleInfoLookupQuery() {
  return useDeferredQuery<RouterInput['fmgservices']['vehicleInfo']['lookup']>({ router: trpc.fmgservices.vehicleInfo.lookup });
}
