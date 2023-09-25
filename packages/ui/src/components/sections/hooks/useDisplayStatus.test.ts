import { act, renderHook } from '../../../test/test-utils';
import { useDisplayStatus } from './useDisplayStatus';
import * as dexieReactHooks from 'dexie-react-hooks';
import * as mockData from './mockData';

describe('ui/sections/hooks/useSectionTable', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const defaultReturnId = 'keyInfo_1';

  it('should not return anything if no sections passed in', async () => {
    // eslint-disable-next-line
    // @ts-ignore
    const { result } = await act(async () => await renderHook(() => useDisplayStatus()));
    expect(result.current).toEqual(expect.any(Function));
  });

  it('should check the first item for building the defaultReturn value', async () => {
    const useLiveQuerySpy = vi.spyOn(dexieReactHooks, 'useLiveQuery');
    useLiveQuerySpy.mockReturnValue([[]]);

    const { result } = await act(async () => await renderHook(() => useDisplayStatus(mockData.sectionLists)));
    const trigger = result.current!;

    expect(useLiveQuerySpy).toBeDefined();
    expect(useLiveQuerySpy).toHaveBeenCalledTimes(1);

    const newDisplayId = await act(async () => await trigger('1', { name: 'householdContent' }));

    expect(newDisplayId).toEqual('keyInfo_undefined');
  });

  it.each`
    testCase        | case                                                 | mockReturn             | removeId  | expected
    ${'display id'} | ${'no removedId is passed in'}                       | ${mockData.mockData1A} | ${''}     | ${defaultReturnId}
    ${'display id'} | ${'an incorrect removeId is passed in'}              | ${mockData.mockData1A} | ${'9999'} | ${defaultReturnId}
    ${'undefined'}  | ${'no liveData is found'}                            | ${undefined}           | ${'9999'} | ${undefined}
    ${'display id'} | ${'Case 1A: not-first of many'}                      | ${mockData.mockData1A} | ${'2'}    | ${'householdContent_1'}
    ${'display id'} | ${'Case 1B: first of many'}                          | ${mockData.mockData1B} | ${'1'}    | ${'householdContent_2'}
    ${'display id'} | ${'Case 2A: Only item with items above'}             | ${mockData.mockData2A} | ${'1'}    | ${'house_2'}
    ${'display id'} | ${'Case 2B: Only item with items below'}             | ${mockData.mockData2B} | ${'1'}    | ${'farmBuilding_1'}
    ${'display id'} | ${'Case 2B: Only item with no items above or below'} | ${mockData.mockData2C} | ${'1'}    | ${defaultReturnId}
  `('should return $testCase if $case', async ({ mockReturn, removeId, expected }) => {
    const useLiveQuerySpy = vi.spyOn(dexieReactHooks, 'useLiveQuery');
    useLiveQuerySpy.mockReturnValue(mockReturn);

    const { result } = await act(async () => await renderHook(() => useDisplayStatus(mockData.sectionLists)));
    const trigger = result.current!;

    expect(useLiveQuerySpy).toBeDefined();
    expect(useLiveQuerySpy).toHaveBeenCalledTimes(1);

    const newDisplayId = await act(() => trigger(removeId, { name: 'householdContent' }));
    expect(newDisplayId).toBe(expected);
  });
});
