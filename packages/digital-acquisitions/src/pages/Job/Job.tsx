import React, { useState } from 'react';
import classnames from 'classnames';

import { Header, type RowKeyType, OnlineStatusProvider, Snackbar } from '@fmg/ui';

import { PageContext } from '../../context/PageContext';
import { Navigation } from '../../workspace/nav/Navigation';
import { Workspace } from '../../workspace/Workspace';
import { Dashboard } from '../Dashboard/Dashboard';
import { usePopulateMockData } from './usePopulateMockData';

export type JobProps = {
  jobId: RowKeyType;
  returnHome?: () => void;
};

export function Job({ jobId, returnHome }: JobProps) {
  const [shouldReturnHome, setShouldReturnHome] = useState(false);

  usePopulateMockData();

  // TODO: replace with real router
  if (shouldReturnHome) {
    if (returnHome) {
      returnHome();
      return null;
    }
    return <Dashboard />;
  }

  return (
    <>
      <OnlineStatusProvider>
        {/* TODO: to be replaced with diga component to read real data */}
        <Header
          headerType="newApplication"
          accountName="John Collins"
          primaryContact="Sophie Collins"
          returnHome={() => setShouldReturnHome(true)}
        />

        <PageContext.Provider value={{ heights: ['h-[calc(100vh-96px)]', 'h-[calc(100vh-72px)]'] }}>
          <div className={classnames('animate-slideUpEnter flex overflow-y-auto', 'md:grid md:grid-cols-[402px_auto]')}>
            <Navigation
              push={() => {
                return;
              }}
              replace={() => {
                return;
              }}
              jobId={jobId}
              returnHome={() => setShouldReturnHome(true)}
            />
            <Workspace className={classnames('absolute z-0 md:static')} />
          </div>
          <Snackbar />
        </PageContext.Provider>
      </OnlineStatusProvider>
    </>
  );
}
