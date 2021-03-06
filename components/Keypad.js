import { useContext } from 'react';
import { TrashIcon, BackspaceIcon } from '@heroicons/react/solid';
import { SettingsContext } from 'utils/settings';

export default function Keypad({ onKeyClick }) {
  const { settings } = useContext(SettingsContext);
  const { showKeypad, reverseKeypad, keypadZeroPosition } = settings;

  let keyOrder = [...Array(10).keys()].map(String);
  if (keypadZeroPosition === 'ZERO_LAST') {
    keyOrder.push(keyOrder.shift());
  }
  const zeroIndex = keyOrder.indexOf('0');
  keyOrder.splice(zeroIndex + 1, 0, 'BACKSPACE');
  keyOrder.splice(zeroIndex, 0, 'CLEAR');
  if (reverseKeypad) {
    const reverseKeyOrder = [];
    for (let i = 0; i < 4; i++) {
      reverseKeyOrder.push(...keyOrder.splice(-3, 3));
    }
    keyOrder = reverseKeyOrder;
  }

  const keys = keyOrder.map((key) => (
    <button
      key={key}
      onClick={() => {
        onKeyClick(key);
      }}
      className='aspect-[2] select-none rounded-md bg-cyan-900 active:brightness-[0.8]'
    >
      {key === 'CLEAR' ? (
        <TrashIcon className='mx-auto h-8 w-8' />
      ) : key === 'BACKSPACE' ? (
        <BackspaceIcon className='mx-auto h-10 w-10' />
      ) : (
        key
      )}
    </button>
  ));

  return (
    <div
      className={`${
        showKeypad ? 'opacity-100' : 'invisible opacity-0'
      } mx-auto grid w-full max-w-sm grid-cols-3 gap-1.5 text-4xl transition-opacity`}
    >
      {keys}
    </div>
  );
}
