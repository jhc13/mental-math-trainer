import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Script from 'next/script';
import { useState } from 'react';
import useSWR from 'swr';
import MenuSidebar from 'components/MenuSidebar';
import SettingsSidebar from 'components/SettingsSidebar';
import Logo from 'public/logo.svg';

export default function Layout({ children }) {
  const [topSidebar, setTopSidebar] = useState(null);
  const { data: session } = useSession();
  const { data, mutate: mutateDisplayName } = useSWR(
    session ? `/api/users/${session.user.id}/displayName` : null
  );
  const displayName = data?.displayName;

  return (
    <>
      <Script
        type='module'
        src='https://static.cloudflareinsights.com/beacon.min.js'
        data-cf-beacon='{"token": "b0b224c7404344d88bb0d9de1adbb379"}'
      />
      {/* Use overflow-x-hidden to prevent the scrollbar from showing up when
        the right sidebar is opened or closed. */}
      <div className='fixed inset-0 flex flex-col overflow-y-auto overflow-x-hidden bg-zinc-800 text-zinc-100'>
        <header className='fixed inset-x-0 top-0 z-10 flex h-12 justify-center bg-gray-800 px-2'>
          <Link
            href='/'
            aria-label='Home'
            className='flex select-none items-center gap-4 justify-self-center'
          >
            <Logo className='h-9 w-9 fill-sky-500 stroke-sky-500' />
            <div className='hidden text-xl font-medium sm:block'>
              Mental Math Trainer
            </div>
          </Link>
        </header>
        <MenuSidebar
          topSidebar={topSidebar}
          onClick={() => {
            setTopSidebar('MENU');
          }}
          displayName={displayName}
          mutateDisplayName={mutateDisplayName}
        />
        <SettingsSidebar
          onClick={() => {
            setTopSidebar('SETTINGS');
          }}
        />
        <main className='isolate mx-auto mt-12 flex w-full max-w-screen-md flex-auto flex-col'>
          {children}
        </main>
      </div>
    </>
  );
}
