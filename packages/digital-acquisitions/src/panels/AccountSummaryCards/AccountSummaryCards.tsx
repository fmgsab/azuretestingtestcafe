import React from 'react';

import { stringToKebab } from '@fmg/utils';
import { AccountSummary, CardData, CardTitles, IAccount, CardRow } from './types';
import classnames from 'classnames';
import { Outline } from '@fmg/ui/src/embellishments/Outline/Outline';

export type GenericProps = {
  accountId: number;
  payload: IAccount[];
  result?: IAccount;
  rowLabels?: AccountSummary['rowLabels'];
  cardTitles?: CardTitles;
};

export const AccountSummaryCards = ({ accountId = 1, payload, rowLabels, cardTitles }: GenericProps) => {
  const result = payload?.find((account: IAccount) => account.accountId === accountId);

  if (!result) {
    return null;
  }

  const accountSummary = new AccountSummary(result);

  // using passed in values if defined, otherwise use class defaults
  if (rowLabels) accountSummary.rowLabels = rowLabels;
  if (cardTitles) accountSummary.cardTitles = cardTitles;

  return (
    // TODO: update flex grid container to cater for fixed contents
    <section className={classnames('gap-4.5 grid', 'grid-cols-[repeat(auto-fit,minmax(370px,auto))]')}>
      <AccountSummaryCard data={accountSummary.getAccountInformation()} />
      <AccountSummaryCard data={accountSummary.getFarmAndBusinessInformation()} />
      <AccountSummaryCard data={accountSummary.getReferrals()} />
    </section>
  );
};

const AccountSummaryCard = ({ data }: CardData) => {
  const { title, rows } = data;

  return (
    <Outline data-testid={stringToKebab(`card-${title}`)}>
      <div className="px-4.5 pb-4.5">
        <header data-testid={stringToKebab(`card-title-${title}`)} className="pt-6.75 pb-7.5 truncate text-lg/[24px] font-normal">
          {title}
        </header>
        {rows.length ? (
          <div
            data-testid={stringToKebab(`card-rows-${title}`)}
            className="bg-fmg-gray-50 border-fmg-gray-200 border-top-0 rounded-1.5 border"
          >
            <ul className="divide-y divide-gray-200">
              {rows.map((row, index) => (
                <AccountSummaryRows {...row} key={`${row.label}-${row.value}-${index}`} />
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </Outline>
  );
};

const AccountSummaryRows = (row: CardRow) => {
  return (
    <li className="p-4.5 h-18 max-h-18">
      <p className="text-fmg-green truncate text-base/[20px] font-normal">{row.label}</p>
      <p className="text-text truncate text-base/[20px] font-normal">{row.value}</p>
    </li>
  );
};
