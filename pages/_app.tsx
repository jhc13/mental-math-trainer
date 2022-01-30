import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SettingsProvider } from 'utils/settings';
import 'styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Mental Math Trainer</title>
      </Head>
      <SettingsProvider>
        <Component {...pageProps} />
      </SettingsProvider>
    </>
  );
}

export default MyApp;
