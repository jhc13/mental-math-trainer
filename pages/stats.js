import { useRouter } from 'next/router';
import Head from 'next/head';
import useSWR from 'swr';
import { getSession, useSession } from 'next-auth/react';
import { formatCentiseconds } from '/utils/format';

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
  const { data } = useSWR(
    session ? `/api/users/${session.user.id}/stats` : null
  );
  const router = useRouter();

  if (!session) {
    router.reload();
    return null;
  }

  return (
    <>
      <Head>
        <title>Stats – Mental Math Trainer</title>
        <meta
          name='description'
          content='View your stats, personal records and improvement over time.'
        />
      </Head>
      <div className='mt-8 flex flex-col gap-4'>
        <h1 className='text-center text-2xl font-semibold'>Stats</h1>
        <div className='grid justify-center gap-y-4 sm:grid-cols-2 sm:justify-items-center'>
          <div>
            <h2 className='text-lg font-medium'>
              Total number of problems solved
            </h2>
            <div className='text-3xl font-medium'>
              {data ? data._count : '...'}
            </div>
          </div>
          <div>
            <h2 className='text-lg font-medium'>Total time spent solving</h2>
            <div className='text-3xl font-medium'>
              {data ? formatCentiseconds(data._sum.centiseconds) : '...'}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
