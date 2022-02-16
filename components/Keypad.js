import { useContext } from 'react';
import { BackspaceIcon } from '@heroicons/react/solid';
import { SettingsContext } from 'utils/settings';

function Keypad({ onKeyClick }) {
  const { settings } = useContext(SettingsContext);
  const { showKeypad, reverseKeypad, keypadZeroPosition } = settings;

  let keyOrder = [...Array(10).keys()].map(String);
  if (keypadZeroPosition === 'zero last') {
    keyOrder.push(keyOrder.shift());
  }
  const zeroIndex = keyOrder.indexOf('0');
  keyOrder.splice(zeroIndex + 1, 0, 'backspace');
  keyOrder.splice(zeroIndex, 0, 'clear');
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
      className={`${
        key === 'clear' ? 'text-2xl first-letter:uppercase' : ''
      } aspect-[2] select-none rounded-md bg-cyan-900 active:brightness-[0.8]`}
    >
      {key === 'backspace' ? (
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

export default Keypad;
