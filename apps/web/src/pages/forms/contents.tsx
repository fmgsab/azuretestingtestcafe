import Link from 'next/link';
import { Header } from '@fmg/ui';
import { OnlineStatusProvider } from '@fmg/ui/src/hooks/useOnlineStatus';
import { Navbar } from 'react-daisyui';
import { FormContent } from '@fmg/forms/src/FormContent/FormContent';
import { db } from 'models';
import { useEffect, useState } from 'react';

export default function ClientInfo() {
  const [hasLocations, setHasLocations] = useState(false);

  const addLocations = async () => {
    const count = await db.location.count();

    if (count) return;

    await db.location.add({
      fullAddress: '1234 Main St, Anytown, USA',
      uniqueId: 11111,
      id: '123',
      jobId: '456',
      sourceDesc: 'Physical',
    });
  };

  useEffect(() => {
    if (!hasLocations) addLocations().then(() => setHasLocations(true));
  }, []);

  return (
    <div>
      <OnlineStatusProvider>
        <Header headerType="newApplication" accountName="John Collins" primaryContact="Sophie Collins" />
      </OnlineStatusProvider>
      <div className="mx-4 my-5">
        <div className="flex flex-col gap-8">
          <div className="component-preview flex w-full items-center justify-center gap-2 p-4">
            <Navbar className="tabs">
              <Link href="/forms/clientInfo" className="tab tab-bordered">
                Client information
              </Link>
              <Link href="/forms/dwellingInfo" className="tab tab-bordered">
                Dwelling information
              </Link>
              <Link href="/forms/farmInfo" className="tab tab-bordered">
                Farm information
              </Link>
              <Link href="/forms/contents" className="tab tab-bordered tab-active">
                Household Contents
              </Link>
            </Navbar>
          </div>
        </div>
        <FormContent uid={'123'} />
      </div>
    </div>
  );
}
