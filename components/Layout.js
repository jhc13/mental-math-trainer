import Link from 'next/link';
import { useState } from 'react';
import MenuSidebar from 'components/MenuSidebar';
import SettingsSidebar from 'components/SettingsSidebar';
import Logo from 'public/logo.svg';

export default function Layout({ children }) {
  const [topSidebar, setTopSidebar] = useState(null);

  return (
    <>
      {/* Use overflow-x-hidden to prevent the scrollbar from showing up when
          the right sidebar is opened or closed. */}
      <div className='fixed inset-0 flex flex-col overflow-y-auto overflow-x-hidden bg-zinc-800 text-zinc-100'>
        <header className='grid h-12 grid-cols-[2.25rem_1fr_2.25rem] bg-gray-800 px-2'>
          <MenuSidebar
            topSidebar={topSidebar}
            onClick={() => {
              setTopSidebar('MENU');
            }}
          />
          <Link href='/' passHref>
            <a className='flex select-none items-center gap-4 justify-self-center'>
              <Logo className='h-9 w-9 fill-sky-500 stroke-sky-500' />
              <div className='hidden text-xl font-medium sm:block'>
                Mental Math Trainer
              </div>
            </a>
          </Link>
          <SettingsSidebar
            onClick={() => {
              setTopSidebar('SETTINGS');
            }}
          />
        </header>
        <main className='mx-auto my-3 w-full max-w-screen-md flex-auto px-3'>
          {children}
        </main>
      </div>
    </>
  );
}
