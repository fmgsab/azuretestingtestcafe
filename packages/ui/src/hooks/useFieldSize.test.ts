import { z } from 'zod';

import { renderHook, withFormWrapper } from '../test/test-utils';
import * as context from '../context/ModelContext';

import { useFieldSize } from './useFieldSize';

describe('useFieldSize', () => {
  afterAll(() => {
    vi.clearAllMocks();
  });

  it.each`
    size         | expected
    ${10}        | ${10}
    ${undefined} | ${10}
  `('should return correct field size when size=$size', async ({ size, expected }) => {
    const schema = z.object({ name: z.string() });

    const useModelContextSpy = vi.spyOn(context, 'useModelContext');
    // @ts-ignore
    useModelContextSpy.mockReturnValue(undefined);

    const { result } = renderHook(() => useFieldSize('name', size), {
      wrapper: withFormWrapper<z.infer<typeof schema>>({ defaultValues: {} }),
    });

    expect(result.current).toBe(expected);
  });

  it.each`
    max    | size         | expected
    ${6}   | ${10}        | ${10}
    ${255} | ${undefined} | ${10}
    ${6}   | ${undefined} | ${5}
    ${255} | ${10}        | ${10}
  `('should return correct field size when size=$size and max=$max', async ({ max, size, expected }) => {
    const schema = z.object({ name: z.string().max(max) });

    const useModelContextSpy = vi.spyOn(context, 'useModelContext');
    useModelContextSpy.mockReturnValue({ schema, uid: 0 });

    const { result } = renderHook(() => useFieldSize('name', size), {
      wrapper: withFormWrapper<z.infer<typeof schema>>({ defaultValues: {} }),
    });

    expect(useModelContextSpy).toHaveBeenCalled();
    expect(result.current).toBe(expected);
  });

  it.each`
    max    | size         | expected
    ${6}   | ${10}        | ${10}
    ${255} | ${undefined} | ${10}
    ${6}   | ${undefined} | ${5}
    ${255} | ${10}        | ${10}
  `('should return correct field size when size=$size and max=$max of optional string', async ({ max, size, expected }) => {
    const schema = z.object({ name: z.string().max(max).optional() });
    const useModelContextSpy = vi.spyOn(context, 'useModelContext');
    useModelContextSpy.mockReturnValue({ schema, uid: 0 });

    const { result } = renderHook(() => useFieldSize('name', size), {
      wrapper: withFormWrapper<z.infer<typeof schema>>({ defaultValues: {} }),
    });

    expect(result.current).toBe(expected);
  });

  it('should return correct field size when not string type', async () => {
    const schema = z.object({ age: z.number() });
    const useModelContextSpy = vi.spyOn(context, 'useModelContext');
    useModelContextSpy.mockReturnValue({ schema, uid: 0 });

    const { result } = renderHook(() => useFieldSize('age'), {
      wrapper: withFormWrapper<z.infer<typeof schema>>({ defaultValues: {} }),
    });

    expect(result.current).toBe(10);
  });

  it('should return correct field size when zodeffects type', async () => {
    const schema = z.object({ age: z.number().refine((val) => val > 10) });
    const useModelContextSpy = vi.spyOn(context, 'useModelContext');
    useModelContextSpy.mockReturnValue({ schema, uid: 0 });

    const { result } = renderHook(() => useFieldSize('age'), {
      wrapper: withFormWrapper<z.infer<typeof schema>>({ defaultValues: {} }),
    });

    expect(result.current).toBe(10);
  });

  it('should return correct field size when no max specified', async () => {
    const schema = z.object({ name: z.string() });
    const useModelContextSpy = vi.spyOn(context, 'useModelContext');
    useModelContextSpy.mockReturnValue({ schema, uid: 0 });

    const { result } = renderHook(() => useFieldSize('name'), {
      wrapper: withFormWrapper<z.infer<typeof schema>>({ defaultValues: {} }),
    });

    expect(result.current).toBe(10);
  });
});
