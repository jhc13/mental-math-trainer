import { Fragment, useContext } from 'react';
import { MenuIcon } from '@heroicons/react/outline';
import { Disclosure, Transition } from '@headlessui/react';
import { SettingsContext } from 'utils/settings';
import { OPERATORS, pluralize } from 'utils/utils';
import { MAX_OPERAND_LENGTH } from 'utils/config';
import SettingListbox from 'components/SettingListbox';
import SettingToggle from 'components/SettingToggle';

function getOperandLengths() {
  return [...Array(MAX_OPERAND_LENGTH).keys()].map((i) => i + 1);
}

function Sidebar() {
  const { settings } = useContext(SettingsContext);
  const { operation, firstOperandLength } = settings;

  return (
    <Disclosure as='div' className='flex items-center'>
      <Disclosure.Button aria-label='Show menu'>
        <MenuIcon className='h-9 w-9 text-gray-300' />
      </Disclosure.Button>
      <Transition
        as={Fragment}
        enter='transition ease-in-out duration-500'
        enterFrom='-translate-x-full'
        enterTo='translate-x-0'
        leave='transition ease-in-out duration-500'
        leaveFrom='translate-x-0'
        leaveTo='-translate-x-full'
      >
        <Disclosure.Panel className='absolute top-12 left-0 bottom-0 z-10 w-full select-none overflow-auto bg-[#202022] px-4 pt-4 pb-32 text-lg sm:max-w-sm'>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-1'>
              <div>Operation</div>
              <SettingListbox
                settingKey='operation'
                optionValues={[
                  'addition',
                  'subtraction',
                  'multiplication',
                  'division'
                ]}
              />
            </div>
            <div className='flex flex-col gap-1'>
              <div>Operand lengths</div>
              <div className='flex items-center justify-between gap-4'>
                <div className='flex-auto'>
                  <SettingListbox
                    settingKey='firstOperandLength'
                    optionValues={getOperandLengths()}
                    optionNames={getOperandLengths().map((length) =>
                      pluralize('digit', length)
                    )}
                  />
                </div>
                {OPERATORS[operation]}
                <div className='flex-auto'>
                  <SettingListbox
                    settingKey='secondOperandLength'
                    optionValues={getOperandLengths()}
                    optionNames={getOperandLengths().map((length) =>
                      pluralize('digit', length)
                    )}
                    disabled={
                      ['subtraction', 'division'].includes(operation)
                        ? Array(firstOperandLength)
                            .fill(false)
                            .concat(
                              Array(
                                MAX_OPERAND_LENGTH - firstOperandLength
                              ).fill(true)
                            )
                        : Array(MAX_OPERAND_LENGTH).fill(false)
                    }
                  />
                </div>
              </div>
            </div>
            <div className='h-px bg-zinc-400' />
            <div className='flex flex-col gap-1'>
              <div>Answer input direction</div>
              <SettingListbox
                settingKey='inputDirection'
                optionValues={['right to left', 'left to right']}
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
                optionValues={['zero first', 'zero last']}
              />
            </div>
          </div>
        </Disclosure.Panel>
      </Transition>
    </Disclosure>
  );
}

export default Sidebar;
