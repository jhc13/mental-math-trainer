import Head from 'next/head';

export default function PageNotFound() {
  return (
    <>
      <Head>
        <title>Page Not Found – Mental Math Trainer</title>
        <meta name='description' content='The requested page was not found.' />
      </Head>
      <div className='mt-8'>
        <h1 className='text-center text-xl font-semibold'>404</h1>
        <p className='mt-1 text-center text-lg'>Page not found</p>
      </div>
    </>
  );
}
