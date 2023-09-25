import { z } from 'zod';

import { contact, db } from 'models';
import { RowKeyType } from '@fmg/ui';
import { render, screen, withFormWrapper, renderHook, act } from '@fmg/ui/src/test/test-utils';

import { useExtractDrivers, displayDriver, MainDriver } from './MainDriver';

type ContactType = Pick<contact.FormValues, 'firstName' | 'lastName' | 'roles'> & { id: RowKeyType };

describe('fields/MainDriver', () => {
  const results: ContactType[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      roles: ['Driver', 'Account Holder'],
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Doe',
      roles: ['Driver', 'Joint Account Holder'],
    },
    {
      id: 3,
      firstName: 'Bob',
      lastName: 'Doe',
      roles: ['Family Relation'],
    },
  ];

  describe('displayDriver', () => {
    it('should format driver correctly', async () => {
      expect(displayDriver(results[0])).toEqual({ value: '1', label: 'John Doe' });
    });
  });

  describe('useExtractDrivers', () => {
    it('should format driver correctly', async () => {
      await db.contact.bulkPut(results);
      const { result, rerender } = await act(async () => await renderHook(() => useExtractDrivers()));
      await act(() => rerender());
      expect(result.current).toEqual([
        { value: '1', label: 'John Doe' },
        { value: '2', label: 'Jane Doe' },
      ]);
    });
  });

  describe('<MainDriver/>', () => {
    const schema = z.object({ itemSubtype: z.string(), usage: z.string() });
    it.each`
      itemSubtype    | label
      ${'Motorbike'} | ${'Main Rider'}
      ${'Motorhome'} | ${'Main Driver'}
    `('should render $label correctly', async ({ itemSubtype, label }) => {
      const wrapper = withFormWrapper<z.infer<typeof schema>>({ defaultValues: { itemSubtype, usage: 'Private' } });
      render(<MainDriver />, { wrapper });
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });
});
