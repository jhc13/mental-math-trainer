import { useContext } from 'react';
import { SettingsContext } from 'utils/settings';
import Problem from 'components/Problem';
import Keypad from 'components/Keypad';

function Home() {
  const { settings } = useContext(SettingsContext);
  const { showKeypad } = settings;

  return (
    <div className='flex h-full flex-col'>
      <div className='flex flex-auto flex-col justify-center'>
        <Problem operands={[12, 34]} operation='addition' />
      </div>
      {showKeypad && (
        <Keypad
          pressKey={(keyText) => {
            console.log(keyText);
          }}
        />
      )}
    </div>
  );
}

export default Home;
