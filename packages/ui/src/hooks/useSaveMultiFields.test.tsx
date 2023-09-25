import { z } from 'zod';
import { renderHook, withFormWrapper } from '../test/test-utils';

import { MockDB } from '../test/mock-model';
import * as ModelCtx from '../context/ModelContext';

import { useSaveMultiFields } from './useSaveMultiFields';

describe('useSaveMultiFields', () => {
  const db = new MockDB('TestDB', { friends: '++id, name, age, isCloseFriend' });
  const changes = { name: 'Friend1', age: 21, isCloseFriend: true };
  const uid = 1;

  beforeAll(() => {
    vi.spyOn(ModelCtx, 'useModelContext').mockReturnValue({ table: db.friends, uid, schema: z.object({}) });
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  it('should have instantiated table correctly', () => {
    const table = db.friends;
    expect(table).toBeDefined();
  });

  it('should execute add', async () => {
    const table = db.friends;
    expect(table).toBeDefined();

    table.add = vi.fn().mockResolvedValueOnce(1);

    const { result } = renderHook(useSaveMultiFields);
    expect(result.current).toBeDefined();

    await result.current(changes);

    await table.where({ name: 'Friend 1' }).first();
    expect(table.add).toHaveBeenNthCalledWith(1, changes, uid);
  });

  it('should execute update', async () => {
    const table = db.friends;

    table.add = vi.fn();
    table.update = vi.fn().mockResolvedValueOnce(1);

    const { result } = renderHook(useSaveMultiFields);
    expect(result.current).toBeDefined();

    await result.current(changes);

    expect(table.update).toHaveBeenNthCalledWith(1, uid, changes);
    expect(table.add).toHaveBeenCalledTimes(0);
  });

  it('should set value to form', async () => {
    const table = db.friends;

    table.add = vi.fn();
    table.update = vi.fn().mockResolvedValueOnce(1);

    const { result } = renderHook(() => useSaveMultiFields(), { wrapper: withFormWrapper({ defaultValues: {} }) });
    expect(result.current).toBeDefined();

    await result.current(changes, true);

    expect(table.update).toHaveBeenNthCalledWith(1, uid, changes);
    expect(table.add).toHaveBeenCalledTimes(0);
  });
});
