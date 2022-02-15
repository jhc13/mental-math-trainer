import { PlusIcon, MinusIcon } from '@heroicons/react/solid';

function NumberInput({ value, onChange, min, max }) {
  return (
    <div className='relative'>
      <button
        onClick={() => {
          if (value > min) {
            onChange(value - 1);
          }
        }}
        className='absolute inset-y-0 left-0 px-3'
      >
        <MinusIcon className='h-5 w-5 text-gray-300' />
      </button>
      <input
        type='number'
        inputMode='numeric'
        value={value}
        min={min}
        max={max}
        onFocus={(event) => {
          event.target.select();
        }}
        onChange={(event) => {
          let newValue = parseInt(event.target.value);
          if (isNaN(newValue) || newValue < min) {
            newValue = min;
          } else if (newValue > max) {
            newValue = max;
          }
          onChange(newValue);
        }}
        className='w-32 rounded-lg bg-zinc-700 py-2 px-7 text-center tabular-nums shadow-md focus:outline-none focus-visible:outline-1 focus-visible:outline-inherit sm:text-sm'
      />
      <button
        onClick={() => {
          if (value < max) {
            onChange(value + 1);
          }
        }}
        className='absolute inset-y-0 right-0 px-3'
      >
        <PlusIcon className='h-5 w-5 text-gray-300' />
      </button>
    </div>
  );
}

export default NumberInput;
