import { Fragment, useContext, useEffect } from 'react';
import { MenuIcon } from '@heroicons/react/outline';
import { Disclosure, Transition } from '@headlessui/react';
import { SettingsContext } from 'utils/settings';
import { OPERATORS, pluralize } from 'utils/utils';
import { MAX_OPERAND_LENGTH } from 'utils/config';
import Listbox from 'components/Listbox';
import Toggle from 'components/Toggle';
import NumberInput from 'components/NumberInput';

function getOperandLengths() {
  return [...Array(MAX_OPERAND_LENGTH).keys()].map((i) => i + 1);
}

function Sidebar() {
  const { settings, setSetting } = useContext(SettingsContext);
  const {
    operation,
    operandLengths,
    problemsPerSet,
    inputDirection,
    showProblemNumber,
    showTimer,
    showAbortButton,
    showKeypad,
    reverseKeypad,
    keypadZeroPosition
  } = settings;

  useEffect(() => {
    if (
      ['subtraction', 'division'].includes(operation) &&
      operandLengths[1] > operandLengths[0]
    ) {
      setSetting('operandLengths', [operandLengths[0], operandLengths[0]]);
    }
  }, [operation, operandLengths, setSetting]);

  const getDefaultChangeHandler = (settingKey) => (value) => {
    setSetting(settingKey, value);
  };

  return (
    <Disclosure as='div' className='flex items-center'>
      <Disclosure.Button aria-label='Show menu'>
        <MenuIcon className='h-9 w-9 text-gray-300' />
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
        <Disclosure.Panel className='absolute top-12 left-0 bottom-0 z-10 w-full select-none overflow-auto scroll-smooth bg-[#202022] px-4 pt-4 pb-32 text-lg sm:max-w-sm'>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-1'>
              Operation
              <Listbox
                value={operation}
                onChange={getDefaultChangeHandler('operation')}
                optionValues={[
                  'addition',
                  'subtraction',
                  'multiplication',
                  'division'
                ]}
              />
            </div>
            <div className='flex flex-col gap-1'>
              Operand lengths
              <div className='grid grid-cols-[1fr_auto_1fr] items-center gap-4'>
                <Listbox
                  value={operandLengths[0]}
                  onChange={(value) => {
                    setSetting('operandLengths', [value, operandLengths[1]]);
                  }}
                  optionValues={getOperandLengths()}
                  optionNames={getOperandLengths().map((length) =>
                    pluralize('digit', length)
                  )}
                />
                <div className='justify-self-center'>
                  {OPERATORS[operation]}
                </div>
                <Listbox
                  value={operandLengths[1]}
                  onChange={(value) => {
                    setSetting('operandLengths', [operandLengths[0], value]);
                  }}
                  optionValues={getOperandLengths()}
                  optionNames={getOperandLengths().map((length) =>
                    pluralize('digit', length)
                  )}
                  disabled={
                    ['subtraction', 'division'].includes(operation)
                      ? Array(operandLengths[0])
                          .fill(false)
                          .concat(
                            Array(MAX_OPERAND_LENGTH - operandLengths[0]).fill(
                              true
                            )
                          )
                      : Array(MAX_OPERAND_LENGTH).fill(false)
                  }
                />
              </div>
            </div>
            <div className='flex items-center justify-between'>
              Problems per set
              <NumberInput
                value={problemsPerSet}
                onChange={getDefaultChangeHandler('problemsPerSet')}
                min={1}
                max={1000}
              />
            </div>
            <div className='h-px bg-zinc-400' />
            <div className='flex flex-col gap-1'>
              Answer input direction
              <Listbox
                value={inputDirection}
                onChange={getDefaultChangeHandler('inputDirection')}
                optionValues={['right to left', 'left to right']}
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
                  optionValues={['zero first', 'zero last']}
                />
              </div>
            </Transition>
          </div>
        </Disclosure.Panel>
      </Transition>
    </Disclosure>
  );
}

export default Sidebar;
