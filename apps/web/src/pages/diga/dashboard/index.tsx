import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { Header, OnlineStatusProvider, QueryServiceContext } from '@fmg/ui';
import logger from '@fmg/logger';

import { AppointmentList, JobList, PageContext } from '@fmg/diga';
import {
  type GetLeadsQueryOutput,
  useAddressDetailQuery,
  useAddressLookupQuery,
  useGetLeadsQuery,
  useVehicleInfoLookupQuery,
} from '../../../hooks';
import { UseTRPCQueryResult } from '@trpc/react-query/shared';
import { useSession } from 'next-auth/react';

export function Dashboard() {
  const { status } = useSession();
  const router = useRouter();
  // TODO: EmployeeId should be replaced with real id
  const leadsQueryResult: UseTRPCQueryResult<GetLeadsQueryOutput, unknown> = useGetLeadsQuery()('a67958d7-9daa-ea11-a812-000d3ad1f9f4');
  const getLeads = () => leadsQueryResult;
  const [lookupAddresses] = useAddressLookupQuery();
  const [getAddressDetail] = useAddressDetailQuery();
  const [lookupVehicleInfo] = useVehicleInfoLookupQuery();
  const [jobId, setJobId] = useState<unknown>();

  if (status === 'unauthenticated') {
    router.push('/').then();
  }

  if (jobId) {
    router.push(`/diga/jobs/${jobId}/summary`).then();
  }

  const createJob = () => {
    logger.info(`New application launch triggered`);
  };

  return (
    <>
      <OnlineStatusProvider>
        <QueryServiceContext.Provider value={{ lookupAddresses, getAddressDetail, lookupVehicleInfo, getLeads }}>
          <Header headerType="acquisition" accountName="John Collins" primaryContact="Sophie Collins" />

          <PageContext.Provider value={{ heights: ['min-h-[calc(100vh-96px)]', 'min-h-[calc(100vh-72px)]'] }}>
            <div className="md:mx-15 mb-4.5 animate-slideUpEnter mx-12 xl:mx-auto">
              <AppointmentList createJob={createJob} />
              <JobList openJob={setJobId} />
            </div>
          </PageContext.Provider>
        </QueryServiceContext.Provider>
      </OnlineStatusProvider>
    </>
  );
}

export default dynamic(() => Promise.resolve(Dashboard), { ssr: false });
