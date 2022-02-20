import { Fragment, useContext } from 'react';
import { CogIcon } from '@heroicons/react/outline';
import { Disclosure, Transition } from '@headlessui/react';
import { SettingsContext } from 'utils/settings';
import Listbox from 'components/Listbox';
import Toggle from 'components/Toggle';

export default function MenuSidebar() {
  const { settings, setSetting } = useContext(SettingsContext);
  const {
    inputDirection,
    showProblemNumber,
    showTimer,
    timerDisplayTime,
    showAbortButton,
    showKeypad,
    reverseKeypad,
    keypadZeroPosition
  } = settings;

  const getDefaultChangeHandler = (settingKey) => (value) => {
    setSetting(settingKey, value);
  };

  return (
    <Disclosure as='div' className='flex items-center'>
      <Disclosure.Button
        aria-label='Show menu'
        className='focus:outline-none focus-visible:outline-1 focus-visible:outline-inherit'
      >
        <CogIcon className='h-9 w-9 text-gray-300' />
      </Disclosure.Button>
      <Transition
        as={Fragment}
        enter='transition-transform duration-500 ease-in-out'
        enterFrom='translate-x-full'
        enterTo='translate-x-0'
        leave='transition-transform duration-500 ease-in-out'
        leaveFrom='translate-x-0'
        leaveTo='translate-x-full'
      >
        <Disclosure.Panel className='absolute top-12 right-0 bottom-0 z-20 w-full select-none overflow-auto scroll-smooth bg-[#202022] px-4 pt-4 pb-32 text-lg sm:max-w-sm'>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-1'>
              Answer input direction
              <Listbox
                value={inputDirection}
                onChange={getDefaultChangeHandler('inputDirection')}
                optionValues={['RIGHT_TO_LEFT', 'LEFT_TO_RIGHT']}
                optionNames={['Right to left', 'Left to right']}
              />
            </div>
            <div className='flex items-center justify-between'>
              Show problem number
              <Toggle
                value={showProblemNumber}
                onChange={getDefaultChangeHandler('showProblemNumber')}
              />
            </div>
            <div className='flex items-center justify-between'>
              Show timer
              <Toggle
                value={showTimer}
                onChange={getDefaultChangeHandler('showTimer')}
              />
            </div>
            <Transition
              as={Fragment}
              show={showTimer}
              enter='transition-opacity duration-100 ease-out'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='transition-opacity duration-100 ease-in'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <div className='flex flex-col gap-1'>
                Timer display time
                <Listbox
                  value={timerDisplayTime}
                  onChange={getDefaultChangeHandler('timerDisplayTime')}
                  optionValues={['SET_TIME', 'PROBLEM_TIME']}
                  optionNames={['Set time', 'Problem time']}
                />
              </div>
            </Transition>
            <div className='flex items-center justify-between'>
              Show abort button
              <Toggle
                value={showAbortButton}
                onChange={getDefaultChangeHandler('showAbortButton')}
              />
            </div>
            <div className='flex items-center justify-between'>
              Show keypad
              <Toggle
                value={showKeypad}
                onChange={getDefaultChangeHandler('showKeypad')}
              />
            </div>
            <Transition
              as={Fragment}
              show={showKeypad}
              enter='transition-opacity duration-100 ease-out'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='transition-opacity duration-100 ease-in'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <div className='flex items-center justify-between'>
                Reverse keypad
                <Toggle
                  value={reverseKeypad}
                  onChange={getDefaultChangeHandler('reverseKeypad')}
                />
              </div>
            </Transition>
            <Transition
              as={Fragment}
              show={showKeypad}
              enter='transition-opacity duration-100 ease-out'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='transition-opacity duration-100 ease-in'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <div className='flex flex-col gap-1'>
                Keypad zero position
                <Listbox
                  value={keypadZeroPosition}
                  onChange={getDefaultChangeHandler('keypadZeroPosition')}
                  optionValues={['ZERO_LAST', 'ZERO_FIRST']}
                  optionNames={['Zero last', 'Zero first']}
                />
              </div>
            </Transition>
          </div>
        </Disclosure.Panel>
      </Transition>
    </Disclosure>
  );
}
