import { router } from '../trpc';
import { azureTablesRouter } from './azure';
import { serviceRouter } from './fmg';

export const appRouter = router({
  azureTables: azureTablesRouter,
  fmgservices: serviceRouter,
});

export type AppRouter = typeof appRouter;
