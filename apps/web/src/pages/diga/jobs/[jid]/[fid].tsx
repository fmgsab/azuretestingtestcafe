import React from 'react';
import dynamic from 'next/dynamic';
import classnames from 'classnames';
import { useRouter } from 'next/router';

import { Header, OnlineStatusProvider, Snackbar, QueryServiceContext } from '@fmg/ui';
import { Workspace, PageContext, Navigation } from '@fmg/diga';
import { useAddressLookupQuery, useAddressDetailQuery, useVehicleInfoLookupQuery } from '../../../../hooks';
import { useSession } from 'next-auth/react';

export function Page() {
  const { status } = useSession();
  const [lookupAddresses] = useAddressLookupQuery();
  const [lookupVehicleInfo] = useVehicleInfoLookupQuery();
  const [getAddressDetail] = useAddressDetailQuery();
  const getLeads = () => ({}) as never;

  const router = useRouter();
  const jobId = router.query.jid ?? '';

  if (!jobId) return null;

  if (status === 'unauthenticated') {
    router.push('/').then();
  }

  const push = (id: string) => {
    router.push(`/diga/jobs/${jobId}/${id}`).then();
  };

  const replace = (id: string) => {
    router.replace(`/diga/jobs/${jobId}/${id}`).then();
  };

  const returnHome = () => {
    router.push('/diga/dashboard').then();
  };

  return (
    <>
      <OnlineStatusProvider>
        <QueryServiceContext.Provider value={{ lookupAddresses, getAddressDetail, lookupVehicleInfo, getLeads }}>
          {/* TODO: to be replaced with diga component to read real data */}
          <Header headerType="newApplication" accountName="John Collins" primaryContact="Sophie Collins" returnHome={returnHome} />

          <PageContext.Provider value={{ heights: ['h-[calc(100vh-96px)]', 'h-[calc(100vh-72px)]'] }}>
            <div className={classnames('animate-slideUpEnter flex overflow-y-auto', 'md:grid md:grid-cols-[402px_auto]')}>
              <Navigation push={push} replace={replace} fid={router.query.fid} jobId={jobId} returnHome={returnHome} />
              <Workspace className={classnames('absolute z-0 md:static')} />
            </div>
            <Snackbar />
          </PageContext.Provider>
        </QueryServiceContext.Provider>
      </OnlineStatusProvider>
    </>
  );
}

export default dynamic(() => Promise.resolve(Page), { ssr: false });
