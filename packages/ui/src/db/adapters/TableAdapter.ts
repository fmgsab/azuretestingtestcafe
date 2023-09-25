import { IndexableType } from 'dexie';
import { toFormattedDate } from '@fmg/utils';

type TableAdapterType<K> = Map<K, Record<string, unknown>>;

/**
 * An Adapter object to imitate operations of Dexie#Table
 */
export class TableAdapter<K extends IndexableType | string> {
  #table: TableAdapterType<K>;

  constructor() {
    this.#table = new Map<K, Record<string, unknown>>();
  }

  where(keyPath: Record<string, unknown>) {
    //return new Promise<TableAdapter<K>>((resolve) => {
    const filtered = new TableAdapter<K>();
    for (const [id, section] of this.#table) {
      Object.entries(keyPath).forEach(async ([key, value]) => {
        if (section[key] === value) {
          await filtered.add(section, id);
        }
      });
    }
    //return resolve(filtered);
    //});
    return filtered;
  }

  toArray() {
    return [...this.#table.values()];
  }

  add(newItem: Record<string, unknown>, key?: K): Promise<K> {
    return new Promise<K>((resolve) => {
      const date = toFormattedDate();
      if (key) {
        this.#table.set(key, { ...newItem, created: date, updated: date, id: key });
        resolve(key);
      } else {
        resolve(0 as K);
      }
    });
  }

  update(key: K, change: Record<string, unknown>): Promise<number> {
    return new Promise<number>((resolve) => {
      // Assuming its type is always [keyPath]: Record<string, unknown>
      const data = this.#table.get(key) as Record<string, unknown>;
      if (!data) {
        resolve(0);
        return;
      }

      this.#table.set(key, { ...data, ...change });
      resolve(1);
    });
  }

  get(key: K): Promise<unknown> {
    return new Promise<unknown>((resolve) => {
      resolve(this.#table.get(key));
    });
  }

  delete(key: K): Promise<number> {
    return new Promise<number>((resolve) => {
      const data = this.#table.get(key) as Record<string, unknown>;
      if (!data) {
        resolve(0);
        return;
      }

      this.#table.delete(key);
      resolve(1);
    });
  }

  count() {
    return new Promise<number>((resolve) => {
      resolve(this.#table.size);
    });
  }
}
