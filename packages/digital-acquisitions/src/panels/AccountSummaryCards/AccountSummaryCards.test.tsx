import React from 'react';

import { accounts } from 'mock-data';
import { stringToKebab } from '@fmg/utils';
import { render, screen } from '@fmg/ui/src/test/test-utils';
import { AccountSummaryCards, GenericProps } from './AccountSummaryCards';
import { AccountSummary } from './types';

const account = new AccountSummary(accounts[0]);
const rowLabels = account.rowLabels;
const cardTitles = account.cardTitles;

const goodProps: GenericProps = {
  rowLabels,
  cardTitles,
  payload: accounts,
  accountId: 1,
};

describe('tables/account-summary/AccountSummaryCards', () => {
  it('should render with correct data', async () => {
    render(<AccountSummaryCards {...goodProps} />);

    const testId = 'card-title-' + stringToKebab(goodProps.cardTitles?.accountInformation)!;

    const accountSummaryCards = screen.getByTestId(testId);
    expect(accountSummaryCards).toBeInTheDocument();
  });

  it('should not render with bad account number', async () => {
    const result = render(<AccountSummaryCards payload={accounts} accountId={0} />);
    expect(result.container).toBeEmptyDOMElement();
  });

  it('should render all three cards', async () => {
    render(<AccountSummaryCards payload={accounts} accountId={3} rowLabels={rowLabels} cardTitles={cardTitles} />);

    const testId1 = 'card-title-' + stringToKebab(goodProps.cardTitles?.accountInformation)!;
    const testId2 = 'card-title-' + stringToKebab(goodProps.cardTitles?.referrals)!;
    const testId3 = 'card-title-' + stringToKebab(goodProps.cardTitles?.farmAndBusinessInformation)!;

    expect(screen.getByTestId(testId1)).toBeInTheDocument();
    expect(screen.getByTestId(testId2)).toBeInTheDocument();
    expect(screen.getByTestId(testId3)).toBeInTheDocument();
  });
});
