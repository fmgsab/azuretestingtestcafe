import * as queryHook from 'dexie-react-hooks';
import { renderHook, act } from '../../../../test/test-utils';

import { MockDB } from '../../../../test/mock-model';

import store from '../store/store';
import { TableAdapter } from '../../../adapters/TableAdapter';
import { useWatchSections } from './useWatchSections';

describe('util/section/hooks/useWatchSections', () => {
  const name = 'Section Group';
  afterEach(() => vi.clearAllMocks());

  describe('proxy table', () => {
    it('should create proxy table', async () => {
      const proxyTbl = new TableAdapter();
      const storeSpy = vi.spyOn(store, 'useStore');
      storeSpy.mockReturnValueOnce(null);
      const createSpy = vi.spyOn(store, 'createGroup');
      storeSpy.mockReturnValueOnce(proxyTbl);
      const { result } = await act(async () => await renderHook(() => useWatchSections({ name })));

      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(storeSpy).toHaveBeenCalledTimes(2);
      expect(result.current).toEqual({ result: [], table: proxyTbl });
    });

    it('should return proxy table', async () => {
      const items = [{ name: 'Section 1' }, { name: 'Section 2' }];
      const proxyTbl = new TableAdapter();
      await proxyTbl.add(items[0], 1);
      await proxyTbl.add(items[1], 2);

      const storeSpy = vi.spyOn(store, 'useStore').mockReturnValue(proxyTbl);
      const { result } = await act(async () => await renderHook(() => useWatchSections({ name })));

      expect(storeSpy).toHaveBeenCalledTimes(2);
      expect(result.current).toEqual({
        result: [
          { ...items[0], id: 1, created: expect.any(String), updated: expect.any(String) },
          { ...items[1], id: 2, created: expect.any(String), updated: expect.any(String) },
        ],
        table: proxyTbl,
      });
    });
  });

  describe('live table', () => {
    it('should use live records', async () => {
      const db = new MockDB('TestDB', { friends: '++id, name, age, isCloseFriend' });
      const table = db.friends;
      const friends = [{ name: 'Friend 1' }, { name: 'Friend 2' }];

      vi.spyOn(store, 'useStore').mockReturnValue(null);
      const liveQrySpy = vi.spyOn(queryHook, 'useLiveQuery').mockReturnValueOnce(friends);
      const { result } = await act(async () => await renderHook(() => useWatchSections({ name, table })));

      expect(liveQrySpy).toHaveBeenCalledTimes(1);
      expect(liveQrySpy).toHaveReturnedWith(friends);
      expect(result.current).toEqual({
        result: friends,
        table,
      });
    });

    it('should return live table records', async () => {
      const db = new MockDB('TestDB', { friends: '++id, name, age, isCloseFriend' });
      const table = db.friends;

      const { result } = await act(async () => await renderHook(() => useWatchSections({ name, table, uid: { name: 'Friend 1' } })));
      expect(result.current).toEqual({
        result: [],
        table,
      });
    });
  });

  describe('no live table', () => {
    it('should use live records', async () => {
      const liveQrySpy = vi.spyOn(queryHook, 'useLiveQuery');

      const { result } = await act(async () => await renderHook(() => useWatchSections({ name })));
      expect(liveQrySpy).toHaveReturnedWith(null);
      expect(result.current).toEqual(
        expect.objectContaining({
          result: [],
        })
      );
    });

    it('should return null from live table records', async () => {
      const { result } = await act(async () => await renderHook(() => useWatchSections({ name })));
      expect(result.current).toEqual(
        expect.objectContaining({
          result: [],
        })
      );
    });
  });
});
