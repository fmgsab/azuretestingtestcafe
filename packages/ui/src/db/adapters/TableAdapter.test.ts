import { TableAdapter } from './TableAdapter';

describe('section/adapters/TableAdapter', () => {
  const table = new TableAdapter();

  it('should perform/mimic add, update & delete operations', async () => {
    let result = await table.add({ name: 'Item 1' });
    expect(result).toBe(0);
    result = await table.add({ name: 'Item 1' }, 1);
    expect(result).toBe(1);

    result = await table.update(2, { isActive: true });
    expect(table.toArray()).toEqual([{ id: 1, name: 'Item 1', created: expect.any(String), updated: expect.any(String) }]);
    expect(result).toBe(0);
    result = await table.update(1, { isActive: true });
    expect(table.toArray()).toEqual([{ id: 1, name: 'Item 1', isActive: true, created: expect.any(String), updated: expect.any(String) }]);
    expect(result).toBe(1);

    result = await table.delete(2);
    expect(table.toArray()).toEqual([{ id: 1, name: 'Item 1', isActive: true, created: expect.any(String), updated: expect.any(String) }]);
    expect(result).toBe(0);
    result = await table.delete(1);
    expect(table.toArray()).toEqual([]);
    expect(result).toBe(1);
  });

  it('should retrieve data correctly', async () => {
    await table.add({ name: 'Item 1' }, 1);
    await table.add({ name: 'Item 2' }, 2);

    let result: unknown | unknown[] = table.where({ name: 'Item 1' }).toArray();
    expect(result).toEqual([{ name: 'Item 1', id: 1, created: expect.any(String), updated: expect.any(String) }]);

    result = await table.get(1);
    expect(result).toEqual({ name: 'Item 1', id: 1, created: expect.any(String), updated: expect.any(String) });

    const count = await table.count();
    expect(count).toBe(2);
  });
});
