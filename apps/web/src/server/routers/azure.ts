import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../trpc';
import { dexieDbSchema } from 'models';
import logger from '@fmg/logger';

const serializeTypes = (row: { [x: string]: string }) =>
  Object.keys(row)
    .filter((key) => key !== '$types')
    .reduce(
      (acc, curr) => {
        typeof row[curr] === 'object' ? (acc[curr] = JSON.stringify(row[curr])) : (acc[curr] = row[curr]);
        return acc;
      },
      {} as { [x: string]: string }
    );

export const azureTablesRouter = router({
  getAllTables: protectedProcedure.input(z.any()).query(async ({ ctx }) => {
    const { tableClient, serviceClient } = ctx;
    const tableObj = { tables: [] } as Record<string, unknown[]>;

    const tables = serviceClient.listTables() ?? [];

    for await (const table of tables) {
      const rows = [];
      const name = table.name ?? '';
      const iter = tableClient(name)?.listEntities() ?? [];

      for await (const entity of iter) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { partitionKey, etag, timestamp, ...rest } = entity;
        rows.push({ ...rest });
      }
      tableObj.tables.push({ name, rows });
    }

    return tableObj;
  }),

  exportToAzureTables: publicProcedure.input(dexieDbSchema).mutation(async ({ ctx, input }) => {
    const { serviceClient, tableClient } = ctx;
    const {
      data: { data },
    } = input;

    const result: unknown[] = [];

    for (const table of data) {
      const tableName = table.tableName;

      // create azure table, no error is thrown if table exists
      await serviceClient.createTable(tableName);

      table.rows.map(async (row) => {
        const partitionKey = String(row['jobId']).padStart(8, '0');
        const rowKey = row['id'];

        const entity = {
          partitionKey,
          rowKey,
          ...serializeTypes(row),
        };

        try {
          await tableClient(tableName).upsertEntity(entity, 'Merge');
          result.push({ tableName, ...entity });
        } catch (error) {
          logger.error(error);
        }
      });
    }

    return result;
  }),
});

export type azureTablesRouter = typeof azureTablesRouter;
