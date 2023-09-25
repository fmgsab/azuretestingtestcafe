import { inferProcedureOutput, inferRouterInputs } from '@trpc/server';
import { AppRouter } from '../server/routers/_app';
import { trpc } from '../utils/trpc';

export type GetLeadsQueryInput = inferRouterInputs<AppRouter>['fmgservices']['leads']['get'];
export type GetLeadsQueryOutput = inferProcedureOutput<AppRouter>['fmgservices']['leads']['get'];

export function useGetLeadsQuery() {
  return trpc.fmgservices.leads.get.useQuery;
}
