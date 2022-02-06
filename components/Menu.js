import { Fragment } from 'react';
import { MenuIcon } from '@heroicons/react/outline';
import { Popover, Transition } from '@headlessui/react';

function Menu() {
  return (
    <Popover className='flex items-center'>
      <Popover.Button aria-label='Show menu'>
        <MenuIcon className='h-9 w-9 text-gray-300' />
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
        <Popover.Panel className='absolute left-0 top-full z-10 w-full max-w-sm select-none p-2'>
          <div className='rounded-lg bg-zinc-900 p-4 text-lg ring-2 ring-sky-500/60 drop-shadow-2xl'>
            <div className='flex flex-col gap-4'>
              <div className='text-2xl'>Menu</div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}

export default Menu;
