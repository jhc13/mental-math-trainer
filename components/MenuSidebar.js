import Link from 'next/link';
import { Fragment, useRef, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import {
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  ChartBarIcon,
  EnvelopeIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Transition
} from '@headlessui/react';
import { MAX_DISPLAY_NAME_LENGTH } from 'utils/config';
import ConfirmationDialog from 'components/ConfirmationDialog';
import Logo from 'public/logo.svg';
import { MarkGithubIcon } from '@primer/octicons-react';

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
      <DisclosureButton
        aria-label='Show menu'
        className='fixed left-1.5 top-1.5'
      >
        <Bars3Icon className='h-9 w-9 text-zinc-300' />
      </DisclosureButton>
      <Transition
        as={Fragment}
        enter='transition-transform duration-500 ease-in-out'
        enterFrom='-translate-x-full'
        enterTo='translate-x-0'
        leave='transition-transform duration-500 ease-in-out'
        leaveFrom='translate-x-0'
        leaveTo='-translate-x-full'
      >
        <DisclosurePanel
          className={`${
            topSidebar === 'MENU' ? 'z-20' : 'z-10'
          } fixed bottom-0 left-0 top-12 w-full select-none overflow-auto scroll-smooth bg-[#202022] px-4 pb-32 pt-4 text-lg sm:max-w-sm`}
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
              {session && (
                <>
                  <button
                    onClick={() => signOut({ redirect: false })}
                    className='flex w-fit items-center gap-3'
                  >
                    <ArrowRightStartOnRectangleIcon className='h-6 w-6 translate-y-px text-red-800' />
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
              <Divider />
              <a
                href='https://github.com/jhc13/mental-math-trainer'
                target='_blank'
                className='flex items-center gap-3'
              >
                <MarkGithubIcon className='h-6 w-6 text-sky-600' />
                GitHub
              </a>
              <a
                href='mailto:dev@mathtrainer.xyz'
                className='flex items-center gap-3'
              >
                <EnvelopeIcon className='h-6 w-6 text-sky-600' />
                Contact
              </a>
            </div>
          )}
        </DisclosurePanel>
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
