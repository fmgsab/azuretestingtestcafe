import { z } from 'zod';
import { renderHook, withFormWrapper } from '../test/test-utils';

import { MockDB } from '../test/mock-model';
import * as ModelCtx from '../context/ModelContext';
import * as hooks from './useSaveMultiFields';

import { useResetFields } from './useResetFields';

describe('useResetFields', () => {
  const db = new MockDB('TestDB', { friends: '++id, name, age, isCloseFriend' });
  const changes = { name: 'Friend1', age: 21, isCloseFriend: true };
  const uid = 1;

  beforeAll(() => {
    vi.spyOn(ModelCtx, 'useModelContext').mockReturnValue({ table: db.friends, uid, schema: z.object({}) });
    db.friends.add(changes);
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  it('should render hook correctly', () => {
    const saveFiendsFn = vi.fn();
    vi.spyOn(hooks, 'useSaveMultiFields').mockReturnValue(saveFiendsFn);

    const { result } = renderHook(() => useResetFields(), { wrapper: withFormWrapper({ defaultValues: {} }) });
    expect(result.current).toBeDefined();

    result.current(['name', 'age']);

    expect(saveFiendsFn).toHaveBeenCalledWith({ name: undefined, age: undefined }, true);
  });

  it('should render other value', () => {
    const saveFiendsFn = vi.fn();
    vi.spyOn(hooks, 'useSaveMultiFields').mockReturnValue(saveFiendsFn);

    const { result } = renderHook(() => useResetFields({}), { wrapper: withFormWrapper({ defaultValues: {} }) });
    expect(result.current).toBeDefined();

    result.current(['name', 'age']);

    expect(saveFiendsFn).toHaveBeenCalledWith({ name: {}, age: {} }, true);
  });
});
