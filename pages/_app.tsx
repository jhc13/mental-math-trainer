import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SettingsProvider } from 'utils/settings';
import Layout from 'components/Layout';
import 'styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Mental Math Trainer</title>
      </Head>
      <SettingsProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SettingsProvider>
    </>
  );
}

export default MyApp;
