vi.mock('models/src/data-dictionary/lookup-data.json', () => ({
  default: {
    coverTypes: [
      {
        effectiveDate: '2023-05-23T00:00:00',
        list: ['Comprehensive', 'Third Party, Fire & Theft', 'Third Party Only', 'Fire & Theft', 'Fire Only'],
        itemType: ['vehicle'],
      },
    ],
    models: {
      hyundai: ['Santa Fe', 'Tucson'],
      toyota: ['Corolla', 'Hilux', 'Prius'],
    },
  },
}));

import { renderHook, withFormWrapper } from '@fmg/ui/src/test/test-utils';

import { useConditionalCriteria } from './useConditionalCriteria';

describe('useConditionalCriteria', () => {
  const wrapper = withFormWrapper({ defaultValues: { itemType: 'vehicle' } });

  it('should return correct result for array type', async () => {
    const { result } = renderHook(() => useConditionalCriteria('coverTypes'), {
      wrapper,
    });

    expect(result.current).toEqual({
      defaultValue: undefined,
      extraFieldValues: expect.any(Array),
      fieldValues: ['vehicle', undefined, undefined, undefined],
      fields: ['itemType', 'itemSubtype', 'usage', 'coverType'],
      options: ['Comprehensive', 'Third Party, Fire & Theft', 'Third Party Only', 'Fire & Theft', 'Fire Only'],
      result: ['Comprehensive', 'Third Party, Fire & Theft', 'Third Party Only', 'Fire & Theft', 'Fire Only'],
    });
  });

  it('should return correct default value', async () => {
    const { result } = renderHook(() => useConditionalCriteria('coverTypes', { hasDefault: true }), {
      wrapper,
    });

    expect(result.current.defaultValue).toEqual('Comprehensive');
  });

  it('should return correct result for object type', async () => {
    const { result } = renderHook(() => useConditionalCriteria('models', { fields: undefined }), {
      wrapper,
    });

    expect(result.current).toEqual({
      defaultValue: undefined,
      fieldValues: ['vehicle', undefined, undefined, undefined],
      extraFieldValues: expect.any(Array),
      fields: ['itemType', 'itemSubtype', 'usage', 'coverType'],
      options: [],
      result: { hyundai: ['Santa Fe', 'Tucson'], toyota: ['Corolla', 'Hilux', 'Prius'] },
    });
  });
});
