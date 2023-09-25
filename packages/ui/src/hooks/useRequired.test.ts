import { z } from 'zod';

import { renderHook, withFormWrapper } from '../test/test-utils';
import { schema } from '../test/mock-model';
import * as context from '../context/ModelContext';

import { useRequired } from './useRequired';

describe('useRequired', () => {
  it('should return correct value when no model/schema', async () => {
    const schema = z.object({ name: z.string() });

    const useModelContextSpy = vi.spyOn(context, 'useModelContext');
    // eslint-disable-next-line
    // @ts-ignore
    useModelContextSpy.mockReturnValue(undefined);

    const { result } = renderHook(() => useRequired('name'), {
      wrapper: withFormWrapper<z.infer<typeof schema>>({ defaultValues: {} }),
    });

    expect(result.current).toBe(false);
  });

  it.each`
    name                 | required     | expected
    ${'driverLicenseNo'} | ${true}      | ${true}
    ${'driverLicenseNo'} | ${false}     | ${false}
    ${'driverLicenseNo'} | ${undefined} | ${false}
    ${'name'}            | ${undefined} | ${true}
    ${'nonexistent'}     | ${undefined} | ${false}
    ${'nested'}          | ${undefined} | ${true}
    ${'nestedOptional'}  | ${undefined} | ${false}
    ${'email'}           | ${undefined} | ${true}
  `('should return correct result for $name field when required=$required', async ({ name, required, expected }) => {
    const model = {
      schema: schema.merge(
        z.object({
          nested: z.object({ child1: z.string(), child2: z.string() }),
          nestedOptional: z.object({ child1: z.string().optional(), child2: z.string().optional() }),
        })
      ),
      uid: 0,
    };

    const useModelContextSpy = vi.spyOn(context, 'useModelContext');
    useModelContextSpy.mockReturnValue(model);

    const { result } = renderHook(() => useRequired(name, required), {
      wrapper: withFormWrapper<z.infer<typeof schema>>({ defaultValues: { age: 16 } }),
    });

    expect(useModelContextSpy).toHaveBeenCalled();
    expect(result.current).toBe(expected);
  });

  it.each`
    age   | expected
    ${16} | ${false}
    ${18} | ${true}
  `('should evaluate required correctly when age=$age', async ({ age, expected }) => {
    const model = { schema, uid: 0 };

    const useModelContextSpy = vi.spyOn(context, 'useModelContext');
    useModelContextSpy.mockReturnValue(model);

    const { result } = renderHook(() => useRequired('driverLicenseNo', 'deferred'), {
      wrapper: withFormWrapper<z.infer<typeof schema>>({ defaultValues: { age } }),
    });

    expect(useModelContextSpy).toHaveBeenCalled();
    expect(result.current).toBe(expected);
  });

  it('should evaluate required correctly for ZodEffects', async () => {
    const model = {
      schema: schema.superRefine((args, ctx) => {
        if (args.isCloseFriend) {
          ctx.addIssue({ code: 'custom', message: 'Required', path: ['email'] });
        }
      }),
      uid: 0,
    };

    const useModelContextSpy = vi.spyOn(context, 'useModelContext');
    useModelContextSpy.mockReturnValue(model);

    const { result } = renderHook(() => useRequired('email', 'deferred'), {
      wrapper: withFormWrapper<z.infer<typeof schema>>({ defaultValues: { name: 'Person 1', age: 20, isCloseFriend: true } }),
    });

    expect(useModelContextSpy).toHaveBeenCalled();
    expect(result.current).toBe(true);
  });
});
