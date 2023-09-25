import { Meta, StoryObj } from '@storybook/react';
import { accounts } from 'mock-data';

import { AccountSummaryCards, GenericProps } from './AccountSummaryCards';
import { AccountSummary } from './types';

const account = new AccountSummary(accounts[0]);
const rowLabels = account.rowLabels;
const cardTitles = account.cardTitles;

const accountNumbers = accounts.map((account: GenericProps) => account.accountId);
accountNumbers.push(9999);

const meta: Meta<typeof AccountSummaryCards> = {
  title: 'diga/Page Panels/Application Summary/Account Summary Cards',
  component: AccountSummaryCards,
  parameters: {
    controls: {
      include: ['accountId', 'cardTitles', 'rowLabels'],
    },
  },
  argTypes: {
    accountId: { options: [...accountNumbers], control: { type: 'select' } },
  },
};

export default meta;

type Story = StoryObj<typeof AccountSummaryCards>;

export const Default: Story = {
  args: {
    accountId: 1,
    cardTitles,
    rowLabels,
    payload: accounts,
  },
};
