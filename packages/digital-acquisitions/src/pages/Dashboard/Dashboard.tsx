import React, { useLayoutEffect, useRef, useState } from 'react';

import { GetLeadsOutput, Header, OnlineStatusProvider, QueryServiceContext, type RowKeyType, useSectionStatus } from '@fmg/ui';

import { PageContext } from '../../context/PageContext';
import { AppointmentList } from '../../panels/AppointmentList/AppointmentList';
import { JobList } from '../../panels/JobList/JobList';
import { Job } from '../Job/Job';
import { leads } from 'mock-data';

export type DashboardProps = {
  sizeAppts: number;
  delayJobList?: number;
  delayAppointmentList?: number;
};
export function Dashboard({ sizeAppts, delayAppointmentList, delayJobList }: DashboardProps) {
  const { setSelectedSectionId } = useSectionStatus();
  const [jobId, setJobId] = useState<unknown>();
  const jobIdRef = useRef<unknown>();

  const [isLoadingAppts, setIsLoadingAppts] = useState(true);

  const getLeads = () =>
    ({
      data: leads.slice(0, sizeAppts).map(({ postCode, postalZip, ...res }: Record<string, string>) => {
        const other = Object.keys(res).reduce((acc, key) => ({ ...acc, [key]: res[key as keyof typeof res] ?? '' }), {});
        return { ...res, ...other, postcode: postalZip || postCode || '' };
      }) as GetLeadsOutput,
      isSuccess: true,
      isLoading: isLoadingAppts,
    }) as never; // To fix with real router

  useLayoutEffect(() => {
    if (delayAppointmentList) {
      setIsLoadingAppts(true);
    }
    const timer = setTimeout(() => {
      setIsLoadingAppts(false);
    }, delayAppointmentList);
    return () => clearTimeout(timer);
  }, [delayAppointmentList]);

  useLayoutEffect(() => {
    if (jobIdRef.current !== jobId || !jobIdRef.current) {
      setSelectedSectionId('summary');
      jobIdRef.current = jobId;
    }
  }, [jobId, setSelectedSectionId]);

  // TODO: replace with real router
  if (jobId) {
    // eslint-disable-next-line
    // @ts-ignore
    window.scrollTo(0, 0);
    return <Job jobId={jobId as RowKeyType} />;
  }

  const createJob = () => {
    // eslint-disable-next-line no-console
    console.log(`New application launch triggered`);
  };

  return (
    <>
      <OnlineStatusProvider>
        <QueryServiceContext.Provider
          value={{ getLeads, lookupAddresses: () => Promise.resolve([]), getAddressDetail: () => Promise.resolve({}) }}
        >
          {/* TODO: to be replaced with diga component to read real data */}
          <Header headerType="acquisition" accountName="John Collins" primaryContact="Sophie Collins" />

          <PageContext.Provider value={{ heights: ['min-h-[calc(100vh-96px)]', 'min-h-[calc(100vh-72px)]'] }}>
            <div className="md:mx-15 mb-4.5 animate-slideUpEnter mx-12 xl:mx-auto">
              <AppointmentList createJob={createJob} />
              <JobList openJob={setJobId} delay={delayJobList} />
            </div>
          </PageContext.Provider>
        </QueryServiceContext.Provider>
      </OnlineStatusProvider>
    </>
  );
}
