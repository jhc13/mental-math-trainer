import { Fragment, useContext } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { SettingsContext } from 'utils/settings';

function SettingListbox({ settingKey, options }) {
  const { settings, setSetting } = useContext(SettingsContext);
  const value = settings[settingKey];

  return (
    <Listbox
      value={value}
      onChange={(value) => {
        setSetting(settingKey, value);
      }}
      as='div'
      className='relative'
    >
      <Listbox.Button className='relative w-full py-2 pl-3 pr-10 bg-zinc-700 rounded-lg shadow-md text-left sm:text-sm'>
        <div className='truncate first-letter:uppercase'>{value}</div>
        <div className='absolute inset-y-0 right-0 flex items-center mr-2 pointer-events-none'>
          <SelectorIcon className='w-5 h-5 text-gray-300' aria-hidden='true' />
        </div>
      </Listbox.Button>
      <Transition
        as={Fragment}
        leave='transition ease-in duration-100'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'
      >
        <Listbox.Options className='absolute z-10 w-full mt-1 py-1 rounded-md bg-zinc-700 shadow-lg focus:outline-none sm:text-sm'>
          {options.map((option) => (
            <Listbox.Option
              key={option}
              className={({ active }) =>
                `${active && 'bg-zinc-600'}
                          relative py-2 pl-10 pr-4 cursor-pointer select-none`
              }
              value={option}
            >
              {({ selected }) => (
                <>
                  {selected && (
                    <div
                      className={`absolute inset-y-0 left-0 flex items-center pl-3 text-green-500`}
                    >
                      <CheckIcon className='w-5 h-5' aria-hidden='true' />
                    </div>
                  )}
                  <div
                    className={`${
                      selected ? 'font-medium' : 'font-normal'
                    } truncate first-letter:uppercase`}
                  >
                    {option}
                  </div>
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Transition>
    </Listbox>
  );
}

export default SettingListbox;
