import type { NextPage } from 'next';
import { useContext } from 'react';
import { SettingsContext } from 'utils/settings';

const Home: NextPage = () => {
  const { settings, setSettings } = useContext(SettingsContext);

  return (
    <div className='h-screen dark:bg-zinc-800 bg-zinc-200 dark:text-zinc-100 text-zinc-900'>
      <h1 className='text-2xl'>Mental Math Trainer</h1>
      <button
        onClick={() =>
          setSettings({ ...settings, darkMode: !settings.darkMode })
        }
        className='rounded px-2 py-1 bg-lime-700 text-xl'
      >
        {`dark mode: ${settings.darkMode}`}
      </button>
    </div>
  );
};

export default Home;
