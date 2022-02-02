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
        <Popover.Panel className='absolute z-10 right-0 top-full w-full max-w-sm p-2'>
          <div className='mb-24 p-4 rounded-lg bg-zinc-900 text-lg'>
            <div className='flex flex-col gap-4'>
              <div className='text-2xl'>Settings</div>
              <div className='flex flex-col gap-1'>
                <div>Problem display</div>
                <SettingListbox
                  settingKey='problemDisplay'
                  options={['vertical', 'horizontal']}
                />
              </div>
              <div className='flex flex-col gap-1'>
                <div>Answer input direction</div>
                <SettingListbox
                  settingKey='inputDirection'
                  options={['right to left', 'left to right']}
                />
              </div>
              <div className='flex justify-between'>
                <div>Always show keypad</div>
                <SettingToggle settingKey='alwaysShowKeypad' />
              </div>
              <div className='flex flex-col gap-1'>
                <div>Keypad layout</div>
                <SettingListbox
                  settingKey='keypadLayout'
                  options={['numpad', 'flipped numpad', 'one row', 'two rows']}
                />
              </div>
              <div className='flex flex-col gap-1'>
                <div>Zero position</div>
                <SettingListbox
                  settingKey='zeroPosition'
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
