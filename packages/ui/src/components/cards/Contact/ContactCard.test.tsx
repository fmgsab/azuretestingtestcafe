import React from 'react';
import { render, screen } from '../../../test/test-utils';
import { ContactCard, getRoles } from './ContactCard';

describe('Components/Summary Widgets/Contact Summary', () => {
  const contact = {
    accountId: 123456,
    accountName: 'Test account',
    contactSalutation: 'Dr',
    firstName: 'Contact',
    middleName: '',
    lastName: 'One',
    preferredName: null,
    dateOfBirth: '1971-01-01',
    email: 'contact@email.com',
    primaryPhone: '0220123456',
    roleTypes: ['Role One', 'Role Two', 'Role Three'],
  };

  describe('Contact Summary', () => {
    it('renders the card correctly', async () => {
      const props = {
        accountId: contact.accountId,
        accountName: contact.accountName,
        contactSalutation: contact.contactSalutation,
        firstName: contact.firstName,
        middleName: contact.middleName,
        lastName: contact.lastName,
        preferredName: contact.preferredName,
        dateOfBirth: contact.dateOfBirth,
        email: contact.email,
        primaryPhone: contact.primaryPhone,
        roleTypes: contact.roleTypes,
      };
      const { rerender } = render(<ContactCard {...props} />);
      const cards = screen.queryAllByText('Role', { exact: false });
      expect(cards).toHaveLength(3);
      const name = screen.queryAllByText('Dr Contact One');
      expect(name).toHaveLength(1);
      const initials = screen.queryAllByText('CO');
      expect(initials).toHaveLength(1);
      const dateOfBirth = screen.getByTestId('dateOfBirth');
      expect(dateOfBirth).toHaveTextContent('01 January 1971');
      rerender(<ContactCard {...props} dateOfBirth={''} />);
      expect(dateOfBirth.innerHTML).toBe('Born ');
    });

    it('does not show fields if they are not passed', async () => {
      const shortRoles = getRoles(['A', 'B', 'C'], 5);
      expect(shortRoles?.filter(Boolean)).toHaveLength(3);
      const longRoles = getRoles(['A', 'B', 'C', 'D', 'E'], 3);
      expect(longRoles?.filter(Boolean)).toHaveLength(3);
    });
  });
});
