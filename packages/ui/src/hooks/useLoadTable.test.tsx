import { z } from 'zod';
import * as dexieQuery from 'dexie-react-hooks';

import { act, renderHook } from '../test/test-utils';
import { MockDB, schema } from '../test/mock-model';

import { initFormValues, safeResolve, saveDefaultValues, useLoadTable } from './useLoadTable';

describe('useLoadTable', () => {
  const db = new MockDB('TestDB', { friends: '++, name, age' });
  const uid = 1;

  describe('safeResolve', () => {
    it('should return value as is when successful', () => {
      expect(safeResolve(z.string(), 'test')).toEqual('test');
      expect(safeResolve(z.object({ name: z.string() }), { name: 'test' })).toEqual({ name: 'test' });
      expect(safeResolve(z.boolean(), true)).toEqual(true);
      expect(safeResolve(z.number(), 1)).toEqual(1);
    });

    it('should return array when array parse error', () => {
      expect(safeResolve(z.array(z.string()), { 0: 'first', 1: 'second' })).toEqual(['first', 'second']);
    });

    it('should return value as is when no array parse error', () => {
      expect(safeResolve(z.string(), { 0: 'first', 1: 'second' })).toEqual({ 0: 'first', 1: 'second' });
    });
  });

  describe('saveDefaultValues', () => {
    const db = new MockDB('TestDB', { friends: '++id, name, age, isCloseFriend' });
    const uid = 1;
    const defaultValues = { name: 'Test' };
    const table = db.friends;

    afterAll(() => {
      vi.clearAllMocks();
    });

    it('should execute update', async () => {
      table.update = vi.fn().mockResolvedValue(1);
      table.add = vi.fn().mockResolvedValue(1);

      await act(() => saveDefaultValues({ result: { name: 'Test' }, table, uid, defaultValues: { ...defaultValues, age: 15 } }));

      expect(table.update).toHaveBeenCalledWith(1, { name: 'Test', age: 15 });
    });

    it('should not execute operation when existing', async () => {
      table.update = vi.fn().mockResolvedValue(1);
      table.add = vi.fn().mockResolvedValue(1);

      await act(() => saveDefaultValues({ result: defaultValues, table, uid, defaultValues }));

      expect(table.add).not.toHaveBeenCalled();
      expect(table.update).not.toHaveBeenCalled();
    });

    it('should not execute operation', async () => {
      table.update = vi.fn().mockResolvedValue(1);
      table.add = vi.fn().mockResolvedValue(1);

      await act(() => saveDefaultValues({ result: defaultValues, table, uid, defaultValues: undefined }));

      expect(table.add).not.toHaveBeenCalled();
      expect(table.update).not.toHaveBeenCalled();

      await act(() => saveDefaultValues({ result: defaultValues, table: undefined, uid, defaultValues: undefined }));

      expect(table.add).not.toHaveBeenCalled();
      expect(table.update).not.toHaveBeenCalled();

      await act(() => saveDefaultValues({ result: undefined, table, uid, defaultValues: undefined }));

      expect(table.add).not.toHaveBeenCalled();
      expect(table.update).not.toHaveBeenCalled();
    });
  });

  const getForm = ({
    isFieldTouched = false,
    isFormDirty = false,
    isFieldInvalid = false,
    fieldError = {},
  }: {
    isFieldTouched?: boolean;
    isFormDirty?: boolean;
    isFieldInvalid?: boolean;
    fieldError?: Record<string, unknown>;
  }) => {
    const getFieldState = vi.fn().mockReturnValue({ isDirty: true, invalid: isFieldInvalid, isTouched: isFieldTouched, error: fieldError });
    const formState = { isDirty: isFormDirty, errors: {} };
    const clearErrors = vi.fn();
    const setValue = vi.fn();
    const getValues = vi.fn().mockReturnValue([{ name: 'Friend 1' }]);
    return { setValue, getValues, getFieldState, formState, clearErrors };
  };

  describe('initFormValues', () => {
    const table = db.friends;
    table.update = vi.fn().mockResolvedValue(1);
    const model = { table, schema };

    it('should return 0 table records', async () => {
      table.get = vi.fn().mockResolvedValue(undefined);
      table.count = vi.fn().mockResolvedValue(0);
      const form = getForm({});
      // eslint-disable-next-line
      // @ts-ignore
      const actual = await initFormValues({ form, uid, model });
      expect(actual).toEqual({ result: undefined, count: 0, isLoaded: true });
      expect(form.setValue).not.toHaveBeenCalled();
    });

    it('should return n table records', async () => {
      table.get = vi.fn().mockResolvedValue({ name: 'Friend 1', age: 25 });
      table.count = vi.fn().mockResolvedValue(1);
      const form = getForm({});

      // eslint-disable-next-line
      // @ts-ignore
      const actual = await initFormValues({ form, uid, model });
      expect(actual).toEqual({ result: { name: 'Friend 1', age: 25 }, count: 1, isLoaded: true });
      expect(form.setValue).toHaveBeenCalled();
    });

    it('should handle ZodEffects', async () => {
      table.get = vi.fn().mockResolvedValue({ name: 'Friend 1', age: 25 });
      table.count = vi.fn().mockResolvedValue(1);
      const zodEffects = schema.superRefine((args, ctx) => {
        if (args.isCloseFriend) {
          ctx.addIssue({ code: 'custom' });
        }
      });

      const form = getForm({});

      // eslint-disable-next-line
      // @ts-ignore
      const actual = await initFormValues({ form, uid, model: { table, schema: zodEffects } });
      expect(actual).toEqual({ result: { name: 'Friend 1', age: 25 }, count: 1, isLoaded: true });
      expect(form.setValue).toHaveBeenCalled();
    });

    it.each`
      isFieldTouched | fieldError            | isFieldInvalid | calls
      ${true}        | ${[]}                 | ${true}        | ${0}
      ${true}        | ${[]}                 | ${false}       | ${0}
      ${false}       | ${[]}                 | ${false}       | ${0}
      ${true}        | ${{}}                 | ${true}        | ${2}
      ${false}       | ${{ type: 'custom' }} | ${true}        | ${2}
    `('should clear field errors on load', async ({ isFieldTouched, fieldError, isFieldInvalid, calls }) => {
      const form = getForm({ isFieldTouched, fieldError, isFieldInvalid });

      // eslint-disable-next-line
      // @ts-ignore
      const actual = await initFormValues({ form, uid, model });
      expect(actual).toEqual({ result: { name: 'Friend 1', age: 25 }, count: 1, isLoaded: true });
      expect(form.clearErrors).toHaveBeenCalledTimes(calls);
    });

    it('should update form state', async () => {
      const form = getForm({ isFormDirty: true });

      // eslint-disable-next-line
      // @ts-ignore
      const actual = await initFormValues({ form, uid, model });
      expect(actual).toEqual({ result: { name: 'Friend 1', age: 25 }, count: 1, isLoaded: true });
      expect(table.update).toHaveBeenCalled();
    });

    it('should handle ZodDiscriminatedUnion', async () => {
      table.get = vi.fn().mockResolvedValue({ type: 'Horticultural', hasFrostCover: true });
      table.count = vi.fn().mockResolvedValue(1);
      const discUnion = z.discriminatedUnion('type', [
        z.object({ type: z.literal('Commercial'), claimsPrepCosts: z.number().min(10000) }),
        z.object({ type: z.literal('Horticultural'), hasFrostCover: z.boolean() }),
      ]);

      const form = getForm({});

      // eslint-disable-next-line
      // @ts-ignore
      const actual = await initFormValues({ form, uid, model: { table, schema: discUnion }, discriminator: 'type' });
      expect(actual).toEqual({ result: { type: 'Horticultural', hasFrostCover: true }, count: 1, isLoaded: true });
      expect(form.setValue).toHaveBeenCalled();
    });
  });

  it('should return correct result', async () => {
    const form = { setValue: vi.fn() };
    const model = { table: db.friends, schema };

    const useLiveQuerySpy = vi.spyOn(dexieQuery, 'useLiveQuery');
    useLiveQuerySpy.mockReturnValueOnce(undefined);

    // eslint-disable-next-line
    // @ts-ignore
    const { result, rerender } = renderHook(() => useLoadTable({ form, model, uid }));

    expect(useLiveQuerySpy).toHaveBeenCalled();
    expect(result.current).toEqual({});

    const returnValue = { result: { name: 'Friend 1', age: 25 }, count: 1, isLoaded: true };
    useLiveQuerySpy.mockReturnValueOnce(returnValue);

    rerender();

    expect(useLiveQuerySpy).toHaveBeenCalled();
    expect(result.current).toEqual(returnValue);
  });

  it('should return correct result', async () => {
    const form = { setValue: vi.fn() };
    const model = { table: db.friends, schema };

    const useLiveQuerySpy = vi.spyOn(dexieQuery, 'useLiveQuery');
    useLiveQuerySpy.mockReturnValueOnce(undefined);

    // eslint-disable-next-line
    // @ts-ignore
    const { result, rerender } = renderHook(() => useLoadTable({ form, model, uid }));

    expect(useLiveQuerySpy).toHaveBeenCalled();
    expect(result.current).toEqual({});

    const returnValue = { result: { name: 'Friend 1', age: 25 }, count: 1, isLoaded: true };
    useLiveQuerySpy.mockReturnValueOnce(returnValue);

    rerender();

    expect(useLiveQuerySpy).toHaveBeenCalled();
    expect(result.current).toEqual(returnValue);
  });
});
