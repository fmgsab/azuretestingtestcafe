import lookups from './lookup-data.json';
import { z } from 'zod';

import { toNumber } from '@fmg/utils';

export type LookupItem = Record<string, unknown> & {
  effectiveDate?: string;
  expirationDate?: string;
};

export type LookupList = LookupItem[] | string[] | LookupItem;
export type CriteriaValue = string | string[];

export const KeyEnum = z.enum([
  'itemType' as string,
  'itemSubtype' as string,
  'coverType' as string,
  'usage' as string,
  'sumInsured.gstExclusive' as string,
  'occupancy' as string,
]);
export type KeyType = z.infer<typeof KeyEnum>;

export type Criteria = Record<KeyType | string, CriteriaValue | undefined>;

// TODO: make sure it doesn't cause type errors when used as component props
export type SearchResult = {
  label?: string;
  value?: unknown;
  description?: string;
  list?: unknown[];
};

export function isEffective({ effectiveDate, expirationDate }: LookupItem, baseDate: string | Date) {
  const stdDate = baseDate instanceof Date ? baseDate : new Date(baseDate);

  return (!expirationDate || new Date(expirationDate) > stdDate) && (!effectiveDate || new Date(effectiveDate) <= stdDate);
}

/**
 * Pull only the valid items out of the <code>list</code> given based on the <code>baseDate</code>
 * @param list
 * @param baseDate a ISO formatted date string - today's date by default
 */
// TODO: confirm whether toISOString returns correct value
export function getValidLookups(list: LookupList, baseDate: string = new Date().toISOString()) {
  const resolveItem = (item: unknown | string) => {
    const isValid = isEffective(item as LookupItem, baseDate);
    return isValid ? item : undefined;
  };

  if (Array.isArray(list)) {
    return list.map((curItem) => resolveItem(curItem)).filter(Boolean);
  }

  return Object.keys(list).reduce((acc, key) => {
    const item = resolveItem(list[key]);
    return item ? { ...acc, [key]: item } : acc;
  }, {});
}

export function contains(arr: unknown[], searchValue: CriteriaValue) {
  return arr.some((element) => {
    if (typeof element === 'string' && typeof searchValue === 'string') {
      return element.toLowerCase() === searchValue.toLowerCase();
    }
    // TODO: this will always be false other than primitive values
    return element === searchValue;
  });
}

export function isMatchingCriteria(searchCriteria: Criteria) {
  return (element: Record<string, unknown[]>) => {
    //const matches = Object.keys(element).reduce((acc, key) => {
    return Object.keys(element).reduce((acc, key) => {
      if (['min', 'max'].includes(key)) {
        const [fieldKey, minmax] = element[key] as [string, number];
        const fieldValue = searchCriteria[fieldKey] as string;
        // console.log({ key, fieldKey, fieldValue });
        if (acc && Boolean(fieldValue)) {
          // <--- remove Boolean(fieldValue) to fix Vehicle Excess behaviour
          return key === 'min' ? toNumber(fieldValue) >= minmax : toNumber(fieldValue) < minmax;
        }
        return false;
      }

      const value = searchCriteria[key];

      // Replace with KeyEnum
      if (!KeyEnum.options.includes(key)) return acc;
      // console.log({ value, key }, element[key], acc, element[key]?.includes(value));
      return acc && Boolean(value) && contains(element[key], value as CriteriaValue);
    }, true);
  };
}

export class DataDictionary {
  static instance: DataDictionary;

  readonly #baseDate: string;
  readonly #data: Record<string, unknown>;

  constructor(date: string) {
    this.#baseDate = date;
    this.#data = this.#filterValid();
  }

  static get(date = '') {
    let baseDate: string = date;
    if (!date) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      baseDate = d.toISOString();
    }

    if (!DataDictionary.instance || DataDictionary.instance.#baseDate !== baseDate) {
      DataDictionary.instance = new DataDictionary(baseDate);
    }

    return DataDictionary.instance;
  }

  get data() {
    return this.#data;
  }

  get baseDate() {
    return this.#baseDate;
  }

  #filterValid() {
    return Object.keys(lookups).reduce((acc, key) => {
      // eslint-disable-next-line
      // @ts-ignore
      const list = getValidLookups(lookups[key], this.#baseDate);
      return { ...acc, [key]: list };
    }, {});
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #filterMatching(data: any[] | any, searchCriteria: Criteria) {
    if (Array.isArray(data)) {
      const matchingData = data.filter(isMatchingCriteria(searchCriteria));
      // eslint-disable-next-line no-console
      // console.log({ data, matchingData, searchCriteria });
      return matchingData.map((data) => data.list ?? data).flat();
    }
    return data;
  }

  #extractCriteria(value: string[] | string, fieldNames: string[] = []) {
    const fieldValues = [value].flat();
    const searchCriteria: Criteria = fieldValues.reduce((acc, value, idx) => {
      return { ...acc, [fieldNames[idx]]: value };
    }, {});

    return searchCriteria;
  }

  has(name: string) {
    return (value: string[]) => {
      const result = DataDictionary.instance.get(`has.${name}`)(value);
      return Array.isArray(result) && result.length > 0;
    };
  }

  get(name: string) {
    return (value?: string | string[], fieldNames = ['itemType', 'itemSubtype', 'usage', 'coverType', 'sumInsured.gstExclusive']) =>
      this.#filterMatching(this.#data[name], value ? this.#extractCriteria(value, fieldNames) : {});
  }
}

// TODO: where to instantiate
// should be able to pull the global base date based on each application
export const dd = DataDictionary.get('2023-05-26T00:00:00');
