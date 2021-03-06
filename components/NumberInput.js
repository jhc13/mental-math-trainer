import { MinusIcon, PlusIcon } from '@heroicons/react/solid';

export default function NumberInput({ value, onChange, min, max }) {
  return (
    <div className='relative w-fit shadow-md'>
      <button
        aria-label='Decrease'
        onClick={() => {
          if (value > min) {
            onChange(value - 1);
          }
        }}
        className='absolute inset-y-0 left-0 px-3'
      >
        <MinusIcon className='h-5 w-5 text-zinc-300' />
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
        className='w-32 rounded-lg bg-zinc-700 py-2 px-7 text-center tabular-nums sm:text-sm'
      />
      <button
        aria-label='Increase'
        onClick={() => {
          if (value < max) {
            onChange(value + 1);
          }
        }}
        className='absolute inset-y-0 right-0 px-3'
      >
        <PlusIcon className='h-5 w-5 text-zinc-300' />
      </button>
    </div>
  );
}
