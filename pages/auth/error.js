import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Error() {
  const router = useRouter();
  const { error } = router.query;

  let message;
  if (error === 'Verification') {
    message =
      'The sign-in link is invalid. It may have expired or already been used.';
  } else {
    message = 'An authentication error has occurred.';
  }

  return (
    <>
      <Head>
        <title>Authentication Error – Mental Math Trainer</title>
        <meta
          name='description'
          content='An authentication error has occurred.'
        />
      </Head>
      <div className='mt-8'>
        <h1 className='text-center text-xl font-semibold'>Error</h1>
        <p className='mt-1 text-center text-lg'>{message}</p>
      </div>
    </>
  );
}
