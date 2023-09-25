import { db } from 'models';
import { render, screen, withFormWrapper, renderHook, act } from '@fmg/ui/src/test/test-utils';

import { useAddressList, AddressSelect } from './AddressSelect';

describe('fields/AddressSelect', () => {
  const results = [
    { fullAddress: 'Physical address, test city, 12345', sourceDesc: 'Physical' },
    { fullAddress: 'Postal/Physical address, test city, 12345', sourceDesc: 'Postal/Physical' },
    { fullAddress: 'Postal address, test city, 12345', sourceDesc: 'Postal' },
  ];

  const formatted = results.map(({ fullAddress }) => ({ label: fullAddress, value: fullAddress }));

  describe('useAddressList', () => {
    it.each`
      mode          | expected
      ${'physical'} | ${formatted.slice(0, 2)}
      ${undefined}  | ${formatted}
    `('should return correct results $expected', async ({ mode, expected }) => {
      await db.location.clear();
      await db.location.bulkPut(results);
      const { result, rerender } = await act(async () => await renderHook(() => useAddressList({ name: 'location', mode })));
      await act(() => rerender());
      expect(result.current).toEqual(expected);
    });
  });

  describe('<AddressSelect/>', () => {
    it('should render $label correctly', async () => {
      const wrapper = withFormWrapper({ defaultValues: {} });
      render(<AddressSelect name="location" question="Address" />, { wrapper });
      expect(screen.queryByRole('combobox')).toBeInTheDocument();
    });
  });
});
