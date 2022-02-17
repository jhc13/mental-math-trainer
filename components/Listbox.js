import { Fragment } from 'react';
import { Listbox as HeadlessListbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';

export default function Listbox({
  value,
  onChange,
  optionValues,
  optionNames = optionValues,
  disabled = Array(optionValues.length).fill(false)
}) {
  const name = optionNames[optionValues.indexOf(value)];

  return (
    <HeadlessListbox
      value={value}
      onChange={onChange}
      as='div'
      className='relative'
    >
      <HeadlessListbox.Button className='relative w-full rounded-lg bg-zinc-700 py-2 pl-3 pr-10 text-left drop-shadow-lg focus:outline-none focus-visible:outline-1 focus-visible:outline-inherit sm:text-sm'>
        <div className='truncate first-letter:uppercase'>{name}</div>
        <div className='pointer-events-none absolute inset-y-0 right-0 mr-2 flex items-center'>
          <SelectorIcon className='h-5 w-5 text-gray-300' aria-hidden='true' />
        </div>
      </HeadlessListbox.Button>
      <Transition
        as={Fragment}
        enter='transition-opacity duration-100 ease-out'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='transition-opacity duration-100 ease-in'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'
      >
        <HeadlessListbox.Options className='absolute z-10 mt-1 w-full cursor-pointer select-none rounded-md bg-zinc-700 py-1 drop-shadow-2xl focus:outline-none sm:text-sm'>
          {optionValues.map((optionValue, i) => (
            <HeadlessListbox.Option
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
            </HeadlessListbox.Option>
          ))}
        </HeadlessListbox.Options>
      </Transition>
    </HeadlessListbox>
  );
}
