import { useContext } from 'react';
import { SettingsContext } from 'utils/settings';

function Keypad({ onKeyClick }) {
  const { settings } = useContext(SettingsContext);
  const { showKeypad, reverseKeypad, keypadZeroPosition } = settings;

  let keyOrder = [...Array(10).keys()];
  if (keypadZeroPosition === 'zero last') {
    keyOrder.push(keyOrder.shift());
  }
  const zeroIndex = keyOrder.indexOf(0);
  keyOrder.splice(zeroIndex + 1, 0, 'erase');
  keyOrder.splice(zeroIndex, 0, 'clear');
  if (reverseKeypad) {
    const reverseKeyOrder = [];
    for (let i = 0; i < 4; i++) {
      reverseKeyOrder.push(...keyOrder.splice(-3, 3));
    }
    keyOrder = reverseKeyOrder;
  }

  const keys = keyOrder.map((text) => (
    <button
      key={text}
      onClick={onKeyClick}
      className={`${
        typeof text === 'string' ? 'text-2xl' : ''
      } aspect-[2] select-none rounded-md bg-cyan-900 first-letter:uppercase active:brightness-[0.8]`}
    >
      {text}
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
