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
          flex h-[30px] w-[58px] border-2 border-transparent rounded-full transition-colors ease-in-out duration-200`}
    >
      <div
        aria-hidden='true'
        className={`${value ? 'translate-x-7' : 'translate-x-0'}
            h-[26px] w-[26px] rounded-full bg-white shadow-lg pointer-events-none transition ease-in-out duration-200`}
      />
    </Switch>
  );
}

export default SettingToggle;
