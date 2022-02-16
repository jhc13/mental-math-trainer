import { Switch } from '@headlessui/react';

export default function Toggle({ value, onChange }) {
  return (
    <Switch
      checked={value}
      onChange={onChange}
      className={`${value ? 'bg-green-500' : 'bg-zinc-600'}
          flex h-[30px] w-[58px] rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out`}
    >
      <div
        aria-hidden='true'
        className={`${value ? 'translate-x-7' : 'translate-x-0'}
            pointer-events-none h-[26px] w-[26px] rounded-full bg-white shadow-lg transition duration-200 ease-in-out`}
      />
    </Switch>
  );
}
