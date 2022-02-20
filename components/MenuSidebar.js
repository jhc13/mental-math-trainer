import Link from 'next/link';
import { Fragment } from 'react';
import useSWR from 'swr';
import { signOut, useSession } from 'next-auth/react';
import { MenuIcon } from '@heroicons/react/outline';
import { Disclosure, Transition } from '@headlessui/react';

function DisplayName({ userId }) {
  const { data, mutate } = useSWR(`/api/users/${userId}/displayName`);

  return (
    <input
      value={data ? data?.displayName : 'Loading...'}
      onChange={async (event) => {
        const newDisplayName = event.target.value;
        await mutate(
          {
            displayName: newDisplayName
          },
          false
        );
        await fetch(`/api/users/${userId}/displayName`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ displayName: event.target.value })
        });
        await mutate();
      }}
      className='rounded bg-[#202022] text-center hover:bg-zinc-800 focus:bg-zinc-800'
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
        <MenuIcon className='h-9 w-9 text-gray-300' />
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
                <div className='flex flex-col gap-1'>
                  <div className='text-center'>Signed in as</div>
                  <DisplayName userId={session.user.id} />
                </div>
              ) : (
                <Link href='/auth/sign-in'>
                  <a
                    onClick={close}
                    className='self-center rounded-md bg-cyan-800 px-2.5 py-1 active:brightness-[0.85]'
                  >
                    Sign in
                  </a>
                </Link>
              )}
              <Divider />
              {session && (
                <>
                  <Divider />
                  <button
                    onClick={() => signOut({ redirect: false })}
                    className='w-fit text-left'
                  >
                    Sign out
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
