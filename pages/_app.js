import Head from 'next/head';
import { SWRConfig } from 'swr';
import { SessionProvider } from 'next-auth/react';
import { SettingsProvider } from 'utils/settings';
import Layout from 'components/Layout';
import 'styles/globals.css';

export default function App({
  Component,
  pageProps: { session, ...pageProps }
}) {
  return (
    <>
      <Head>
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/favicon-16x16.png'
        />
        <link rel='manifest' href='/manifest.webmanifest' />
        <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#0ea5e9' />
        <meta name='msapplication-TileColor' content='#2d89ef' />
        <meta name='theme-color' content='#1f2937' />
      </Head>
      <SWRConfig
        value={{
          fetcher: (...args) => fetch(...args).then((res) => res.json())
        }}
      >
        <SessionProvider session={session}>
          <SettingsProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SettingsProvider>
        </SessionProvider>
      </SWRConfig>
    </>
  );
}
