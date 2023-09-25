import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import { leads, address, vehicleInfo } from 'models';

export const serviceRouter = router({
  address: router({
    lookup: protectedProcedure
      .input(address.lookup.input)
      .output(address.lookup.output)
      .query(async ({ ctx, input }) => {
        return ctx.fmgServiceClient.lookupAddresses({ searchFor: input });
      }),

    detail: protectedProcedure
      .input(address.detail.input)
      .output(address.detail.output)
      .query(async ({ ctx, input }) => {
        return ctx.fmgServiceClient.getAddressDetail({ adr: input });
      }),
  }),
  vehicleInfo: router({
    lookup: protectedProcedure
      .input(vehicleInfo.lookup.input)
      .output(vehicleInfo.lookup.output)
      .query(async ({ ctx, input }) => {
        return ctx.fmgServiceClient.lookupVehicleInfo({ searchFor: input });
      }),
  }),
  leads: router({
    get: protectedProcedure
      .input(leads.get.input)
      .output(leads.get.output)
      .query(async ({ ctx, input }) => {
        const result: Record<string, string>[] = await ctx.fmgServiceClient.getLeads({ employeeId: input });
        type Element = z.infer<typeof leads.leadShape>;
        return result.map(({ postCode, postalZip, ...res }) => {
          const other = Object.keys(res).reduce<Partial<Element>>(
            (acc, key) => ({ ...acc, [key]: res[key as keyof typeof res] ?? '' }),
            {}
          );
          return { ...other, postcode: postalZip || postCode } as Element;
        });
      }),
  }),
});

export type serviceRouter = typeof serviceRouter;
