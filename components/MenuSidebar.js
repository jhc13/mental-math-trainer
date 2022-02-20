import Link from 'next/link';
import { Fragment } from 'react';
import useSWR from 'swr';
import { signOut, useSession } from 'next-auth/react';
import {
  MenuIcon,
  ChartBarIcon,
  LogoutIcon,
  TrashIcon
} from '@heroicons/react/outline';
import { Disclosure, Transition } from '@headlessui/react';
import { MAX_DISPLAY_NAME_LENGTH } from 'utils/config';
import logo from '../public/logo.svg';
import Image from 'next/image';

function DisplayName({ userId }) {
  const { data, mutate } = useSWR(`/api/users/${userId}/displayName`);

  return (
    <input
      maxLength={MAX_DISPLAY_NAME_LENGTH}
      value={data ? data?.displayName : 'Loading...'}
      onChange={async (event) => {
        await mutate(
          {
            displayName: event.target.value
          },
          false
        );
      }}
      onBlur={async (event) => {
        await fetch(`/api/users/${userId}/displayName`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ displayName: event.target.value })
        });
        await mutate();
      }}
      className='rounded bg-[#202022] py-1 text-center font-bold hover:bg-zinc-800 focus:bg-zinc-800'
    />
  );
}

function Divider() {
  return <div className='h-px bg-zinc-400' />;
}

export default function MenuSidebar() {
  const { data: session } = useSession();

  return (
    <Disclosure as='div' className='flex items-center'>
      <Disclosure.Button
        aria-label='Show menu'
        className='focus:outline-none focus-visible:outline-1 focus-visible:outline-inherit'
      >
        <MenuIcon className='h-9 w-9 text-zinc-300' />
      </Disclosure.Button>
      <Transition
        as={Fragment}
        enter='transition-transform duration-500 ease-in-out'
        enterFrom='-translate-x-full'
        enterTo='translate-x-0'
        leave='transition-transform duration-500 ease-in-out'
        leaveFrom='translate-x-0'
        leaveTo='-translate-x-full'
      >
        <Disclosure.Panel className='absolute top-12 left-0 bottom-0 z-20 w-full select-none overflow-auto scroll-smooth bg-[#202022] px-4 pt-4 pb-32 text-lg sm:max-w-sm'>
          {({ close }) => (
            <div className='flex flex-col gap-4'>
              {session ? (
                <div className='flex flex-col gap-0.5'>
                  <div className='text-center text-base'>Signed in as</div>
                  <DisplayName userId={session.user.id} />
                </div>
              ) : (
                <div className='flex flex-col gap-2'>
                  <div className='text-center text-base'>Not signed in</div>
                  <Link href='/auth/sign-in'>
                    <a
                      onClick={close}
                      className='self-center rounded-md bg-cyan-800 px-3 py-1 active:brightness-[0.85]'
                    >
                      Sign in
                    </a>
                  </Link>
                </div>
              )}
              <Divider />
              <Link href='/'>
                <a onClick={close} className='flex items-center gap-3'>
                  <Image
                    src={logo}
                    alt=''
                    width={24}
                    height={24}
                    fill={'red'}
                  />
                  Solve
                </a>
              </Link>
              <Link href='/stats'>
                <a onClick={close} className='flex items-center gap-3'>
                  <ChartBarIcon className='h-6 w-6 text-zinc-300' />
                  Stats
                </a>
              </Link>
              {session && (
                <>
                  <Divider />
                  <button
                    onClick={() => signOut({ redirect: false })}
                    className='flex w-fit items-center gap-3'
                  >
                    <LogoutIcon className='h-6 w-6 text-zinc-300' />
                    Sign out
                  </button>
                  <button
                    onClick={() => {}}
                    className='flex w-fit items-center gap-3'
                  >
                    <TrashIcon className='h-6 w-6 -translate-x-[2px] text-zinc-300' />
                    Delete account
                  </button>
                </>
              )}
            </div>
          )}
        </Disclosure.Panel>
      </Transition>
    </Disclosure>
  );
}
