import { z } from 'zod';
import { UseTRPCQueryResult } from '@trpc/react-query/shared';
import { createContext, useContext } from 'react';
import { address, leads, vehicleInfo } from 'models';

export type AnyQueryResult<T> = T extends never ? Partial<UseTRPCQueryResult<T, unknown>> : UseTRPCQueryResult<T, unknown>;

export type LookupAddressesOutput = z.infer<typeof address.lookup.output>;
export type GetAddressDetailOutput = z.infer<typeof address.detail.output>;
export type GetLeadsOutput = z.infer<typeof leads.get.output>;

export type QueryServiceContextProps = {
  lookupAddresses: (search: z.infer<typeof address.lookup.input>) => Promise<LookupAddressesOutput>;
  lookupVehicleInfo: (search: z.infer<typeof vehicleInfo.lookup.input>) => Promise<LookupAddressesOutput>;
  getAddressDetail: (search: z.infer<typeof address.detail.input>) => Promise<GetAddressDetailOutput> | Promise<Record<string, string>>;
  getLeads: <T extends GetLeadsOutput>() => UseTRPCQueryResult<T, unknown>;
};

export const QueryServiceContext = createContext<QueryServiceContextProps>({
  lookupAddresses: () => Promise.resolve([]),
  lookupVehicleInfo: () => Promise.resolve([]),
  getAddressDetail: () => Promise.resolve({}),
  getLeads: () => {
    return { data: [], isLoading: false, isSuccess: false } as never;
  },
});
export const useQueryServiceContext = () => useContext(QueryServiceContext);
