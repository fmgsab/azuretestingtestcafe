import type { AppProps } from 'next/app';
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import type { AppType } from 'next/app';
import { trpc } from '../utils/trpc';

import '../styles/globals.css';
import '@fmg/ui/src/styles.css';

const App: AppType = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};
export default trpc.withTRPC(App);
