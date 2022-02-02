import { Fragment } from 'react';
import { CogIcon } from '@heroicons/react/outline';
import { Popover, Transition } from '@headlessui/react';
import SettingToggle from 'components/SettingToggle';

function Settings() {
  return (
    <Popover className='flex items-center'>
      <Popover.Button aria-label='Show settings'>
        <CogIcon className='h-9 w-9 text-gray-300' />
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
        <Popover.Panel className='absolute z-10 right-0 top-full w-full max-w-sm p-2'>
          <div className='p-4 rounded bg-zinc-700 text-lg'>
            <div className='flex flex-col gap-3'>
              <div className='text-2xl'>Settings</div>
              <div className='flex justify-between'>
                <div>Theme</div>
              </div>
              <div className='flex justify-between'>
                <div>Problem display</div>
              </div>
              <div className='flex justify-between'>
                <div>Answer input direction</div>
              </div>
              <div className='flex justify-between'>
                <div>Always show keypad</div>
                <SettingToggle key='alwaysShowKeypad' />
              </div>
              <div className='flex justify-between'>
                <div>Keypad layout</div>
              </div>
              <div className='flex justify-between'>
                <div>0 position</div>
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}

export default Settings;
