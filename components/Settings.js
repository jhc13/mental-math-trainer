import { Fragment } from 'react';
import { CogIcon } from '@heroicons/react/outline';
import { Popover, Transition } from '@headlessui/react';
import SettingListbox from 'components/SettingListbox';
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
        <Popover.Panel className='absolute right-0 top-full z-10 w-full max-w-sm select-none p-2'>
          <div className='rounded-lg bg-zinc-900 p-4 text-lg'>
            <div className='flex flex-col gap-4'>
              <div className='text-2xl'>Settings</div>
              <div className='flex flex-col gap-1'>
                <div>Answer input direction</div>
                <SettingListbox
                  settingKey='inputDirection'
                  options={['right to left', 'left to right']}
                />
              </div>
              <div className='flex justify-between'>
                <div>Show timer while solving</div>
                <SettingToggle settingKey='showTimerWhileSolving' />
              </div>
              <div className='flex justify-between'>
                <div>Show keypad</div>
                <SettingToggle settingKey='showKeypad' />
              </div>
              <div className='flex justify-between'>
                <div>Reverse keypad</div>
                <SettingToggle settingKey='reverseKeypad' />
              </div>
              <div className='flex flex-col gap-1'>
                <div>Keypad zero position</div>
                <SettingListbox
                  settingKey='keypadZeroPosition'
                  options={['zero first', 'zero last']}
                />
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}

export default Settings;
