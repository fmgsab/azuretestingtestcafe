import { TableClient, TableServiceClient } from '@azure/data-tables';

const connectionString = 'UseDevelopmentStorage=true';
const serviceClient = TableServiceClient.fromConnectionString(connectionString);

function tableClient(table: string): TableClient {
  return TableClient.fromConnectionString(connectionString, table);
}

export { serviceClient, tableClient };
