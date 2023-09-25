import { renderHook, act } from '../../test/test-utils';
import {
  isPlaceholder,
  isOption,
  isOptions,
  convertToOptions,
  convertToPrimitiveArray,
  useOptions,
  extractValues,
  getLabel,
} from './options-util';

describe('', () => {
  const options = [
    { value: 1, label: 'First' },
    { value: 2, label: 'Second' },
    { value: 3, label: 'Third' },
  ];
  const nonOptions = [1, 2, 3, 4, 5];

  it('should return correct type guard result', async () => {
    const option = { value: 1, label: 'First' };
    expect(isOption(option)).toBeTruthy();

    const nonOption = '';
    expect(isOption(nonOption)).toBeFalsy();
  });

  it('should return correct type guard result', async () => {
    expect(isOptions(options)).toBeTruthy();
    expect(isOptions(nonOptions)).toBeFalsy();
  });

  it('should return whether data is a placeholder', async () => {
    const placeholder = { value: '', label: 'Select...' };
    expect(isPlaceholder(placeholder)).toBeTruthy();

    const option = { value: 1, label: 'First' };
    expect(isPlaceholder(option)).toBeFalsy();
  });

  describe('useFindOption', () => {
    it('should find options array correctly', async () => {
      const { result } = renderHook(() => useOptions(options));

      expect(
        await act(() => {
          return result.current([options[0].value, options[1].value]);
        })
      ).toEqual([options[0], options[1]]);

      expect(
        await act(() => {
          return result.current([options[0], options[1]]);
        })
      ).toEqual([options[0], options[1]]);
    });

    it('should find option object correctly', async () => {
      const { result } = renderHook(() => useOptions(options));

      expect(
        await act(() => {
          return result.current(1);
        })
      ).toEqual([options[0]]);

      expect(
        await act(() => {
          return result.current({ value: 1, label: 'First' });
        })
      ).toEqual([options[0]]);
    });

    it('should return value correctly', async () => {
      const { result } = renderHook(() => useOptions(nonOptions));
      expect(
        await act(() => {
          return result.current(1);
        })
      ).toEqual([nonOptions[0]]);
    });

    it('should return undefined for null selection', async () => {
      const { result } = renderHook(() => useOptions(nonOptions));
      expect(
        await act(() => {
          return result.current(null);
        })
      ).toEqual(undefined);
    });
  });

  describe('convertToOptions', () => {
    it('should convert to OptionProps type format correctly', async () => {
      expect(convertToOptions(nonOptions)).toEqual([
        { id: '0', value: 1, label: '1' },
        { id: '1', value: 2, label: '2' },
        { id: '2', value: 3, label: '3' },
        { id: '3', value: 4, label: '4' },
        { id: '4', value: 5, label: '5' },
      ]);
    });

    it('should return options array when already of type OptionProps', async () => {
      expect(convertToOptions(options)).toEqual(options);
    });

    it('should map extra properties', async () => {
      expect(convertToOptions(options, (option, idx) => ({ isDisabled: idx === 0 || undefined }))).toEqual([
        { ...options[0], isDisabled: true },
        ...options.slice(1),
      ]);
    });
  });

  describe('extractValues', () => {
    it('should values from OptionProps', async () => {
      expect(extractValues(nonOptions)).toEqual(nonOptions);
      expect(extractValues(options)).toEqual([1, 2, 3]);
      expect(extractValues(options[0])).toEqual(options[0].value);
      expect(extractValues(nonOptions[0])).toEqual(nonOptions[0]);
      expect(extractValues([])).toEqual([]);
      expect(extractValues(null)).toBeNull();
      expect(extractValues(undefined)).toBeUndefined();
    });
  });

  describe('getLabel', () => {
    it('should extract the correct label', async () => {
      const dataSource = [
        { value: 'nrv', label: 'Nominated Replacement Value' },
        { value: 'pdv', label: 'Present Day Value' },
        { value: 'full', label: 'Full Replacement Value' },
      ];
      expect(getLabel('nrv', dataSource)).toEqual('Nominated Replacement Value');
    });

    it('should return undefined', async () => {
      const dataSource = [
        { value: 'nrv', label: 'Nominated Replacement Value' },
        { value: 'pdv', label: 'Present Day Value' },
        { value: 'full', label: 'Full Replacement Value' },
      ];
      expect(getLabel('nrv1', dataSource)).toBeUndefined();
    });
  });

  it('should convert to primitive array type correctly', async () => {
    expect(convertToPrimitiveArray(options)).toEqual(['First', 'Second', 'Third']);

    expect(convertToPrimitiveArray(nonOptions)).toEqual(nonOptions);
  });
});
