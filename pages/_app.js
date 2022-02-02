import Head from 'next/head';
import { SettingsProvider } from 'utils/settings';
import Layout from 'components/Layout';
import 'styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Mental Math Trainer</title>
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
        <link rel='manifest' href='/site.webmanifest' />
        <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#0ea5e9' />
        <meta name='msapplication-TileColor' content='#2d89ef' />
        <meta name='theme-color' content='#1f2937' />
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
