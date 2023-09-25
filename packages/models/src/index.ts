import { FormValues as T1 } from './vehicle.table';
import { FormValues as T2 } from './house.table';
import { FormValues as T3 } from './business.table';
import { FormValues as T4 } from './keyInfo.table';
import { FormValues as T5 } from './contact.table';
import { FormValues as T6 } from './content.table';
import { FormValues as T7 } from './otherContent.table';

export { db } from './@database';

export * as clientInfo from './keyInfo.table';
export * as house from './house.table';
export * as farmInfo from './business.table';
export * as vehicle from './vehicle.table';
export * as contact from './contact.table';
export * as content from './content.table';
export * as otherContent from './otherContent.table';

export type TableTypes = T1 & T2 & T3 & T4 & T5 & T6 & T7 & { id: number };

export { dexieDbSchema, type DexieDbSchemaType } from './schemas/dexieDbSchema';

export * from './data-dictionary/data-dictionary';
export * from './data-dictionary/constants';
export * from './data-dictionary/names-questions';

export * as schema from './schemas/schema';

export * as leads from './schemas/query-services/leads';
export * as address from './schemas/query-services/address';
export * as vehicleInfo from './schemas/query-services/vehicle';
