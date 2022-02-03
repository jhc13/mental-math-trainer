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
      <Listbox.Button className='relative w-full rounded-lg bg-zinc-700 py-2 pl-3 pr-10 text-left shadow-md sm:text-sm'>
        <div className='truncate first-letter:uppercase'>{value}</div>
        <div className='pointer-events-none absolute inset-y-0 right-0 mr-2 flex items-center'>
          <SelectorIcon className='h-5 w-5 text-gray-300' aria-hidden='true' />
        </div>
      </Listbox.Button>
      <Transition
        as={Fragment}
        leave='transition ease-in duration-100'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'
      >
        <Listbox.Options className='absolute z-10 mt-1 w-full rounded-md bg-zinc-700 py-1 shadow-lg focus:outline-none sm:text-sm'>
          {options.map((option) => (
            <Listbox.Option
              key={option}
              className={({ active }) =>
                `${active && 'bg-zinc-600'}
                          relative cursor-pointer select-none py-2 pl-10 pr-4`
              }
              value={option}
            >
              {({ selected }) => (
                <>
                  {selected && (
                    <div
                      className={`absolute inset-y-0 left-0 flex items-center pl-3 text-green-500`}
                    >
                      <CheckIcon className='h-5 w-5' aria-hidden='true' />
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
