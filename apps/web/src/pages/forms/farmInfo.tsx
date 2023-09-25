import React from 'react';
import Link from 'next/link';
import { Header } from '@fmg/ui';
import { OnlineStatusProvider } from '@fmg/ui/src/hooks/useOnlineStatus';
import { FarmInfoForm } from '@fmg/forms';
import { Navbar } from 'react-daisyui';

export default function FarmInfo() {
  return (
    <div>
      <OnlineStatusProvider>
        <Header headerType="newApplication" accountName="John Collins" primaryContact="Sophie Collins" />
      </OnlineStatusProvider>
      <div className="mx-4 my-5">
        <div className="flex flex-col gap-8">
          <div className="component-preview flex w-full items-center justify-center gap-2 p-4">
            <Navbar className="tabs">
              <Link href="/forms/clientInfo" className="tab tab-bordered tab-active">
                Client information
              </Link>
              <Link href="/forms/dwellingInfo" className="tab tab-bordered">
                Dwelling information
              </Link>
              <Link href="/forms/farmInfo" className="tab tab-bordered">
                Farm information
              </Link>
              <Link href="/forms/contents" className="tab tab-bordered">
                Household Contents
              </Link>
            </Navbar>
          </div>
        </div>
        <FarmInfoForm />
      </div>
    </div>
  );
}
