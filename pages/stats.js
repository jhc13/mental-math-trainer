import Head from 'next/head';
import useSWR from 'swr';
import { getSession, useSession } from 'next-auth/react';

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: `/auth/sign-in?callbackUrl=${context.resolvedUrl}`,
        permanent: false
      }
    };
  }
  return {
    props: {
      session
    }
  };
}

export default function Stats() {
  const { data: session } = useSession();
  const { data } = useSWR(`/api/users/${session.user.id}/stats`);

  return (
    <>
      <Head>
        <title>Stats – Mental Math Trainer</title>
        <meta
          name='description'
          content='View your stats, personal records and improvement over time.'
        />
      </Head>
      <div className='mt-8'>
        <h1 className='text-center text-xl font-semibold'>Stats</h1>
      </div>
    </>
  );
}
