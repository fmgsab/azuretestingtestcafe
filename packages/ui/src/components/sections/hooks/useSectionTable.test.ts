import { renderHook, act } from '../../../test/test-utils';
import { MockDB } from '../../../test/mock-model';
import * as sectionHooks from '../../../db/mappers/sections/hooks';

import { useSectionTable } from './useSectionTable';
import { TableAdapter } from '../../../db/adapters/TableAdapter';

describe('ui/sections/hooks/useSectionTable', () => {
  it('should return data', async () => {
    const name = 'Section Group';
    const table = new TableAdapter();
    const sections = [{ id: 1, name: 'Section 1' }];

    const watchSectionSpy = vi.spyOn(sectionHooks, 'useWatchSections');
    watchSectionSpy.mockReturnValueOnce({ result: sections, table });

    const { result } = renderHook(() => useSectionTable({ name }));

    expect(watchSectionSpy).toHaveBeenCalledWith({ name });
    expect(result.current).toEqual({
      addSection: expect.any(Function),
      updateSection: expect.any(Function),
      removeSection: expect.any(Function),
      sections,
      table,
    });
  });

  it('should operate as expected', async () => {
    const name = 'Section Group';
    const uid = { name: 'Friend 1' };
    const db = new MockDB('TestDB', { friends: '++id, name, age' });
    const { result } = renderHook(() => useSectionTable({ name, table: db.friends, uid }));

    const newKey = await act(async () => await result.current.addSection('Friend 1'));
    expect(newKey).toBeDefined();

    await act(async () => await result.current.updateSection(newKey, { hasStarted: true }));
    expect(await result.current.table.where(uid).toArray()).toEqual([
      expect.objectContaining({
        name: 'Friend 1',
        hasStarted: true,
        created: expect.any(String),
        updated: expect.any(String),
        id: expect.any(String),
      }),
    ]);

    await act(async () => await result.current.removeSection(newKey));
    expect(await result.current.table.where(uid).toArray()).toEqual([]);
  });

  it('should operate add correctly', async () => {
    vi.spyOn(global.self.crypto, 'randomUUID').mockReturnValue('1-1-1-1-1');
    const name = 'Section Group';
    const { result } = renderHook(() => useSectionTable({ name }));

    const newKey = await act(async () => await result.current.addSection('Friend 1'));
    expect(newKey).toBeDefined();
  });
});
