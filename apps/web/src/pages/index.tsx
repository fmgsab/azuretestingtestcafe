import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import { db } from 'models';
import { Button, Header, OnlineStatusProvider } from '@fmg/ui';
import logger from '@fmg/logger';
import { trpc } from '../utils/trpc';

import { importAzureTablesToIdb } from '../utils/idb';
import { DbTables } from '../types';
import { useAddressLookupQuery, useAddressDetailQuery } from '../hooks';
import { useVehicleInfoLookupQuery } from '../hooks/useVehicleInfoLookupQuery';

function Home() {
  const router = useRouter();
  const { refetch, isRefetching } = trpc.azureTables.getAllTables.useQuery(undefined, { enabled: false });

  const exportToAzureTables = trpc.azureTables.exportToAzureTables.useMutation();
  const [fetchAddresses] = useAddressLookupQuery();
  const [getDetail] = useAddressDetailQuery();
  const [fetchVehicleInfo] = useVehicleInfoLookupQuery();

  const handleExport = async () => {
    try {
      const data = await db.exportDbAddon();
      exportToAzureTables.mutate(data);
    } catch {
      exportToAzureTables.status = 'error';
    }
  };

  const searchAddresses = async () => {
    const result = await fetchAddresses('douglas');
    logger.info({ result }, result?.data?.[0]?.fullAddress);
    const detail = result?.data?.[0]?.uniqueId ? await getDetail(result?.data?.[0]?.uniqueId) : {};
    logger.info({ detail }, detail?.data?.postalLine1);
  };

  const searchVehicle = async () => {
    const result = await fetchVehicleInfo('FHG883');
    logger.info({ result }, result?.data);
  };

  const handleImport = async () => {
    const result = await refetch();
    await importAzureTablesToIdb(result.data as DbTables);
  };

  return (
    <div className="flex flex-col gap-4">
      <OnlineStatusProvider>
        <Header
          headerType="newApplication"
          accountName="John Collins"
          primaryContact="Sophie Collins"
          returnHome={() => router.push('/diga/dashboard')}
        />
      </OnlineStatusProvider>
      <div className="flex justify-end gap-3 p-3">
        <div>
          <p>
            Status: {exportToAzureTables.status} {exportToAzureTables.error?.data?.code}
          </p>
        </div>
        <Button
          color="primary"
          aria-label="label"
          onClick={handleExport}
          disabled={exportToAzureTables.isLoading && !exportToAzureTables.error}
        >
          Export to Azure
        </Button>
        <Button color="primary" aria-label="label" onClick={handleImport} disabled={isRefetching}>
          Import to Idb
        </Button>
        <Button color="primary" aria-label="label" onClick={searchAddresses}>
          Search addresses
        </Button>
        <Button color="primary" aria-label="label" onClick={searchVehicle}>
          Search registration
        </Button>
      </div>
      <div className="my-8">
        <AuthShowcase />
      </div>
    </div>
  );
}

const AuthShowcase: React.FC = () => {
  const { data: sessionData, status } = useSession();

  if (status === 'loading') {
    return <>Loading...</>;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-2x text-center">{sessionData && <span>Logged in as {sessionData.user?.name}</span>}</p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut({ callbackUrl: process.env.NEXTAUTH_URL }) : () => void signIn('azure-ad')}
      >
        {sessionData ? 'Sign out' : 'Sign in'}
      </button>
    </div>
  );
};

export default Home;
