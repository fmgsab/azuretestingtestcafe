import { renderHook, act } from '@fmg/ui/src/test/test-utils';

import { MockDB } from '@fmg/ui/src/test/mock-model';
import * as saveField from '@fmg/ui/src/hooks/useSaveField';
import * as context from '@fmg/ui/src/context/ModelContext';
import { autoFormat, useFieldInfo } from './useFieldInfo';
import { z } from 'zod';

describe('hooks/useFieldInfo', () => {
  const getValue = async (key: string) => {
    const values: Record<string, string> = {
      year: '1996',
      make: 'Mazda',
      model: 'Demio',
      rego: 'FS211',
    };
    return values[key];
  };

  describe('autoFormat', () => {
    it.each`
      sources                                   | expected
      ${['year', 'make', 'model', '-', 'rego']} | ${'1996 Mazda Demio - FS211'}
      ${['', 'make', 'model', '-', 'rego']}     | ${'Mazda Demio - FS211'}
      ${['', 'make', 'model', '-']}             | ${'Mazda Demio'}
      ${['', '', '', '-', 'rego']}              | ${'FS211'}
    `('should return correct value $expected', async ({ sources, expected }) => {
      const formatted = await autoFormat({ sources, getValue });
      expect(formatted).toEqual(expected);
    });

    it('should return correct value $expected', async () => {
      const setValue = vi.fn();
      const target = 'name';
      const formatted = await autoFormat({ sources: ['year', 'make', 'model', '-', 'rego'], getValue, target, setValue });
      expect(setValue).toHaveBeenCalledWith(target, formatted);
    });
  });

  it('should return correct value', async () => {
    const db = new MockDB('TestDB', { car: '++, year, make, model, rego' });
    const table = db.car;
    const modelSpy = vi.spyOn(context, 'useModelContext');
    modelSpy.mockReturnValue({ table, uid: 1, schema: z.object({ year: z.string() }) });
    table.get = vi.fn().mockResolvedValue({ year: '1996', make: 'Mazda', model: 'Demio', rego: 'FS211' });
    const saveFieldFn = vi.fn();
    vi.spyOn(saveField, 'useSaveField').mockReturnValue(saveFieldFn);
    await act(() =>
      renderHook(
        async () =>
          await useFieldInfo({
            sources: ['year', 'make', 'model', '-', 'rego'],
            target: 'name',
          })
      )
    );
    expect(saveFieldFn).toHaveBeenCalledWith({ name: 'name', value: '1996 Mazda Demio - FS211' });
  });
});
