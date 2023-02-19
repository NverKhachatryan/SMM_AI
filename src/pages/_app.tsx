/* eslint-disable simple-import-sort/imports */
/* eslint-disable import/no-extraneous-dependencies */
import { ThemeProvider } from 'next-themes';

import '../styles/global.css';

import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <SessionProvider session={pageProps.session}>
    <ThemeProvider attribute="class">
      <Component {...pageProps} />
    </ThemeProvider>
  </SessionProvider>
);

export default MyApp;
