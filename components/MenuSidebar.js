import Link from 'next/link';
import { Fragment, useRef, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import {
  ChartBarIcon,
  LogoutIcon,
  MailIcon,
  MenuIcon,
  TrashIcon
} from '@heroicons/react/outline';
import { Disclosure, Transition } from '@headlessui/react';
import { MAX_DISPLAY_NAME_LENGTH } from 'utils/config';
import ConfirmationDialog from 'components/ConfirmationDialog';
import Logo from 'public/logo.svg';

export default function MenuSidebar({
  topSidebar,
  onClick,
  displayName,
  mutateDisplayName
}) {
  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] =
    useState(false);
  const { data: session } = useSession();
  const focusRef = useRef();

  return (
    <Disclosure as='div' onClick={onClick} className='flex items-center'>
      <Disclosure.Button
        aria-label='Show menu'
        className='fixed top-1.5 left-1.5'
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
        <Disclosure.Panel
          className={`${
            topSidebar === 'MENU' ? 'z-20' : 'z-10'
          } fixed top-12 left-0 bottom-0 w-full select-none overflow-auto scroll-smooth bg-[#202022] px-4 pt-4 pb-32 text-lg sm:max-w-sm`}
        >
          {({ close }) => (
            <div ref={focusRef} className='flex flex-col gap-4'>
              <div className='h-16'>
                {session ? (
                  <div className='flex flex-col gap-0.5'>
                    <div className='text-center text-base'>Signed in as</div>
                    <DisplayName
                      displayName={displayName}
                      mutateDisplayName={mutateDisplayName}
                      userId={session.user.id}
                    />
                  </div>
                ) : (
                  <div className='flex flex-col gap-1'>
                    <div className='text-center text-base'>Not signed in</div>
                    <Link
                      href='/auth/sign-in'
                      onClick={() => close(focusRef)}
                      className='self-center rounded-md bg-cyan-800 px-3 py-1 active:brightness-[0.85]'
                    >
                      Sign in
                    </Link>
                  </div>
                )}
              </div>
              <Divider />
              <Link
                href='/'
                onClick={() => close(focusRef)}
                className='flex items-center gap-3'
              >
                <Logo className='h-6 w-6 fill-sky-600 stroke-sky-600' />
                Trainer
              </Link>
              <Link
                href='/stats'
                onClick={() => close(focusRef)}
                className='flex items-center gap-3'
              >
                <ChartBarIcon className='h-6 w-6 text-sky-600' />
                Stats
              </Link>
              <Divider />
              <a
                href='mailto:dev@mathtrainer.xyz'
                className='flex items-center gap-3'
              >
                <MailIcon className='h-6 w-6 text-sky-600' />
                Contact
              </a>
              {session && (
                <>
                  <button
                    onClick={() => signOut({ redirect: false })}
                    className='flex w-fit items-center gap-3'
                  >
                    <LogoutIcon className='h-6 w-6 translate-y-px text-red-800' />
                    Sign out
                  </button>
                  <button
                    onClick={() => {
                      setIsDeleteAccountDialogOpen(true);
                    }}
                    className='flex w-fit items-center gap-3'
                  >
                    <TrashIcon className='h-6 w-6 -translate-x-px translate-y-px text-red-800' />
                    Delete account
                  </button>
                  <ConfirmationDialog
                    isOpen={isDeleteAccountDialogOpen}
                    setIsOpen={setIsDeleteAccountDialogOpen}
                    title='Delete account'
                    description='Are you sure you want to permanently delete your account and all of your data? This action cannot be undone.'
                    action='Delete account'
                    onAction={async () => {
                      await fetch(`/api/users/${session.user.id}`, {
                        method: 'DELETE'
                      });
                      await signOut({ redirect: false });
                    }}
                  />
                </>
              )}
            </div>
          )}
        </Disclosure.Panel>
      </Transition>
    </Disclosure>
  );
}

function DisplayName({ displayName, mutateDisplayName, userId }) {
  return (
    <input
      maxLength={MAX_DISPLAY_NAME_LENGTH}
      spellCheck={false}
      value={displayName === undefined ? '...' : displayName}
      onChange={async (event) => {
        if (displayName === undefined) {
          return;
        }
        await mutateDisplayName(
          {
            displayName: event.target.value
          },
          false
        );
      }}
      onBlur={async (event) => {
        if (displayName === undefined) {
          return;
        }
        await fetch(`/api/users/${userId}/displayName`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ displayName: event.target.value })
        });
        await mutateDisplayName();
      }}
      className='rounded bg-[#202022] py-1 text-center text-xl font-medium hover:bg-zinc-800 focus:bg-zinc-800'
    />
  );
}

function Divider() {
  return <div role='separator' className='h-px bg-zinc-400' />;
}
