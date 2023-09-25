import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames';

import { dd, db } from 'models';
import { useSectionStatus } from '@fmg/ui';
import { accounts, contacts } from 'mock-data';
import { AccountSummaryCards } from '../AccountSummaryCards/AccountSummaryCards';
import { AccountSummary } from '../AccountSummaryCards/types';
import { ContactSummaryCards } from '../ContactSummaryCards/ContactSummaryCards';
import { ItemDetailsPanel, ItemSummaryPanelProps } from '../ItemDetailsPanel/ItemDetailsPanel';

export function ApplicationSummary() {
  const { jobId } = useSectionStatus();
  const [loaded, setLoaded] = useState(false);
  const [tableList, setTableList] = useState<ItemSummaryPanelProps['tableList']>({});
  const [keyInfo, setKeyInfo] = useState<object>({});

  const getTableList = useCallback(async () => {
    return dd
      .get('itemTypes')()
      .reduce(
        async (acc: Promise<ItemSummaryPanelProps['tableList']>, { value: tblName, label: heading }: { value: string; label: string }) => {
          const out = await acc;
          const table = await db.table(tblName);
          const count = await table.where({ jobId }).count();
          return count ? { ...out, [tblName]: { table, heading } } : out;
        },
        Promise.resolve({})
      ) as Promise<ItemSummaryPanelProps['tableList']>;
  }, [jobId]);

  const getKeyInfo = useCallback(async () => {
    return db.table('keyInfo').where({ jobId }).toArray();
  }, [jobId]);

  useEffect(() => {
    getKeyInfo().then((result) => {
      setKeyInfo(result.at(0));
    });
    getTableList().then((result) => {
      setLoaded(true);
      setTableList(result);
    });
  }, [getKeyInfo, getTableList]);

  const account = new AccountSummary(accounts[0]);
  const rowLabels = account.rowLabels;
  const cardTitles = account.cardTitles;

  const accountSummaryProps = {
    accountId: 1,
    cardTitles,
    rowLabels,
    payload: [...accounts.slice(1), { ...accounts.at(0), ...keyInfo, accountId: 1 }],
  };

  const contactSummaryProps = {
    data: contacts,
  };

  const itemSummaryProps = {
    tableList,
    jobId,
    canEdit: true,
    showEmptyTable: false,
    labels: {
      description: 'Description',
      coverType: 'Cover Type',
      sumInsured: 'Sum Insured',
      excess: 'Excess',
      action: 'Action',
    },
  };

  return (
    <>
      <header className={classnames('border-b-fmg-gray-200 border-b-1 p-4.5 mb-7.5 border-b text-center text-xl')}>
        Application Summary
      </header>
      <section className={classnames('p-4.5 mx-auto grid max-w-[1278px] gap-y-12')}>
        <div className={classnames('gap-y-4.5 grid')}>
          <h1 className={classnames('h-10.5  flex items-center justify-between text-lg')}>Account Summary</h1>
          {/* eslint-disable-next-line*/}
          {/*@ts-ignore*/}
          <AccountSummaryCards {...accountSummaryProps} />
        </div>
        <div className={classnames('gap-y-4.5 grid')}>
          <h1 className={classnames('h-10.5 flex items-center justify-between text-lg')}>Contact Summary</h1>
          <ContactSummaryCards {...contactSummaryProps} />
        </div>
        {loaded ? <ItemDetailsPanel {...itemSummaryProps} /> : <>Loading...</>}
      </section>
    </>
  );
}
