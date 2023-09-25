import { act, renderHook, waitFor } from '../test/test-utils';

import { MockDB } from '../test/mock-model';

import { useDexieTableData } from './useDexieTableData';

describe('useDexieTableData', () => {
  const db = new MockDB('TestDB', { friends: '++id, name, age, isCloseFriend' });

  beforeAll(async () => {
    await db.friends.add({ name: 'Friend 1', age: 20, isCloseFriend: true });
    await db.friends.add({ name: 'Friend 2', age: 21, isCloseFriend: false });
    await db.friends.add({ name: 'Friend 3', age: 21 });
    await db.friends.add({ name: 'Friend 4', age: 21 });
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  it('should have instantiated table correctly', () => {
    const table = db.friends;
    expect(table).toBeDefined();
  });

  it('should return correct result', async () => {
    const table = db.friends;
    expect(table).toBeDefined();

    const { result, rerender } = await act(() => renderHook(() => useDexieTableData({ tables: [table], keyPath: { age: 21 } })));
    // TODO: Investigate why rerender is needed
    await act(rerender);
    await waitFor(() =>
      expect(result.current).toEqual({
        friends: [
          { id: expect.any(Number), age: 21, name: 'Friend 2', isCloseFriend: false },
          { id: expect.any(Number), age: 21, name: 'Friend 3' },
          { id: expect.any(Number), age: 21, name: 'Friend 4' },
        ],
      })
    );
  });

  it('should return correct result for given column names', async () => {
    const table = db.friends;
    expect(table).toBeDefined();

    const { result, rerender } = await act(() =>
      renderHook(() => useDexieTableData({ tables: [table], keyPath: { age: 21 }, columnNames: ['name', 'age'] }))
    );
    // TODO: Investigate why rerender is needed
    await act(rerender);
    await act(rerender);
    await waitFor(() =>
      expect(result.current).toEqual({
        friends: [
          { age: 21, name: 'Friend 2' },
          { age: 21, name: 'Friend 3' },
          { age: 21, name: 'Friend 4' },
        ],
      })
    );
  });
});
