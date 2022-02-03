import { useContext } from 'react';
import { Switch } from '@headlessui/react';
import { SettingsContext } from 'utils/settings';

function SettingToggle({ settingKey }) {
  const { settings, setSetting } = useContext(SettingsContext);
  const value = settings[settingKey];

  return (
    <Switch
      checked={value}
      onChange={(value) => {
        setSetting(settingKey, value);
      }}
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

export default SettingToggle;
