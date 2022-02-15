import { Fragment, useContext } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { SettingsContext } from 'utils/settings';

function SettingListbox({
  settingKey,
  optionValues,
  optionNames = optionValues,
  disabled = Array(optionValues.length).fill(false)
}) {
  const { settings, setSetting } = useContext(SettingsContext);
  const value = settings[settingKey];
  const name = optionNames[optionValues.indexOf(value)];

  return (
    <Listbox
      value={value}
      onChange={(value) => {
        setSetting(settingKey, value);
      }}
      as='div'
      className='relative'
    >
      <Listbox.Button className='relative w-full rounded-lg bg-zinc-700 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:outline-1 focus-visible:outline-inherit sm:text-sm'>
        <div className='truncate first-letter:uppercase'>{name}</div>
        <div className='pointer-events-none absolute inset-y-0 right-0 mr-2 flex items-center'>
          <SelectorIcon className='h-5 w-5 text-gray-300' aria-hidden='true' />
        </div>
      </Listbox.Button>
      <Transition
        as={Fragment}
        enter='transition-opacity duration-100 ease-out'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='transition-opacity duration-100 ease-in'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'
      >
        <Listbox.Options className='absolute z-10 mt-1 w-full cursor-pointer select-none rounded-md bg-zinc-700 py-1 shadow-2xl focus:outline-none sm:text-sm'>
          {optionValues.map((optionValue, i) => (
            <Listbox.Option
              key={optionValue}
              className={({ active }) =>
                `${active && 'bg-zinc-600'} ${disabled[i] && 'opacity-30'}
                          relative py-2 pl-10 pr-4 focus:outline-none`
              }
              value={optionValue}
              disabled={disabled[i]}
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
                    {optionNames[i]}
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
