import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationIcon } from '@heroicons/react/outline';

export default function ConfirmationDialog({
  isOpen,
  setIsOpen,
  title,
  description,
  action,
  onAction
}) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as='div'
        className='fixed inset-0 z-10 select-none overflow-y-auto text-zinc-100'
        initialFocus={cancelButtonRef}
        onClose={setIsOpen}
      >
        <div className='flex min-h-full items-center justify-center p-4 text-center sm:block sm:p-0'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 bg-zinc-700/75 transition-opacity' />
          </Transition.Child>
          <span
            className='hidden sm:inline-block sm:h-screen sm:align-middle'
            aria-hidden='true'
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <div className='inline-block transform overflow-hidden rounded-lg bg-zinc-900 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle'>
              <div className='px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                <div className='sm:flex sm:items-start'>
                  <div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-800 sm:mx-0 sm:h-10 sm:w-10'>
                    <ExclamationIcon
                      className='h-6 w-6 text-red-100'
                      aria-hidden='true'
                    />
                  </div>
                  <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                    <Dialog.Title
                      as='h1'
                      className='text-xl font-medium leading-6'
                    >
                      {title}
                    </Dialog.Title>
                    <div className='mt-2'>
                      <p>{description}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='bg-zinc-800 p-4 sm:flex sm:flex-row-reverse'>
                <button
                  className='inline-flex w-full justify-center rounded-md bg-red-700 px-4 py-2 font-medium shadow-sm focus:outline-none focus-visible:outline-1 focus-visible:outline-inherit active:brightness-[0.85] sm:ml-3 sm:w-auto'
                  onClick={() => {
                    setIsOpen(false);
                    onAction();
                  }}
                >
                  {action}
                </button>
                <button
                  className='mt-3 inline-flex w-full justify-center rounded-md bg-zinc-700 px-4 py-2 font-medium shadow-sm focus:outline-none focus-visible:outline-1 focus-visible:outline-inherit active:brightness-[0.85] sm:mt-0 sm:ml-3 sm:w-auto'
                  onClick={() => {
                    setIsOpen(false);
                  }}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
