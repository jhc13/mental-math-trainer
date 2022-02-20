import Link from 'next/link';
import { Fragment } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { MenuIcon } from '@heroicons/react/outline';
import { Disclosure, Transition } from '@headlessui/react';

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
                <div className='flex items-center justify-between'>
                  {`Signed in as ${session.user.displayName}`}
                  <button
                    onClick={() => signOut({ redirect: false })}
                    className='rounded-md bg-red-900 px-2.5 py-1 active:brightness-[0.85]'
                  >
                    Sign out
                  </button>
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
            </div>
          )}
        </Disclosure.Panel>
      </Transition>
    </Disclosure>
  );
}
