import type { NextPage } from 'next';
import { useContext } from 'react';
import { SettingsContext } from 'utils/settings';

const Home: NextPage = () => {
  const { settings, setSettings } = useContext(SettingsContext);

  return (
    <button
      onClick={() => setSettings({ ...settings, darkMode: !settings.darkMode })}
      className='rounded px-2 py-1 bg-lime-700 text-xl'
    >
      {`dark mode: ${settings.darkMode}`}
    </button>
  );
};

export default Home;
