import { Fragment } from 'react';
import { CogIcon } from '@heroicons/react/outline';
import { Popover, Transition } from '@headlessui/react';

function Settings() {
  return (
    <Popover className='flex items-center'>
      <Popover.Button aria-label='Show settings'>
        <CogIcon className='h-7 w-7 text-gray-300' />
      </Popover.Button>
      <Transition
        as={Fragment}
        enter='transition ease-out duration-200'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='transition ease-in duration-150'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'
      >
        <Popover.Panel className='absolute z-10 right-0 top-full w-full max-w-md p-2'>
          <div className='p-4 rounded bg-zinc-700'>Settings</div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}

export default Settings;
