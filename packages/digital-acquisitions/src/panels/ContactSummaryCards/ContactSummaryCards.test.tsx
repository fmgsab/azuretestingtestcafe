import React from 'react';
import { render, screen } from '@fmg/ui/src/test/test-utils';
import { ContactSummaryCards } from './ContactSummaryCards';

const contacts = [
  {
    accountId: 123456,
    accountName: 'Test account',
    contactSalutation: 'Dr',
    firstName: 'Contact',
    middleName: '',
    lastName: 'One',
    preferredName: null,
    dateOfBirth: '12th June 1990',
    email: 'contact@email.com',
    primaryPhone: '0220123456',
    roleTypes: ['Role One'],
  },
  {
    accountId: 123456,
    accountName: 'Test account',
    contactSalutation: 'Mr',
    firstName: 'Contact',
    middleName: '',
    lastName: 'Two',
    preferredName: null,
    dateOfBirth: '12th June 1990',
    email: 'contact@email.com',
    primaryPhone: '0220123456',
    roleTypes: ['Role One', 'Role Two', 'Role Three'],
  },
  {
    accountId: 123456,
    accountName: 'Test account',
    contactSalutation: 'Mrs',
    firstName: 'Contact',
    middleName: 'Middle',
    lastName: 'Three',
    preferredName: null,
    dateOfBirth: '12th June 1990',
    email: 'test@email.com',
    primaryPhone: '0220123456',
    roleTypes: ['Role One', 'Role Two', 'Role Three'],
  },
];

describe('Components/Summary Widgets/Contact Summary', () => {
  describe('Contact Summary', () => {
    it('renders the correct amount of cards', async () => {
      render(<ContactSummaryCards data={contacts} />);
      const allCards = screen.queryAllByText('Born', { exact: false });
      expect(allCards).toHaveLength(3);

      const email = contacts[0].email;
      const matchingCards = screen.queryAllByText(email, { exact: false });
      expect(matchingCards).toHaveLength(2);
    });
  });
});
